// ARQUIVO: cronograma-de-alunos.js
// BANCO DE DADOS OFICIAL - 28 COLUNAS

let ALUNOS_DB = {
  "kpt0": {nome:"SAY KORVIL", tipo:"ADMIN"},
  "mag1": {nome:"Magda Gomes dos Santos", tipo:"ADMIN"},
  "mcarla2": {nome:"Maria Carla Carvalho Santos", tipo:"ALUNO"},
  "hvitoria3": {nome:"Hellem Vitória Carvalho dos Santos", tipo:"ALUNO"},
  "alexandra4": {nome:"Alexandra", tipo:"ALUNO"},
  "michele5": {nome:"Michele B", tipo:"ALUNO"},
  "aline6": {nome:"Aline", tipo:"ALUNO"},
  "adriana7": {nome:"Adriana", tipo:"ALUNO"},
  "joss8": {nome:"Jossiane Alves", tipo:"ALUNO"},
  "amigaadrum9": {nome:"amigaadrum", tipo:"ALUNO"},
  "amigaadrdois10": {nome:"amigaadrdois", tipo:"ALUNO"},
  "angel11": {nome:"Angélica", tipo:"ALUNO"},
  "anapaula12": {nome:"Ana Paula", tipo:"ALUNO"},
  "gusta13": {nome:"Gustavo Geraldino", tipo:"ALUNO"},
  "sueli14": {nome:"Sueli", tipo:"ALUNO"},
  "fabi15": {nome:"Fabiana", tipo:"ALUNO"},
  "paula16": {nome:"Paula Cristine", tipo:"ALUNO"},
  "nop17": {nome:"Natan Osvath Paoli", tipo:"ALUNO"},
  "bianca18": {nome:"Bianca", tipo:"ALUNO"},
  "lau19": {nome:"Laura Jesus Aragão", tipo:"ALUNO"},
  "cass20": {nome:"Cassandra Jesus", tipo:"ALUNO"},
  "katia21": {nome:"Kátia Paoli", tipo:"ALUNO"},
  "mara22": {nome:"Lucimara", tipo:"ALUNO"},
  "edna23": {nome:"Edna", tipo:"ALUNO"},
  "luciane24": {nome:"Luciane Paoli", tipo:"ALUNO"},
  "marly25": {nome:"Marly", tipo:"ALUNO"},
  "mcris26": {nome:"Maria Cristina", tipo:"ALUNO"},
  "juci27": {nome:"Jucilene", tipo:"ALUNO"},
  "joce28": {nome:"Jocélia", tipo:"ALUNO"},
  "marcos29": {nome:"Marcos França", tipo:"ALUNO"},
  "lucas30": {nome:"Lucas", tipo:"ALUNO"},
  "celi31": {nome:"Celidalva", tipo:"ALUNO"},
  "jaque32": {nome:"Jaqueline", tipo:"ALUNO"},
  "elisa33": {nome:"Elisangela", tipo:"ALUNO"},
  "gice34": {nome:"Gicelia", tipo:"ALUNO"},
  "pati35": {nome:"Patrícia", tipo:"ALUNO"},
  "mel36": {nome:"Melissa", tipo:"ALUNO"},
  "naty37": {nome:"Natália Melo", tipo:"ALUNO"},
  "gon38": {nome:"José Gonzaga", tipo:"ALUNO"},
  "nicol39": {nome:"Nicoli da Silga Guedes", tipo:"ALUNO"},
  "tchuco1": {nome:"Tchuco Silva", tipo:"ALUNO"},
  "dani2": {nome:"Daniele Vieira Leite", tipo:"ALUNO"}
};

