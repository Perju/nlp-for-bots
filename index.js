const { NlpManager, Language, ConversationContext } = require("node-nlp");
const express = require("express");

// train or load model
let train = process.env.TRAIN || false;

let modelFilename = "./model.nlp";

// NLP part
const manager = new NlpManager({ languages: ["en", "es"], forceNER: true });
const language = new Language();

manager.addCorpus("./langs/en_EN.json");
manager.addCorpus("./langs/es_ES.json");

(async () => {
  if (train === "true") {
    console.log("entrenando nlp");
    await manager.train();
    manager.save(modelFilename);
  } else {
    console.log("cargando datos nlp");
    manager.load(modelFilename);
  }
})();

// Expressjs part
let app = express();
let port = process.env.PORT || 3000;

app.use(express.json());

app.get("/nlp", async (req, res) => {
  const context = new ConversationContext();
  let frase = req.body.frase || "nothing";
  let guess = language.guess(frase, ["en", "es"])[0].alpha2;
  let nombre = req.body.nombre;
  context.nombre = nombre;
  console.log(context);
  let response = await manager.process(guess, frase, context);
  console.log(response);
  res.send(response.answer);
});

app.listen(port, () => {
  console.log(`La aplicación esta escuchando en el puerto ${port}`);
});
