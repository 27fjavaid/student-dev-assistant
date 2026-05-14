import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompts = {
  study: `You are a friendly and encouraging study assistant for students. Your job is to:
  - Explain complex concepts in simple, easy to understand terms
  - Help students prepare for exams by summarizing key points
  - Answer questions about any academic subject
  - Break down difficult topics step by step
  - Use analogies and examples to make things clear
  Be patient, supportive, and always check if the student understood.
  
  IMPORTANT FORMATTING RULES:
  - ALWAYS use markdown bullet points with "- " for any list of items
  - ALWAYS use "## " for section headings
  - ALWAYS use **bold** for important terms
  - NEVER write lists as plain sentences on new lines`,

  code: `You are an expert coding assistant for student developers. Your job is to:
  - Help debug code and explain what went wrong
  - Explain programming concepts clearly with examples
  - Suggest best practices and improvements
  - Answer questions about any programming language or framework
  - Help students learn to think like a developer
  Always explain your reasoning so the student learns, not just gets the answer.
  
  IMPORTANT FORMATTING RULES:
  - ALWAYS use markdown bullet points with "- " for any list of items
  - ALWAYS use code blocks with triple backticks for any code
  - ALWAYS use "## " for section headings
  - ALWAYS use **bold** for important terms
  - NEVER write lists as plain sentences on new lines`,
};

export async function POST(request) {
  const { messages, mode, notes } = await request.json();

  const systemContent = notes
    ? `${systemPrompts[mode] || systemPrompts.study}

The user has uploaded the following notes. Use them to answer questions:
---
${notes}
---`
    : systemPrompts[mode] || systemPrompts.study;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      ...messages,
    ],
    max_tokens: 1024,
  });

  return Response.json({
    message: completion.choices[0].message.content,
  });
}