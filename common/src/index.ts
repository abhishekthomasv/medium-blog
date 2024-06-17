import { z } from "zod"

export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3).optional(),
})

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const createPostInput = z.object({
    title: z.string().min(6),
    content: z.string(),
})

export const updatePostInput = z.object({
  title: z.string().min(6),
  content: z.string(),
  id: z.string(),
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type CreatePostInput = z.infer<typeof createPostInput>
export type UpdatePostInput = z.infer<typeof updatePostInput>