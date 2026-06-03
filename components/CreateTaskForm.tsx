"use client";

import React, { useState } from "react";

//  အပေါ်က import { Priority } အစား ဒီမှာတင် တိုက်ရိုက် Type သတ်မှတ်ပေးလိုက်ပါတယ်
type Priority = "LOW" | "MEDIUM" | "HIGH";

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
}

export default function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return alert("Task ခေါင်းစဉ် (Title) ဖြည့်ပေးပါဦး။");

    setIsLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        if (onTaskCreated) onTaskCreated();
        alert("Task အသစ် ထည့်သွင်းပြီးပါပြီ။");
      } else {
        alert("တစ်ခုခု မှားယွင်းနေပါသည်။");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full mb-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-800">📋 Task အသစ် ထည့်ရန်</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="ဥပမာ- to go to meeting"
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="လုပ်ဆောင်ရမယ့် အသေးစိတ်..."
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:border-blue-500"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Priority)}
          className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="LOW">🔵 Low</option>
          <option value="MEDIUM">🟡 Medium</option>
          <option value="HIGH">🔴 High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm transition duration-150"
      >
        {isLoading ? "Saving..." : "Task အသစ် သိမ်းမည်"}
      </button>
    </form>
  );
}