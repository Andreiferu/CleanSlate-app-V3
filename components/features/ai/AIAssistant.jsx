import { useEffect, useState, useCallback } from 'react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);

  const getWelcomeMessage = useCallback(() => {
    return { id: 1, text: 'Hello, I am your AI Assistant.' };
  }, []);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [getWelcomeMessage()];
      }
      return prev;
    });
  }, [getWelcomeMessage]);

  return (
    <div className="p-4 border rounded-xl bg-white">
      <h2 className="text-lg font-semibold mb-2">AI Assistant</h2>
      <ul className="space-y-2">
        {messages.map((msg) => (
          <li key={msg.id} className="text-sm text-gray-700">
            {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
