import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from 'cors';

// routes
import api from '@/routes';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 80;
const host: string = process.env.HOST || '0.0.0.0';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL as string, "*"], // add another url to allow more
    credentials: true,
}));

app.use("/api", api);
app.use((_, res) => res.status(404).send("NO API ROUTES"));


app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
});