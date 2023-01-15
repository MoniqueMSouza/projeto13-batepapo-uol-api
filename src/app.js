import express from "express";
import cors from "cors";
import chalk from "chalk"
import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("bate-papo-uol-api"); 
    console.log('Conectou com o mongodb!')
});

const app = express();
app.use(cors());
app.use(express.json());


const PORT = 5000

app.listen(PORT, () => {console.log(chalk.blue(`Servidor Funcionando na porta => ${PORT}!`));
  })