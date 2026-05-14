"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

type Message = { role: string; content: string };
type Mode = "study" | "code";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markdownComponents: any = {
  ul: (props: any) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
  li: (props: any) => <li className="text-gray-100" {...props} />,
  strong: (props: any) => <strong className="font-bold text-white" {...props} />,
  p: (props: any) => <p className="mb-2" {...props} />,
  h2: (props: any) => <h2 className="font-bold text-white text-base mt-3 mb-1" {...props} />,
  h3: (props: any) => <h3 className="font-bold text-white text-sm mt-2 mb-1" {...props} />,
  code: (props: any) => {
    const { className, children } = props;
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <pre className="bg-gray-950 rounded-lg p-3 my-2 overflow-x-auto w-full">
        <code className="text-green-400 text-xs font-mono whitespace-pre">{children}</code>
      </pre>
    ) : (
      <code className="bg-gray-800 px-1 rounded text-green-400 font-mono text-xs">{children}</code>
    );
  },
};

function TypingMessage({ text, onUpdate }: { text: string; onUpdate: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        onUpdate();
      } else {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text]);

  return <ReactMarkdown components={markdownComponents}>{displayed}</ReactMarkdown>;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("study");
  const [lastAssistantIndex, setLastAssistantIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      body: JSON.stringify({ messages: updatedMessages, mode }),
    });

    const data = await response.json();
    const newMessages = [...updatedMessages, { role: "assistant", content: data.message }];
    setMessages(newMessages);
    setLastAssistantIndex(newMessages.length - 1);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    setLastAssistantIndex(null);
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2 text-blue-400">Student Dev Assistant</h1>
      <p className="text-gray-400 mb-4">Ask me anything about coding or your studies!</p>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("study"); clearChat(); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            mode === "study" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          }`}
        >
          🎓 Study Mode
        </button>
        <button
          onClick={() => { setMode("code"); clearChat(); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            mode === "code" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          }`}
        >
          💻 Code Mode
        </button>
      </div>

      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl flex flex-col h-[600px]">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <span className="text-sm text-gray-400">
            {mode === "study" ? "🎓 Study Mode" : "💻 Code Mode"} · {messages.length} messages
          </span>
          <button onClick={clearChat} className="text-sm text-red-400 hover:text-red-300 transition">
            Clear Chat
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-20">
              {mode === "study" ? "Ask me to explain a concept or help you study!" : "Paste your code and I'll help you debug it!"}
            </p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="relative group w-full max-w-[85%]">
                <div className={`px-4 py-2 rounded-2xl text-sm ${
                  msg.role === "user" ? "bg-blue-600 text-white ml-auto w-fit max-w-full" : "bg-gray-700 text-gray-100 w-full"
                }`}>
                  {msg.role === "assistant" && i === lastAssistantIndex ? (
                    <TypingMessage text={msg.content} onUpdate={scrollToBottom} />
                  ) : msg.role === "assistant" ? (
                    <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(msg.content, i)}
                    className="absolute -bottom-5 left-0 text-xs text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition"
                  >
                    {copied === i ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-gray-700 text-gray-400 text-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex gap-2">
          <textarea
  className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 text-sm outline-none resize-none"
  placeholder={mode === "study" ? "Ask a study question..." : "Paste your code or describe a bug..."}
  value={input}
  rows={1}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
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