// Garante que a interface seja atualizada assim que a página carregar
window.onload = function() {
    atualizarInterface();
    setupPopup();
};

// Função auxiliar para obter informações da grandeza selecionada
function getGrandezaInfo() {
    const tipoSensor = document.getElementById('tipo-sensor').value;
    switch (tipoSensor) {
        case 'temperatura':
            return { nome: 'Temperatura', unidade: '°C', artigo: 'A' };
        case 'nivel':
            return { nome: 'Nível', unidade: 'm³/h', artigo: 'O' };
        case 'pressao':
        default:
            return { nome: 'Pressão', unidade: 'bar', artigo: 'A' };
    }
}

function atualizarInterface() {
    const { nome, unidade } = getGrandezaInfo();
    
    // Atualiza todos os textos na página
    document.getElementById('label-p-min').innerText = nome;
    document.getElementById('unit-p-min').innerText = unidade;
    document.getElementById('label-p-max').innerText = nome;
    document.getElementById('unit-p-max').innerText = unidade;
    document.getElementById('label-p-atual').innerText = nome;
    document.getElementById('unit-p-atual').innerText = unidade;
    
    document.getElementById('label-calculo-corrente').innerText = nome;
    document.getElementById('label-calculo-p').innerText = nome;
    document.getElementById('label-botao-p').innerText = nome;
}

// --- Lógica do Pop-up ---
function setupPopup() {
    const modal = document.getElementById('popup-modal');
    const closeBtn = document.querySelector('.close-button');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
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

// --- Funções de Cálculo ---
function getValores() {
    const C_min = parseFloat(document.getElementById('c-min').value);
    const C_max = parseFloat(document.getElementById('c-max').value);
    const P_min = parseFloat(document.getElementById('p-min').value);
    const P_max = parseFloat(document.getElementById('p-max').value);
    return { C_min, C_max, P_min, P_max };
}

function calcularCorrente() {
    const { C_min, C_max, P_min, P_max } = getValores();
    const P_atual = parseFloat(document.getElementById('p-atual').value);
    const { nome, unidade } = getGrandezaInfo();

    if (isNaN(C_min) || isNaN(C_max) || isNaN(P_min) || isNaN(P_max) || isNaN(P_atual)) {
        exibirResultado('Erro: Preencha todos os campos corretamente.', true);
        return;
    }

    if (P_min >= P_max || C_min >= C_max) {
        exibirResultado('Erro de Especificação: O valor mínimo não pode ser maior ou igual ao valor máximo.', true);
        return;
    }
    
    if (P_atual < P_min || P_atual > P_max) {
        exibirResultado(`Erro: O valor de entrada (${P_atual} ${unidade}) está fora da faixa especificada de ${P_min} a ${P_max} ${unidade}.`, true);
        return;
    }
    
    const bar_para_mA = (((P_atual - P_min) * (C_max - C_min)) / (P_max - P_min)) + C_min;
    exibirResultado(`A corrente deve ser: ${bar_para_mA.toFixed(2)} mA`);
}

function calcularGrandeza() {
    const { C_min, C_max, P_min, P_max } = getValores();
    const C_atual = parseFloat(document.getElementById('c-atual').value);
    const { nome, unidade, artigo } = getGrandezaInfo();

    if (isNaN(C_min) || isNaN(C_max) || isNaN(P_min) || isNaN(P_max) || isNaN(C_atual)) {
        exibirResultado('Erro: Preencha todos os campos corretamente.', true);
        return;
    }

    if (P_min >= P_max || C_min >= C_max) {
        exibirResultado('Erro de Especificação: O valor mínimo não pode ser maior ou igual ao valor máximo.', true);
        return;
    }

    if (C_atual < C_min || C_atual > C_max) {
        exibirResultado(`Erro: O valor de entrada (${C_atual} mA) está fora da faixa especificada de ${C_min} a ${C_max} mA.`, true);
        return;
    }

    const mA_para_grandeza = (((C_atual - C_min) * (P_max - P_min)) / (C_max - C_min)) + P_min;
    exibirResultado(`${artigo} ${nome.toLowerCase()} deve ser: ${mA_para_grandeza.toFixed(2)} ${unidade}`);
}