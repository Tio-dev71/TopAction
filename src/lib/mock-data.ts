export const tournaments = [
  {
    id: "1",
    slug: "heea-evnhcmc-chao-mung-50-nam",
    title: "HEEA & EVNHCMC – Chào mừng 50 năm",
    category: "Doanh nghiệp",
    short_description:
      "Giải chạy bộ trực tuyến kỷ niệm 50 năm thành lập, kết nối cộng đồng doanh nghiệp và thể thao.",
    description: `
## Giới thiệu

Giải chạy bộ trực tuyến **HEEA & EVNHCMC – Chào mừng 50 năm** là sự kiện thể thao ý nghĩa nhằm kỷ niệm 50 năm thành lập Tổng Công ty Điện lực TP. Hồ Chí Minh, đồng thời lan tỏa tinh thần rèn luyện sức khỏe trong cộng đồng doanh nghiệp.

## Mục đích

- Kỷ niệm 50 năm ngày thành lập EVNHCMC (1975 – 2025)
- Khuyến khích lối sống lành mạnh, rèn luyện thể chất
- Kết nối cộng đồng CBCNV và đối tác trong & ngoài ngành điện
- Gây quỹ từ thiện hỗ trợ đồng bào khó khăn

## Đối tượng tham gia

Tất cả CBCNV, đối tác, khách hàng và cộng đồng yêu thể thao đều có thể đăng ký tham gia. Không giới hạn độ tuổi và giới tính.

## Cơ chế thi đấu

Người tham gia sử dụng ứng dụng theo dõi GPS (Strava, Garmin Connect, Nike Run Club...) để ghi nhận quãng đường. Kết quả được đồng bộ tự động về hệ thống và cập nhật lên bảng xếp hạng theo thời gian thực.

## Giải thưởng

- **Top 3 cá nhân** mỗi cự ly: Huy chương vàng/bạc/đồng + Phần thưởng giá trị
- **Top 3 đội thi đấu**: Cúp + Giấy chứng nhận + Phần thưởng
- **Tất cả người hoàn thành**: Huy chương kỷ niệm + Áo finisher
- **Giải đặc biệt**: Người chạy xa nhất, đội đông thành viên nhất

## Lưu ý quan trọng

Vận động viên cần đảm bảo sức khỏe trước khi tham gia. Ban tổ chức không chịu trách nhiệm về các sự cố sức khỏe trong quá trình thi đấu. Mọi kết quả gian lận sẽ bị hủy bỏ.
    `,
    cover_image:
      "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=1200&q=80",
    start_date: "2026-04-01",
    end_date: "2026-07-08",
    registration_deadline: "2026-06-30T23:59:59",
    location: "TP. Hồ Chí Minh",
    distances: ["10 km", "50 km", "120 km", "150 km"],
    participant_count: 1248,
    donation_total: 156000000,
    is_active: true,
  },
  {
    id: "2",
    slug: "vrace-ha-noi-marathon-2026",
    title: "VRace Hà Nội Marathon 2026",
    category: "Cộng đồng",
    short_description:
      "Giải marathon trực tuyến lớn nhất miền Bắc, kết nối hàng nghìn runner.",
    description: "Giải marathon trực tuyến dành cho cộng đồng chạy bộ Hà Nội.",
    cover_image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80",
    start_date: "2026-05-15",
    end_date: "2026-06-20",
    registration_deadline: "2026-06-10T23:59:59",
    location: "Hà Nội",
    distances: ["5 km", "10 km", "21 km", "42 km"],
    participant_count: 3560,
    donation_total: 230000000,
    is_active: true,
  },
  {
    id: "3",
    slug: "mekong-delta-cycling-challenge",
    title: "Mekong Delta Cycling Challenge",
    category: "Xe đạp",
    short_description:
      "Thử thách đạp xe xuyên miền Tây, khám phá vẻ đẹp sông nước.",
    description: "Giải đạp xe trực tuyến khám phá miền Tây sông nước.",
    cover_image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
    start_date: "2026-06-01",
    end_date: "2026-06-30",
    registration_deadline: "2026-06-25T23:59:59",
    location: "Cần Thơ",
    distances: ["50 km", "100 km", "200 km"],
    participant_count: 892,
    donation_total: 89000000,
    is_active: true,
  },
  {
    id: "4",
    slug: "da-nang-triathlon-open",
    title: "Đà Nẵng Triathlon Open",
    category: "Ba môn phối hợp",
    short_description:
      "Ba môn phối hợp quốc tế tại thành phố biển Đà Nẵng xinh đẹp.",
    description: "Giải ba môn phối hợp mở rộng tại Đà Nẵng.",
    cover_image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80",
    start_date: "2026-07-10",
    end_date: "2026-08-15",
    registration_deadline: "2026-08-01T23:59:59",
    location: "Đà Nẵng",
    distances: ["Sprint", "Olympic", "Half Ironman"],
    participant_count: 640,
    donation_total: 46000000,
    is_active: true,
  },
];

