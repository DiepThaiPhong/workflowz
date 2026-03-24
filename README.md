# SkillBridge AI – AI Mentor Kỹ Năng Số

> Nền tảng học kỹ năng số **miễn phí** cho người Việt Nam, được phát triển bởi team BAP.

## ✨ Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 🤖 AI Mentor | Chat tiếng Việt với AI, powered by Gemini |
| 🎯 Đánh giá kỹ năng | 10 câu hỏi chat-style + progress ring |
| 📚 5 Lộ trình học | Digital Literacy, AI Basics, Coding, Job Skills, Community |
| ⏱️ Nhiệm vụ 10 phút | Dashboard cá nhân với missions hàng ngày |
| 🌱 Cộng đồng | Forum với AI moderation |
| 🎯 Tác động | Animated counter – 1.000 cuộc sống được trao quyền |
| 🚀 Kế hoạch 6 tháng | Lộ trình + viral share button (+100 XP) |
| 📱 PWA | Offline-first, cài được trên điện thoại |

## 🚀 Chạy local

```bash
cd skillbridge-ai
npm install
npm run dev
# Mở: http://localhost:5173
```

## 🧪 Tests

```bash
npm test
```

## 🌐 Deploy lên Vercel

### Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### GitHub + Vercel Dashboard
1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → "New Project" → Import repo
3. Build settings: Framework=Vite, Build=`npm run build`, Output=`dist`
4. Click "Deploy"

## 🏗️ Cấu trúc dự án

```
src/
├── components/     # Navbar, ChatBubble, ProgressRing, MissionCard...
├── pages/          # LandingPage, AssessmentPage, DashboardPage...
├── hooks/          # useLocalStorage, useDarkMode
├── services/       # geminiService.ts (mock AI)
├── data/           # assessmentQuestions, learningPaths, communityData
├── types/          # TypeScript interfaces
└── utils/          # helpers.ts
```

## 🛡️ Cam kết AI có trách nhiệm
- 🔒 **Privacy-first**: localStorage only – không thu thập dữ liệu cá nhân
- 🛡️ **Safety**: AI kiểm duyệt nội dung cộng đồng tự động
- 💬 **Transparency**: Hiển thị confidence % + Gemini disclaimer
- ♿ **Accessibility**: WCAG 2.1 AA

## 📦 Tech Stack
React 18 + Vite + TypeScript + Tailwind CSS v3 + Framer Motion + React Router v6 + Lucide React + vite-plugin-pwa + Vitest

---
*Dự án phi lợi nhuận vì cộng đồng kỹ năng số Việt Nam 🇻🇳*
