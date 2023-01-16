import express from "express";
import cors from "cors";
import chalk from "chalk"
import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
import joi from 'joi'

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
  const usuario = req.body;

  const usuarioSchema = joi.object({
    name: joi.string().required()
  })

  const validation = usuarioSchema.validate(usuario)

  if (validation.error) return res.status(422).send('Preencha o campo com nome!')

  const usuarioExiste = await db.collection("participants").findOne({ name: usuario.name })
  if (usuarioExiste) return res.status(409).send("Esse usuário já existe")

  await db.collection("participants").insertOne({ name: usuario.name })
  res.status(201).send("ok")

})

app.get("/participants", async (req, res) => {
  const usuarios = await db.collection("participants").find().toArray()

  return res.status(200).send(usuarios)

})

app.post("/messages", async (req, res) => {
  const { to, text, type } = req.body;
  let { user } = req.headers;

  try {
    await db.collection("messages").insertOne({
      from: user,
      to,
      text,
      type,
      time

    })
    return res.status(201).send("Mensagem enviada")

  } catch (err) {
    res.status(422).send("Deu algo errado no servidor!")
  }
})


app.listen(5000, () => {
  console.log(chalk.blue('Servidor Funcionando na porta 5000'));
})