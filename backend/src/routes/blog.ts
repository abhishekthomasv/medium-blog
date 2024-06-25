import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { verify } from "hono/jwt"
import { createPostInput} from "@abhishekthomasv/medium-common"

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  },
  Variables: {
    userId: string;
  }
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || ""
  try{
  const user = await verify(authHeader, c.env.JWT_SECRET)
    if (user.id) {
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


  function formatDate(date: Date | string) {
    
    return new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
  }

  const formattedDate = formatDate(new Date())

  const post = await prisma.post.create({
    data: { title: body.title, content: body.content, authorId: authorId, date: formattedDate},
  })

  return c.json({
    id: post.id,
    authorId
  })
})


blogRouter.get("/bulk", async (c) => {


  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const posts = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      date: true,
      author: {
        select: {
          name: true,
          caption: true,
        }
      }
    }
  })

  return c.json({
    posts,
  })
})

blogRouter.post("/filter", async (c) => {

  const body =  await c.req.json();
  console.log(body.search)

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const posts = await prisma.post.findMany({
    where: {
      title: {
        contains: body.search || "",
        mode: "insensitive",
      },
    },
    select: {
      content: true,
      title: true,
      id: true,
      date: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  return c.json({
    posts,
  })
})

blogRouter.get("/myblogs", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const posts = await prisma.post.findMany({
    where: {
      authorId: c.get("userId"),
    },
    select: {
      content: true,
      title: true,
      id: true,
      date: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  })

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
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        author: {
          select: {
            name: true,
            id: true,
            caption: true,
          }
        }
      }
    })
    return c.json({ post })
  } catch (e) {
    c.status(411)
    return c.json({
      message: "Error while fetching blog post",
    })
  }
})

blogRouter.delete("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const id = c.req.param("id")

  const deletePost = await prisma.post.delete({
    where: {
      id: id,
    },
  })
  return c.json({
    msg: "deleted post: " + deletePost.id,
  })
})


blogRouter.put("/:id", async (c) => {
  const id =  c.req.param("id")
  const body = await c.req.json()
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const post = await prisma.post.update({
    where: { id: id},
    data: { title: body.title, content: body.content },
  })

  return c.json({
    id: post.id,
  })
})
