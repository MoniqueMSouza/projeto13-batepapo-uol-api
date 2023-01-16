import express from "express";
import cors from "cors";
import chalk from "chalk"
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
  mongoClient.connect()
  db = mongoClient.db();
  console.log('Conectou com o mongodb!')
} catch (error) {
  console.log('Deu erro no banco de dados!')
}


const app = express();


app.use(cors());
app.use(express.json());

app.post("/participants", async (req, res) => {
  const { name } = req.body;


  try {
    const usuarioExiste = await db.collection("participants").findOne({ name })
    if (usuarioExiste) return res.status(409).send("Esse usuário já existe")

    await db.collection("participants").insertOne({ name })
    res.status(201).send("ok")

  } catch (err) {
    res.status(422).send("Deu algo errado no servidor!")
  }
})

app.get("/participants", async (req, res) => {
  const usuarios = await db.collection("participants").find().toArray()
  
    return res.status(200).send(usuarios)
  
})


app.post("/messages", async (req, res) => {
  const { to, text, type} = req.body;
  let { user } = req.headers;

  try {
    const usuarioExiste = await db.collection("messages").findOne({ })
    if (usuarioExiste) return res.status(409).send("Esse usuário já existe")

    await db.collection("participants").insertOne({ name })
    res.send("ok")

  } catch (err) {
    res.status(422).send("Deu algo errado no servidor!")
  }
})





app.listen(5000, () => {
  console.log(chalk.blue('Servidor Funcionando na porta 5000'));
})