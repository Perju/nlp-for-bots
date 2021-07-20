const { NlpManager, Language } = require("node-nlp");
const express = require("express");

// train or load model
let train = process.env.TRAIN || false;
let modelFilename = "./model.nlp";

// NLP part
const manager = new NlpManager({languages: ["en", "es"], forceNER: true});
const language = new Language();

manager.addCorpus("./langs/en_EN.json");
manager.addCorpus("./langs/es_ES.json");

(async() => {
  if(train){
    await manager.train();
    manager.save(modelFilename);
  } else {
    manager.load(modelFilename);
  }
})();

// Expressjs part
let app = express();
let port = process.env.PORT || 3000;

app.use(express.json());

app.get("/nlp",async (req, res)=>{
  let frase = req.body.frase || "nothing";
  let guess = language.guess(frase, ["en", "es"])[0].alpha2;
  let response = await manager.process(guess, frase)
  res.send(response.answer);
});

app.listen(port, ()=>{
  console.log(`La aplicación esta escuchando en el puerto ${port}`);
});
