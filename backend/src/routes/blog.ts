import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { decode, sign, verify } from "hono/jwt"
import { createPostInput, updatePostInput } from "@abhishekthomasv/medium-common"

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  },
  Variables: {
    userId: string;
  }
}>();

//middleware
blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || ""
  const user = await verify(authHeader, c.env.JWT_SECRET);
    
  try{

    if (user) {
      c.set("userId", user.id as string)
      await next()
    } else {
      c.status(403)
      return c.json({ error: "unauthorized" })
    }

  }catch(e){
    c.status(403)
    return c.json({ error: "unauthorized" })
  }
  
  
})

//create post
blogRouter.post("/", async (c) => {
  const body = await c.req.json()

  const {success} = createPostInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      error: "inputs are incorrect"
    })
  }

  const authorId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const post = await prisma.post.create({
    data: { title: body.title, content: body.content, authorId: authorId },
  })

  return c.json({
    id: post.id,
  })
})

//update the post
blogRouter.put("/", async (c) => {
  const body = await c.req.json()
   const { success } = createPostInput.safeParse(body)
   if (!success) {
     c.status(411)
     return c.json({
       error: "inputs are incorrect",
     })
   }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const post = await prisma.post.update({
    where: { id: body.id },
    data: { title: body.title, content: body.content, authorId: "1" },
  })

  return c.json({
    id: post.id,
  })
})

//pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const posts = await prisma.post.findMany()

  return c.json({
    posts,
  })
})


blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    })
    return c.json({ post })
  } catch (e) {
    c.status(411)
    return c.json({
      message: "Error while fetching blog post",
    })
  }
})

