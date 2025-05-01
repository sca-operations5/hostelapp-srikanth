
    import * as XLSX from 'xlsx';

    export const exportToExcel = (data, fileName) => {
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No data provided for export or data is not an array.");
        // Optionally show a toast message to the user
        return;
      }

      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };
  