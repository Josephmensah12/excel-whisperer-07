import * as XLSX from "xlsx";

export interface ColumnMapping {
  invoice_number?: string;
  phone_number?: string;
  destination_zone_or_city?: string;
  eta_to_ghana?: string;
  eta_delivery?: string;
  delivery_address_flag?: string;
  outstanding_balance_flag?: string;
  whatsapp_opt_in?: string;
  timeline_status?: string;
  timeline_date?: string;
  timeline_notes?: string;
}

export interface ParsedShipment {
  invoice_number: string;
  phone_raw: string;
  phone_normalized: string;
  destination_zone_or_city?: string;
  eta_to_ghana?: string;
  eta_delivery?: string;
  delivery_address_flag: boolean;
  outstanding_balance_flag: boolean;
  whatsapp_opt_in: boolean;
  timeline_status?: string;
  timeline_date?: string;
  timeline_notes?: string;
}

export interface ParseResult {
  shipments: ParsedShipment[];
  headers: string[];
  errors: { row: number; message: string }[];
}

export function normalizePhone(phone: string): string {
  if (!phone) return "";
  return phone.toString().replace(/[^0-9]/g, "");
}

export function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    return lower === "yes" || lower === "true" || lower === "1" || lower === "y";
  }
  return Boolean(value);
}

export function parseDate(value: unknown): string | undefined {
  if (!value) return undefined;
  
  // Handle Excel date serial numbers
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      const year = date.y;
      const month = String(date.m).padStart(2, "0");
      const day = String(date.d).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  
  // Handle string dates
  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  }
  
  return undefined;
}

export async function parseExcelFile(
  file: File,
  mapping: ColumnMapping
): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
        
        if (jsonData.length < 2) {
          reject(new Error("Excel file must have at least a header row and one data row"));
          return;
        }
        
        const headers = (jsonData[0] as string[]).map(h => String(h || "").trim());
        const shipments: ParsedShipment[] = [];
        const errors: { row: number; message: string }[] = [];
        
        // Helper to get column index
        const getColIndex = (mappedName: string | undefined): number => {
          if (!mappedName) return -1;
          return headers.findIndex(h => h.toLowerCase() === mappedName.toLowerCase());
        };
        
        const invoiceColIdx = getColIndex(mapping.invoice_number);
        const phoneColIdx = getColIndex(mapping.phone_number);
        const destColIdx = getColIndex(mapping.destination_zone_or_city);
        const etaGhanaColIdx = getColIndex(mapping.eta_to_ghana);
        const etaDeliveryColIdx = getColIndex(mapping.eta_delivery);
        const deliveryAddrColIdx = getColIndex(mapping.delivery_address_flag);
        const balanceColIdx = getColIndex(mapping.outstanding_balance_flag);
        const whatsappColIdx = getColIndex(mapping.whatsapp_opt_in);
        const statusColIdx = getColIndex(mapping.timeline_status);
        const statusDateColIdx = getColIndex(mapping.timeline_date);
        const notesColIdx = getColIndex(mapping.timeline_notes);
        
        // Process data rows
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as unknown[];
          
          // Skip empty rows
          if (!row || row.every(cell => !cell)) continue;
          
          const invoiceNumber = invoiceColIdx >= 0 ? String(row[invoiceColIdx] || "").trim() : "";
          const phoneRaw = phoneColIdx >= 0 ? String(row[phoneColIdx] || "").trim() : "";
          
          if (!invoiceNumber) {
            errors.push({ row: i + 1, message: "Missing invoice number" });
            continue;
          }
          
          if (!phoneRaw) {
            errors.push({ row: i + 1, message: "Missing phone number" });
            continue;
          }
          
          const shipment: ParsedShipment = {
            invoice_number: invoiceNumber,
            phone_raw: phoneRaw,
            phone_normalized: normalizePhone(phoneRaw),
            destination_zone_or_city: destColIdx >= 0 ? String(row[destColIdx] || "").trim() || undefined : undefined,
            eta_to_ghana: etaGhanaColIdx >= 0 ? parseDate(row[etaGhanaColIdx]) : undefined,
            eta_delivery: etaDeliveryColIdx >= 0 ? parseDate(row[etaDeliveryColIdx]) : undefined,
            delivery_address_flag: deliveryAddrColIdx >= 0 ? parseBoolean(row[deliveryAddrColIdx]) : false,
            outstanding_balance_flag: balanceColIdx >= 0 ? parseBoolean(row[balanceColIdx]) : false,
            whatsapp_opt_in: whatsappColIdx >= 0 ? parseBoolean(row[whatsappColIdx]) : false,
            timeline_status: statusColIdx >= 0 ? String(row[statusColIdx] || "").trim() || undefined : undefined,
            timeline_date: statusDateColIdx >= 0 ? parseDate(row[statusDateColIdx]) : undefined,
            timeline_notes: notesColIdx >= 0 ? String(row[notesColIdx] || "").trim() || undefined : undefined,
          };
          
          shipments.push(shipment);
        }
        
        resolve({ shipments, headers, errors });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

export function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  
  const patterns: Record<keyof ColumnMapping, RegExp[]> = {
    invoice_number: [/invoice/i, /inv.*num/i, /invoice.*#/i],
    phone_number: [/phone/i, /mobile/i, /cell/i, /contact/i],
    destination_zone_or_city: [/destination/i, /city/i, /zone/i, /area/i],
    eta_to_ghana: [/eta.*ghana/i, /arrival.*ghana/i, /ghana.*eta/i],
    eta_delivery: [/eta.*delivery/i, /delivery.*date/i, /deliver.*eta/i],
    delivery_address_flag: [/delivery.*address/i, /address.*flag/i, /has.*address/i],
    outstanding_balance_flag: [/balance/i, /outstanding/i, /owe/i],
    whatsapp_opt_in: [/whatsapp/i, /opt.*in/i, /notification/i],
    timeline_status: [/status/i, /state/i, /stage/i],
    timeline_date: [/status.*date/i, /event.*date/i, /date/i],
    timeline_notes: [/notes/i, /comment/i, /remark/i],
  };
  
  for (const [key, regexes] of Object.entries(patterns)) {
    for (const header of headers) {
      if (regexes.some(regex => regex.test(header))) {
        mapping[key as keyof ColumnMapping] = header;
        break;
      }
    }
  }
  
  return mapping;
}