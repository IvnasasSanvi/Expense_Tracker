import ExcelJS from "exceljs";

export const exportToExcel = async (
  data,
  fileName = "transactions"
) => {

  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }

  try {

    // Create workbook
    const workbook = new ExcelJS.Workbook();

    // Create worksheet
    const worksheet = workbook.addWorksheet("Transactions");

    // Create columns dynamically
    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key.toUpperCase(),
      key,
      width: 20,
    }));

    // Add rows
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // Generate excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob
    const blob = new Blob(
      [buffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    // Download file
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${fileName}.xlsx`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error("Export error:", error);

    alert("Error exporting data");

  }
};