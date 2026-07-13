
// kai-core/brain/kai-parser.js
export class KAIParser {
  parse(comando) {
    comando = comando.toLowerCase();
    
    if(comando.includes("cria") || comando.includes("criar")){
      return { action: "create", target: this.extractTarget(comando) }
    }
    if(comando.includes("edita") || comando.includes("editar")){
      return { action: "edit", target: this.extractTarget(comando) }
    }
    if(comando.includes("lista") || comando.includes("mostra")){
      return { action: "list", target: "all" }
    }
    
    return { action: "unknown" }
  }
  
  extractTarget(texto){
    if(texto.includes("peça")) return texto.split("peça ")[1];
    if(texto.includes("visor")) return "visor";
    if(texto.includes("peito")) return "peito";
    return "geral";
  }
}
