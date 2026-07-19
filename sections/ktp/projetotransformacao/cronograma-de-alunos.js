// ARQUIVO: cronograma-de-alunos.js
// BANCO DE DADOS OFICIAL - 28 COLUNAS

const ALUNOS_DB = {
  "ktp1": {nome:"SAY KORVIL", tipo:"ADMIN"},
  "mag0": {nome:"Magda Gomes dos Santos", tipo:"ADMIN"}
};

const CRONOGRAMA_DB = {
  "PRESENCIAL": [
    {hora:"06h00 🐦", status:"DESATIVADOS", alunos:[
      {n:1, aluno:"Adriana", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Emagrecimento", plano:"Presencial 2x", dias:"Ter Qua", horario:"06:00", mensalidade:"R$80,00", matricula:"--", total:"R$80,00", valor:80, venc:"24/03/26", status:"Desativado", id:"adriana20"}
    ]},
    {hora:"07h00 🌙", status:"DESATIVADOS", alunos:[
      {n:2, aluno:"Angélica", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Definição", plano:"Presencial 3x", dias:"Seg Qua Sex", horario:"07:00", mensalidade:"R$100,00", matricula:"--", total:"R$100,00", valor:100, venc:"30/05/25", status:"Desativado", id:"angel02"},
      {n:3, aluno:"Ana Paula", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Definição", plano:"Presencial 3x", dias:"Seg Qua Sex", horario:"07:00", mensalidade:"R$50,00", matricula:"--", total:"R$50,00", valor:50, venc:"05/07/25", status:"Desativado", id:"anapaula22"}
    ]},
    {hora:"08h00 🐢", status:"ATIVOS", alunos:[
      {n:1, aluno:"Maria Carla Carvalho Santos", cpf:"417.344.068-52", nascimento:"1996-04-22", idade:"30", genero:"Feminino", whatsapp:"(13) 99768-3699", email:"carlacarvalho8362@gmail.com", nivel:"Iniciante", q1:"Sim", q2:"Mais ou menos, preciso melhorar", q3:"6 a 7 horas", q4:"Não", q5:"Barriga, braços e pernas", q6:"Não", q7:"Sim", q8:"Sim", q9:"Vitaminas e ferro norimpurum", objetivo:"Emagrecimento | Saúde | Hipertrofia | Definição Muscular | Condicionamento Físico | Reabilitação Física", plano:"Presencial 3x", dias:"Terça, Quinta, Sexta", horario:"08:00", mensalidade:"R$100,00", matricula:"R$50,00", total:"R$150,00", valor:100, venc:"06/08/26", status:"Ativo", id:"carla38"},
      {n:2, aluno:"Hellem Vitória Carvalho dos Santos", cpf:"417.344.078-24", nascimento:"1999-01-11", idade:"27", genero:"Feminino", whatsapp:"(13) 99645-0471", email:"vitoria2018201@gmail.com", nivel:"Iniciante", q1:"Sim", q2:"Normal,preciso aumentar a proteína", q3:"7 horas", q4:"Não", q5:"Braços,barriga, culote e pernas.", q6:"Não", q7:"Sim", q8:"Sim", q9:"Só noripurum.", objetivo:"Definição Muscular | Saúde | Hipertrofia | Condicionamento Físico | Reabilitação Física | Emagrecimento", plano:"Presencial 3x", dias:"Terça, Quinta, Sexta", horario:"08:00", mensalidade:"R$100,00", matricula:"R$50,00", total:"R$150,00", valor:100, venc:"06/08/26", status:"Ativo", id:"vhellem39"}
    ]},
    {hora:"10h00 🐙", status:"DESATIVADOS", alunos:[
      {n:1, aluno:"Paula Cristine", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Condicionamento físico", plano:"Presencial 4x", dias:"Ter a Sex", horario:"10:00", mensalidade:"R$130,00", matricula:"--", total:"R$130,00", valor:130, venc:"15/03/26", status:"Desativado", id:"paula06"}
    ]},
    {hora:"16h00 🕊️", status:"DESATIVADOS", alunos:[
      {n:1, aluno:"Laura Jesus Aragão", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Emagrecimento", plano:"Presencial 2x", dias:"Seg Qui", horario:"16:00", mensalidade:"R$80,00", matricula:"--", total:"R$80,00", valor:80, venc:"05/01/26", status:"Desativado", id:"lau08"}
    ]},
    {hora:"17h00 🐼", status:"DESATIVADOS", alunos:[
      {n:1, aluno:"Kátia Paoli", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Emagrecimento", plano:"Presencial 3x", dias:"Ter Qua Qui", horario:"17:00", mensalidade:"R$100,00", matricula:"--", total:"R$100,00", valor:100, venc:"26/03/26", status:"Desativado", id:"katiap11"}
    ]},
    {hora:"18h00 🐸", status:"DESATIVADOS", alunos:[
      {n:1, aluno:"Jucilene", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Emagrecimento", plano:"Presencial 2x", dias:"Seg Qua", horario:"18:00", mensalidade:"R$80,00", matricula:"--", total:"R$80,00", valor:80, venc:"23/07/25", status:"Desativado", id:"juci29"}
    ]},
    {hora:"19h00 🌑", status:"DESATIVADOS", alunos:[
      {n:1, aluno:"Gicelia", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Saúde", plano:"Presencial 2x", dias:"Seg Qua", horario:"19:00", mensalidade:"R$80,00", matricula:"--", total:"R$80,00", valor:80, venc:"09/02/26", status:"Desativado", id:"gice01"},
      {n:2, aluno:"Nicoli da Silga Guedes", cpf:"397.764.168-96", nascimento:"2001-10-21", idade:"25", genero:"Feminino", whatsapp:"(13) 99657-4924", email:"nicolisgdss@gmail.com", nivel:"Iniciante", q1:"Apenas na epoca de escola", q2:"Nao me alimento corretamente", q3:"7/8h", q4:"Nao", q5:"Resistencia de braco e pernas, pois nao tenho forca", q6:"Nao", q7:"Sim", q8:"Sim", q9:"Nao", objetivo:"Definição Muscular | Condicionamento Físico | Reabilitação Física | Saúde", plano:"Presencial 3x", dias:"Segunda, Quarta, Sexta", horario:"19:00", mensalidade:"R$100,00", matricula:"R$50,00", total:"R$150,00", valor:100, venc:"--", status:"Ativo", id:"nicoli25"}
    ]},
    {hora:"20h00 ⭐", status:"ATIVOS", alunos:[
      {n:10, aluno:"José Gonzaga", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Hipertrofia", plano:"Presencial 3x", dias:"Seg Qua Sex", horario:"20:00", mensalidade:"--", matricula:"--", total:"R$100,00", valor:100, venc:"13/05/26", status:"Ativo", id:"gon19"}
    ]}
  ],
  "ONLINE": [
    {hora:"14h00", status:"ATIVOS", alunos:[
      {n:1, aluno:"Daniele Vieira Leite", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Definição", plano:"Online", dias:"Seg a Sex", horario:"14:00", mensalidade:"R$60,00", matricula:"R$50,00", total:"R$110,00", valor:60, venc:"13/05/26", status:"Ativo", id:"dani36"}
    ]},
    {hora:"", status:"DESATIVADOS", alunos:[
      {aluno:"Tchuco", cpf:"--", nascimento:"--", idade:"--", genero:"--", whatsapp:"--", email:"--", nivel:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", objetivo:"Condicionamento físico", plano:"Online", dias:"Online", horario:"14:00", mensalidade:"--", matricula:"--", total:"--", valor:"--", venc:"06/04/26", status:"Desativado", id:"tchu37"}
    ]}
  ]
};
