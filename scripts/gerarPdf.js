import { dadosSalvos } from "./salvarTabela.js";
import { itensPadrao } from "./itensPadrao.js"; // Lista padrão para sobras

export function gerarPdf(lojaSelecionada) {
  if (!lojaSelecionada) {
    alert("Selecione uma loja antes de gerar o PDF!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPosition = 20;
  let paginaAtual = 1;

  // Cabeçalho
  doc.setFont("Consolas", "bold");
  doc.setFontSize(18);
  doc.text("Solicitação de Insumos", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Loja e data/hora
  const dataHora = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  doc.setFontSize(12);
  doc.setFont("Consolas", "normal");
  doc.text(`Loja: ${lojaSelecionada}`, margin, yPosition);
  doc.text(`Data/Hora: ${dataHora}`, pageWidth - margin, yPosition, { align: "right" });
  yPosition += 10;

  // MERCEARIA até DIVERSOS (ignora QTD vazia)
  const categoriasPrincipais = ["mercearia", "frios", "bebidas", "hortifruti", "embalagem", "diversos"];
  let tabelaUnificada = [];

  categoriasPrincipais.forEach(categoria => {
    const items = dadosSalvos[categoria] || [];
    items.forEach(item => {
      if (item.descricao && item.qtd) {
        tabelaUnificada.push([
          item.descricao,
          item.qtd,
          "",       // QTD manual
          item.unidade,
          ""        // CHECK
        ]);
      }
    });
  });

  if (tabelaUnificada.length > 0) {
    doc.autoTable({
      startY: yPosition,
      head: [["DESCRIÇÃO", "QTD", "QTD.", "UNID", "CHECK"]],
      body: tabelaUnificada,
      styles: { font: "Consolas", fontSize: 10 },
      headStyles: { fillColor: [200, 200, 200], textColor: 0, halign: "center" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 }
      },
      theme: "grid",
      margin: { left: margin, right: margin },
      didDrawPage: function () {
        doc.setFontSize(10);
        doc.text(`Página ${paginaAtual}`, pageWidth / 2, pageHeight - 10, { align: "center" });
        paginaAtual++;
      }
    });
    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // SOBRAS: sempre carregar todos os itens, quantidade vazia se não houver salvo
  const sobrasSalvas = dadosSalvos["sobras"] || [];
  const itensSobras = itensPadrao["sobras"].map(item => {
    const salvo = sobrasSalvas.find(s => s.descricao === item.descricao);
    return {
      descricao: item.descricao,
      qtd: salvo ? salvo.qtd : "",
      unidade: item.unidade
    };
  });

  if (itensSobras.length > 0) {
    doc.setFont("Consolas", "bold");
    doc.setFontSize(14);
    doc.text("SOBRAS DE PORCIONADOS", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 6;

    const tabelaSobras = itensSobras.map(item => [
      item.descricao,
      item.qtd,
      "",
      item.unidade,
      ""
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [["DESCRIÇÃO", "QTD", "QTD.", "UNID", "CHECK"]],
      body: tabelaSobras,
      styles: { font: "Consolas", fontSize: 10 },
      headStyles: { fillColor: [200, 200, 200], textColor: 0, halign: "center" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 }
      },
      theme: "grid",
      margin: { left: margin, right: margin }
    });
  }

  doc.save(`Solicitacao_Insumos_${lojaSelecionada}_${new Date().getTime()}.pdf`);
}
