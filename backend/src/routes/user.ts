import {Hono} from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import{signupInput, signinInput} from '@priyankarxdevs/spam-checker-common'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }
}>();


//signup api
userRouter.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);

    if(!success){
      c.status(411)
      return c.json({
        message: "Inputs not correct"
      })
    }
    try{
        const user = await prisma.user.create({
            data:{
                name: body.name,
                phone: body.phone,
                password: body.password,
                email: body.email
            }
        })

        if(!user){
            c.status(403)
            return c.json({error: "Error registering user"})
        }

        const token = await sign({id:user.id}, c.env.JWT_SECRET)
        return c.json({
            token
        })
    }
    catch(e){
        c.status(403);
      return c.json({error: "Error while signing up"})
    }
})


//signin api

userRouter.post('/signin', async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

    const body = await c.req.json();

    //zod validation
    const success = signinInput.safeParse(body);

    if(!success){
      c.status(411)
      return c.json({
        message: "Inputs not correct"
      })
    }

    try{
        const user = await prisma.user.findFirst({
            where:{
                phone: body.phone,
                password: body.password
            }
        })
        if(!user){
            c.status(401)
            return c.json({error: "Invalid phone or password"})
        }

        const token = await sign({id:user.id}, c.env.JWT_SECRET)
        return c.json({
            token
        })
    }
    catch(e){
        c.status(500)
        return c.json({
            error: "error while signing in"
        })
    }
})