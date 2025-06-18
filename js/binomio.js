// Função auxiliar para calcular o coeficiente binomial C(n, k)
// Esta função agora também pode retornar os passos de cálculo do coeficiente
function coeficienteBinomial(n, k, passosBinomial = []) {
    if (k < 0 || k > n) {
        passosBinomial.push(`C(${n}, ${k}): k fora do intervalo.`);
        return 0;
    }
    if (k === 0 || k === n) {
        passosBinomial.push(`C(${n}, ${k}): Coeficiente é 1 (k=0 ou k=n).`);
        return 1;
    }
    if (k > n / 2) k = n - k; // Otimização
    
    let res = 1;
    let numeradorStr = `${n}`;
    let denominadorStr = `1`;

    for (let i = 1; i <= k; i++) {
        res = res * (n - i + 1) / i;
        numeradorStr += ` * (${n - i + 1})`;
        denominadorStr += ` * ${i}`;
    }
    passosBinomial.push(`C(${n}, ${k}) = ${numeradorStr} / (${denominadorStr}) = ${res}`);
    return res;
}

// Função para criar o HTML de um passo do binômio
function criarPassoBinomioHTML(descricao, detalhe, isFinal = false, isError = false) {
    let classes = 'resultado-binomio-passo';
    if (isFinal) {
        classes += ' final-result-binomio';
    }
    if (isError) {
        classes += ' error-binomio-step';
    }
    return `<div class="${classes}">
                <p><strong>${descricao}</strong></p>
                <p>${detalhe}</p>
            </div>`;
}

// Função para calcular o Binômio de Newton (a+b)^n
function calcularBinomio() {
    const n = parseInt(document.getElementById('expoenteN').value);
    const resultadoDiv = document.getElementById('resultadoBinomio');
    resultadoDiv.innerHTML = ''; // Limpa resultados anteriores

    if (isNaN(n) || n < 0) {
        resultadoDiv.innerHTML = criarPassoBinomioHTML("Erro", "Por favor, insira um número inteiro não negativo para 'n'.", true, true);
        return;
    }

    let todosOsPassos = [];
    todosOsPassos.push(criarPassoBinomioHTML("Fórmula Geral do Binômio de Newton", `$(a+b)^n = \\sum_{k=0}^{n} C(n, k) a^{n-k} b^k$`));
    todosOsPassos.push(criarPassoBinomioHTML("Substituindo 'n'", `Para n = ${n}: $(a+b)^{${n}} = \\sum_{k=0}^{${n}} C(${n}, k) a^{${n}-k} b^k$`));
    
    let termosHtml = [];
    for (let k = 0; k <= n; k++) {
        let passosCoeficiente = [];
        const coef = coeficienteBinomial(n, k, passosCoeficiente);
        
        todosOsPassos.push(criarPassoBinomioHTML(`Cálculo do Coeficiente Binomial para k=${k}`, passosCoeficiente.join('<br>')));

        let termoStr = `${coef}`;
        let aPower = n - k;
        let bPower = k;

        if (aPower > 0) {
            termoStr += `a`;
            if (aPower > 1) {
                termoStr += `<sup>${aPower}</sup>`;
            }
        }
        if (bPower > 0) {
            termoStr += `b`;
            if (bPower > 1) {
                termoStr += `<sup>${bPower}</sup>`;
            }
        }
        termosHtml.push(termoStr);
        todosOsPassos.push(criarPassoBinomioHTML(`Montagem do Termo para k=${k}`, `Termo: ${termoStr}`));
    }

    const finalExpansion = termosHtml.join(' + ');
    todosOsPassos.push(criarPassoBinomioHTML("Expansão Final", `$(a+b)^${n} = ${finalExpansion}`));
    
    resultadoDiv.innerHTML = todosOsPassos.join('');
    resultadoDiv.innerHTML += criarPassoBinomioHTML("Resultado Final do Binômio", `$(a+b)^${n} = ${finalExpansion}`, true);
    
    // Renderiza LaTeX
    setTimeout(() => {
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([resultadoDiv]);
        }
    }, 100);
}

// A função para gerar o Triângulo de Pascal permanece a mesma, pois sua saída já é visualmente um "passo a passo"
function gerarTrianguloPascal() {
    const numRows = parseInt(document.getElementById('linhasPascal').value);
    const trianguloDiv = document.getElementById('trianguloPascal');
    trianguloDiv.innerHTML = '';

    if (isNaN(numRows) || numRows < 1 || numRows > 15) {
        trianguloDiv.innerHTML = "<div class='error-message'>Por favor, insira um número de linhas entre 1 e 15.</div>";
        return;
    }

    let triangulo = [];
    for (let i = 0; i < numRows; i++) {
        triangulo[i] = [];
        let rowHtml = '<div class="pascal-row">';
        for (let j = 0; j <= i; j++) {
            if (j === 0 || j === i) {
                triangulo[i][j] = 1;
            } else {
                triangulo[i][j] = triangulo[i - 1][j - 1] + triangulo[i - 1][j];
            }
            rowHtml += `<span class="pascal-number">${triangulo[i][j]}</span>`;
        }
        rowHtml += '</div>';
        trianguloDiv.innerHTML += rowHtml;
    }
}

// Gera o triângulo de Pascal inicial ao carregar a página
document.addEventListener('DOMContentLoaded', gerarTrianguloPascal);