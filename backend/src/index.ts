import { Hono } from 'hono'
import {userRouter} from './routes/user'
import {contactRouter} from './routes/contact'

export const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}
}>();

app.route('api/v1/user',userRouter);
app.route('api/v1/contact',contactRouter);

export default app
