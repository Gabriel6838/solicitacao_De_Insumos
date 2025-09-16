import { renderTabela } from "./renderTabela.js";
import { gerarPdf } from "./gerarPdf.js";
import { dadosSalvos } from "./salvarTabela.js";

const menu = document.getElementById("menu");
const tabelasArea = document.getElementById("tabelas");
const fornoSelect = document.getElementById("fornoSelect");
const btnGerarPdf = document.getElementById("gerarPdfBtn");
const btnReiniciar = document.getElementById("reiniciarBtn");

// Inicialmente escondemos menu e botões
menu.style.display = "none";
btnGerarPdf.style.display = "none";
btnReiniciar.style.display = "none";

let lojaSelecionada = "";

// Seleção da loja
fornoSelect.addEventListener("change", () => {
  if (!fornoSelect.value) return;
  lojaSelecionada = fornoSelect.value;
  fornoSelect.disabled = true; // Bloqueia seleção

  // Mostra menu e botões
  menu.style.display = "flex";
  btnGerarPdf.style.display = "flex";
  btnReiniciar.style.display = "flex";
});

// Menu de categorias
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const categoria = e.target.getAttribute("data-categoria");

    // Oculta menu e botões enquanto tabela aberta
    menu.style.display = "none";
    btnGerarPdf.style.display = "none";
    btnReiniciar.style.display = "none";

    // Renderiza tabela
    renderTabela(categoria, dadosSalvos[categoria] || [], lojaSelecionada, tabelasArea, menu, btnGerarPdf, btnReiniciar);
  }
});

// Botão Gerar PDF
btnGerarPdf.addEventListener("click", () => {
  if (!lojaSelecionada) {
    alert("Selecione uma loja antes de gerar o PDF!");
    return;
  }
  gerarPdf(lojaSelecionada);
});

// Botão Reiniciar
btnReiniciar.addEventListener("click", () => {
  if (confirm("Deseja realmente reiniciar todas as informações?")) {
    localStorage.clear();
    location.reload();
  }
});
