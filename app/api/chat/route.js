import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  const { messages } = await request.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for students who are learning to code and studying tech subjects. 
        You can help with:
        - Explaining coding concepts and debugging code
        - Breaking down complex topics in simple terms
        - Helping study for exams
        - Answering questions about computer science and software development
        Be friendly, encouraging, and clear in your explanations.`,
      },
      ...messages,
    ],
    max_tokens: 1024,
  });

  return Response.json({
    message: completion.choices[0].message.content,
  });
}