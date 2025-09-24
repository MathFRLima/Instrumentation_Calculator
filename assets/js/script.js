// Garante que a interface seja atualizada assim que a página carregar
window.onload = function() {
    atualizarInterface();
    setupPopup();
};

function atualizarInterface() {
    const tipoSensor = document.getElementById('tipo-sensor').value;
    
    let nomeGrandeza, unidade;

    if (tipoSensor === 'pressao') {
        nomeGrandeza = 'Pressão';
        unidade = 'bar';
    } else {
        nomeGrandeza = 'Temperatura';
        unidade = '°C';
    }

    // Atualiza todos os textos na página
    document.getElementById('label-p-min').innerText = nomeGrandeza;
    document.getElementById('unit-p-min').innerText = unidade;
    document.getElementById('label-p-max').innerText = nomeGrandeza;
    document.getElementById('unit-p-max').innerText = unidade;
    document.getElementById('label-p-atual').innerText = nomeGrandeza;
    document.getElementById('unit-p-atual').innerText = unidade;
    document.getElementById('label-calculo-p').innerText = nomeGrandeza;
    document.getElementById('label-botao-p').innerText = nomeGrandeza;
}

// --- Lógica do Pop-up ---
function setupPopup() {
    const modal = document.getElementById('popup-modal');
    const closeBtn = document.querySelector('.close-button');

    // Fecha o pop-up ao clicar no 'X'
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Fecha o pop-up ao clicar fora da caixa de diálogo
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function exibirResultado(mensagem) {
    const modal = document.getElementById('popup-modal');
    const resultadoP = document.getElementById('resultado-popup');
    resultadoP.innerText = mensagem;
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

    const tipoSensor = document.getElementById('tipo-sensor').value;
    const unidade = (tipoSensor === 'pressao') ? 'bar' : '°C';

    if (isNaN(C_min) || isNaN(C_max) || isNaN(P_min) || isNaN(P_max) || isNaN(P_atual)) {
        exibirResultado('Erro: Preencha todos os campos corretamente.');
        return;
    }
    
    // Verifica se a pressão/temperatura atual está dentro da faixa especificada
    if (P_atual < P_min || P_atual > P_max) {
        exibirResultado(`Erro: O valor de entrada (${P_atual} ${unidade}) está fora da faixa especificada de ${P_min} a ${P_max} ${unidade}.`);
        return;
    }

    const bar_para_mA = (((P_atual - P_min) * (C_max - C_min)) / (P_max - P_min)) + C_min;
    exibirResultado(`A corrente deve ser: ${bar_para_mA.toFixed(2)} mA`);
}

function calcularGrandeza() {
    const { C_min, C_max, P_min, P_max } = getValores();
    const C_atual = parseFloat(document.getElementById('c-atual').value);
    
    const tipoSensor = document.getElementById('tipo-sensor').value;
    const unidade = (tipoSensor === 'pressao') ? 'bar' : '°C';
    const nomeGrandeza = (tipoSensor === 'pressao') ? 'A pressão' : 'A temperatura';

    if (isNaN(C_min) || isNaN(C_max) || isNaN(P_min) || isNaN(P_max) || isNaN(C_atual)) {
        exibirResultado('Erro: Preencha todos os campos corretamente.');
        return;
    }

    // Verifica se a corrente atual está dentro da faixa especificada
    if (C_atual < C_min || C_atual > C_max) {
        exibirResultado(`Erro: O valor de entrada (${C_atual} mA) está fora da faixa especificada de ${C_min} a ${C_max} mA.`);
        return;
    }

    const mA_para_grandeza = (((C_atual - C_min) * (P_max - P_min)) / (C_max - C_min)) + P_min;
    exibirResultado(`${nomeGrandeza} deve ser: ${mA_para_grandeza.toFixed(2)} ${unidade}`);
}