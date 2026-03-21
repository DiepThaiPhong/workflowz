import { AssessmentQuestion } from '../types';

// 10 progressive Vietnamese assessment questions
// Starts with 3 simple MCQ, then expands adaptively
export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    question: 'Bạn sử dụng smartphone để làm gì thường xuyên nhất?',
    
    options: [
      'Gọi điện và nhắn tin',
      'Xem mạng xã hội (Facebook, TikTok)',
      'Làm việc và học tập online',
      'Xem phim và giải trí',
    ],
    category: 'digital-literacy',
  },
  {
    id: '2',
    question: 'Bạn đã từng nghe về "Trí tuệ nhân tạo" (AI) chưa?',
    
    options: [
      'Chưa nghe bao giờ',
      'Có nghe nhưng chưa hiểu rõ',
      'Hiểu cơ bản và đã thử dùng',
      'Am hiểu và dùng AI hằng ngày',
    ],
    category: 'ai-basics',
  },
  {
    id: '3',
    question: 'Bạn đang làm việc trong lĩnh vực nào?',
    
    options: [
      'Học sinh / Sinh viên',
      'Công nhân / Nhân viên văn phòng',
      'Tự kinh doanh / Freelancer',
      'Đang tìm việc làm',
    ],
    category: 'job-skills',
  },
  {
    id: '4',
    question: 'Bạn có thể tự tìm kiếm thông tin học tập trên internet không?',
    
    options: [
      'Không biết cách tìm',
      'Biết tìm nhưng hay gặp thông tin sai',
      'Tìm được và biết chọn lọc',
      'Tìm rất thành thạo, kể cả tài liệu tiếng Anh',
    ],
    category: 'digital-literacy',
  },
  {
    id: '5',
    question: 'Bạn đã từng thử dùng ChatGPT hoặc Gemini chưa?',
    
    options: [
      'Chưa bao giờ',
      'Thử 1-2 lần rồi thôi',
      'Thỉnh thoảng dùng cho công việc/học tập',
      'Dùng hằng ngày',
    ],
    category: 'ai-basics',
  },
  {
    id: '6',
    question: 'Bạn tự đánh giá kỹ năng viết email và báo cáo chuyên nghiệp của mình như thế nào?',
    
    options: [
      'Chưa biết viết email chuyên nghiệp',
      'Viết được nhưng chưa tự tin',
      'Viết tốt bằng tiếng Việt',
      'Viết tốt cả tiếng Việt lẫn tiếng Anh',
    ],
    category: 'job-skills',
  },
  {
    id: '7',
    question: 'Bạn có muốn học lập trình không?',
    
    options: [
      'Không quan tâm',
      'Muốn nhưng sợ khó quá',
      'Đã học qua chút ít',
      'Đang học và muốn nâng cao',
    ],
    category: 'coding',
  },
  {
    id: '8',
    question: 'Bạn thích học theo cách nào nhất?',
    
    options: [
      'Xem video bài giảng',
      'Đọc tài liệu và ví dụ',
      'Thực hành bài tập ngay',
      'Học nhóm & thảo luận',
    ],
    category: 'digital-literacy',
  },
  {
    id: '9',
    question: 'Bạn có muốn tham gia vào cộng đồng học tập và chia sẻ kỹ năng không?',
    
    options: [
      'Không, tôi thích tự học',
      'Có thể, nếu tiện',
      'Có, tôi thích giao lưu học hỏi',
      'Rất muốn, tôi muốn cả dạy người khác',
    ],
    category: 'community',
  },
  {
    id: '10',
    question: 'Mục tiêu chính của bạn khi tham gia SkillBridge AI là gì?',
    
    options: [
      'Học kiến thức mới để tìm việc tốt hơn',
      'Tự động hóa công việc với AI',
      'Nâng cao kỹ năng số cơ bản',
      'Xây dựng network và cộng đồng',
    ],
    category: 'job-skills',
  },
];

export const aiIntroMessages = [
  'Xin chào! Mình là AI Mentor của bạn 👋',
  'Mình sẽ giúp bạn tìm ra lộ trình học kỹ năng số phù hợp nhất.',
  'Bắt đầu bằng vài câu hỏi nhỏ nhé – không có câu nào sai cả! 😊',
];
