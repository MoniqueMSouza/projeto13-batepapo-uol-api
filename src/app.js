import express from "express";
import cors from "cors";
import chalk from "chalk"
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient.connect()
  .then(() => {
    db = mongoClient.db("bate-papo-uol-api");
    console.log('Conectou com o mongodb!')
  })
  .catch(() =>
    console.log('Deu erro no banco de dados!')
  )

const app = express();


app.use(cors());
app.use(express.json());

app.post("/participants", async (req, res) => {
  const { name } = req.body;
  
  const usuarioExiste = await db.collection("participants").findOne({ name })
  if (usuarioExiste) return res.status(409).send("Esse usuário já existe")
  await db.collection("participants").insertOne({ name })

  res.send("ok")
})

app.get("/participants", (req, res) => {
  const usuarios = db.collection("participants").find().toArray().then(dados => {
    return res.send(dados)
  }).catch(() => {
    res.status(500).send('Erro no banco de dados')
  })
})







const PORT = 5000

app.listen(PORT, () => {
  console.log(chalk.blue(`Servidor Funcionando na porta => ${PORT}!`));
})