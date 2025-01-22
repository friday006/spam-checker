import {z} from 'zod'

export const signupInput = z.object({
    name: z.string().min(6, 'Name is required'),
    phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const signinInput = z.object({
    phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const addContactInput = z.object({
    name: z.string().min(6, 'Name is required'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),
    isSpam: z.boolean().optional(), 
  });

export const markSpamInput = z.object({
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),
    name: z.string().optional(),  // Optional, fallback to "Unknown" in DB
});

export const searchByNameInput = z.object({
    name: z.string().min(6, 'Search query is required'),
});

export const searchByPhoneInput = z.object({
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'),
});


//type inference in zod
export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type AddContactInput = z.infer<typeof addContactInput>;
export type MarkSpamInput = z.infer<typeof markSpamInput>;
export type SearchByNameInput = z.infer<typeof searchByNameInput>;
export type SearchByPhoneInput = z.infer<typeof searchByPhoneInput>;