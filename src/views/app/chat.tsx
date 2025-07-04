"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardBody,
  Input,
  Button,
  Avatar,
  Spinner,
  Divider,
  Chip,
} from "@heroui/react";
import { Send, Bot, User } from "lucide-react";
import { baseUrl } from "../../hooks/fetch-api.hook";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ApiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${baseUrl}chat/history/${user?.id}`);
        const historyMessages = response.data
          .filter((msg: any) => msg.role !== "system")
          .map((msg: any) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));
        setMessages(historyMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Failed to load chat history. Starting new conversation.",
          },
        ]);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages: ApiMessage[] = [
        { role: "system", content: "You are a helpful assistant." },
        ...messages.map(
          (m) => ({ role: m.role, content: m.content } as ApiMessage)
        ),
        { role: "user", content: input },
      ];

      const response = await axios.post(
        `${baseUrl}chat`,
        { messages: apiMessages, userId: user?.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Sorry, there was an error processing your request.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <Avatar
            icon={<Bot className="w-5 h-5" />}
            className="bg-purple-600/20 text-purple-400"
            size="sm"
          />
          <div>
            <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
            <p className="text-sm text-zinc-400">
              {isLoading ? "Thinking..." : "Ready to help"}
            </p>
          </div>
        </div>
        <Chip
          variant="dot"
          color="success"
          size="sm"
          className="bg-zinc-800/50 text-zinc-300"
        >
          Online
        </Chip>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-6">
              <Avatar
                icon={<Bot className="w-8 h-8" />}
                className="bg-purple-600/20 text-purple-400 w-16 h-16"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome to AI Chat
            </h2>
            <p className="text-zinc-400 max-w-md">
              {isLoading
                ? "Loading your conversation history..."
                : "Start a conversation by typing a message below. I'm here to help with any questions you have."}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                icon={
                  message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )
                }
                className={
                  message.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-700 text-zinc-300"
                }
                size="sm"
              />
              <Card
                className={`max-w-[70%] ${
                  message.role === "user"
                    ? "bg-purple-600/90 border-purple-500/50"
                    : "bg-zinc-800/50 border-zinc-700/50"
                }`}
              >
                <CardBody className="p-3">
                  <p
                    className={`text-sm whitespace-pre-wrap ${
                      message.role === "user" ? "text-white" : "text-zinc-200"
                    }`}
                  >
                    {message.content}
                  </p>
                </CardBody>
              </Card>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <Avatar
              icon={<Bot className="w-4 h-4" />}
              className="bg-zinc-700 text-zinc-300"
              size="sm"
            />
            <Card className="bg-zinc-800/50 border-zinc-700/50">
              <CardBody className="p-3">
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="secondary" />
                  <span className="text-sm text-zinc-400">
                    AI is thinking...
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <Divider className="bg-zinc-800/50" />

      {/* Input Area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            variant="bordered"
            className="flex-1"
            classNames={{
              input: "text-white placeholder:text-zinc-500",
              inputWrapper: [
                "bg-zinc-900/50",
                "border-zinc-700/50",
                "hover:border-purple-500/50",
                "focus-within:border-purple-500",
                "group-data-[focus=true]:border-purple-500",
              ],
            }}
            endContent={
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                isIconOnly
                color="secondary"
                variant="flat"
                className="bg-purple-600 hover:bg-purple-700 text-white min-w-unit-10 w-10 h-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            }
          />
        </form>
        <p className="text-xs text-zinc-500 mt-2 text-center">
          Press Enter to send your message
        </p>
      </div>
    </div>
  );
}
