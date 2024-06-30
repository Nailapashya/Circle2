import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import path from 'path';
import router from "./src/routers/index"
import { redisConnect } from "./src/cache/redis"

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
app.use(router)

app.listen(PORT, async()=>{
    redisConnect()
    console.log(`Server running in port: ${PORT}`)
})