import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import type { ScanResult } from "../store/scanStore";

// --- Add near top (if not already)
type RoutineItem = { step: string; product: string; match: number; price: string };

export type FullReportOptions = {
  includeHistoryThumbs?: boolean;
  routineAM?: RoutineItem[];
  routinePM?: RoutineItem[];
  alerts?: { title: string; severity: "safe" | "caution" | "avoid"; note?: string }[];
};

function badgeHtml(sev: "safe" | "caution" | "avoid") {
  if (sev === "safe") return `background:#E8F7F2; color:#12735f;`;
  if (sev === "avoid") return `background:#FDECEC; color:#A52727;`;
  return `background:#FFF4E5; color:#8A5A00;`;
}

function makeFullReportHtml(params: {
  payload: ExportPayload;
  latestImgDataUrl?: string | null;
  historyThumbs?: Record<string, string>;
  routineAM?: RoutineItem[];
  routinePM?: RoutineItem[];
  alerts?: { title: string; severity: "safe" | "caution" | "avoid"; note?: string }[];
}) {
  const { payload, latestImgDataUrl, historyThumbs, routineAM, routinePM, alerts } = params;
  const latest = payload.latest;

  const historyRows = payload.history
    .map((x) => {
      const conf = `${Math.round(x.confidence_scores * 100)}%`;
      const face = x.face_detected ? "Yes": "No";
      const date = new Date(x.scannedAt).toLocaleString();
      const thumb = "https://placehold.co/240x300.png?text=Gentle+Cleanser";//x?.capturedUri;
      console.log(payload.history,"thumb--------------------------?")
      return `
        <tr>
          <td style="width:62px;">${thumb ? `<img class="thumb" src="${thumb}" />` : ""}</td>
          <td>${escapeHtml(x.skin_type)}</td>
          <td>${conf}</td>
          <td>${face}</td>
          <td>${escapeHtml(date)}</td>
        </tr>
      `;
    })
    .join("");

  const routineTable = (title: string, items?: RoutineItem[]) => {
    if (!items || items.length === 0) {
      return `
        <div class="card">
          <b>${escapeHtml(title)}</b>
          <div class="muted" style="margin-top:8px;">No routine data.</div>
        </div>
      `;
    }

    const rows = items
      .map((r, idx) => {
        return `
          <tr>
            <td style="width:32px;">${idx + 1}</td>
            <td>${escapeHtml(r.step)}</td>
            <td>${escapeHtml(r.product)}</td>
            <td>${Math.round(r.match * 100)}%</td>
            <td>${escapeHtml(r.price)}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <div class="card">
        <b>${escapeHtml(title)}</b>
        <table>
          <thead>
            <tr>
              <th style="width:32px;">#</th>
              <th>Step</th>
              <th>Product</th>
              <th>Match</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  };

  const alertsBlock = () => {
    if (!alerts || alerts.length === 0) {
      return `
        <div class="card">
          <b>Ingredient alerts</b>
          <div class="muted" style="margin-top:8px;">No alerts.</div>
        </div>
      `;
    }

    const rows = alerts
      .map((a) => {
        return `
          <div class="alertRow">
            <span class="pill" style="${badgeHtml(a.severity)}">${escapeHtml(a.severity.toUpperCase())}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${escapeHtml(a.title)}</div>
              ${a.note ? `<div class="muted">${escapeHtml(a.note)}</div>` : ""}
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="card">
        <b>Ingredient alerts</b>
        <div style="margin-top:10px; display:flex; flex-direction:column; gap:10px;">
          ${rows}
        </div>
      </div>
    `;
  };

  return `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body { font-family: -apple-system, Segoe UI, Roboto, Arial; padding: 16px; color:#111; }
        h1 { margin: 0 0 6px; font-size: 20px; }
        .sub { color: #444; margin-bottom: 14px; font-size: 12px; }
        .card { border: 1px solid #eee; border-radius: 12px; padding: 12px; margin: 12px 0; }
        .badge { display:inline-block; padding: 4px 10px; border-radius: 999px; background:#f3f3f3; font-size: 12px; }
        .row { display:flex; gap: 12px; align-items: center; }
        .imgWrap { width: 120px; height: 160px; border-radius: 12px; overflow:hidden; background:#f6f6f6; border:1px solid #eee; }
        .imgWrap img { width:100%; height:100%; object-fit: cover; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; font-size: 12px; vertical-align: middle; }
        th { background: #fafafa; }
        .thumb { width: 42px; height: 42px; border-radius: 10px; object-fit: cover; border: 1px solid #eee; background:#f6f6f6; }
        .muted { color:#666; font-size: 12px; }
        .pill { display:inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight:700; }
        .alertRow { display:flex; gap: 10px; align-items:flex-start; }
      </style>
    </head>
    <body>
      <h1>AI Skincare — Full Report</h1>
      <div class="sub">Exported: ${escapeHtml(new Date(payload.exportedAt).toLocaleString())} • Total scans: ${
        payload.count
      }</div>

      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div><b>Latest scan</b></div>
          ${
            latest
              ? `<span class="badge">${escapeHtml(latest.skin_type)} • ${Math.round(
                  latest.confidence_scores * 100
                )}%</span>`
              : `<span class="badge">None</span>`
          }
        </div>

        ${
          latest
            ? `
          <div class="muted" style="margin-top:8px;">Scanned: ${escapeHtml(
            new Date(latest.scannedAt).toLocaleString()
          )}</div>
          <div class="row" style="margin-top:10px;">
            ${
              latestImgDataUrl
                ? `<div class="imgWrap"><img src="${latestImgDataUrl}" /></div>`
                : `<div class="imgWrap"><img src="${'https://placehold.co/240x300.png?text=Gentle+Cleanser'}" /></div>`
            }
            <div style="flex:1;">
              <div class="muted">Confidence: ${Math.round(latest.confidence_scores * 100)}%</div>
              <div class="muted">Faces detected: ${
                 latest.face_detected ? "Yes": "No"
              }</div>
              <div class="muted">Note: Not a medical diagnosis.</div>
            </div>
          </div>
          `
            : `<div class="muted" style="margin-top:8px;">No saved latest scan.</div>`
        }
      </div>

      ${alertsBlock()}

      ${routineTable("AM routine", routineAM)}
      ${routineTable("PM routine", routinePM)}

      <div class="card">
        <b>Scan history</b>
        <table>
          <thead>
            <tr>
              <th style="width:62px;">Photo</th>
              <th>Skin type</th>
              <th>Confidence</th>
              <th>Faces</th>
              <th>Scanned at</th>
            </tr>
          </thead>
          <tbody>
            ${historyRows || `<tr><td colspan="5">No history</td></tr>`}
          </tbody>
        </table>
      </div>
    </body>
  </html>
  `;
}

export async function exportFullReportPDF(
  payload: ExportPayload,
  options?: FullReportOptions
) {
  console.log(payload,"payload---------------------")
  const latestImgDataUrl = await uriToBase64DataUrl(payload.latest?.capturedUri);

  let historyThumbs: Record<string, string> | undefined = undefined;
  if (options?.includeHistoryThumbs) {
    historyThumbs = {};
    for (const item of payload.history) {
      const dataUrl = await uriToBase64DataUrl(item.capturedUri);
      if (dataUrl) historyThumbs[item.id] = dataUrl;
    }
  }

  const html = makeFullReportHtml({
    payload,
    latestImgDataUrl,
    historyThumbs,
    routineAM: options?.routineAM,
    routinePM: options?.routinePM,
    alerts: options?.alerts,
  });

  const { uri } = await Print.printToFileAsync({ html });

  return shareFile(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Export Full Report (PDF)",
    UTI: "com.adobe.pdf",
  });
}



type ExportPayload = {
  exportedAt: string;
  count: number;
  latest: ScanResult | null;
  history: ScanResult[];
};

function safeFileName(name: string) {
  return name.replace(/[^a-z0-9\-_\.]/gi, "_");
}

async function shareFile(
  fileUri: string,
  opts?: { mimeType?: string; dialogTitle?: string; UTI?: string }
) {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) return { ok: false as const, fileUri };

  await Sharing.shareAsync(fileUri, {
    mimeType: opts?.mimeType,
    dialogTitle: opts?.dialogTitle,
    UTI: opts?.UTI,
  });

  return { ok: true as const, fileUri };
}





/* ---------------- PDF ---------------- */

function makePdfHtml(ctx: {
  payload: ExportPayload;
  latestImgDataUrl?: string | null;
  historyThumbs?: Record<string, string> | undefined;
}) {
  const payload = ctx.payload;
  const latest = payload.latest;

  const historyRows = payload.history
    .map((x) => {
      const conf = `${Math.round(x.confidence_scores * 100)}%`;
      const face =  x.face_detected ? "Yes": "No";
      return `
        <tr>
          <td>${x.skin_type}</td>
          <td>${conf}</td>
          <td>${face}</td>
          <td>${new Date(x.scannedAt).toLocaleString()}</td>
        </tr>
      `;
    })
    .join("");

  return `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body { font-family: -apple-system, Segoe UI, Roboto, Arial; padding: 16px; }
        h1 { margin: 0 0 6px; font-size: 20px; }
        .sub { color: #444; margin-bottom: 14px; }
        .card { border: 1px solid #eee; border-radius: 12px; padding: 12px; margin: 12px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; font-size: 12px; }
        th { background: #fafafa; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #f3f3f3; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>AI Skincare — Scan Report</h1>
      <div class="sub">Exported: ${new Date(payload.exportedAt).toLocaleString()} • Total scans: ${payload.count}</div>

      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div><b>Latest scan</b></div>
          ${latest ? `<span class="badge">${latest.skin_type} • ${Math.round(latest.confidence_scores * 100)}%</span>` : `<span class="badge">None</span>`}
        </div>
        ${
          latest
            ? `<div style="margin-top:8px;color:#555;">Scanned: ${new Date(latest.scannedAt).toLocaleString()}</div>`
            : `<div style="margin-top:8px;color:#555;">No saved latest scan.</div>`
        }
      </div>

      <div class="card">
        <b>History</b>
        <table>
          <thead>
            <tr>
              <th>Skin type</th>
              <th>Confidence</th>
              <th>Faces</th>
              <th>Scanned at</th>
            </tr>
          </thead>
          <tbody>
            ${historyRows || `<tr><td colspan="4">No history</td></tr>`}
          </tbody>
        </table>
      </div>
    </body>
  </html>
  `;
}



/* ---------------- Convenience wrapper ---------------- */


/* ---------------- PDF (with images) ---------------- */

function guessMimeFromUri(uri: string) {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

async function uriToBase64DataUrl(uri?: string | null) {
  if (!uri) return null;

  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const mime = guessMimeFromUri(uri);
    return `data:${mime};base64,${base64}`;
  } catch {
    return null;
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


export async function exportScanHistoryPDF(payload: ExportPayload, opts?: { includeHistoryThumbs?: boolean }) {
  // ✅ embed latest image
  const latestImgDataUrl = await uriToBase64DataUrl(payload.latest?.capturedUri);

  // Optional: embed thumbnails for history (can increase size)
  let historyThumbs: Record<string, string> | undefined = undefined;

  if (opts?.includeHistoryThumbs) {
    historyThumbs = {};
    // only up to 10 items anyway
    for (const item of payload.history) {
      const dataUrl = await uriToBase64DataUrl(item.capturedUri);
      if (dataUrl) historyThumbs[item.id] = dataUrl;
    }
  }

  const html = makePdfHtml({ payload, latestImgDataUrl, historyThumbs });
  const { uri } = await Print.printToFileAsync({ html });

  return shareFile(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Export Scan History (PDF)",
    UTI: "com.adobe.pdf",
  });
}

/* Convenience */
export async function buildExportPayload(latest: ScanResult | null, history: ScanResult[]) {
  return {
    exportedAt: new Date().toISOString(),
    count: history.length,
    latest,
    history,
  } satisfies ExportPayload;
}