let CRONOGRAMA_DB = {
"PRESENCIAL": [
    {hora:"06h00 🐦", status:"DESATIVADOS", alunos:[
      {n:0, id:"adriana7", aluno:"Adriana", dias:"Ter Qua", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"24/03/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:1, id:"joss8", aluno:"Jossiane Alves", dias:"Seg a Sex", freq:"5x", objetivo:"Definição", valor:"R$150,00", matricula:"R$0,00", total:"R$150,00", venc:"24/10/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 5x"},
      {n:2, id:"amigaadrum9", aluno:"amigaadrum", dias:"--", freq:"--", objetivo:"Saúde", valor:"--", matricula:"--", total:"--", venc:"--", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"--"},
      {n:3, id:"amigaadrdois10", aluno:"amigaadrdois", dias:"--", freq:"--", objetivo:"Saúde", valor:"--", matricula:"--", total:"--", venc:"--", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"--"}
    ]},
    {hora:"07h00 🌙", status:"DESATIVADOS", alunos:[
      {n:0, id:"angel11", aluno:"Angélica", dias:"Seg Qua Sex", freq:"3x", objetivo:"Definição", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"30/05/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:1, id:"anapaula12", aluno:"Ana Paula", dias:"Seg Qua Sex", freq:"3x", objetivo:"Definição", valor:"R$50,00", matricula:"R$0,00", total:"R$50,00", venc:"05/07/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:2, id:"gusta13", aluno:"Gustavo Geraldino", dias:"Seg Qua Sex", freq:"3x", objetivo:"Cond. Físico", valor:"R$50,00", matricula:"R$0,00", total:"R$50,00", venc:"05/07/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:3, id:"sueli14", aluno:"Sueli", dias:"Ter Qui Sex", freq:"3x", objetivo:"Definição", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"09/02/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:4, id:"fabi15", aluno:"Fabiana", dias:"Ter Qui", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"27/01/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"}
    ]},
    {hora:"08h00 🐢", status:"ATIVOS", alunos:[
      {n:0, id:"mag1", aluno:"Magda Gomes dos Santos", dias:"Segunda, Terça, Quarta, Quinta, Sexta", freq:"5x", objetivo:"Definição Muscular", valor:"R$150,00", matricula:"R$50,00", total:"R$200,00", venc:"13/05/26", status:"Ativo", cpf:"112.505.24", nasc:"2026-07-27", idade:"0 anos", genero:"Feminino", whats:"(13) 99636-4009", email:"magdagomes998@gmail.com", nivel_atividade:"Intermediário", q1:"Sim", q2:"Irregular", q3:"9 horas", q4:"Não", q5:"Abdômen", q6:"Não", q7:"Sim", q8:"Sim", q9:"Anti depressivo", plano:"Presencial 5x"},
      {n:1, id:"mcarla2", aluno:"Maria Carla Carvalho Santos", dias:"Segunda, Quinta, Sexta", freq:"3x", objetivo:"Emagrecimento | Saúde | Hipertrofia | Definição Muscular | Condicionamento Físico | Reabilitação Física", valor:"R$100,00", matricula:"R$50,00", total:"R$150,00", venc:"06/08/2026", status:"Ativo", cpf:"417.344.068-52", nasc:"1996-04-22", idade:"30 anos", genero:"Feminino", whats:"(13) 99768-3699", email:"carlacarvalho8362@gmail.com", nivel_atividade:"Iniciante", q1:"Sim", q2:"Mais ou menos, preciso melhorar", q3:"6 a 7 horas", q4:"Não", q5:"Barriga, braços e pernas", q6:"Não", q7:"Sim", q8:"Sim", q9:"Vitaminas e ferro norimpurum", plano:"Presencial 3x"},
      {n:2, id:"hvitoria3", aluno:"Hellem Vitória Carvalho dos Santos", dias:"Segunda, Quinta, Sexta", freq:"3x", objetivo:"Definição Muscular | Saúde | Hipertrofia | Condicionamento Físico | Reabilitação Física | Emagrecimento", valor:"R$100,00", matricula:"R$50,00", total:"R$150,00", venc:"06/08/2026", status:"Ativo", cpf:"417.344.078-24", nasc:"1999-01-11", idade:"27 anos", genero:"Feminino", whats:"(13) 99645-0471", email:"vitoria2018201@gmail.com", nivel_atividade:"Iniciante", q1:"Sim", q2:"Normal,preciso aumentar a proteína", q3:"7 horas", q4:"Não", q5:"Braços,barriga, culote e pernas.", q6:"Não", q7:"Sim", q8:"Sim", q9:"Só noripurum", plano:"Presencial 3x"},
      {n:3, id:"alexandra4", aluno:"Alexandra", dias:"Ter Qui", freq:"2x", objetivo:"Hipertrofia", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"15/07/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:4, id:"michele5", aluno:"Michele B", dias:"Seg Qua Sex", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"22/10/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:5, id:"aline6", aluno:"Aline", dias:"Seg Qui", freq:"2x", objetivo:"Definição", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"10/02/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"}
    ]},
    {hora:"09h00", status:"DESATIVADOS", alunos:[]},
    {hora:"10h00 🐙", status:"DESATIVADOS", alunos:[
      {n:0, id:"paula16", aluno:"Paula Cristine", dias:"Ter a Sex", freq:"4x", objetivo:"Condicionamento físico", valor:"R$130,00", matricula:"R$0,00", total:"R$130,00", venc:"15/03/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 4x"},
      {n:1, id:"nop17", aluno:"Natan Osvath Paoli", dias:"Seg Qua Sex", freq:"3x", objetivo:"Saúde", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"07/08/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:2, id:"bianca18", aluno:"Bianca", dias:"Seg Qua Sex", freq:"3x", objetivo:"Definição", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"19/11/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"}
    ]},
    {hora:"16h00 🕊️", status:"DESATIVADOS", alunos:[
      {n:0, id:"lau19", aluno:"Laura Jesus Aragão", dias:"Seg Qui", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"05/01/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:1, id:"cass20", aluno:"Cassandra Jesus", dias:"Seg Ter Qui", freq:"3x", objetivo:"Hipertrofia", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"07/01/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"}
    ]},
    {hora:"17h00 🐼", status:"DESATIVADOS", alunos:[
      {n:0, id:"katia21", aluno:"Kátia Paoli", dias:"Ter Qua Qui", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"26/03/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:1, id:"mara22", aluno:"Lucimara", dias:"Ter Qui Sex", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"10/11/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:2, id:"edna23", aluno:"Edna", dias:"Ter Qui Sex", freq:"3x", objetivo:"Saúde", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"10/11/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:3, id:"luciane24", aluno:"Luciane Paoli", dias:"Ter Qua Qui", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"11/11/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:4, id:"marly25", aluno:"Marly", dias:"Seg Qua Sex", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"29/07/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:5, id:"mcris26", aluno:"Maria Cristina", dias:"Seg Qua Sex", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"30/07/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"}
    ]},
    {hora:"18h00 🐸", status:"DESATIVADOS", alunos:[
      {n:0, id:"juci27", aluno:"Jucilene", dias:"Seg Qua", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"23/07/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:1, id:"joce28", aluno:"Jocélia", dias:"Seg Qua", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"12/06/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:2, id:"marcos29", aluno:"Marcos França", dias:"Sex", freq:"1x", objetivo:"Saúde", valor:"R$60,00", matricula:"R$0,00", total:"R$60,00", venc:"14/08/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 1x"},
      {n:3, id:"lucas30", aluno:"Lucas", dias:"Ter Qua Qui", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"12/08/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:4, id:"celi31", aluno:"Celidalva", dias:"Qua", freq:"1x", objetivo:"Emagrecimento", valor:"R$60,00", matricula:"R$0,00", total:"R$60,00", venc:"25/10/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 1x"},
      {n:5, id:"jaque32", aluno:"Jaqueline", dias:"Qua Sex", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"16/01/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:6, id:"elisa33", aluno:"Elisangela", dias:"Qua Sex", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"16/01/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"}
    ]},
    {hora:"19h00 🌑", status:"DESATIVADOS", alunos:[
      {n:0, id:"gice34", aluno:"Gicelia", dias:"Seg Qua", freq:"2x", objetivo:"Saúde", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"09/02/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:1, id:"pati35", aluno:"Patrícia", dias:"Seg Qua Sex", freq:"3x", objetivo:"Definição", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"--", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:2, id:"mel36", aluno:"Melissa", dias:"Seg Qua Sex", freq:"3x", objetivo:"Hipertrofia", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"--", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:3, id:"naty37", aluno:"Natália Melo", dias:"Seg Qua Sex", freq:"3x", objetivo:"Emagrecimento", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"17/07/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"}
    ]},
    {hora:"19h00 ⭐", status:"ATIVOS", alunos:[
      {n:0, id:"gon38", aluno:"José Gonzaga", dias:"Seg Qua Sex", freq:"3x", objetivo:"Hipertrofia", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"13/05/26", status:"Ativo", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:1, id:"nicol39", aluno:"Nicoli da Silga Guedes", dias:"Segunda, Quarta, Sexta", freq:"3x", objetivo:"Definição Muscular | Condicionamento Físico | Reabilitação Física | Saúde", valor:"R$100,00", matricula:"R$50,00", total:"R$150,00", venc:"30/04/26", status:"Ativo", cpf:"397.764.168-96", nasc:"2001-10-21", idade:"25 anos", genero:"Feminino", whats:"(13) 99657-4924", email:"nicolisgdss@gmail.com", nivel_atividade:"Iniciante", q1:"Apenas na epoca de escola", q2:"Nao me alimento corretamente", q3:"7/8h", q4:"Nao", q5:"Resistencia de braco e pernas, pois nao tenho forca", q6:"Nao", q7:"Sim", q8:"Sim", q9:"Nao", plano:"Presencial 3x"}
    ]},
    {hora:"20h00", status:"DESATIVADOS", alunos:[]},
    {hora:"21h00", status:"DESATIVADOS", alunos:[]},
    {hora:"22h00", status:"DESATIVADOS", alunos:[]},
    {hora:"23h00", status:"DESATIVADOS", alunos:[]},
    {hora:"00h00", status:"DESATIVADOS", alunos:[]},
    {hora:"01h00", status:"DESATIVADOS", alunos:[]},
    {hora:"02h00", status:"DESATIVADOS", alunos:[]},
    {hora:"03h00", status:"DESATIVADOS", alunos:[]},
    {hora:"04h00", status:"DESATIVADOS", alunos:[]},
    {hora:"05h00", status:"DESATIVADOS", alunos:[]},
  ],
"ONLINE": [
    {hora:"14h00", status:"DESATIVADOS", alunos:[
      {n:0, id:"tchuco1", aluno:"Tchuco Silva", dias:"Segunda a Sexta", freq:"5x", objetivo:"Condicionamento Físico | Saúde", valor:"R$60,00", matricula:"R$0,00", total:"R$60,00", venc:"15/07/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Online 5x"},
      {n:1, id:"dani2", aluno:"Daniele Vieira Leite", dias:"Seg a Sex", freq:"5x", objetivo:"Definição", valor:"R$60,00", matricula:"R$0,00", total:"R$60,00", venc:"13/05/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Online 5x"}
    ]}
  ]
};
