import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

/**
 * Robustly loads a logo image from multiple source options.
 * Falls back if the primary URL fails or is empty.
 */
const loadLogo = async (logoUrl) => {
  const sources = [
    logoUrl, // 1. Admin Panel URL
    "/logo.png", // 2. Public /logo.png
    "/images/logo.webp", // 3. Public /images/logo.webp
  ].filter(src => src && src.trim() !== "");

  for (const src of sources) {
    try {
      const img = new Image();
      img.src = src;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      if (img.naturalWidth > 0) return img;
    } catch (err) {
      console.warn(`Failed to load logo from ${src}, trying next...`);
    }
  }
  return null;
};

export const generateCalculatorsPDF = async (
  data,
  title,
  startDate,
  endDate,
  graphId,
  barGraphId,
  sitedata,
  logoUrl
) => {
  const doc = new jsPDF();
  const websiteName = sitedata?.websiteName || "";
  const email = sitedata?.email || "";
  const mobile = sitedata?.mobile || "";
  const inputs = Array.isArray(data?.inputs) ? data.inputs : [];

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (typeof value === "number" && Number.isFinite(value)) {
      return value.toLocaleString("en-IN");
    }
    return String(value);
  };

  // Robust logo loading
  const logo = await loadLogo(logoUrl);
  if (logo) {
    try {
      doc.addImage(logo, "PNG", 14, 5, 35, 15);
    } catch (error) {
      console.error("Error adding logo image:", error);
    }
  }

  doc.setLineWidth(0.3);
  doc.line(14, 24, 200, 24);
  doc.line(60, 0, 60, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, 14, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${websiteName}`, 70, 11);
  doc.text(`${email} / ${mobile}`, 70, 16);
  doc.setLineWidth(0.4);
  doc.line(14, 38, 200, 38);

  let yPosition = 47;

  if (inputs.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Input Parameters", 14, yPosition);
    yPosition += 5;

    autoTable(doc, {
      head: [["Parameter", "Value"]],
      body: inputs.map((input) => [input.label, formatValue(input.value)]),
      startY: yPosition,
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: 0, halign: "left" },
      bodyStyles: { fillColor: [255, 255, 255], textColor: 0, halign: "left" },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Investment Summary", 14, yPosition);
  yPosition += 5;

  const boxWidth = 30; // Compact width
  const boxHeight = 13; // Compact height
  const gap = 2; // Compact gap
  const startX = 14;

  const valueList = Array.isArray(data?.values)
    ? data.values
    : [
      data?.totalInvestment,
      data?.futureValue,
      data?.sipInvestment,
      data?.lumpsumInvestment,
    ];

  const fields = (data?.labels || []).map((label, index) => ({
    label,
    value: valueList[index],
  }));

  // Draw fields in a single row if possible
  fields.forEach((field, index) => {
    const x = startX + (boxWidth + gap) * index;
    // Check if we need to wrap to next row (though compact version usually fits 6)
    const currentX = x;
    const currentY = yPosition;

    doc.setDrawColor(200);
    doc.rect(currentX, currentY, boxWidth, boxHeight);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(field.label, currentX + 2, currentY + 4, { maxWidth: boxWidth - 4 });
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(formatValue(field.value), currentX + 2, currentY + 10);
  });

  yPosition += boxHeight + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Graphical Analysis", 14, yPosition);
  yPosition += 5;

  const captureGraph = async (elementId, x, y) => {
    const graphElement = document.getElementById(elementId);
    if (!graphElement) return 0;

    try {
      const canvas = await html2canvas(graphElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      if (!imgData || !imgData.startsWith("data:image")) {
        return 0;
      }
      const imgWidth = 87;
      const imgHeight = 53;
      try {
        doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      } catch (error) {
        console.error("Error adding chart image:", error);
        return 0;
      }
      return imgHeight;
    } catch (err) {
      console.error("Error capturing chart:", err);
      return 0;
    }
  };

  const leftGraphHeight = await captureGraph(graphId, 14, yPosition + 5);
  const rightGraphHeight = await captureGraph(barGraphId, 110, yPosition + 5);
  yPosition += Math.max(leftGraphHeight, rightGraphHeight) + 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Calculation Details", 14, yPosition);
  yPosition += 5;

  const columns = ["Parameter", "Value"];
  const rows = [
    ["Expected Inflation Rate (%)", "5"],
    ...fields.map((f) => [f.label, formatValue(f.value)]),
  ];

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: yPosition,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "left" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: 0, halign: "left" },
  });

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Note: This is an indicative calculation. Actual results may vary depending on market performance.",
    14,
    doc.internal.pageSize.height - 10,
  );

  const fileName = (title || "Calculators_Report").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`${fileName}.pdf`);
};

export const generatePDF = async (
  data,
  title,
  inputs,
  startDate,
  endDate,
  graphId,
  sitedata,
  logoUrl
) => {
  const doc = new jsPDF();
  const websiteName = sitedata?.websiteName;
  const email = sitedata?.email;
  const mobile = sitedata?.mobile;

  // Robust logo loading
  const logo = await loadLogo(logoUrl);
  if (logo) {
    try {
      doc.addImage(logo, "PNG", 14, 5, 35, 15);
    } catch (error) {
      console.error("Error adding logo image:", error);
    }
  }

  // Header Elements
  doc.setLineWidth(0.3);
  doc.line(14, 24, 200, 24);
  doc.line(60, 0, 60, 24);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 31);
  doc.setFont("helvetica", "normal");
  doc.text(websiteName || "", 70, 11);
  doc.setFontSize(11);
  doc.text(`${email || ""} / ${mobile || ""}`, 70, 16);
  doc.text(`From: ${startDate} To: ${endDate}`, 14, 37);

  let yPosition = 45;

  if (inputs && inputs.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Input Parameters", 14, yPosition);
    yPosition += 5;

    autoTable(doc, {
      head: [["Parameter", "Value"]],
      body: inputs.map(input => [input.label, input.value]),
      startY: yPosition,
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: 0, halign: "left" },
      bodyStyles: { fillColor: [255, 255, 255], textColor: 0, halign: "left" },
      styles: { fontSize: 9, cellPadding: 2 },
    });
    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Summary Boxes
  const sourceData = data.valuation || {};
  if (Object.keys(sourceData).length > 0) {
    const boxWidth = 25;
    const boxHeight = 13;
    const marginX = 2;
    const startX = 14;

    const summaryFields = [
      { label: "Amount Invested", value: sourceData.investedAmount },
      { label: "Current Value", value: sourceData.currentAssetValue },
      { label: "Profit/Loss", value: sourceData.pl },
      { label: "MONTHLY SIP", value: sourceData.sipAmout },
      { label: "Current NAV", value: sourceData.currentNav },
      { label: "Absolute Return", value: sourceData.absoluteReturns },
      { label: "XIRR (%)", value: sourceData.xirrRate },
    ];

    summaryFields.forEach((field, index) => {
      const x = startX + (boxWidth + marginX) * index;
      doc.setDrawColor(200);
      doc.rect(x, yPosition, boxWidth, boxHeight);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(field.label, x + 2, yPosition + 4, { maxWidth: boxWidth - 4 });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(field.value?.toString() || "N/A", x + 2, yPosition + 11);
    });

    yPosition += boxHeight + 10;
  }

  const graphElement = document.getElementById(graphId);
  let tableStartY = yPosition + 10;
  if (graphElement) {
    try {
      const canvas = await html2canvas(graphElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const graphImgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const maxImgHeight = 200;
      let finalHeight = imgHeight;
      if (finalHeight > maxImgHeight) finalHeight = maxImgHeight;

      if (yPosition + finalHeight > 280) {
        doc.addPage();
        yPosition = 20;
      }

      doc.addImage(graphImgData, "PNG", 14, yPosition, imgWidth, finalHeight);
      tableStartY = yPosition + finalHeight + 10;
      yPosition = tableStartY;
    } catch (error) {
      console.error("Error capturing graph:", error);
    }
  }

  // Table
  const columns = [
    "Date", "Nav", "Amt", "Unit", "Cumulative Unit", "Cumulative Amt", "Valuation",
  ];

  const rows = data?.sipData?.map(item => [
    item.navDate || "",
    item.nav || "",
    item.cashFlow || "",
    item.units || "",
    item.cumulitiveUnits || "",
    item.amount || "",
    item.currentValue || "",
  ]) || [];

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: tableStartY,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add footer
  doc.setFontSize(10);
  doc.text(
    "Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully.",
    14,
    doc.internal.pageSize.height - 10,
  );

  const fileName = (title || "Performance_Report").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`${fileName}.pdf`);
};

export const generateSwpPDF = async (
  data,
  title,
  inputs,
  startDate,
  endDate,
  graphId,
  sitedata,
  logoUrl
) => {
  const doc = new jsPDF();
  const websiteName = sitedata?.websiteName || "";
  const email = sitedata?.email || "";
  const mobile = sitedata?.mobile || "";

  // Robust logo loading
  const logo = await loadLogo(logoUrl);
  if (logo) {
    try {
      doc.addImage(logo, "PNG", 14, 5, 35, 15);
    } catch (error) {
      console.error("Error adding logo image:", error);
    }
  }

  // Header Elements
  doc.setLineWidth(0.3);
  doc.line(14, 24, 200, 24);
  doc.line(60, 0, 60, 24);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 31);
  doc.setFont("helvetica", "normal");
  doc.text(websiteName, 70, 11);
  doc.setFontSize(11);
  doc.text(`${email} / ${mobile}`, 70, 16);
  doc.text(`From: ${startDate} To: ${endDate}`, 14, 37);

  let yPosition = 45;

  if (inputs && inputs.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Input Parameters", 14, yPosition);
    yPosition += 5;

    autoTable(doc, {
      head: [["Parameter", "Value"]],
      body: inputs.map(input => [input.label, input.value]),
      startY: yPosition,
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: 0, halign: "left" },
      bodyStyles: { fillColor: [255, 255, 255], textColor: 0, halign: "left" },
      styles: { fontSize: 9, cellPadding: 2 },
    });
    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Summary Boxes
  const sourceData = data.valuation || {};
  if (Object.keys(sourceData).length > 0) {
    const boxWidth = 30;
    const boxHeight = 13;
    const marginX = 2;
    const startX = 14;

    const summaryFields = [
      { label: "Amount Invested", value: sourceData.initialAmount },
      { label: "Monthly Withdrawl", value: sourceData.totalWithdrawlAmount },
      { label: "Total Withdrawl (A)", value: sourceData.totalWithdrawlAmount },
      { label: "Remaining Fund (B)", value: sourceData.fundRemaining },
      { label: "Total Portfolio (A+B)", value: sourceData.portFolioValue },
      { label: "XIRR (%)", value: sourceData.xirrRate },
    ];

    summaryFields.forEach((field, index) => {
      const x = startX + (boxWidth + marginX) * index;
      doc.setDrawColor(200);
      doc.rect(x, yPosition, boxWidth, boxHeight);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(field.label, x + 2, yPosition + 4, { maxWidth: boxWidth - 4 });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(field.value?.toString() || "N/A", x + 2, yPosition + 11);
    });

    yPosition += boxHeight + 10;
  }

  const graphElement = document.getElementById(graphId);
  let tableStartY = yPosition + 10;
  if (graphElement) {
    try {
      const canvas = await html2canvas(graphElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const graphImgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const maxImgHeight = 200;
      let finalHeight = imgHeight;
      if (finalHeight > maxImgHeight) finalHeight = maxImgHeight;

      if (yPosition + finalHeight > 280) {
        doc.addPage();
        yPosition = 20;
      }

      doc.addImage(graphImgData, "PNG", 14, yPosition, imgWidth, finalHeight);
      tableStartY = yPosition + finalHeight + 10;
      yPosition = tableStartY;
    } catch (error) {
      console.error("Error capturing graph:", error);
    }
  }

  const columns = [
    "Date", "Nav", "Cash Flow", "Unit", "Cumulative Unit", "Current Value", "Net Amount",
  ];
  const rows = data?.resData?.map(item => [
    item.navDate || "",
    item.nav || "",
    item.cashFlow || "",
    item.units || "",
    item.cumulativeUnits || "",
    item.currentValue || "",
    item.netAmount || "",
  ]) || [];

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: tableStartY,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add footer
  doc.setFontSize(10);
  doc.text(
    "Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully.",
    14,
    doc.internal.pageSize.height - 10,
  );

  // Save the PDF
  const fileName = (title || "SWP_Report").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`${fileName}.pdf`);
};

export const generateSchemePDF = async (
  data,
  title,
  inputs,
  startDate,
  endDate,
  graphId,
  sitedata = {},
  logoUrl
) => {
  try {
    // Validate input data
    if (!data || !title || !startDate || !endDate || !graphId) {
      console.error("Missing required parameters for PDF generation");
      return;
    }

    const websiteName = sitedata?.websiteName || "";
    const email = sitedata?.email || "";
    const mobile = sitedata?.mobile || "";

    const doc = new jsPDF();

    // Robust logo loading
    const logo = await loadLogo(logoUrl);
    if (logo) {
      try {
        doc.addImage(logo, "PNG", 14, 5, 35, 15);
      } catch (error) {
        console.error("Error adding logo image:", error);
      }
    }

    // Header Elements
    doc.setLineWidth(0.3);
    doc.line(14, 24, 200, 24);
    doc.line(60, 0, 60, 24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 31);
    doc.setFont("helvetica", "normal");
    doc.text(websiteName, 70, 11);
    doc.setFontSize(11);
    doc.text(`${email} / ${mobile}`, 70, 16);
    doc.text(`From: ${startDate} To: ${endDate}`, 14, 37);

    let yPosition = 45;

    if (inputs && inputs.length > 0) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Input Parameters", 14, yPosition);
      yPosition += 5;

      autoTable(doc, {
        head: [["Parameter", "Value"]],
        body: inputs.map(input => [input.label, input.value]),
        startY: yPosition,
        theme: "grid",
        headStyles: { fillColor: [240, 240, 240], textColor: 0, halign: "left" },
        bodyStyles: { fillColor: [255, 255, 255], textColor: 0, halign: "left" },
        styles: { fontSize: 9, cellPadding: 2 },
      });
      yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Summary Boxes
    const sourceData = data.valuation || {};
    if (Object.keys(sourceData).length > 0) {
      const boxWidth = 25;
      const boxHeight = 13;
      const marginX = 2;
      const startX = 14;

      const summaryFields = [
        { label: "Amount Invested", value: sourceData.investedAmount },
        { label: "Buy Units", value: sourceData.buyUnit || sourceData.units },
        { label: "Current NAV", value: sourceData.currentNav },
        { label: "Maturity Value", value: sourceData.maturityValue },
        { label: "Absolute Return", value: sourceData.absoluteReturns },
        { label: "XIRR (%)", value: sourceData.xirrRate },
      ];

      summaryFields.forEach((field, index) => {
        const x = startX + (boxWidth + marginX) * index;
        doc.setDrawColor(200);
        doc.rect(x, yPosition, boxWidth, boxHeight);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(field.label, x + 2, yPosition + 4, { maxWidth: boxWidth - 4 });
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(field.value?.toString() || "N/A", x + 2, yPosition + 11);
      });

      yPosition += boxHeight + 10;
    }

    const graphElement = document.getElementById(graphId);
    let tableStartY = yPosition + 10;
    if (graphElement) {
      try {
        const canvas = await html2canvas(graphElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const graphImgData = canvas.toDataURL("image/png");
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const maxImgHeight = 200;
        let finalHeight = imgHeight;
        if (finalHeight > maxImgHeight) finalHeight = maxImgHeight;

        // If the graph would go off the page, add a new page
        if (yPosition + finalHeight > 280) {
          doc.addPage();
          yPosition = 20;
        }

        doc.addImage(graphImgData, "PNG", 14, yPosition, imgWidth, finalHeight);
        tableStartY = yPosition + finalHeight + 10;
        yPosition = tableStartY;
      } catch (error) {
        console.error("Error capturing graph:", error);
      }
    }

    // Table
    const columns = [
      "Invested Type", "Invested Amount", "Buy Rate", "Buy Units", "Maturity Date", "Maturity Rate", "Maturity Value", "Absolute Return", "XIRR (%)",
    ];
    const rows = Array.isArray(data)
      ? data.map(item => [
        item.title || "-",
        item.investedAmount?.toString() || "-",
        item.buyRate?.toString() || "-",
        item.buyUnit?.toString() || "-",
        item.maturityDate?.toString() || "-",
        item.RateAtMaturity?.toString() || "-",
        item.maturityValue?.toString() || "-",
        item.absoluteReturns?.toString() || "-",
        item.xirrRate?.toString() || "-",
      ])
      : [];

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: tableStartY,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    // Add footer
    doc.setFontSize(10);
    doc.text(
      "Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.",
      14,
      doc.internal.pageSize.height - 10,
    );

    // Save the PDF
    const fileName = (title || "Scheme_Report").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error generating Scheme PDF:", error);
  }
};

export const generateStpPDF = async (
  data,
  title,
  inputs,
  destinationTitle,
  startDate,
  endDate,
  graphId,
  sitedata,
  logoUrl
) => {
  if (!data) {
    console.error("Error: Data parameter is undefined.");
    return;
  }

  const doc = new jsPDF();
  const websiteName = sitedata?.websiteName || "Unknown Website";
  const email = sitedata?.email || "N/A";
  const mobile = sitedata?.mobile || "N/A";

  // Robust logo loading
  const logo = await loadLogo(logoUrl);
  if (logo) {
    try {
      doc.addImage(logo, "PNG", 14, 5, 35, 15);
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }

  // Add title and metadata
  doc.setLineWidth(0.3);
  doc.line(14, 24, 200, 24);
  doc.line(60, 0, 60, 24);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(title || "STP Report", 14, 31);
  doc.setFont("helvetica", "normal");
  doc.text(websiteName, 70, 11);
  doc.setFontSize(11);
  doc.text(`${email} / ${mobile}`, 70, 16);
  doc.text(`From: ${startDate || "N/A"} To: ${endDate || "N/A"}`, 14, 37);

  let yPosition = 45;

  if (inputs && inputs.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Input Parameters", 14, yPosition);
    yPosition += 5;

    autoTable(doc, {
      head: [["Parameter", "Value"]],
      body: inputs.map(input => [input.label, input.value]),
      startY: yPosition,
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: 0, halign: "left" },
      bodyStyles: { fillColor: [255, 255, 255], textColor: 0, halign: "left" },
      styles: { fontSize: 9, cellPadding: 2 },
    });
    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Source Fund Summary
  const sourceData = data.withdrawlingScheme || {};
  if (Object.keys(sourceData).length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Source Fund", 14, yPosition);
    doc.setFontSize(8);
    yPosition += 5;
    doc.text(title, 14, yPosition);
    yPosition += 5;

    const boxWidth = 30;
    const boxHeight = 13;
    const marginX = 2;
    const startX = 14;

    const sourceFields = [
      { label: "Amount Invested", value: sourceData.initialAmount },
      { label: "Monthly Transfer", value: sourceData.totalWithdrawlAmount },
      { label: "Total Transfer", value: sourceData.totalWithdrawlAmount },
      { label: "Source Fund Balance", value: sourceData.fundRemaining },
      { label: "Total Transferred + Bal", value: sourceData.portFolioValue },
      { label: "XIRR (%)", value: sourceData.xirrRate },
    ];

    sourceFields.forEach((field, index) => {
      const x = startX + (boxWidth + marginX) * index;
      doc.setDrawColor(200);
      doc.rect(x, yPosition, boxWidth, boxHeight);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(field.label, x + 2, yPosition + 4, { maxWidth: boxWidth - 4 });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(field.value?.toString() || "N/A", x + 2, yPosition + 11);
    });

    yPosition += boxHeight + 10;
  }

  // Destination Fund Summary
  const destinationData = data.investedScheme.DestinationFundValuation || {};
  if (Object.keys(destinationData).length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Destination Fund", 14, yPosition);
    doc.setFontSize(8);
    yPosition += 5;
    doc.text(destinationTitle, 14, yPosition);
    yPosition += 5;

    const boxWidth = 30;
    const boxHeight = 13;
    const marginX = 2;
    const startX = 14;

    const destFields = [
      { label: "Installment Amount", value: destinationData.installmentAmount },
      { label: "Amount Trans Month", value: destinationData.amountTransferFormonth },
      { label: "Amount Invested", value: destinationData.amountInvested },
      { label: "Valuation Maturity", value: destinationData.valuationAsOnMaturity },
      { label: "Absolute Return (%)", value: destinationData.absoluteReturns },
      { label: "XIRR (%)", value: destinationData.xirrRate },
    ];

    destFields.forEach((field, index) => {
      const x = startX + (boxWidth + marginX) * index;
      doc.setDrawColor(200);
      doc.rect(x, yPosition, boxWidth, boxHeight);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(field.label, x + 2, yPosition + 4, { maxWidth: boxWidth - 4 });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(field.value?.toString() || "N/A", x + 2, yPosition + 11);
    });

    yPosition += boxHeight + 10;
  }

  const graphElement = document.getElementById(graphId);
  if (graphElement) {
    try {
      const canvas = await html2canvas(graphElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const graphImgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const maxImgHeight = 200;
      let finalHeight = imgHeight;
      if (finalHeight > maxImgHeight) finalHeight = maxImgHeight;

      if (yPosition + finalHeight > 280) {
        doc.addPage();
        yPosition = 20;
      }

      doc.addImage(graphImgData, "PNG", 14, yPosition, imgWidth, finalHeight);
      yPosition += finalHeight + 10;
    } catch (error) {
      console.error("Error capturing graph:", error);
    }
  }

  // Define columns for detailed tables
  const columns = [
    "Date",
    "Nav",
    "Cash Flow",
    "Unit",
    "Cumulative Unit",
    "Current Value",
    "Net Amount",
  ];

  // Table 1: SIP Investment Details
  const sipRows =
    data?.investedScheme?.sipData && Array.isArray(data.investedScheme.sipData)
      ? data.investedScheme.sipData.map((item) => [
        item.navDate || "N/A",
        item.nav?.toString() || "0",
        item.cashFlow?.toString() || "0",
        item.units?.toString() || "0",
        item.cumulitiveUnits?.toString() || "0",
        item.currentValue?.toString() || "0",
        item.netAmount?.toString() || "0",
      ])
      : [];

  if (sipRows.length > 0) {
    const pageHeight = doc.internal.pageSize.height;
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(10);
    doc.text("Source Fund", 14, yPosition);
    doc.text(title, 14, yPosition + 5);
    yPosition += 10;

    try {
      autoTable(doc, {
        head: [columns],
        body: sipRows,
        startY: yPosition,
        margin: { top: 10, left: 14, right: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 30 } },
      });
      yPosition = doc.lastAutoTable.finalY + 20;
    } catch (error) {
      console.error("Error rendering SIP table:", error);
    }
  } else {
    console.warn("No valid SIP data for table");
    doc.setFontSize(10);
    doc.text("No SIP Investment Data Available", 14, yPosition);
    yPosition += 20;
  }

  // Table 2: Withdrawal Details
  const withdrawalRows =
    data?.withdrawlingScheme?.resData &&
      Array.isArray(data.withdrawlingScheme.resData)
      ? data.withdrawlingScheme.resData.map((item) => [
        item.navDate || "N/A",
        item.nav?.toString() || "0",
        item.cashFlow?.toString() || "0",
        item.units?.toString() || "0",
        item.cumulativeUnits?.toString() || "0",
        item.currentValue?.toString() || "0",
        item.netAmount?.toString() || "0",
      ])
      : [];

  if (withdrawalRows.length > 0) {
    const pageHeight = doc.internal.pageSize.height;
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(10);
    doc.text("Destination Fund", 14, yPosition);
    doc.text(destinationTitle || "STP", 14, yPosition + 5);
    yPosition += 10;

    try {
      autoTable(doc, {
        head: [columns],
        body: withdrawalRows,
        startY: yPosition,
        margin: { top: 10, left: 14, right: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 30 } },
      });
    } catch (error) {
      console.error("Error rendering Withdrawal table:", error);
    }
  } else {
    console.warn("No valid withdrawal data for table");
    doc.setFontSize(10);
    doc.text("No Withdrawal Data Available", 14, yPosition);
    yPosition += 20;
  }

  // Add footer
  doc.setFontSize(10);
  const pageHeight = doc.internal.pageSize.height;
  if (yPosition > pageHeight - 20) {
    doc.addPage();
  }
  doc.text(
    "Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully.",
    14,
    pageHeight - 10,
  );

  // Save the PDF
  try {
    const fileName = (title || "STP_Report").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error saving PDF:", error);
  }
};

export const generateFundDetailsPDF = async (
  data,
  graphId,
  sitedata = {},
  logoUrl
) => {
  try {
    const doc = new jsPDF();
    const websiteName = sitedata?.websiteName || "";
    const email = sitedata?.email || "";
    const mobile = sitedata?.mobile || "";

    // Robust logo loading
    const logo = await loadLogo(logoUrl);
    if (logo) {
      try {
        doc.addImage(logo, "PNG", 14, 5, 35, 15);
      } catch (error) {
        console.error("Error adding logo image:", error);
      }
    }

    // Header Lines
    doc.setLineWidth(0.3);
    doc.line(14, 24, 200, 24);
    doc.line(60, 0, 60, 24);

    // Header Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Fund Performance Report", 14, 31);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(websiteName, 70, 11);
    doc.text(`${email} / ${mobile}`, 70, 16);

    doc.line(14, 38, 200, 38);

    let yPosition = 45;

    // Fund Name & Category
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(data?.funddes || "Fund Name", 14, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(data?.schemeCategory || "Category", 14, yPosition);
    yPosition += 8;

    // Key Metrics Box (Single Row)
    const boxWidth = 35;
    const boxHeight = 13;
    const gap = 2;
    const startX = 14;

    const metrics = [
      { label: "Current NAV", value: `Rs. ${data?.threeyear_navEndDate || data?.NAVAmount || "0.00"}` },
      { label: "1Y CAGR", value: `${data?.one_year || "0.00"}%` },
      { label: "3Y CAGR", value: `${data?.three_year || "0.00"}%` },
      { label: "5Y CAGR", value: `${data?.five_year || "0.00"}%` },
      { label: "Risk Grade", value: data?.risk_grade || "N/A" },
    ];

    metrics.forEach((metric, index) => {
      const x = startX + (boxWidth + gap) * index;
      doc.setDrawColor(200);
      doc.rect(x, yPosition, boxWidth, boxHeight);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(metric.label, x + 2, yPosition + 4);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(String(metric.value), x + 2, yPosition + 10);
    });

    yPosition += boxHeight + 10;

    // Chart
    const graphElement = document.getElementById(graphId);
    if (graphElement) {
      try {
        const canvas = await html2canvas(graphElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const maxImgHeight = 200;
        let finalHeight = imgHeight;
        if (finalHeight > maxImgHeight) finalHeight = maxImgHeight;

        if (yPosition + finalHeight > 280) {
          doc.addPage();
          yPosition = 20;
        }

        doc.addImage(imgData, "PNG", 14, yPosition, imgWidth, finalHeight);
        yPosition += finalHeight + 10;
      } catch (error) {
        console.error("Error capturing graph:", error);
      }
    }

    // Trailing Returns Table
    if (yPosition + 40 > 280) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Trailing Returns (%)", 14, yPosition);
    yPosition += 5;

    const returnsData = [
      ["1 Year", data?.one_year || "-"],
      ["3 Years", data?.three_year || "-"],
      ["5 Years", data?.five_year || "-"],
      ["Since Inception", data?.si || "-"]
    ];

    autoTable(doc, {
      head: [["Period", "Returns (%)"]],
      body: returnsData,
      startY: yPosition,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        "Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully.",
        14,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`${data?.funddes?.replace(/[^a-zA-Z0-9]/g, "_") || "Fund_Details"}.pdf`);

  } catch (error) {
    console.error("Error generating Fund Details PDF:", error);
  }
};
