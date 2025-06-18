
document.getElementById("gm").addEventListener("click", function () {
  const emY = parseInt(document.getElementById("emY").value);
  const emX = parseInt(document.getElementById("emX").value);
  if (isNaN(emY) || isNaN(emX) || emY <= 0 || emX <= 0) {
    alert("Preencha as dimensões corretamente.");
    return;
  }
  gerarMatriz(emX, emY);
});

function gerarMatriz(linhas, colunas) {
  const container = document.getElementById("mg");
  container.innerHTML = '';
  const tabela = document.createElement("table");
  tabela.style.margin = "auto";
  for (let i = 0; i < linhas; i++) {
    const linha = document.createElement("tr");
    for (let j = 0; j < colunas; j++) {
      const celula = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.classList.add("input-cell");
      celula.appendChild(input);
      linha.appendChild(celula);
    }
    tabela.appendChild(linha);
  }
  container.appendChild(tabela);
}

function lerMatriz() {
  const container = document.getElementById("mg");
  const linhas = container.getElementsByTagName("tr");
  let matriz = [];
  for (let i = 0; i < linhas.length; i++) {
    const inputs = linhas[i].getElementsByTagName("input");
    let linha = [];
    for (let j = 0; j < inputs.length; j++) {
      const valor = parseFloat(inputs[j].value);
      if (isNaN(valor)) {
        alert("Todos os campos devem ser preenchidos.");
        return null;
      }
      linha.push(valor);
    }
    matriz.push(linha);
  }
  return matriz;
}
