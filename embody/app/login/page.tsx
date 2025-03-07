"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId) router.push("/");
  }, [router]);

  const handleLogin = () => {
    if (!userId) return;
    localStorage.setItem("userId", userId);
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-gradient-to-t from-white via-white to-blue-400">
      <h1 className="text-4xl font-bold text-black mb-80">EmBody</h1>
      <input
        className="border-b-4 border-black bg-transparent text-lg outline-none placeholder-gray-500 text-black"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="ID"
      />
      <button onClick={handleLogin} className="px-6 py-3 font-bold bg-white border-blue-400 text-blue-500 rounded-xl border-2 shadow-md hover:bg-blue-100">
        log in
      </button>
    </div>
  );
}
