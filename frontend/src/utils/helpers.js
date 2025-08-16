import React from 'react';

export const generateReport = (data, type) => {
  let reportContent = `Reporte de ${type}:\n\n`;
  if (data.length === 0) {
    reportContent += "No hay datos para este reporte.";
  } else {
    data.forEach(item => {
      reportContent += `- ${item.nombre || item.policiaFallecido || item.funcionarioNombre || item.funcionarioPolicial} (Exp: ${item.noExpediente || item.dni})\n`;
      if (item.causaMuerte) reportContent += `  Causa: ${item.causaMuerte}\n`;
      if (item.estadoExpediente) reportContent += `  Estado: ${item.estadoExpediente}\n`;
      if (item.sumaPagar) reportContent += `  Suma a Pagar: L. ${item.sumaPagar}\n`;
      if (item.hospitalTraslado) reportContent += `  Hospital: ${item.hospitalTraslado}\n`;
      if (item.totalGastos) reportContent += `  Gastos: L. ${item.totalGastos.toFixed(2)}\n`;
      if (item.causaIndemnizacion) reportContent += `  Causa Indemnización: ${item.causaIndemnizacion}\n`;
      if (item.miembroAmputado) reportContent += `  Miembro Amputado: ${item.miembroAmputado}\n`;
      reportContent += `\n`;
    });
  }
  return reportContent;
};

export const printContent = (contentId) => {
  const printContent = document.getElementById(contentId);
  if (printContent) {
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  } else {
    alert('No se encontró el contenido para imprimir.');
  }
};

// Función para simular descarga de Excel (no genera un archivo real)
export const downloadExcel = (data, filename = 'reporte') => {
  if (!data || data.length === 0) {
    alert("No hay datos para descargar.");
    return;
  }

  const headers = Object.keys(data[0]).filter(key => key !== 'id' && key !== 'visitas' && key !== 'gastos' && key !== 'fotografia' && key !== 'imagenesVisita'); // Excluir 'id', 'visitas', 'gastos', 'fotografia', 'imagenesVisita'
  
  const rows = data.map(item => headers.map(header => {
    let value = item[header];
    if (Array.isArray(value)) {
      value = value.map(v => JSON.stringify(v)).join('; '); // Convertir arrays a string
    }
    return `"${String(value).replace(/"/g, '""')}"`; // Escapar comillas dobles y encerrar en comillas
  }));

  let csvContent = "data:text/csv;charset=utf-8," 
    + headers.map(header => `"${header}"`).join(",") + "\n" 
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert("Simulación de descarga de Excel. En un entorno real, esto generaría un archivo CSV.");
};