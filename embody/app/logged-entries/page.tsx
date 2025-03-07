"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../locales";


export default function LoggedEntriesPage() {

  const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language];
  interface Entry {
    id: string;
    x: string;
    y: string;
    emotion: string;
    intensity: string;
    notes: string;
    start_timestamp: string;
    finish_timestamp: string;
  }

  const [entries, setEntries] = useState<Entry[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return;
    setUserId(storedUserId);

    const fetchEntries = async () => {
      const response = await fetch(`/api/entries?userId=${storedUserId}`);
      const data = await response.json();


      if (!Array.isArray(data)) {
        console.error("API-Daten kein Array", data);
        return;
      }

      // formatieren der Timestamps wegen Supabase / Arrays
      const formattedEntries = data.map((entry: Entry) => ({
        ...entry,
        start_timestamp: entry.start_timestamp
          ? new Date(entry.start_timestamp).toLocaleString()
          : "N/A",
        finish_timestamp: entry.finish_timestamp
          ? new Date(entry.finish_timestamp).toLocaleString()
          : "N/A",
      }));

      setEntries(formattedEntries);
    };

    fetchEntries();
  }, []);

  return (

  
    


    <div className="flex flex-col items-center justify-center min-h-screen max-h-screen p-10 bg-gradient-to-t from-white via-white to-blue-400">
      <h1 onClick={() => router.push("/")} className="absolute top-4 right-4 text-sm text-black font-bold cursor-pointer">{t.back}</h1>

      <div className=" text-left bg-blue-100 p-8 rounded-2xl shadow-lg w-[100%] max-w-md">

      <h1 className="text-l text-black font-bold mb-4">Logged Entries:</h1>
      <ul className="text-left">
        {!entries || entries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          entries.map((entry, index) => (
            <li key={index} className="text-xs mb-4 p-2 border-b text-black border-black">

              {/* Hier auskommentiert mögliche Anzeigen. Einfach aus dem Kommentar in die li drunter packen, falls 
                  sie angezeigt werden sollen. Trennung am besten mit zusätzlichem <br/>.
              
                  <strong>Emotion:</strong> {entry.emotion}
                  <strong>Intensity:</strong> {entry.intensity}
                  <strong>Notes:</strong> <pre className="whitespace-pre-wrap">{entry.notes}</pre>
                  <strong>Start Time:</strong> {entry.start_timestamp}
              */}
              
              {/* Hier lasse ich die Emotion und den Timestamp des Anlegens anzeigen.*/}
              <strong>{entry.emotion}:</strong> {entry.finish_timestamp}
            </li>
          ))
        )}
      </ul>
      </div>
      
    </div>
  );
}
