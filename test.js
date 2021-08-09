import express from "express";
import Nlp from "./index.js";

const nlp = new Nlp({ env: process.env });
nlp.init();

// Expressjs part
let app = express();
let port = process.env.PORT || 3000;

app.use(express.json());

app.get("/nlp", async (req, res) => {
  let frase = req.body.frase || "nothing";
  let nombre = req.body.nombre;
  let relacion = req.body.relacion || "neutral";
  let answer = await nlp.response(frase, nombre, relacion);
  res.send(answer);
});

app.listen(port, () => {
  console.log(`La aplicación esta escuchando en el puerto ${port}`);
});
