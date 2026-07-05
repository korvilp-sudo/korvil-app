function anexarArquivo(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf,.png,.jpg,.jpeg,.txt';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if(file){
      const resposta = await Copia.lerArquivo(file);
      KAI.adicionarNaTela("kai", resposta);
    }
  }
  input.click();
}
