document.getElementById("resolver").addEventListener("click", function () {
  const matriz = lerMatriz();
  if (!matriz) return;

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = ''; // Limpa resultados anteriores
  resultadoDiv.style.opacity = 0; // Prepara para a animação fade-in

  const { matriz: finalMatriz, passos } = escalonarMatriz(matriz);

  // Adiciona a matriz original como o primeiro passo
  resultadoDiv.innerHTML += criarPassoHTML("Matriz Original:", formatarMatriz(matriz), false);

  // Adiciona todos os outros passos
  for (let i = 0; i < passos.length; i += 2) { // Percorre em pares (descrição e matriz)
    const description = passos[i];
    const matrixHTML = passos[i + 1];
    resultadoDiv.innerHTML += criarPassoHTML(description, matrixHTML, false);
  }

  // Adiciona o resultado final com a classe de destaque
  resultadoDiv.innerHTML += criarPassoHTML("Matriz Escalonada Final:", formatarMatriz(finalMatriz), true);

  // Ativa a animação de fade-in
  setTimeout(() => {
    resultadoDiv.style.opacity = 1;
  }, 50);

  // Adiciona o listener de clique nos containers dos passos
  adicionarListenerDeCliqueNosPassos();
});

function escalonarMatriz(matriz) {
  const m = JSON.parse(JSON.stringify(matriz));
  let passos = []; // Armazenará strings de descrição e strings de HTML de matriz

  let rows = m.length;
  let cols = m[0].length;

  for (let i = 0; i < rows; i++) {
    let pivotRow = i;
    while (pivotRow < rows && m[pivotRow][i] === 0) {
      pivotRow++;
    }

    if (pivotRow === rows) {
      continue;
    }

    if (pivotRow !== i) {
      [m[i], m[pivotRow]] = [m[pivotRow], m[i]];
      passos.push(`L${i + 1} <-> L${pivotRow + 1} (troca de linhas para encontrar pivô não-zero)`);
      passos.push(formatarMatriz(m)); // Adiciona a matriz após a troca
    }

    for (let j = i + 1; j < rows; j++) {
      let factor = m[j][i] / m[i][i];
      if (m[j][i] === 0 || isNaN(factor) || !isFinite(factor)) continue;

      passos.push(`Passo ${j}`);
      for (let k = i; k < cols; k++) {
        m[j][k] -= factor * m[i][k];
      }
      passos.push(formatarMatriz(m)); // Adiciona a matriz após a operação
    }
  }
  return { matriz: m, passos };
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

let currentSelectedStepContainer = null; // Armazena o container do passo atualmente selecionado

function criarPassoHTML(description, matrixHTML, isFinalResult) {
  let containerClass = "passo-container";
  if (isFinalResult) {
    containerClass += " final-result-container";
  }
  return `
    <div class='${containerClass}'>
      <span class='passo-resolucao-texto'>${description}</span>
      ${matrixHTML}
    </div>
  `;
}

function adicionarListenerDeCliqueNosPassos() {
  const passoContainers = document.querySelectorAll('#resultado .passo-container');
  passoContainers.forEach(container => {
    container.removeEventListener('click', handleStepClick); // Remove para evitar duplicação
    container.addEventListener('click', handleStepClick);
  });
}

function handleStepClick(event) {
  const clickedContainer = event.currentTarget; // Este é o .passo-container clicado

  if (currentSelectedStepContainer) {
    // Se já houver um passo selecionado, remove a classe de destaque
    currentSelectedStepContainer.classList.remove('selected-step-container');
    // Se o passo selecionado ANTES era o final, ele volta ao tamanho normal de final-result
    if (currentSelectedStepContainer.classList.contains('final-result-container')) {
       // Permanece com o estilo de final-result, mas remove o de selecionado
       // Suas transições CSS cuidarão do resto
    } else {
       // Se não era o final-result, volta ao estilo padrão (menor escala, menor opacidade)
       currentSelectedStepContainer.style.transform = 'scale(0.9)';
       currentSelectedStepContainer.style.opacity = '0.7';
    }
  }

  if (clickedContainer !== currentSelectedStepContainer) {
    // Se o container clicado não era o selecionado, destaca-o
    clickedContainer.classList.add('selected-step-container');
    clickedContainer.style.transform = 'scale(1.1)'; // Aumenta a escala
    clickedContainer.style.opacity = '1'; // Aumenta a opacidade
    currentSelectedStepContainer = clickedContainer;

    // Garante que o container do resultado final volte ao normal
    const finalResultContainer = document.querySelector('#resultado .final-result-container');
    if (finalResultContainer && finalResultContainer !== currentSelectedStepContainer) {
        finalResultContainer.classList.remove('selected-step-container'); // Remove destaque se estava
        // O estilo de final-result-container já o mantém em 1.05 e opacidade 1
        finalResultContainer.style.transform = 'scale(.9)';
        finalResultContainer.style.opacity = '1';
    }

  } else {
    // Se o container clicado já era o selecionado, deseleciona-o
    clickedContainer.classList.remove('selected-step-container');
    // Volta ao estilo padrão ou ao estilo de final-result se for o caso
    if (clickedContainer.classList.contains('final-result-container')) {
        clickedContainer.style.transform = 'scale(.9)';
        clickedContainer.style.opacity = '1';
    } else {
        clickedContainer.style.transform = 'scale(0.9)';
        clickedContainer.style.opacity = '0.7';
    }
    currentSelectedStepContainer = null; // Nenhum passo está selecionado
  }
}