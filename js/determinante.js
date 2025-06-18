document.getElementById("resolver").addEventListener("click", function () {
  const matriz = lerMatriz();
  if (!matriz || matriz.length !== matriz[0].length) {
    alert("A matriz deve ser quadrada.");
    return;
  }

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = '';
  resultadoDiv.style.opacity = 0;

  const { det, passos } = calcularDeterminante(matriz);

  // Adiciona a matriz original como o primeiro passo
  resultadoDiv.innerHTML += criarPassoHTML("Matriz Original:", formatarMatriz(matriz), false);

  // Adiciona todos os outros passos (que já incluem a matriz)
  passos.forEach(stepHtml => {
      resultadoDiv.innerHTML += stepHtml; // Cada passoHTML já é um container completo
  });

  // Adiciona o resultado final com a classe de destaque
  resultadoDiv.innerHTML += criarPassoHTML("Determinante Final:", `<span style='font-size: 1.2em; font-weight: bold;'>${det.toFixed(2)}</span>`, true);

  setTimeout(() => {
    resultadoDiv.style.opacity = 1;
  }, 50);

  adicionarListenerDeCliqueNosPassos();
});

// A função calcularDeterminante foi ligeiramente modificada para retornar o HTML completo do passo
function calcularDeterminante(m, currentPassos = [], indent = "") {
  const n = m.length;

  let currentStepDescription = `${indent}Calculando Determinante para a matriz:`;
  currentPassos.push(criarPassoHTML(currentStepDescription, indent + formatarMatriz(m), false, indent));


  if (n === 1) {
      currentStepDescription = `${indent}Determinante de [${m[0][0].toFixed(2)}] = ${m[0][0].toFixed(2)}`;
      currentPassos.push(criarPassoHTML(currentStepDescription, "", false, indent)); // Sem matriz para 1x1
      return { det: m[0][0], passos: currentPassos };
  }
  if (n === 2) {
      const det2x2 = m[0][0]*m[1][1] - m[0][1]*m[1][0];
      currentStepDescription = `${indent}Determinante de 2x2 = (${m[0][0].toFixed(2)} * ${m[1][1].toFixed(2)}) - (${m[0][1].toFixed(2)} * ${m[1][0].toFixed(2)}) = ${det2x2.toFixed(2)}`;
      currentPassos.push(criarPassoHTML(currentStepDescription, "", false, indent)); // Sem matriz para 2x2 final
      return { det: det2x2, passos: currentPassos };
  }
  let det = 0;
  currentPassos.push(`${indent}<div class='passo-resolucao-texto'>Iniciando expansão por cofatores ao longo da primeira linha:</div>`); // Texto simples, não é um container de passo completo

  for (let i = 0; i < n; i++) {
    let subPassos = [];
    let sub = m.slice(1).map(r => r.filter((_, j) => j !== i));

    currentStepDescription = `${indent}  Termo ${i + 1}: (${i % 2 === 0 ? '+' : '-'}) ${m[0][i].toFixed(2)} * Determinante da submatriz:`;
    const { det: subDet, passos: subDetPassos } = calcularDeterminante(sub, subPassos, indent + "  ");
    
    currentPassos.push(criarPassoHTML(currentStepDescription, indent + formatarMatriz(sub), false, indent)); // Mostra a submatriz
    currentPassos.push(...subDetPassos); // Adiciona os passos da submatriz

    let term = ((i % 2 === 0 ? 1 : -1) * m[0][i] * subDet);
    currentPassos.push(criarPassoHTML(`${indent}  Valor do Termo ${i + 1} = ${term.toFixed(2)}`, "", false, indent)); // Sem matriz
    det += term;
  }
  currentPassos.push(criarPassoHTML(`${indent}Somando todos os termos: ${det.toFixed(2)}`, "", false, indent)); // Sem matriz para soma final
  return { det, passos: currentPassos };
}

function formatarMatriz(m) {
  let tableHTML = '<table>';
  for (let i = 0; i < m.length; i++) {
    tableHTML += '<tr>';
    for (let j = 0; j < m[i].length; j++) {
      tableHTML += `<td><span class='borda'>${m[i][j].toFixed(2)}</span></td>`;
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</table>';
  return tableHTML;
}

// === Lógica de Destaque e Seleção de Passos ===

let currentSelectedStepContainer = null;

function criarPassoHTML(description, contentHTML, isFinalResult, indent = "") {
  let containerClass = "passo-container";
  if (isFinalResult) {
    containerClass += " final-result-container";
  }
  return `
    <div class='${containerClass}' style='margin-left: ${indent.length * 10}px;'>
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