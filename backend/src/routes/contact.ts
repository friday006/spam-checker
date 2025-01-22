import {Hono} from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {verify} from 'hono/jwt'
import {addContactInput, markSpamInput, searchByNameInput, searchByPhoneInput} from '@priyankarxdevs/spam-checker-common'

export const contactRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables:{
        userId: string
    }
}>();

//middleware
contactRouter.use('/*', async(c, next)=>{
    const header = c.req.header("authorization") || "" 

    try{
        const user = await verify(header, c.env.JWT_SECRET)
        const Id = user.id as string
        if(user){
            c.set('userId', Id)
            await next();
        }
        else{
            c.status(403)
            return c.json({error: "You are not logged in"})
          }
    }
    catch(e){
        c.status(403)
        return c.json({
            messagee: "You are not logged in"
        })
    }
})


// add contact
contactRouter.post('/add', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const loggedInUserId = c.get('userId');
    const body = await c.req.json();
    //zod validation
    const success = addContactInput.safeParse(body);
    
    if(!success){
      c.status(411)
      return c.json({
        message: "Inputs not correct"
      })
    }
  
    try {
      // Check if the phone number and name are already registered
      const existingContact = await prisma.contact.findFirst({
        where: {
          phone: body.phone,
          name: body.name,
          userId: loggedInUserId,  // Ensuring it's the logged-in user's contact list
        },
      });
  
      if (existingContact) {
        // If a contact with the same phone and name already exists
        c.status(400);
        return c.json({
          message: 'This phone number and name is already registered as a contact.',
        });
      }
  
      // Add the contact to the logged-in user's contact list
      const newContact = await prisma.contact.create({
        data: {
          name: body.name,
          phone: body.phone,
          userId: loggedInUserId,
        },
      });
  
      return c.json({ message: 'Contact added successfully!', contact: newContact });
    } catch (error) {
      console.error('Error adding contact:', error);
      c.status(500);
      return c.json({ error: 'An error occurred while adding the contact.' });
    }
  });
  


// mark spam
contactRouter.post('/spam',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();

    //zod validation
    const success = markSpamInput.safeParse(body);
    
    if(!success){
      c.status(400)
      return c.json({
        message: "Phone number required"
      })
    }
    
    const userId = c.get("userId")

    try{
      
      const spamReport = await prisma.spam.create({
        data:{
          phone: body.phone,
          reportedById: userId
        }
      })
      return c.json({
        message: "The number has been marked as spam successfully.",
      });
    }
    catch(e){
        c.status(400)
        return c.json({
            message: "Failed to marked number as spam"
        })
    }
})


//search by name
contactRouter.get('/search/name', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const query = c.req.query('query'); // get the search query for the name
    
    //zod validation
    const success = searchByNameInput.safeParse(query);
    
    if(!success){
      c.status(411)
      return c.json({
        message: "Inputs not correct"
      })
    }

    try {
      const searchStartsWithName = await prisma.user.findMany({
        where:{
          name:{
            startsWith: query,
            mode: 'insensitive',
          }
        },
        select:{
          id:true,
          name: true,
          phone: true,
          spams: true
        }
      })

      if(searchStartsWithName.length === 0){
        const searchContainsName = await prisma.user.findMany({
          where:{
            name:{
              contains: query,
              mode: 'insensitive'
            }
          },
          select:{
            id:true,
          name: true,
          phone: true,
          spams: true
          }
        })
        
        return c.json(searchContainsName
        )
      }
      c.status(200)
     return c.json({
      message:"Search resultls by name",
      searchStartsWithName
     })

     
    } catch (error) {
      console.error('Error searching for name:', error);
      c.status(500);
      return c.json({ error: 'An error occurred while searching for the name.' });
    }
});


//search by phone number
contactRouter.get('/search/phone', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const phone = c.req.query('query'); // get Phone number from the URL params
    //zod validation
    const success = searchByPhoneInput.safeParse(phone);
    
    if(!success){
      c.status(411)
      return c.json({
        message: "Inputs not correct"
      })
    }
  
    try {
      const userResult = await prisma.user.findUnique({
        where:{
          phone
        },
        select:{
          id: true,
          name: true,
          phone: true,
          spams: true,
          email: true
        }
      })

      if(userResult){
        c.status(200)
        return c.json({
          message: "Registered user found by phone number:",
          userResult
        })
      }

      const contactResult = await prisma.contact.findMany({
        where:{
          phone
        },
        select:{
          id: true,
          name: true,
          phone: true,
          user:{
            select:{
              spams:true
            }
          }
        }
      })

      return c.json(contactResult);
    } catch (error) {
      console.error('Error searching for phone number:', error);
      c.status(500);
      return c.json({ error: 'An error occurred while searching for the phone number.' });
    }
  });
  
// search person details

contactRouter.get('/search/profile',async(c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const currentUserId = c.get("userId")

  const userId = c.req.query('userId')

  try{const profileResult = await prisma.user.findUnique({
    where:{
      id: userId
    },
    select:{
      id: true,
      name: true,
      phone: true,
      email: true,
      spams: true
    } 
  })

  if(!profileResult){
    c.status(404)
    return c.json({
      message:"User not found"
    })
  }

  const isContact = await prisma.contact.findFirst({
    where:{
      userId: profileResult.id,
      phone: profileResult.phone,
      user:{
        id: currentUserId
      }
    }
  })

  if(!isContact){
    profileResult.email = null
  }

  c.status(200)
  return c.json({
    message: "Profile found successfully:",
    profileResult
  })
}
catch(error){
  console.error('Error searching for phofile:', error);
  c.status(500);
  return c.json({ error: 'An error occurred while searching for the profile.' });
}
})