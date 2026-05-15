# StudyAI
An AI-powered chatbot that helps students with coding questions and studying. Built with Next.js and deployed on Vercel.

## Live Demo
[student-dev-assistant.vercel.app](https://student-dev-assistant.vercel.app)

## Features 
- **Study Mode** — explains concepts, summarizes topics, and helps you prepare for exams
- **Code Mode** — debugs code, explains errors, and suggests best practices
- **Upload Notes** — upload .txt or .docx files and ask questions about them
- **Chat History** — conversations persist after page refresh
- **Light/Dark Mode** — toggle between light and dark themes
- **Smart Input** — Shift+Enter for new lines, Enter to send
- **Copy Responses** — hover over any response to copy it

## Built With
- [Next.js](https://nextjs.org/) — React framework
- [Groq API](https://groq.com/) — AI powered by LLaMA 3.3
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [React Markdown](https://github.com/remarkjs/react-markdown) — markdown rendering
- [Vercel](https://vercel.com/) — deployment


## Getting Started
1. Clone the repo
```bash
git clone https://github.com/27fjavaid/studyai.git
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file and add your Groq API key. You can get a free key at [console.groq.com](https://console.groq.com). GROQ_API_KEY=your_api_key_here

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Screenshots
![StudyAI Screenshot](./public/screenshot.png)

## Author

**Fatima Javaid**
- GitHub: [@27fjavaid](https://github.com/27fjavaid)
