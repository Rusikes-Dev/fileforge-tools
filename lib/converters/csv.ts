/** Standards-aware CSV parsing/serialization (RFC 4180 quoting rules). */

export function parseCsv(input: string, delimiter = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const text = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else if (ch === '"' && field === "") {
      inQuotes = true;
      i++;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
      i++;
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
    } else {
      field += ch;
      i++;
    }
  }
  if (inQuotes) throw new Error("Unclosed quote in CSV input.");
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

export interface CsvToJsonOptions {
  delimiter?: string;
  detectNumbers?: boolean;
}

export function csvToJson(input: string, opts: CsvToJsonOptions = {}): Array<Record<string, unknown>> {
  const rows = parseCsv(input, opts.delimiter ?? ",");
  if (rows.length === 0) throw new Error("The CSV input is empty.");
  const [header, ...data] = rows;
  if (header.some((h) => h.trim() === "")) {
    throw new Error("The header row contains an empty column name.");
  }
  return data.map((cells) => {
    const obj: Record<string, unknown> = {};
    header.forEach((key, idx) => {
      const raw = cells[idx] ?? "";
      if (opts.detectNumbers && raw !== "" && /^-?\d+(\.\d+)?$/.test(raw) && !/^0\d/.test(raw)) {
        obj[key] = Number(raw);
      } else {
        obj[key] = raw;
      }
    });
    return obj;
  });
}

function csvEscape(value: string, delimiter: string): string {
  if (value.includes('"') || value.includes(delimiter) || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function jsonToCsv(input: unknown, delimiter = ","): string {
  const arr: unknown[] = Array.isArray(input) ? input : [input];
  if (arr.length === 0) throw new Error("The JSON array is empty.");
  const objects = arr.map((item, idx) => {
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`Item ${idx + 1} is not an object. Expected an array of objects like [{"a":1}].`);
    }
    return item as Record<string, unknown>;
  });
  const columns: string[] = [];
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      if (!columns.includes(key)) columns.push(key);
    }
  }
  const lines = [columns.map((c) => csvEscape(c, delimiter)).join(delimiter)];
  for (const obj of objects) {
    lines.push(
      columns
        .map((c) => {
          const v = obj[c];
          if (v === undefined || v === null) return "";
          const s = typeof v === "object" ? JSON.stringify(v) : String(v);
          return csvEscape(s, delimiter);
        })
        .join(delimiter)
    );
  }
  return lines.join("\n");
}