export const tournamentRules = [
  {
    id: "r1",
    tournament_id: "1",
    rule_type: "sport",
    title: "Bộ môn",
    content: "Chạy bộ (Running) – Đường trường, không giới hạn địa hình",
    icon: "running",
    sort_order: 0,
  },
  {
    id: "r2",
    tournament_id: "1",
    rule_type: "pace",
    title: "Yêu cầu pace",
    content: "Tối thiểu 4:00/km – Tối đa 12:00/km. Kết quả ngoài khoảng sẽ không được tính.",
    icon: "gauge",
    sort_order: 1,
  },
  {
    id: "r3",
    tournament_id: "1",
    rule_type: "tracking",
    title: "Ghi nhận kết quả",
    content:
      "Kết quả được đồng bộ qua ứng dụng GPS. Mỗi hoạt động phải có bản đồ và dữ liệu pace rõ ràng.",
    icon: "map",
    sort_order: 2,
  },
  {
    id: "r4",
    tournament_id: "1",
    rule_type: "device",
    title: "Thiết bị / App đồng bộ",
    content:
      "Hỗ trợ Strava, Garmin Connect, Apple Health, Nike Run Club. Kết nối trước khi bắt đầu thi đấu.",
    icon: "smartphone",
    sort_order: 3,
  },
  {
    id: "r5",
    tournament_id: "1",
    rule_type: "completion",
    title: "Điều kiện hoàn thành",
    content:
      "Hoàn thành ít nhất 80% quãng đường đăng ký trong thời gian giải. Mỗi lần chạy tối thiểu 1 km.",
    icon: "check-circle",
    sort_order: 4,
  },
];

export const organizers = [
  {
    id: "o1",
    tournament_id: "1",
    name: "EVNHCMC",
    logo_url: null,
    description:
      "Tổng Công ty Điện lực TP. Hồ Chí Minh – Đơn vị tổ chức chính.",
    type: "organizer",
    sort_order: 0,
  },
  {
    id: "o2",
    tournament_id: "1",
    name: "HEEA Sports",
    logo_url: null,
    description:
      "Đơn vị vận hành giải đấu, chuyên tổ chức các sự kiện thể thao trực tuyến.",
    type: "organizer",
    sort_order: 1,
  },
  {
    id: "o3",
    tournament_id: "1",
    name: "VPBank",
    logo_url: null,
    description:
      "Nhà tài trợ kim cương – Đồng hành cùng phong trào thể thao cộng đồng.",
    type: "sponsor",
    sort_order: 2,
  },
  {
    id: "o4",
    tournament_id: "1",
    name: "Garmin Vietnam",
    logo_url: null,
    description:
      "Đối tác công nghệ – Cung cấp giải pháp theo dõi hoạt động thể thao.",
    type: "partner",
    sort_order: 3,
  },
];

const firstNames = [
  "Nguyễn Văn", "Trần Thị", "Lê Hoàng", "Phạm Minh", "Hoàng Thị",
  "Vũ Đức", "Đặng Thị", "Bùi Quang", "Đỗ Thị", "Ngô Thanh",
  "Dương Văn", "Lý Thị", "Phan Minh", "Hồ Thị", "Trịnh Đình",
  "Đinh Thị", "Mai Văn", "Tạ Quốc", "Võ Thị", "Châu Minh",
];
const lastNames = [
  "An", "Bình", "Cường", "Dung", "Hà",
  "Hùng", "Lan", "Long", "Mai", "Nam",
  "Phúc", "Quân", "Sơn", "Tâm", "Thảo",
  "Tuấn", "Uyên", "Việt", "Xuân", "Yến",
];

export const leaderboardEntries = Array.from({ length: 20 }, (_, i) => {
  const gender = i % 3 === 1 ? "Nữ" : "Nam";
  const dist = [10, 50, 120, 150][i % 4];
  const totalKm = dist - Math.random() * dist * 0.3;
  const paceMin = 4 + Math.random() * 4;
  const minutes = Math.floor(paceMin);
  const seconds = Math.floor((paceMin - minutes) * 60);

  return {
    id: `lb${i + 1}`,
    tournament_id: "1",
    user_id: null,
    participant_name: `${firstNames[i]} ${lastNames[i]}`,
    gender,
    team_name: i < 6 ? ["Đội Ánh Sáng", "Đội Sấm Sét", "Đội Bão Táp"][i % 3] : null,
    category_type: i < 6 ? "team" : "individual",
    distance_category: `${dist} km`,
    total_distance: Math.round(totalKm * 100) / 100,
    total_time: Math.round(totalKm * paceMin * 60),
    avg_pace: `${minutes}:${seconds.toString().padStart(2, "0")}/km`,
    score: Math.round((1000 - i * 40 + Math.random() * 20) * 10) / 10,
    rank_no: i + 1,
    avatar_url: `https://api.dicebear.com/9.x/adventurer/svg?seed=runner${i}`,
  };
});

export const donations = [
  {
    id: "d1",
    tournament_id: "1",
    donor_name: "Nguyễn Văn Minh",
    amount: 5000000,
    message: "Cổ vũ tinh thần thể thao! Cố lên các VĐV!",
    status: "confirmed",
    created_at: "2026-04-02T10:30:00",
  },
  {
    id: "d2",
    tournament_id: "1",
    donor_name: "Trần Thị Hoa",
    amount: 2000000,
    message: "Ủng hộ giải chạy ý nghĩa",
    status: "confirmed",
    created_at: "2026-04-03T14:20:00",
  },
  {
    id: "d3",
    tournament_id: "1",
    donor_name: "Công ty ABC",
    amount: 50000000,
    message: "Đồng hành cùng EVNHCMC – 50 năm phát triển",
    status: "confirmed",
    created_at: "2026-04-01T08:00:00",
  },
  {
    id: "d4",
    tournament_id: "1",
    donor_name: "Lê Quốc Hùng",
    amount: 1000000,
    message: "Chúc giải thành công tốt đẹp!",
    status: "pending",
    created_at: "2026-04-05T16:45:00",
  },
  {
    id: "d5",
    tournament_id: "1",
    donor_name: "Phạm Anh Tuấn",
    amount: 3000000,
    message: "Vì sức khỏe cộng đồng",
    status: "confirmed",
    created_at: "2026-04-04T09:15:00",
  },
];

export function getTournamentBySlug(slug: string) {
  return tournaments.find((t) => t.slug === slug) ?? null;
}
