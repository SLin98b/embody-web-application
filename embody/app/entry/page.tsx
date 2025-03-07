"use client";
import { useState, useEffect } from "react";
import BodySilhouette from "../components/BodySilhouette";
import { useRouter } from "next/navigation";

import { useLanguage } from "../context/LanguageContext";
import { translations } from "../locales";



export default function EntryPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);
  const [step, setStep] = useState(1);


  const [customEmotion, setCustomEmotion] = useState("");
  const [emotion, setEmotion] = useState("");



  const [intensity, setIntensity] = useState<number>(50);
  const [startTimestamp, setStartTimestamp] = useState<string>(() => new Date().toISOString());
  const [notes, setNotes] = useState("");
  const emotions = t.emotions;

  //randomisierte Darstellung der Emotionen. Benutzung nur bei Änderung im HTML Teil
  const shuffledEmotions = [...emotions].sort(() => Math.random() - 0.5); 

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  /* Hier wird ist die Zuordnung zu Körperteilen. Ich habe bewusst if Bedinungen gewählt, damit es möglichst leicht erweiterbar/kürzbar ist.
  Die Zuordnung erfolgt über Koordinatenbedingungen. Falls keine Bedingung zutrifft, wird Torso/body zurückgegeben. */
  const getBodyPart = (x: number, y: number): string => {
    if (y > 355 && x < 109) return "right leg";
    if (y > 355 && x >= 109) return "left leg";
    if (x < 58) return "right arm";
    if (x > 175) return "left arm";
    if (y < 90) return "head";
    return "body"; 
  };

  // Sobald die newEntry Seite geladen wird, wird der Startzeitpunkt und damit der Timestamp 1 gesetzt.
  useEffect(() => {
    setStartTimestamp(new Date().toISOString()); 
  }, []);


  interface Position {
    x: number;
    y: number;
  }

  const handleBodyClick = (position: Position) => {
    setSelectedPosition(position);
  };




  const saveEntry = async () => {

    // checkt ob benutzerdefinierte Emotionseingabe erfolgt ist oder eine ausgewählt wurde
    const finalEmotion = customEmotion.trim() !== "" ? customEmotion : emotion; 

    

    if (!finalEmotion) {
      console.error("keine Emotion gewählt");
      return;
    }


    if (!selectedPosition || !finalEmotion || !notes || !startTimestamp) {
      console.error("Fehlende Eingaben:", { selectedPosition, emotion, notes, startTimestamp });
      return;
    }

    // finish Button wird deaktiviert
    setIsSaving(true); 

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("keine User ID");
      return;
    }

    // macht timestamp bei Klick auf finish Button
    const finishTimestamp = new Date().toISOString(); 

    // checkt an welcher Körperstelle geklickt wurde
    const bodyPart = getBodyPart(selectedPosition.x, selectedPosition.y);
    
    const newEntry = {
      id: userId,
      x: selectedPosition.x,
      y: selectedPosition.y,
      emotion: finalEmotion,
      intensity,
      notes,
      start_timestamp: startTimestamp,
      finish_timestamp: finishTimestamp,
      body_part: bodyPart,
    };

    console.log("gesendete daten:", newEntry);


    const response = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: localStorage.getItem("userId"),
        x: selectedPosition.x,
        y: selectedPosition.y,
        emotion: finalEmotion,
        intensity,
        notes,
        start_timestamp: startTimestamp, 
        finish_timestamp: new Date().toISOString(),
        body_part: bodyPart,
      }),
    });


    // const responseData = await response.json();
    // console.log("response date:", responseData);


    if (!response.ok) {
      console.error("Fehler beim Speichern", await response.text());
    } else {
      setShowSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }

    setSelectedPosition(null);
    setEmotion("");
    setIntensity(5);
    setNotes("");


  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-h-screen px-4 sm:px-8 md:px-16 lg:px-32 py-6 sm:py-10 md:py-20 lg:py-48 bg-gradient-to-t from-white via-white to-blue-400"
    >
      <h1 onClick={() => router.push("/")} className="absolute top-4 right-4 text-sm text-black font-bold cursor-pointer">{t.cancel}</h1>

      {/* Körperkarte und Positionsauswahl */}
      {step === 1 && (
        <>

          <div className="flex flex-col items-center">
            <BodySilhouette onBodyClick={handleBodyClick} selectedPosition={selectedPosition} />
          </div>
          
          {!selectedPosition ? ( 
            // tauscht Text und Confirm Button
            <h1 className="font-bold text-center text-xs text-black mb-2">
              {t.pleaseTouchInstruction}
            </h1>
          ) : ( 
            <button
              className="px-6 py-3 w-48 font-bold bg-white border-blue-400 text-blue-500 rounded-xl border-2 shadow-md hover:bg-blue-100"
              onClick={() => setStep(2)}
            >
              {t.confirm}
            </button>
          )}

        </>
      )}

      {/* Emotionsauswahl*/}
      {step === 2 && (
        <>

          <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-blue-100 p-8 rounded-2xl shadow-lg w-[100%] max-w-md">

              <h1 className="text-xl font-bold text-black mb-2">{t.whatEmotion}</h1>
              <p className="text-sm text-black mb-4">{t.whatEmotionSubtext}</p>
              <div className="flex flex-wrap gap-2 justify-center">

                {/* Für das randomisieren der Emotionen 
                "{emotions.map((e) => (" 
                in 
                "{shuffledEmotions.map((e) => ("
                ändern.  */}
                {emotions.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setEmotion(e);
                      setCustomEmotion("");
                    }}
                    className={`px-5 py-1 text-sm font-medium rounded-xl shadow whitespace-nowrap ${emotion === e ? "bg-blue-500 text-black" : "bg-white text-black hover:bg-gray-100"
                      }`}
                  >
                    {e}
                  </button>
                ))}

                {/* Freitextfeld für custom Emotionen. In className "hidden" entfernen, damit es angezeigt wird.  */}
                <input
                  type="text"
                  placeholder="..."
                  value={customEmotion}
                  onChange={(e) => {
                    setCustomEmotion(e.target.value);
                    setEmotion("");
                  }}
                  className="hidden px-5 py-1 text-sm font-medium rounded-xl shadow border bg-blue-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button className="mt-6 px-6 py-3 bg-opacity-0 text-blue-700 font-medium rounded-lg hover:bg-blue-200" onClick={() => setStep(step - 1)}>{t.back}</button>
                <button
                  className={`mt-6 px-6 py-3 border-blue-400 border-2 text-blue-700 rounded-lg shadow-md hover:bg-blue-200 ${!emotion && !customEmotion.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => setStep(3)}
                  disabled={!emotion && !customEmotion.trim()}
                >{t.next}</button>
              </div>


            </div>
          </div>
        </>
      )}


      {/* Intensitätsslider*/}
      {step === 3 && (
        <>
          <div className=" min-h-screen max-h-screen flex flex-col items-center justify-center h-screen">
            <div className="bg-blue-100 p-8 rounded-2xl shadow-lg w-[100%] max-w-md">


              <h1 className="text-xl font-bold text-black mb-2" >{t.howStrongly}</h1>
              <p className="text-sm text-black mb-4">{t.howStronglySubtext}</p>


              <div className="flex flex-col gap-8 relative mb-6 mt-10" >
                <div className="text-black w-full flex justify-between text-xs ">
                  {/* Hier die Beschriftung des Sliders. Falls man etwas anpassen möchte wäre hier die Stelle dazu.*/}
                  <span className="rotate-45">{t.sliderText1}</span>
                  <span className="rotate-45">{t.sliderText2}</span>
                  <span className="rotate-45">{t.sliderText3}</span>
                  <span className="rotate-45">{t.sliderText4}</span>
                  <span className="rotate-45">{t.sliderText5}</span>
                </div>
                {/* Sliderwerte sind hier in min="" und max="" abgebildet. Beispielsweise max="100" setzen für 100 verschiedene Werte.*/}
                <input className="w-full h-2 bg-gray-300 rounded-lg mt-10px" type="range" min="1" max="5" value={intensity} onChange={(e) => setIntensity(+e.target.value)} />


              </div>

              <div className="flex justify-between">
                <button className="mt-6 px-6 py-3 bg-opacity-0 text-blue-700 font-medium rounded-lg hover:bg-blue-200" onClick={() => setStep(step - 1)}>{t.back}</button>
                <button className="mt-6 px-6 py-3 border-blue-400 border-2 bg-opacity-0 text-blue-700 font-medium rounded-lg shadow-md hover:bg-blue-200" onClick={() => setStep(4)}>{t.next}</button>
              </div>

            </div>
          </div>

        </>
      )}

      {/* Freitextfeld zur Situation und Finish Button*/}
      {step === 4 && (
        <>
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-blue-100 p-8 rounded-2xl shadow-lg w-[100%] max-w-md">

              <h1 className="text-xl font-bold text-black mb-2">{t.situationQuestion}</h1>
              <p className="text-sm text-black mb-4">{t.situationQuestionSubtext}</p>
              <textarea className="w-full p-3 rounded-lg border bg-blue-50 border-gray-300 focus:ring-2 text-black focus:ring-blue-500" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} />


              <div className="flex justify-between">
                <button className="mt-6 px-6 py-3 bg-opacity-0 text-blue-700 font-medium rounded-lg hover:bg-blue-200" onClick={() => setStep(step - 1)}>{t.back}</button>
                <button className="mt-6 px-6 py-3 border-blue-400 border-2 bg-opacity-0 text-blue-700 font-medium rounded-lg shadow-md hover:bg-blue-200" disabled={isSaving} onClick={saveEntry}>{isSaving ? t.saving : t.finish}</button>

              </div>
              {showSuccess && <p className="mt-4 text-green-600">{t.successfulSave}</p>}


            </div>
          </div>

        </>
      )}
    </div>
  );
}
