import { ChatMessage } from '../types';

// SkillCategory used in generateQuiz (compatible with legacy types)
type SkillCategory = 'digital-literacy' | 'ai-basics' | 'coding' | 'job-skills' | 'community';

// Mock Gemini AI Service (simulates Google Gemini API responses)
// In production: replace with actual @google/generative-ai SDK calls
// Privacy-first: all processing simulated locally, no real API calls in demo mode

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Random confidence score between 78% and 96%
const randomConfidence = () => Math.floor(Math.random() * 19) + 78;

// Vietnamese AI tutor responses based on topic keywords
const tutorResponses: Record<string, string[]> = {
  ai: [
    'AI (Trí tuệ nhân tạo) là công nghệ giúp máy tính học hỏi và đưa ra quyết định như con người. Ví dụ đơn giản nhất là khi Gemini trả lời câu hỏi của bạn như thế này! 😊',
    'Bạn đang dùng AI ngay lúc này đấy! Gemini được Google phát triển, có thể hiểu tiếng Việt, viết văn bản, giaitích vấn đề và học cùng bạn.',
    'AI không phải robot từ phim khoa học viễn tưởng. AI là công cụ – giống như cái búa với thợ mộc. Ai biết dùng sẽ làm việc hiệu quả gấp 10 lần! 🔨',
  ],
  python: [
    'Python là ngôn ngữ lập trình dễ học nhất cho người mới bắt đầu. Cú pháp đơn giản, gần với tiếng Anh tự nhiên. Bắt đầu với:\n\n```python\nprint("Xin chào Việt Nam!")\n```\n\nChạy thử đi! 🐍',
    'Python được dùng rất nhiều trong AI, phân tích dữ liệu và website (Django/Flask). Ở Việt Nam, nhiều công ty fintech, startup đang tìm người biết Python!',
  ],
  cv: [
    'CV tốt cần 3 điều: **Rõ ràng**, **Ngắn gọn** (1 trang), và **Có số liệu cụ thể**. Thay vì "làm marketing giỏi", hãy viết "Tăng 30% doanh thu qua Facebook Ads trong 3 tháng".',
    'Dùng Gemini để cải thiện CV rất hiệu quả! Chỉ cần copy CV của bạn và hỏi: "Hãy cải thiện phần kinh nghiệm này cho chuyên nghiệp hơn".',
  ],
  viec: [
    'Để tìm việc nhanh hơn ở thời đại AI, bạn cần:\n1. **Kỹ năng số cơ bản** (bạn đang học rồi!)\n2. **Kỹ năng mềm**: giao tiếp, làm việc nhóm\n3. **Portfolio**: dự án thực tế để show nhà tuyển dụng',
    'LinkedIn là mạng xã hội nghề nghiệp số 1 hiện nay. Tạo profile đẹp trên LinkedIn có thể giúp bạn được các recruiter chủ động liên hệ!',
  ],
  hoc: [
    'Cách học hiệu quả nhất là **học và thực hành ngay**. Đừng chỉ đọc lý thuyết. Thử ứng dụng ngay những gì học được vào công việc hằng ngày của bạn!',
    'Phương pháp Pomodoro rất hiệu quả: học tập trung 25 phút → nghỉ 5 phút → lặp lại. Não bộ sẽ hấp thu tốt hơn nhiều!',
  ],
  default: [
    'Câu hỏi hay đấy! Để trả lời chi tiết, bạn có thể cho mình biết thêm ngữ cảnh không? Ví dụ bạn đang gặp vấn đề gì cụ thể?',
    'Mình hiểu câu hỏi của bạn! Dựa trên lộ trình học của bạn, mình gợi ý bạn nên bắt đầu từ những bước cơ bản nhất rồi từ từ nâng cao. Bạn muốn mình hướng dẫn bước nào trước?',
    'Đây là một chủ đề rất quan trọng trong hành trình học kỹ năng số! Mình sẽ giải thích theo cách đơn giản nhất để bạn dễ hiểu và áp dụng ngay.',
  ],
};

const findResponse = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('ai') || lower.includes('trí tuệ') || lower.includes('gemini') || lower.includes('chatgpt')) {
    return tutorResponses.ai[Math.floor(Math.random() * tutorResponses.ai.length)];
  }
  if (lower.includes('python') || lower.includes('lập trình') || lower.includes('code') || lower.includes('javascript')) {
    return tutorResponses.python[Math.floor(Math.random() * tutorResponses.python.length)];
  }
  if (lower.includes('cv') || lower.includes('resume') || lower.includes('hồ sơ')) {
    return tutorResponses.cv[Math.floor(Math.random() * tutorResponses.cv.length)];
  }
  if (lower.includes('việc') || lower.includes('tìm việc') || lower.includes('linkedin') || lower.includes('phỏng vấn')) {
    return tutorResponses.viec[Math.floor(Math.random() * tutorResponses.viec.length)];
  }
  if (lower.includes('học') || lower.includes('nghiên cứu') || lower.includes('cách')) {
    return tutorResponses.hoc[Math.floor(Math.random() * tutorResponses.hoc.length)];
  }
  return tutorResponses.default[Math.floor(Math.random() * tutorResponses.default.length)];
};

