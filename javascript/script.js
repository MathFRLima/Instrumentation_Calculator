function calcularCorrente() {
    // Pega os valores das especificações
    const C_min = parseFloat(document.getElementById('c-min').value);
    const C_max = parseFloat(document.getElementById('c-max').value);
    const P_min = parseFloat(document.getElementById('p-min').value);
    const P_max = parseFloat(document.getElementById('p-max').value);

    // Pega o valor da pressão atual
    const P_atual = parseFloat(document.getElementById('p-atual').value);

    // Verifica se todos os campos foram preenchidos
    if (isNaN(C_min) || isNaN(C_max) || isNaN(P_min) || isNaN(P_max) || isNaN(P_atual)) {
        document.getElementById('resultado').innerText = 'Erro: Preencha todos os campos corretamente.';
        return;
    }
    
    // Fórmula para calcular a corrente
    const bar_para_mA = (((P_atual - P_min) * (C_max - C_min)) / (P_max - P_min)) + C_min;

    // Exibe o resultado na página
    document.getElementById('resultado').innerText = `A corrente deve ser: ${bar_para_mA.toFixed(2)} mA`;
}

function calcularPressao() {
    // Pega os valores das especificações
    const C_min = parseFloat(document.getElementById('c-min').value);
    const C_max = parseFloat(document.getElementById('c-max').value);
    const P_min = parseFloat(document.getElementById('p-min').value);
    const P_max = parseFloat(document.getElementById('p-max').value);
    
    // Pega o valor da corrente atual
    const C_atual = parseFloat(document.getElementById('c-atual').value);

    // Verifica se todos os campos foram preenchidos
    if (isNaN(C_min) || isNaN(C_max) || isNaN(P_min) || isNaN(P_max) || isNaN(C_atual)) {
        document.getElementById('resultado').innerText = 'Erro: Preencha todos os campos corretamente.';
        return;
    }

    // Fórmula para calcular a pressão
    const mA_para_bar = (((C_atual - C_min) * (P_max - P_min)) / (C_max - C_min)) + P_min;

    // Exibe o resultado na página
    document.getElementById('resultado').innerText = `A pressão deve ser: ${mA_para_bar.toFixed(2)} bar`;
}
