import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signinInput} from "@abhishekthomasv/medium-common";


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();


export async function hashPassword(
  password: string,
  providedSalt?: Uint8Array
): Promise<string> {
  const encoder = new TextEncoder()
  const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
  const exportedKey = (await crypto.subtle.exportKey("raw", key)) as ArrayBuffer
  const hashBuffer = new Uint8Array(exportedKey)
  const hashArray = Array.from(hashBuffer)
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `${saltHex}:${hashHex}`
}


export async function verifyPassword(
  storedHash: string,
  passwordAttempt: string
): Promise<boolean> {
  const [saltHex, originalHash] = storedHash.split(":")
  const matchResult = saltHex.match(/.{1,2}/g)
  if (!matchResult) {
    throw new Error("Invalid salt format")
  }
  const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)))
  const attemptHashWithSalt = await hashPassword(passwordAttempt, salt)
  const [, attemptHash] = attemptHashWithSalt.split(":")
  return attemptHash === originalHash
}


//signup endpoint
userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body)
  if(!success){
    c.status(411);
    return c.json({
      error: "inputs are incorrect"
    })
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      email: body.email
    }
  })

  if (existingUser){
     c.status(403)
     return c.json({
      error : "user already exists"
     })
  }


  const hashedPasskey = await hashPassword(body.password).then((hashedPassword) => {
    return hashedPassword

  })

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPasskey,
        caption: body.caption,
      },
    })
  const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
  return c.text(jwt);
});

//signin endpoint
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.json({
      error: "inputs are incorrect",
    })
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email,
     },
  });

  if (!user) {
    c.status(403);
    return c.json({
      error: "invalid email user not found",
    });
  }

   await verifyPassword(user.password, body.password).then((result) => {
    if (!result) {
      c.status(403);
      return c.json({
        error: "invalid password",
      });
    }
   })

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.text(jwt)
});



userRouter.get("/me", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const auth = c.req.header("Authorization")
  if (!auth) {
    c.status(401);
    return c.json({
      error: "unauthorized",
    });
  }
  const token = auth;
  const { id } = await verify(token, c.env.JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: {
      id: id as string,
    },
    select:{
      id: true,
      email: true,
      name: true,
      caption: true,
    }
  });
  if (!user) {
    c.status(403);
    return c.json({
      error: "user not found",
    });
  }
  return c.json(user);
});

userRouter.put("/update", async (c) => {
  const body = await c.req.json()
  console.log(body)


  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const post = await prisma.user.update({
    where: {id: body.userId},
    data: {email: body.email, name: body.name, caption: body.caption},
  })

  return c.json({
    id: post.id,
  })
})