// Main AI tutor chat function
export const askTutor = async (
  message: string,
  _history: ChatMessage[] = []
): Promise<{ text: string; confidence: number }> => {
  await delay(800 + Math.random() * 700); // Simulate network latency

  const text = findResponse(message);
  const confidence = randomConfidence();

  return { text, confidence };
};

// Generate quiz for a topic (mock)
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const generateQuiz = async (category: SkillCategory): Promise<QuizQuestion[]> => {
  await delay(1000);

  const quizzes: Record<SkillCategory, QuizQuestion[]> = {
    'digital-literacy': [
      {
        question: 'Cách an toàn nhất để tạo mật khẩu là gì?',
        options: ['Dùng ngày sinh', 'Dùng từ ngẫu nhiên dài trên 12 ký tự', 'Dùng tên mình', '123456'],
        correct: 1,
        explanation: 'Mật khẩu mạnh cần dài (12+ ký tự), ngẫu nhiên, kết hợp chữ hoa, thường, số và ký tự đặc biệt.',
      },
      {
        question: 'URL của website hợp lệ bắt đầu bằng?',
        options: ['http://', 'https://', 'www.', 'ftp://'],
        correct: 1,
        explanation: 'HTTPS (có chữ S) nghĩa là kết nối được mã hóa, an toàn hơn HTTP thường.',
      },
    ],
    'ai-basics': [
      {
        question: 'Gemini do công ty nào phát triển?',
        options: ['Microsoft', 'Apple', 'Google', 'Meta'],
        correct: 2,
        explanation: 'Gemini là mô hình AI của Google DeepMind, ra mắt năm 2023.',
      },
      {
        question: '"Prompt" trong AI nghĩa là gì?',
        options: ['Nút bắt đầu', 'Câu hỏi hoặc lệnh bạn nhập vào AI', 'Kết quả AI đưa ra', 'Tốc độ xử lý AI'],
        correct: 1,
        explanation: 'Prompt là câu lệnh hoặc câu hỏi bạn nhập vào AI. Prompt tốt → kết quả tốt hơn!',
      },
    ],
    coding: [
      {
        question: 'Trong Python, lệnh nào dùng để in ra màn hình?',
        options: ['echo', 'console.log', 'print', 'System.out.println'],
        correct: 2,
        explanation: 'Trong Python, print("text") dùng để in text ra màn hình. Rất đơn giản!',
      },
    ],
    'job-skills': [
      {
        question: 'CV tốt nhất nên có độ dài bao nhiêu trang?',
        options: ['5-10 trang', '3-4 trang', '1-2 trang', 'Càng dài càng tốt'],
        correct: 2,
        explanation: 'CV ngắn gọn, súc tích (1-2 trang) được nhà tuyển dụng ưa chuộng hơn vì họ đọc rất nhiều hồ sơ mỗi ngày.',
      },
    ],
    community: [
      {
        question: 'Yếu tố quan trọng nhất để workshop thành công là gì?',
        options: ['Địa điểm sang trọng', 'Nội dung hữu ích + tương tác', 'Số lượng người tham dự đông', 'Quà tặng hấp dẫn'],
        correct: 1,
        explanation: 'Nội dung hữu ích và tương tác trực tiếp luôn là yếu tố quyết định thành công của một workshop.',
      },
    ],
  };

  return quizzes[category] || quizzes['digital-literacy'];
};

// AI content moderation (mock)
export const moderatePost = async (content: string): Promise<{ safe: boolean; reason?: string }> => {
  await delay(300);

  const unsafeKeywords = ['lừa đảo', 'hack', 'scam', 'giả mạo', 'phishing'];
  const hasUnsafe = unsafeKeywords.some((kw) => content.toLowerCase().includes(kw));

  if (hasUnsafe) {
    return { safe: false, reason: 'Nội dung có thể chứa thông tin nguy hiểm' };
  }

  return { safe: true };
};

// Generate personalized assessment feedback
export const generateAssessmentFeedback = async (overallScore: number): Promise<string> => {
  await delay(600);

  if (overallScore >= 75) {
    return 'Xuất sắc! Bạn đã có nền tảng kỹ năng số tốt. Hãy tiếp tục nâng cao và chia sẻ kiến thức với cộng đồng! 🌟';
  } else if (overallScore >= 50) {
    return 'Tốt lắm! Bạn đang trên đúng hướng. Với chương trình học 10 phút mỗi ngày, bạn sẽ thấy tiến bộ rõ rệt trong vòng 1 tháng! 💪';
  } else {
    return 'Tuyệt vời vì bạn đã bắt đầu! Mọi chuyên gia đều từng là người mới. SkillBridge AI sẽ đồng hành cùng bạn từng bước. 🌱';
  }
};
