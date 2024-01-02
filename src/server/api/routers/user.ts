import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // check if user exists
      const userExists = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (userExists?.email) {
        return {
          user: null,
          success: false,
          message: "User already exists",
        };
      }

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });

      if (user?.email) {
        return {
          user: user,
          success: true,
          message: "User created successfully",
        };
      } else {
        return {
          user: null,
          success: false,
          message: "User could not be created",
        };
      }
    }),

  getUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.email },
      });
      return user;
    }),
});
