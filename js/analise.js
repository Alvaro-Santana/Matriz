// Função auxiliar para calcular o fatorial e registrar os passos
function fatorial(num, passosFatorial = []) {
    if (num < 0) {
        passosFatorial.push(`Fatorial de ${num}: Não é possível calcular o fatorial de um número negativo.`);
        return NaN; // Retorna NaN para indicar um erro
    }
    if (num === 0 || num === 1) {
        passosFatorial.push(`Cálculo de ${num}!: ${num}! = 1`);
        return 1;
    }

    // CORREÇÃO AQUI: result deve começar com 'num'
    // E o loop deve começar de 'num - 1'
    let result = num; // <--- AGORA INICIAMOS COM O PRÓPRIO NÚMERO
    let calculoStr = `${num}`;

    // Loop para multiplicar de (num-1) até 1
    for (let i = num - 1; i >= 1; i--) { // O loop permanece o mesmo
        result *= i;
        calculoStr += ` &times; ${i}`;
    }

    passosFatorial.push(`Cálculo de ${num}!: ${num}! = ${calculoStr} = ${result}`);
    return result;
}

// Função para criar o HTML de um passo
function criarPassoCombinatoriaHTML(descricao, detalhe, isFinal = false) {
    let classes = 'resultado-combinatoria-passo';
    if (isFinal) {
        classes += ' final-result-combinatoria'; // Adiciona uma classe para destaque do final
    }
    return `<div class="${classes}">
                <p><strong>${descricao}</strong></p>
                <p>${detalhe}</p>
            </div>`;
}

// Função para calcular Arranjo Simples A(n, p) = n! / (n-p)!
function calcularArranjo() {
    const n = parseInt(document.getElementById('nArranjo').value);
    const p = parseInt(document.getElementById('pArranjo').value);
    const resultadoDiv = document.getElementById('resultadoArranjo');
    resultadoDiv.innerHTML = ''; // Limpa resultados anteriores

    if (isNaN(n) || isNaN(p) || n < 0 || p < 0) {
        resultadoDiv.innerHTML = criarPassoCombinatoriaHTML("Erro", "Por favor, insira números inteiros não negativos.", true);
        return;
    }
    if (p > n) {
        resultadoDiv.innerHTML = criarPassoCombinatoriaHTML("Erro", "'p' não pode ser maior que 'n' para Arranjo.", true);
        return;
    }

    let passos = [];
    passos.push(criarPassoCombinatoriaHTML("Fórmula do Arranjo Simples", `A(n, p) = n! / (n-p)!`));
    passos.push(criarPassoCombinatoriaHTML("Substituindo valores", `A(${n}, ${p}) = ${n}! / (${n}-${p})!`));
    passos.push(criarPassoCombinatoriaHTML("Simplificando", `A(${n}, ${p}) = ${n}! / ${n-p}!`));

    let passosFatorialN = [];
    const fatN = fatorial(n, passosFatorialN);
    passosFatorialN.forEach(passo => passos.push(criarPassoCombinatoriaHTML("Cálculo Fatorial n", passo)));

    let passosFatorialNminusP = [];
    const fatNminusP = fatorial(n - p, passosFatorialNminusP);
    passosFatorialNminusP.forEach(passo => passos.push(criarPassoCombinatoriaHTML("Cálculo Fatorial (n-p)", passo)));

    if (isNaN(fatN) || isNaN(fatNminusP)) { // Se algum fatorial resultou em erro (ex: número negativo)
        resultadoDiv.innerHTML = passos.join('');
        resultadoDiv.innerHTML += criarPassoCombinatoriaHTML("Erro", "Não foi possível calcular o arranjo devido a um erro no fatorial.", true);
        return;
    }

    const arranjo = fatN / fatNminusP;
    passos.push(criarPassoCombinatoriaHTML("Cálculo Final", `A(${n}, ${p}) = ${fatN} / ${fatNminusP} = ${arranjo}`));
    resultadoDiv.innerHTML = passos.join('');
    resultadoDiv.innerHTML += criarPassoCombinatoriaHTML("Resultado Final do Arranjo", `A(${n}, ${p}) = ${arranjo}`, true);
}

