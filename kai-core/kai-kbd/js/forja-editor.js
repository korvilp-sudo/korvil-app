// ============= AUTO START + OBSERVADOR K-AI =============

// OBSERVA TUDO QUE O USUÁRIO FAZ
editor.addEventListener('input', () => {
  K_AI.observar("digitou", editor.value.substring(0, 50));
});

document.getElementById('arquivo').addEventListener('change', e => {
  K_AI.observar("mudou_arquivo", e.target.value);
});

document.getElementById('confirmarBtn').addEventListener('click', () => {
  K_AI.observar("salvou", ARQUIVO_SELECIONADO);
});

window.addEventListener('error', (e) => {
  K_AI.observar("erro", e.message);
});

// ============= LIGA TUDO AUTOMATICO AO ABRIR =============
window.addEventListener('load', () => {
  setTimeout(() => {
    // 1. LIGA K-AI
    K_AI.iniciar();
    document.getElementById('menu-kai').classList.add('ativo');
    
    // 2. LIGA VOZ
    if(recognition){
      recognition.start();
      document.getElementById('btnVoz').classList.add('gravando');
      K_AI.salvarMemoria("Microfone ativado");
    }
    
    // 3. LIGA CGM
    setTimeout(() => {
      iniciarCGM();
      K_AI.salvarMemoria("CGM ativado");
    }, 2000);

    falarKai("Bem vindo de volta. Estou monitorando tudo.");
  }, 1500);
});

// DETECTA INATIVIDADE
let tempoInativo;
document.onmousemove = document.onkeydown = () => {
  clearTimeout(tempoInativo);
  tempoInativo = setTimeout(() => K_AI.observar("inativo", "5 segundos"), 5000);
}
