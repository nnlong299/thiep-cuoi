// ====== CẤU HÌNH — chỉnh ở đây ======
window.WEDDING = {
  // Ngày giờ lễ (giờ Việt Nam)
  dateISO: "2026-12-20T10:00:00+07:00",
  title: "Đám cưới Ngọc Hân & Nhật Long",
  location: "Tại nhà",
  lat: 10.347403,
  lng: 106.525732,

  // Nhạc nền: ID video YouTube (từ https://youtu.be/AWKUF7xhuIw)
  youtubeId: "AWKUF7xhuIw",

  // Dán URL Web App của Google Apps Script vào đây (xem README.md)
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzFZOjFciVE_-3stGvr-QF3hwdtsTfPRSFTHOhb1FElq-ilRmQmq8UHnia4JAL5wAQmWw/exec",

  // Theme mặc định: "sage" | "forest" | "mint"
  defaultTheme: "sage",

  // Ảnh: chép ảnh đã chọn vào thư mục images/ rồi liệt kê tên file ở đây.
  // cover.jpg = ảnh bìa & hero, couple.jpg = ảnh chung của cô dâu chú rể.
  cover: "images/cover.jpg",
  gallery: [
    "images/01.jpg", "images/02.jpg", "images/03.jpg",
    "images/04.jpg", "images/05.jpg", "images/06.jpg"
  ]
};
