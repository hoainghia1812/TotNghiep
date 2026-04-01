/** Chỉnh sửa nội dung sự kiện tại đây */

export const siteMeta = {
  title: "Lễ Tốt Nghiệp — Thư Mời",
  description:
    "Thư mời trân trọng tham dự Lễ Tốt Nghiệp — khoảnh khắc đánh dấu chặng đường mới.",
};

/** ISO 8601 — giờ VN; dùng cho bản đồ / logic (6/6/2026 là Thứ Bảy theo lịch) */
export const eventStartISO = "2026-06-06T15:30:00+07:00";
export const eventEndISO = "2026-06-06T18:30:00+07:00";

/** Dòng ngày giờ hiển thị trên thư mời (tuỳ chỉnh chữ, khác Intl nếu cần) */
export const eventDateLineVi = "Lúc 15h30 Thứ 2, 6 tháng 6, 2026";

export const eventTitle = "Lễ Tốt Nghiệp Đại Học";

export const venue = {
  name: "Sảnh chính — Trường Đại học Ngoại ngữ - Tin học Thành phố Hồ Chí Minh (HUFLIT) Cơ sở Hóc Môn",
  address: "806 Lê Quang Đạo, Trung Mỹ Tây, Quận 12, Hồ Chí Minh, Việt Nam",
  /** Tọa độ ghim bản đồ — chỉnh lại trên Google Maps nếu cần chính xác từng mét */
  lat: 10.8642,
  lng: 106.5995,
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
  name: "Phạm Hoài Nghĩa",
  degree: "Cử nhân chuyên ngành công nghệ thông tin",
  bio: "Sau những năm tháng miệt mài giảng đường và thử thách, em/cháu rất mong được chia sẻ niềm vui này cùng những người thân yêu đã đồng hành.",
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

/** Ảnh + đoạn tâm sự (chỉnh trong file này; ảnh có thể đổi sang /public/...) */
export const reflection = {
  imageSrc: "https://picsum.photos/seed/tamsu/900/1100",
  imageAlt: "Phạm Hoài Nghĩa",
  title: "Tâm sự",
  lead: "Vài dòng gửi những người đã đồng hành cùng em trên giảng đường.",
  paragraphs: [
    "Nhìn lại những năm tháng vừa qua, em biết ơn vì được học hỏi, được thử và được sai, rồi đứng dậy tiếp tục. Mỗi buổi học khuya, mỗi lần làm nhóm căng thẳng đều trở thành phần của hành trình khiến hôm nay trọn vẹn hơn.",
    "Em hiểu lễ tốt nghiệp không chỉ là một buổi lễ, mà là khoảnh khắc để nói lời cảm ơn: với gia đình đã hy sinh thầm lặng, với thầy cô và bạn bè đã kéo em lên mỗi khi ngã. Hẹn một buổi gặp thật ấm, để cùng ôn kỷ niệm và mở ra chương mới.",
  ],
};
