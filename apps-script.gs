/** @OnlyCurrentDoc */
// Dòng trên giới hạn quyền truy cập chỉ trong Google Sheet gắn với script này.
// Dán toàn bộ file này vào Google Apps Script (Extensions → Apps Script) của Google Sheet.
// Sheet sẽ tự có các cột: Thời gian | Họ tên | Tham dự | Số người | Lời chúc
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Thời gian", "Họ tên", "Tham dự", "Số người", "Ở lại đêm trước", "Lời chúc"]);
  }
  var p = e.parameter;
  // Giới hạn độ dài để tránh spam
  sheet.appendRow([
    new Date(),
    String(p.name || "").slice(0, 80),
    String(p.attending || "").slice(0, 10),
    Number(p.guests) || 0,
    String(p.stay || "").slice(0, 40),
    String(p.message || "").slice(0, 500)
  ]);
  return ContentService.createTextOutput("ok");
}
