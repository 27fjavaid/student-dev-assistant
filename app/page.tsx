"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await response.json();
    setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2 text-blue-400">Student Dev Assistant</h1>
      <p className="text-gray-400 mb-6">Ask me anything about coding or your studies!</p>

      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-20">Start a conversation below!</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-gray-700 text-gray-400 text-sm">Thinking...</div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex gap-2">
          <input
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 text-sm outline-none"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}