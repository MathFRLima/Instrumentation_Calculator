// Ao carregar a página
window.onload = function() {
  atualizarInterface();
  atualizarSinalPadronizado();
  atualizarTipoCalculo();
  setupPopup();
};

// Info da grandeza selecionada
function getGrandezaInfo() {
  const tipo = document.getElementById('tipo-grandeza').value;

  switch (tipo) {
    case 'temperatura':
      return { nome: 'Temperatura', unidade: '°C', artigo: 'A' };
    case 'nivel':
      return { nome: 'Nível', unidade: 'm', artigo: 'O' };
    case 'vazao':
      return { nome: 'Vazão', unidade: 'm³/h', artigo: 'A' };
    case 'pressao':
    default:
      return { nome: 'Pressão', unidade: 'bar', artigo: 'A' };
  }
}

// Atualiza textos e unidades
function atualizarInterface() {
  const { nome, unidade } = getGrandezaInfo();

  document.getElementById('label-g-min').innerText = nome;
  document.getElementById('label-g-max').innerText = nome;
  document.getElementById('label-g-atual').innerText = nome;

  document.getElementById('unit-g-min').innerText = unidade;
  document.getElementById('unit-g-max').innerText = unidade;
  document.getElementById('unit-g-atual').innerText = unidade;
}

// Atualiza limites do sinal padronizado
function atualizarSinalPadronizado() {
  const tipoSinal = document.getElementById('tipo-sinal').value;
  const cMinInput = document.getElementById('c-min');
  const cMaxInput = document.getElementById('c-max');
  const unitCorrente = document.getElementById('unit-c-atual');
  const labelCorrente = document.getElementById('label-c-atual');

  switch (tipoSinal) {
    case '4-20':
      cMinInput.value = 4;
      cMaxInput.value = 20;
      unitCorrente.innerText = 'mA';
      labelCorrente.innerText = 'Corrente';
      break;
    case '0-20':
      cMinInput.value = 0;
      cMaxInput.value = 20;
      unitCorrente.innerText = 'mA';
      labelCorrente.innerText = 'Corrente';
      break;
    case '1-5':
      cMinInput.value = 1;
      cMaxInput.value = 5;
      unitCorrente.innerText = 'V';
      labelCorrente.innerText = 'Tensão';
      break;
    case '0-10':
      cMinInput.value = 0;
      cMaxInput.value = 10;
      unitCorrente.innerText = 'V';
      labelCorrente.innerText = 'Tensão';
      break;
    default:
      cMinInput.value = '';
      cMaxInput.value = '';
      unitCorrente.innerText = 'mA ou V';
      labelCorrente.innerText = 'Corrente / Tensão';
  }
}

// Alterna entre calcular Corrente ou Grandeza
function atualizarTipoCalculo() {
  const checkbox = document.getElementById('tipo-calculo');
  const grupoGrandeza = document.getElementById('grupo-grandeza-atual');
  const grupoCorrente = document.getElementById('grupo-corrente-atual');
  const botao = document.getElementById('btn-calcular');

  if (!checkbox.checked) {
    // Calcular Corrente
    grupoGrandeza.style.display = 'block';
    grupoCorrente.style.display = 'none';
    botao.innerText = 'Calcular Corrente';
  } else {
    // Calcular Grandeza
    grupoGrandeza.style.display = 'none';
    grupoCorrente.style.display = 'block';
    botao.innerText = 'Calcular Grandeza';
  }
}

// Lógica do pop-up
function setupPopup() {
  const modal = document.getElementById('popup-modal');
  const closeBtn = document.querySelector('.close-button');

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

function exibirResultado(mensagem, isError = false) {
  const modal = document.getElementById('popup-modal');
  const resultadoP = document.getElementById('resultado-popup');

  resultadoP.innerText = mensagem;

  if (isError) {
    resultadoP.classList.add('error-text');
  } else {
    resultadoP.classList.remove('error-text');
  }

  modal.style.display = 'block';
}

// Função auxiliar para pegar valores
function getValores() {
  const C_min = parseFloat(document.getElementById('c-min').value);
  const C_max = parseFloat(document.getElementById('c-max').value);
  const G_min = parseFloat(document.getElementById('g-min').value);
  const G_max = parseFloat(document.getElementById('g-max').value);

  return { C_min, C_max, G_min, G_max };
}

// Decide qual cálculo executar
function executarCalculo() {
  const checkbox = document.getElementById('tipo-calculo');

  if (!checkbox.checked) {
    calcularCorrente();
  } else {
    calcularGrandeza();
  }
}

// Calcular corrente/tensão a partir da grandeza
function calcularCorrente() {
  const { C_min, C_max, G_min, G_max } = getValores();
  const G_atual = parseFloat(document.getElementById('g-atual').value);
  const { nome, unidade } = getGrandezaInfo();
  const tipoSinal = document.getElementById('tipo-sinal').value;

  if (
    isNaN(C_min) || isNaN(C_max) ||
    isNaN(G_min) || isNaN(G_max) ||
    isNaN(G_atual)
  ) {
    exibirResultado('Erro: Preencha todos os campos obrigatórios.', true);
    return;
  }

  if (G_min >= G_max || C_min >= C_max) {
    exibirResultado('Erro de especificação: valor mínimo não pode ser maior ou igual ao máximo.', true);
    return;
  }

  if (G_atual < G_min || G_atual > G_max) {
    exibirResultado(
      `Erro: O valor de entrada (${G_atual} ${unidade}) está fora da faixa de ${G_min} a ${G_max} ${unidade}.`,
      true
    );
    return;
  }

  const saida = (((G_atual - G_min) * (C_max - C_min)) / (G_max - G_min)) + C_min;

  const unidadeSaida = (tipoSinal === '4-20' || tipoSinal === '0-20') ? 'mA' : 'V';

  exibirResultado(`A saída deve ser: ${saida.toFixed(2)} ${unidadeSaida}`);
}

// Calcular grandeza a partir da corrente/tensão
function calcularGrandeza() {
  const { C_min, C_max, G_min, G_max } = getValores();
  const C_atual = parseFloat(document.getElementById('c-atual').value);
  const { nome, unidade, artigo } = getGrandezaInfo();

  if (
    isNaN(C_min) || isNaN(C_max) ||
    isNaN(G_min) || isNaN(G_max) ||
    isNaN(C_atual)
  ) {
    exibirResultado('Erro: Preencha todos os campos obrigatórios.', true);
    return;
  }

  if (G_min >= G_max || C_min >= C_max) {
    exibirResultado('Erro de especificação: valor mínimo não pode ser maior ou igual ao máximo.', true);
    return;
  }

  if (C_atual < C_min || C_atual > C_max) {
    exibirResultado(
      `Erro: O valor de entrada (${C_atual}) está fora da faixa de ${C_min} a ${C_max}.`,
      true
    );
    return;
  }

  const grandeza = (((C_atual - C_min) * (G_max - G_min)) / (C_max - C_min)) + G_min;

  exibirResultado(`${artigo} ${nome.toLowerCase()} deve ser: ${grandeza.toFixed(2)} ${unidade}`);
}
