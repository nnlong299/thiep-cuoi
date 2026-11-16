/** @OnlyCurrentDoc */
// Dòng trên giới hạn quyền truy cập chỉ trong Google Sheet gắn với script này.
// Dán toàn bộ file này vào Google Apps Script (Extensions → Apps Script) của Google Sheet.
// Sheet sẽ tự có các cột: Thời gian | Họ tên | Tham dự | Số người | Ở lại đêm trước | Lời chúc

// Chặn "formula injection": chữ bắt đầu bằng = + - @ sẽ bị Sheet hiểu là công thức.
function safe(s, max) {
  s = String(s || "").slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function pick(value, allowed) {
  return allowed.indexOf(value) >= 0 ? value : "";
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Thời gian", "Họ tên", "Tham dự", "Số người", "Ở lại đêm trước", "Lời chúc"]);
  }
  var p = e.parameter;
  var guests = Math.min(Math.max(parseInt(p.guests, 10) || 0, 0), 10);
  sheet.appendRow([
    new Date(),
    safe(p.name, 80),
    pick(p.attending, ["Có", "Không"]),
    guests,
    pick(p.stay, ["Đi về trong ngày", "Tự lo chỗ ở", "Nhờ hỗ trợ chỗ ở"]),
    safe(p.message, 500)
  ]);
  return ContentService.createTextOutput("ok");
}
