export let dadosSalvos = JSON.parse(localStorage.getItem("dadosSalvos")) || {};

export function salvarTabela(categoria, table) {
  const tbody = table.querySelector("tbody");
  const dados = [];

  tbody.querySelectorAll("tr").forEach(tr => {
    const descricao = tr.cells[0].textContent;
    const qtd = tr.cells[1].querySelector("input").value; // pega o valor mesmo que vazio
    const unidade = tr.cells[2].textContent;
    dados.push({ descricao, qtd, unidade });
  });

  // Salva qualquer categoria, inclusive "sobras"
  dadosSalvos[categoria] = dados;

  localStorage.setItem("dadosSalvos", JSON.stringify(dadosSalvos));

  alert(`Tabela ${categoria.toUpperCase()} salva com sucesso!`);
}
