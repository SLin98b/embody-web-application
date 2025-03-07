"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import { useLanguage } from "./context/LanguageContext";
import { translations } from "./locales";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const router = useRouter();
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { language, toggleLanguage } = useLanguage();
  const t = translations[language]; 



  useEffect(() => {
    if (!userId) return;

    const fetchEntryCount = async () => {
      const { count, error } = await supabase
        .from("entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId); // Nutzerid check, damit nur passende Einträge angezeigt werden

      if (error) {
        console.error("Fehler beim Abrufen der Eintragsanzahl:", error);
        return;
      }
      setEntryCount(count);
    };

    fetchEntryCount();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };


  if (!userId) {
    router.push("/login"); 
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-t from-white via-white to-blue-400">
      <h1 className="text-4xl font-bold text-black mb-80">EmBody</h1>
      <button onClick={() => router.push("/entry")} className="px-6 py-3  mt-40 w-48 font-bold bg-white border-blue-400 text-blue-500 rounded-xl border-2 shadow-md hover:bg-blue-100">
      {t.newEntry}
      </button>

      {/*Logged Entries Button. Bei Anklicken gelangt man zu einer Page, auf der man die bisher angelegten Einträge einsehen kann.
         Bei Bedarf einfach asublendbar indem man "hidden" in den "className" schreibt. */}
      <button onClick={() => router.push("/logged-entries")} className="mt-4 font-semibold  text-black">
      {t.loggedEntries} {entryCount !== null ? `${entryCount}` : ""}
      </button>

      <button onClick={handleLogout} className="mt-6 px-6 py-3 bg-opacity-0 text-blue-700 font-medium rounded-lg hover:bg-blue-200">
      {t.logout}
      </button>

      {/* Sprachumstellung. Standartmäßig ausgeblendet, zum einschalten das "hidden" aus className entfernen.*/}
      <button
        className="hidden mt-0 text-xs text-black"
        onClick={toggleLanguage}
      >
        {t.switchLanguage}
      </button>

    </div>
  );
}