// Função para calcular Permutação Simples P(n) = n!
function calcularPermutacao() {
    const n = parseInt(document.getElementById('nPermutacao').value);
    const resultadoDiv = document.getElementById('resultadoPermutacao');
    resultadoDiv.innerHTML = ''; // Limpa resultados anteriores

    if (isNaN(n) || n < 0) {
        resultadoDiv.innerHTML = criarPassoCombinatoriaHTML("Erro", "Por favor, insira um número inteiro não negativo.", true);
        return;
    }

    let passos = [];
    passos.push(criarPassoCombinatoriaHTML("Fórmula da Permutação Simples", `P(n) = n!`));
    passos.push(criarPassoCombinatoriaHTML("Substituindo valores", `P(${n}) = ${n}!`));

    let passosFatorialN = [];
    const permutacao = fatorial(n, passosFatorialN);
    passosFatorialN.forEach(passo => passos.push(criarPassoCombinatoriaHTML("Cálculo Fatorial n", passo)));

    if (isNaN(permutacao)) {
        resultadoDiv.innerHTML = passos.join('');
        resultadoDiv.innerHTML += criarPassoCombinatoriaHTML("Erro", "Não foi possível calcular a permutação devido a um erro no fatorial.", true);
        return;
    }

    passos.push(criarPassoCombinatoriaHTML("Cálculo Final", `P(${n}) = ${permutacao}`));
    resultadoDiv.innerHTML = passos.join('');
    resultadoDiv.innerHTML += criarPassoCombinatoriaHTML("Resultado Final da Permutação", `P(${n}) = ${permutacao}`, true);
}

// Função para calcular Combinação Simples C(n, p) = n! / (p! * (n-p)!)
function calcularCombinacao() {
    const n = parseInt(document.getElementById('nCombinacao').value);
    const p = parseInt(document.getElementById('pCombinacao').value);
    const resultadoDiv = document.getElementById('resultadoCombinacao');
    resultadoDiv.innerHTML = ''; // Limpa resultados anteriores

    if (isNaN(n) || isNaN(p) || n < 0 || p < 0) {
        resultadoDiv.innerHTML = criarPassoCombinatoriaHTML("Erro", "Por favor, insira números inteiros não negativos.", true);
        return;
    }
    if (p > n) {
        resultadoDiv.innerHTML = criarPassoCombinatoriaHTML("Erro", "'p' não pode ser maior que 'n' para Combinação.", true);
        return;
    }

    let passos = [];
    passos.push(criarPassoCombinatoriaHTML("Fórmula da Combinação Simples", `C(n, p) = n! / (p! * (n-p)!)`));
    passos.push(criarPassoCombinatoriaHTML("Substituindo valores", `C(${n}, ${p}) = ${n}! / (${p}! * (${n}-${p})!)`));
    passos.push(criarPassoCombinatoriaHTML("Simplificando", `C(${n}, ${p}) = ${n}! / (${p}! * ${n-p}!)`));

    let passosFatorialN = [];
    const fatN = fatorial(n, passosFatorialN);
    passosFatorialN.forEach(passo => passos.push(criarPassoCombinatoriaHTML("Cálculo Fatorial n", passo)));

    let passosFatorialP = [];
    const fatP = fatorial(p, passosFatorialP);
    passosFatorialP.forEach(passo => passos.push(criarPassoCombinatoriaHTML("Cálculo Fatorial p", passo)));

    let passosFatorialNminusP = [];
    const fatNminusP = fatorial(n - p, passosFatorialNminusP);
    passosFatorialNminusP.forEach(passo => passos.push(criarPassoCombinatoriaHTML("Cálculo Fatorial (n-p)", passo)));

    if (isNaN(fatN) || isNaN(fatP) || isNaN(fatNminusP)) {
        resultadoDiv.innerHTML = passos.join('');
        resultadoDiv.innerHTML += criarPassoCombinatoriaHTML("Erro", "Não foi possível calcular a combinação devido a um erro no fatorial.", true);
        return;
    }

    const denominador = fatP * fatNminusP;
    passos.push(criarPassoCombinatoriaHTML("Cálculo do Denominador", `${p}! * ${n-p}! = ${fatP} * ${fatNminusP} = ${denominador}`));

    const combinacao = fatN / denominador;
    passos.push(criarPassoCombinatoriaHTML("Cálculo Final", `C(${n}, ${p}) = ${fatN} / ${denominador} = ${combinacao}`));
    resultadoDiv.innerHTML = passos.join('');
    resultadoDiv.innerHTML += criarPassoCombinatoriaHTML("Resultado Final da Combinação", `C(${n}, ${p}) = ${combinacao}`, true);
}