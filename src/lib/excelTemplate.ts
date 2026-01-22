import * as XLSX from "xlsx";

export function downloadShipmentTemplate() {
  // Define headers matching the expected column mapping
  const headers = [
    "Invoice Number",
    "Phone Number",
    "Destination City",
    "ETA to Ghana",
    "ETA Delivery",
    "Delivery Address Confirmed",
    "Outstanding Balance",
    "WhatsApp Opt-In",
    "Status",
    "Status Date",
    "Notes"
  ];

  // Sample data rows to show expected format
  const sampleData = [
    [
      "INV-2024-001",
      "+1 234 567 8900",
      "Accra",
      "2024-02-15",
      "2024-02-20",
      "Yes",
      "No",
      "Yes",
      "Received",
      "2024-01-20",
      "Package received at warehouse"
    ],
    [
      "INV-2024-002",
      "233201234567",
      "Kumasi",
      "2024-02-18",
      "2024-02-25",
      "No",
      "Yes",
      "Yes",
      "Processing",
      "2024-01-21",
      "Awaiting customs documentation"
    ]
  ];

  // Create worksheet data
  const wsData = [headers, ...sampleData];
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths for better readability
  ws["!cols"] = [
    { wch: 18 }, // Invoice Number
    { wch: 18 }, // Phone Number
    { wch: 16 }, // Destination City
    { wch: 14 }, // ETA to Ghana
    { wch: 14 }, // ETA Delivery
    { wch: 24 }, // Delivery Address Confirmed
    { wch: 18 }, // Outstanding Balance
    { wch: 16 }, // WhatsApp Opt-In
    { wch: 18 }, // Status
    { wch: 14 }, // Status Date
    { wch: 30 }, // Notes
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Shipments");

  // Add instructions sheet
  const instructionsData = [
    ["Gold Coast Global Logistics - Shipment Import Template"],
    [""],
    ["INSTRUCTIONS:"],
    ["1. Fill in your shipment data starting from row 2 (below the headers)"],
    ["2. Delete the sample data rows before importing"],
    ["3. Required fields: Invoice Number, Phone Number"],
    ["4. All other fields are optional"],
    [""],
    ["COLUMN DESCRIPTIONS:"],
    ["Invoice Number", "Unique identifier for the shipment (required)"],
    ["Phone Number", "Customer phone number - any format accepted (required)"],
    ["Destination City", "City/zone in Ghana for delivery"],
    ["ETA to Ghana", "Expected arrival date in Ghana (YYYY-MM-DD)"],
    ["ETA Delivery", "Expected delivery date to customer (YYYY-MM-DD)"],
    ["Delivery Address Confirmed", "Yes/No - Has customer confirmed address?"],
    ["Outstanding Balance", "Yes/No - Is there an unpaid balance?"],
    ["WhatsApp Opt-In", "Yes/No - Can we send WhatsApp updates?"],
    ["Status", "Current shipment status (see valid options below)"],
    ["Status Date", "Date of the status event (YYYY-MM-DD)"],
    ["Notes", "Additional notes about the shipment/status"],
    [""],
    ["VALID STATUS VALUES:"],
    ["Received", "Processing", "Shipped from USA", "In Transit"],
    ["Arrived Ghana", "Clearing from port", "Delivery scheduling"],
    ["Delivered", "Hold", "Cancelled"],
    [""],
    ["TIPS:"],
    ["- Dates can be in various formats (Excel dates, YYYY-MM-DD, etc.)"],
    ["- Phone numbers are normalized automatically (special characters removed)"],
    ["- Yes/No fields accept: yes, no, true, false, 1, 0, y, n"],
    ["- Existing shipments are updated by Invoice Number match"],
  ];

  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
  wsInstructions["!cols"] = [{ wch: 30 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

  // Generate and download file
  XLSX.writeFile(wb, "shipment-import-template.xlsx");
}
