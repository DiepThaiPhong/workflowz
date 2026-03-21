import { ForumPost, CommunityStats, GrowthPlanMonth } from '../types';

// Seed forum data (Vietnamese) – field names match ForumPost/ForumComment types
export const seedForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Nguyễn Thị Lan',
    authorAvatar: 'https://i.pravatar.cc/40?img=1',
    title: 'Mình đã dùng AI để viết CV và được nhận việc! 🎉',
    content: 'Sau 2 tuần học kỹ năng số ở đây, mình đã thử dùng Gemini để cải thiện CV. Kết quả là được gọi phỏng vấn 3 nơi chỉ trong 1 tuần! Ai cũng nên thử cách này nhé.',
    category: 'Kinh nghiệm',
    likes: 47,
    isModerated: true,
    createdAt: '2026-03-15T08:30:00Z',
    comments: [
      {
        id: 'cmt-1-1',
        author: 'Trần Văn Minh',
        authorAvatar: 'https://i.pravatar.cc/40?img=2',
        content: 'Chị ơi chia sẻ cụ thể prompt chị dùng được không? Em đang rất cần!',
        createdAt: '2026-03-15T09:00:00Z',
        likes: 12,
      },
      {
        id: 'cmt-1-2',
        author: 'Lê Thị Hoa',
        authorAvatar: 'https://i.pravatar.cc/40?img=3',
        content: 'Cảm ơn chị! Mình cũng sẽ thử. Chúc mừng chị có việc làm mới! 🥳',
        createdAt: '2026-03-15T10:15:00Z',
        likes: 8,
      },
    ],
  },
  {
    id: 'post-2',
    author: 'Phạm Đình Khôi',
    authorAvatar: 'https://i.pravatar.cc/40?img=4',
    title: 'Câu hỏi: Học Python hay JavaScript trước?',
    content: 'Mình là người mới hoàn toàn, 28 tuổi, đang làm kinh doanh. Muốn học lập trình để tự làm website bán hàng. Nên học Python hay JavaScript trước? AI Mentor nói gì về điều này vậy mọi người?',
    category: 'Hỏi đáp',
    likes: 23,
    isModerated: true,
    createdAt: '2026-03-16T14:00:00Z',
    comments: [
      {
        id: 'cmt-2-1',
        author: 'Vũ Thanh Hùng',
        authorAvatar: 'https://i.pravatar.cc/40?img=5',
        content: 'Theo mình thì JavaScript phù hợp hơn nếu mục tiêu là web. Python tốt hơn cho data/AI.',
        createdAt: '2026-03-16T15:30:00Z',
        likes: 15,
      },
    ],
  },
  {
    id: 'post-3',
    author: 'Trần Thị Mai',
    authorAvatar: 'https://i.pravatar.cc/40?img=6',
    title: 'Workshop kỹ năng số tại Q.12 – Mời tham gia! 📅',
    content: 'Nhóm mình tổ chức buổi workshop miễn phí về "AI trong công việc hằng ngày" vào thứ 7 này tại Quận 12. Có chỗ ngồi hạn chế, đăng ký sớm nhé!',
    category: 'Sự kiện',
    likes: 61,
    isModerated: true,
    createdAt: '2026-03-17T07:00:00Z',
    comments: [
      {
        id: 'cmt-3-1',
        author: 'Hoàng Văn Tú',
        authorAvatar: 'https://i.pravatar.cc/40?img=7',
        content: 'Đăng ký rồi! Mong gặp mọi người 🙌',
        createdAt: '2026-03-17T08:00:00Z',
        likes: 5,
      },
    ],
  },
];

// Community stats (simulated local data)
export const initialCommunityStats: CommunityStats = {
  totalMembers: 342,
  livesEmpowered: 342,
  targetMembers: 1000,
  citiesReached: 8,
  workshopsHeld: 24,
  hoursLearned: 5130,
};

// 6-month growth plan
export const growthPlanMonths: GrowthPlanMonth[] = [
  {
    month: 1,
    title: 'Khởi động & Phủ sóng mạng xã hội',
    goals: [
      'Tạo group Facebook "Kỹ năng số TP.HCM"',
      'Đăng 3 video TikTok chia sẻ mẹo AI',
      'Nhắn tin mời 50 người bạn bè vào nhóm Zalo',
      'Tổ chức 1 buổi giới thiệu online miễn phí',
    ],
    channels: ['Facebook', 'Zalo', 'TikTok'],
    targetReach: 100,
    completed: false,
  },
  {
    month: 2,
    title: 'Workshop Offline & Cộng Đồng Địa Phương',
    goals: [
      'Tổ chức workshop tại nhà văn hóa hoặc quán cà phê',
      'Hợp tác với 2–3 trường đại học/cao đẳng',
      'Ra mắt chương trình "Bạn dạy Bạn"',
      'Đạt 200 thành viên cộng đồng',
    ],
    channels: ['Offline Workshop', 'Trường học', 'Công ty'],
    targetReach: 250,
    completed: false,
  },
  {
    month: 3,
    title: 'Nội Dung Viral & Chia Sẻ',
    goals: [
      'Thách thức #HọcAI30Ngày trên TikTok',
      'Mời 1 KOL/influencer chia sẻ về WorkFlowz',
      'Ra mắt certificate kỹ năng số điện tử',
      'Đạt 400 thành viên hoạt động',
    ],
    channels: ['TikTok Challenge', 'KOL', 'Certificate'],
    targetReach: 400,
    completed: false,
  },
  {
    month: 4,
    title: 'Lan Rộng Ra Các Tỉnh Thành',
    goals: [
      'Mở rộng sang Hà Nội, Đà Nẵng, Cần Thơ',
      'Tuyển 5 đại sứ cộng đồng (Community Ambassadors)',
      'Hợp tác với doanh nghiệp địa phương',
      'Đạt 600 thành viên',
    ],
    channels: ['Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Ambassador'],
    targetReach: 600,
    completed: false,
  },
  {
    month: 5,
    title: 'Chương Trình Hỗ Trợ Đặc Biệt',
    goals: [
      'Ra mắt học bổng kỹ năng số cho người thu nhập thấp',
      'Hợp tác với tổ chức NGO/phi lợi nhuận',
      'Chương trình đào tạo giảng viên cộng đồng',
      'Đạt 800 thành viên',
    ],
    channels: ['NGO', 'Học bổng', 'Train-the-Trainer'],
    targetReach: 800,
    completed: false,
  },
  {
    month: 6,
    title: 'Cán Mốc 1.000 Cuộc Sống Được Trao Quyền',
    goals: [
      'Lễ kỷ niệm 1.000 thành viên (online + offline)',
      'Phát hành báo cáo tác động xã hội',
      'Mời Google/các tổ chức tài trợ tiếp tục',
      'Lên kế hoạch mở rộng sang năm 2027',
    ],
    channels: ['Celebration', 'Impact Report', 'Sponsorship'],
    targetReach: 1000,
    completed: false,
  },
];
