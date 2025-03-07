import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Supabase Client initiallisieren
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// get request der Einträge
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  //if (!userId) {
  //  return new NextResponse(JSON.stringify({ error: "user id fehlt" }));
  //}

  //console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  //console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "key" : "kein key");


  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", userId)
    



  if (error) {
    console.error("Fehler beim Abrufen der Einträge:", error);
    return new NextResponse(JSON.stringify({ error: "Fehler beim Abrufen" }));
  }

  


if (!Array.isArray(data)) {
  console.error("Fehler: Supabase hat kein Array zurückgegeben", data);
  return new NextResponse(JSON.stringify([]));
}


  return new NextResponse(JSON.stringify(data));
}


export async function POST(req: Request) {
  try {
    const requestData = await req.json();


    const { user_id, x, y, emotion, intensity, notes, start_timestamp, finish_timestamp, body_part } = requestData;

  
    // Falls `body_part` undefined oder null ist wird daraus ein leerer String
    const safeBodyPart = body_part || "";

    // Falls `emotion` leer ist, wird "unknown" gespeichert
    const finalEmotion = emotion && emotion.trim() !== "" ? emotion : "(unknown)"; 

    
   // console.log("speichern in supabase:", { emotion: finalEmotion, body_part });

    const { data, error } = await supabase.from("entries").insert([
      {
        id: uuidv4(),
        user_id,
        x,
        y,
        emotion: finalEmotion,
        intensity,
        notes,
        start_timestamp,
        finish_timestamp,
        body_part: safeBodyPart,
      },
    ]).select("*"); 

    if (error) {
      console.error("fehler bei supabase:", error);
      return new Response(JSON.stringify({ error: error.message }));
    }

    console.log("Entry erfolgreich gesaved:", data);
    return new Response(JSON.stringify(data));

  } catch (err) {
    console.error("API fehler", err);
    return new Response(JSON.stringify({ error: "Server-Fehler" }));
  }
}


