import { salvarTabela } from "./salvarTabela.js";
import { itensPadrao } from "./itensPadrao.js"; // Lista separada de itens por categoria

export function renderTabela(categoria, dadosCategoria, loja, container) {
  container.innerHTML = "";

  const div = document.createElement("div");
  div.className = "tabela-container";

  // Cabeçalho da tabela
  const header = document.createElement("div");
  header.className = "tabela-header";
  header.innerHTML = `<h2>${categoria.toUpperCase()}</h2>`;
  div.appendChild(header);

  // Tabela
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>DESCRIÇÃO</th>
      <th>QTD</th>
      <th>UNID</th>
    </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  let itensParaRenderizar = [];

  if (categoria === "sobras") {
    // SOBRAS: sempre carregar todos os itens do padrão
    itensParaRenderizar = itensPadrao[categoria];

    // Se tiver dados salvos, substitui as quantidades
    const salvos = dadosCategoria || [];
    itensParaRenderizar = itensParaRenderizar.map(item => {
      const salvo = salvos.find(s => s.descricao === item.descricao);
      return {
        descricao: item.descricao,
        qtd: salvo ? salvo.qtd : "", // pega quantidade salva ou vazio
        unidade: item.unidade
      };
    });
  } else {
    // Outras categorias: carrega dados salvos ou itens padrão
    itensParaRenderizar = dadosCategoria.length > 0 ? dadosCategoria : itensPadrao[categoria];
  }

  itensParaRenderizar.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.descricao || ""}</td>
      <td><input type="number" min="0" value="${item.qtd || ""}"></td>
      <td>${item.unidade || ""}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  div.appendChild(table);

  // Botão salvar
  const btnSalvar = document.createElement("button");
  btnSalvar.className = "btn-salvar";
  btnSalvar.textContent = "💾 Salvar";
  btnSalvar.addEventListener("click", () => {
    salvarTabela(categoria, table);
    container.innerHTML = ""; // remove tabela da tela
    document.getElementById("menu").style.display = "flex";
    document.getElementById("gerarPdfBtn").style.display = "flex";
    document.getElementById("reiniciarBtn").style.display = "flex";
  });

  div.appendChild(btnSalvar);
  container.appendChild(div);
}
