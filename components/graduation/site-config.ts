/** Chỉnh sửa nội dung sự kiện tại đây */

/**
 * Bật/tắt hiển thị lời chúc trên frontend (rơi full màn + danh sách tĩnh khi reduce motion).
 * Không xóa code — chỉ ẩn UI. `false`: không hiện lời chúc; form gửi vẫn lưu qua API.
 */
export const enableGuestbookFallAnimation = false;

export const siteMeta = {
  title: "Thư Mời Dự Lễ Tốt Nghiệp",
  description:
    "Thư mời trân trọng tham dự Lễ Tốt Nghiệp — khoảnh khắc đánh dấu chặng đường mới.",
  /** Favicon — file trong public/ */
  faviconPath: "/graduation/reflection-huflit.png",
  /** Ảnh preview khi gửi link (Zalo, Facebook, Messenger, …) — file trong public/ */
  ogImagePath: "/graduation/reflection-huflit.png",
};

/**
 * URL gốc khi deploy (https://ten-mien.com, không / cuối).
 * Thêm NEXT_PUBLIC_SITE_URL vào .env.local — preview link chỉ đúng ảnh khi domain khớp.
 */
export function getSiteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** ISO 8601 — giờ VN; dùng cho bản đồ / logic */
export const eventStartISO = "2026-04-06T15:30:00+07:00";
export const eventEndISO = "2026-04-06T18:30:00+07:00";

/** Dòng ngày giờ hiển thị trên thư mời (tuỳ chỉnh chữ, khác Intl nếu cần) */
export const eventDateLineVi = "Lúc 15h30 Thứ Hai, 6 tháng 4, 2026";

export const eventTitle = "Lễ Tốt Nghiệp Đại Học";

export const venue = {
  name: "Sảnh chính — Trường Đại học Ngoại ngữ - Tin học Thành phố Hồ Chí Minh (HUFLIT) Cơ sở Hóc Môn",
  address: "806 Lê Quang Đạo, Trung Mỹ Tây, Quận 12, Hồ Chí Minh, Việt Nam",
  /** Tọa độ ghim bản đồ — chỉnh lại trên Google Maps nếu cần chính xác từng mét */
  lat: 10.8642,
  lng: 106.5995,
  mapUrl: "https://maps.app.goo.gl/N5Rksr1HVuz26qMc6",
};

export const parkingSpots = [
  {
    id: "p1",
    title: "Bãi xe gần cổng",
    hint: "Theo biển chỉ dẫn vào sảnh / hội trường.",
    lat: 10.8648,
    lng: 106.6002,
  },
  {
    id: "p2",
    title: "Bãi xe phụ",
    hint: "Đi bộ ngắn theo lối vào khu trường.",
    lat: 10.8635,
    lng: 106.5988,
  },
];

export const about = {
  name: "PHẠM HOÀI NGHĨA",
  degree: "Cử nhân chuyên ngành Công nghệ Thông tin",
  bio: "Sau những năm tháng miệt mài trên giảng đường, vượt qua không ít thử thách và nỗ lực không ngừng, em/cháu đã chạm đến một cột mốc đáng nhớ trong hành trình của mình.\n\nEm/cháu rất mong được chia sẻ niềm vui này cùng những người thân yêu - những người đã luôn đồng hành, ủng hộ và tiếp thêm động lực trong suốt chặng đường vừa qua.",
  quote:
    "Hành trình ngàn dặm bắt đầu từ một bước chân — và hôm nay là bước chân tiếp theo.",
};

export const timelineItems = [
  {
    year: "2022",
    title: "Ngày đầu nhập học",
    text: "Bước vào giảng đường với bao háo hức và một chút hồi hộp.",
  },
  {
    year: "2023",
    title: "Kỳ học quân sự đáng nhớ ",
    text: "Lần đầu làm việc nhóm lớn — học được cách lắng nghe và dẫn dắt.",
  },
  {
    year: "2024",
    title: "Thực tập & trải nghiệm",
    text: "Áp dụng kiến thức vào thực tế, tìm ra hướng đi phù hợp.",
  },
  {
    year: "2025",
    title: "Bảo vệ khóa luận",
    text: "Khép lại một chương, mở ra cánh cửa mới đầy hy vọng.",
  },
];

/** Ảnh + đoạn tâm sự — ảnh đặt trong public/graduation/ */
export const reflection = {
  imageSrc: "/graduation/reflection-huflit.png",
  imageAlt: "Phạm Hoài Nghĩa — HUFLIT, lễ tốt nghiệp",
  title: "Tâm sự",
  lead: "Vài dòng gửi những người đã đồng hành cùng em trên giảng đường.",
  paragraphs: [
    "Nhìn lại những năm tháng vừa qua, em biết ơn vì được học hỏi, được thử và được sai, rồi đứng dậy tiếp tục. Mỗi buổi học khuya, mỗi lần làm nhóm căng thẳng đều trở thành phần của hành trình khiến hôm nay trọn vẹn hơn.",
    "Em hiểu lễ tốt nghiệp không chỉ là một buổi lễ, mà là khoảnh khắc để nói lời cảm ơn: với gia đình đã hy sinh thầm lặng, với thầy cô và bạn bè đã kéo em lên mỗi khi ngã. Hẹn một buổi gặp thật ấm, để cùng ôn kỷ niệm và mở ra chương mới.",
  ],
};
