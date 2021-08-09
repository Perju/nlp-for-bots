//const { NlpManager, Language, ConversationContext } = require("node-nlp");
import { NlpManager, Language, ConversationContext } from "node-nlp";

class Nlp {
  constructor(config){
    this.env = config.env;
    this.train = config.env.TRAIN || false;
    this.modelFile = "./model.nlp";
    this.manager = new NlpManager({ languages: ["en", "es"], forceNER: true });
    this.language = new Language();
  }

  async init(){
    this.manager.addCorpus("./langs/en_EN.json");
    this.manager.addCorpus("./langs/es_ES.json");
    if (this.train === "true") {
      console.log("entrenando nlp");
      await this.manager.train();
      this.manager.save(this.modelFile);
    } else {
      console.log("cargando datos nlp");
      this.manager.load(this.modelFile);
    }
  }

  async response(frase, nombre, relacion) {
    const context = new ConversationContext();
    let guess = this.language.guess(frase, ["en", "es"])[0].alpha2;
    context.nombre = nombre;
    context.relacion = relacion;
    let response = await this.manager.process(guess, frase, context);
    return rndElem(response.answer);
  }
}

const rndElem = (arr) => {
  return arr === undefined
    ? "No entiendo que dices"
    : arr[Math.floor(Math.random() * arr.length)];
};

export default Nlp;
