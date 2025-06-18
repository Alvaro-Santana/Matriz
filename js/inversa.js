document.getElementById("resolver").addEventListener("click", function () {
    const matriz = lerMatriz();
    if (!matriz || matriz.length === 0 || matriz.length !== matriz[0].length) {
        alert("A matriz deve ser quadrada e não vazia.");
        return;
    }

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = '';
    resultadoDiv.style.opacity = 0;

    try {
        const { inversa: finalInversa, passos } = inverterMatriz(matriz);

        // Adiciona a matriz original como o primeiro passo
        resultadoDiv.innerHTML += criarPassoHTML("Matriz Original:", formatarMatriz(matriz, 4), false);

        // Adiciona todos os passos intermediários (que já vêm como HTML de container)
        passos.forEach(stepHtml => {
            resultadoDiv.innerHTML += stepHtml;
        });

        // Adiciona o resultado final com a classe de destaque
        resultadoDiv.innerHTML += criarPassoHTML("Matriz Inversa Final:", formatarMatriz(finalInversa, 4), true);

        setTimeout(() => {
          resultadoDiv.style.opacity = 1;
        }, 50);

        adicionarListenerDeCliqueNosPassos();

    } catch (error) {
        resultadoDiv.innerHTML = `<div class='passo-container final-result-container selected-step-container' style='background-color: #ffe0e0; border-color: #ff0000;'><span class='passo-resolucao-texto' style='color: #ff0000; font-weight: bold;'>Erro: ${error.message}</span></div>`;
        resultadoDiv.style.opacity = 1;
    }
});

function inverterMatriz(A) {
    let n = A.length;
    let I = A.map((_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    let M = A.map(row => [...row]);
    let passos = []; // Armazenará HTML completo dos containers de passo

    passos.push(criarPassoHTML("Iniciando o método de Gauss-Jordan. Matriz Aumentada Inicial:", formatarMatrizAumentada(M, I, 4), false));


    for (let i = 0; i < n; i++) {
        let pivotRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(M[k][i]) > Math.abs(M[pivotRow][i])) {
                pivotRow = k;
            }
        }

        if (M[pivotRow][i] === 0) {
            throw new Error("A matriz é singular e não possui inversa.");
        }

        if (pivotRow !== i) {
            [M[i], M[pivotRow]] = [M[pivotRow], M[i]];
            [I[i], I[pivotRow]] = [I[pivotRow], I[i]];
            passos.push(criarPassoHTML(`L${i + 1} <-> L${pivotRow + 1} (troca de linhas para pivoteamento)`, formatarMatrizAumentada(M, I, 4), false));
        }

        let factor = M[i][i];
        if (factor !== 1) {
            passos.push(criarPassoHTML(`L${i + 1} = L${i + 1} / ${factor.toFixed(4)} (Normalizando pivô para 1)`, formatarMatrizAumentada(M, I, 4), false));
            for (let j = 0; j < n; j++) {
                M[i][j] /= factor;
                I[i][j] /= factor;
            }
        }


        for (let k = 0; k < n; k++) {
            if (k !== i) {
                let f = M[k][i];
                if (f === 0) continue;
                passos.push(criarPassoHTML(`L${k + 1} = L${k + 1} - (${f.toFixed(4)} * L${i + 1}) (Zerando coluna ${i+1} fora do pivô)`, formatarMatrizAumentada(M, I, 4), false));
                for (let j = 0; j < n; j++) {
                    M[k][j] -= f * M[i][j];
                    I[k][j] -= f * I[i][j];
                }
            }
        }
    }

    return { inversa: I, passos };
}

function formatarMatriz(m, decimalPlaces = 0) {
    let tableHTML = '<table>';
    for (let i = 0; i < m.length; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < m[i].length; j++) {
            tableHTML += `<td><span class='borda'>${m[i][j].toFixed(decimalPlaces)}</span></td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    return tableHTML;
}

function formatarMatrizAumentada(M, I, decimalPlaces = 0) {
    let tableHTML = '<table>';
    for (let i = 0; i < M.length; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < M[i].length; j++) {
            tableHTML += `<td><span class='borda'>${M[i][j].toFixed(decimalPlaces)}</span></td>`;
        }
        tableHTML += `<td><span class='borda' style='border: none; font-weight: bold;'>|</span></td>`;
        for (let j = 0; j < I[i].length; j++) {
            tableHTML += `<td><span class='borda'>${I[i][j].toFixed(decimalPlaces)}</span></td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    return tableHTML;
}

// === Lógica de Destaque e Seleção de Passos ===

let currentSelectedStepContainer = null;

function criarPassoHTML(description, contentHTML, isFinalResult) {
  let containerClass = "passo-container";
  if (isFinalResult) {
    containerClass += " final-result-container";
  }
  return `
    <div class='${containerClass}'>
      <span class='passo-resolucao-texto'>${description}</span>
      ${contentHTML}
    </div>
  `;
}

function adicionarListenerDeCliqueNosPassos() {
  const passoContainers = document.querySelectorAll('#resultado .passo-container');
  passoContainers.forEach(container => {
    container.removeEventListener('click', handleStepClick);
    container.addEventListener('click', handleStepClick);
  });
}

function handleStepClick(event) {
  const clickedContainer = event.currentTarget;

  if (currentSelectedStepContainer) {
    currentSelectedStepContainer.classList.remove('selected-step-container');
    if (currentSelectedStepContainer.classList.contains('final-result-container')) {
       // Permanece com o estilo de final-result
    } else {
       currentSelectedStepContainer.style.transform = 'scale(0.9)';
       currentSelectedStepContainer.style.opacity = '0.7';
    }
  }

  if (clickedContainer !== currentSelectedStepContainer) {
    clickedContainer.classList.add('selected-step-container');
    clickedContainer.style.transform = 'scale(1.1)';
    clickedContainer.style.opacity = '1';
    currentSelectedStepContainer = clickedContainer;

    const finalResultContainer = document.querySelector('#resultado .final-result-container');
    if (finalResultContainer && finalResultContainer !== currentSelectedStepContainer) {
        finalResultContainer.classList.remove('selected-step-container');
        finalResultContainer.style.transform = 'scale(1.05)';
        finalResultContainer.style.opacity = '1';
    }

  } else {
    clickedContainer.classList.remove('selected-step-container');
    if (clickedContainer.classList.contains('final-result-container')) {
        clickedContainer.style.transform = 'scale(1.05)';
        clickedContainer.style.opacity = '1';
    } else {
        clickedContainer.style.transform = 'scale(0.9)';
        clickedContainer.style.opacity = '0.7';
    }
    currentSelectedStepContainer = null;
  }
}