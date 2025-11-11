"use client";

import { useState } from "react";
import { useWordStore, Word } from "@/app/lib/storage";

type QuizSource = "favorites" | "last50" | "range";

export default function QuizPage() {
  const { words, favorites } = useWordStore();
  const [quizSource, setQuizSource] = useState<QuizSource | null>(null);
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [rangeEnd, setRangeEnd] = useState<number>(0);
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showResult, setShowResult] = useState(false);

  const shuffleArray = <T,>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);

  const speakText = (text: string, lang: string = "en-US") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateOptions = (correctWord: Word): string[] => {
    const options = [correctWord.meaning];
    const others = words.filter((w) => w.id !== correctWord.id);
    while (options.length < 4 && others.length > 0) {
      const randIndex = Math.floor(Math.random() * others.length);
      const option = others.splice(randIndex, 1)[0].meaning;
      if (!options.includes(option)) options.push(option);
    }
    return shuffleArray(options);
  };

  const startQuiz = () => {
    let selectedWords: Word[] = [];

    if (quizSource === "favorites") selectedWords = [...favorites];
    else if (quizSource === "last50") selectedWords = favorites.slice(-50);
    else if (quizSource === "range") {
      if (rangeStart > rangeEnd) {
        setErrorMsg("نطاق ID غير صحيح!");
        return;
      }
      selectedWords = words.filter((w) => w.id >= rangeStart && w.id <= rangeEnd);
      if (selectedWords.length === 0) {
        setErrorMsg("لا توجد كلمات في هذا النطاق!");
        return;
      }
    }

    if (selectedWords.length === 0) {
      setErrorMsg("لا توجد كلمات للاختبار!");
      return;
    }

    selectedWords = shuffleArray(selectedWords).slice(0, 25);

    setQuizWords(selectedWords);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setErrorMsg("");
    setQuizStarted(true);
    setShowResult(false);

    speakText(selectedWords[0].word);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);

    const correctAnswer = quizWords[currentIndex].meaning;
    if (answer === correctAnswer) setScore((prev) => prev + 4);
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;

    if (currentIndex + 1 < quizWords.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      speakText(quizWords[currentIndex + 1].word);
    } else {
      setShowResult(true);
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setQuizStarted(false);
    setQuizSource(null);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-6">اختبار الكلمات</h1>

        <div className="flex flex-col gap-4 mb-4 w-full max-w-md">
          <button
            className="p-3 bg-blue-600 rounded hover:bg-blue-500 transition"
            onClick={() => setQuizSource("favorites")}
          >
            جميع المفضلة
          </button>
          <button
            className="p-3 bg-green-600 rounded hover:bg-green-500 transition"
            onClick={() => setQuizSource("last50")}
          >
            آخر 50 كلمة مضافة للمفضلة
          </button>
          <button
            className="p-3 bg-yellow-600 rounded hover:bg-yellow-500 transition"
            onClick={() => setQuizSource("range")}
          >
            نطاق كلمات حسب ID
          </button>
        </div>

        {quizSource === "range" && (
          <div className="flex flex-col md:flex-row gap-2 mb-4 w-full max-w-md">
            <input
              type="number"
              placeholder="من"
              value={rangeStart}
              onChange={(e) => setRangeStart(parseInt(e.target.value || "0"))}
              className="w-full md:flex-1 p-2 rounded bg-gray-800 border border-gray-700"
            />
            <input
              type="number"
              placeholder="إلى"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(parseInt(e.target.value || "0"))}
              className="w-full md:flex-1 p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
        )}

        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        {quizSource && (
          <button
            onClick={startQuiz}
            className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-500 transition"
          >
            ابدأ الاختبار
          </button>
        )}
      </div>
    );
  }

  const currentWord = quizWords[currentIndex];
  const options = generateOptions(currentWord);
  const maxScore = quizWords.length * 4;
  const percentage = (score / maxScore) * 100;
  let level = "";
  let message = "";

  if (percentage >= 85) {
    level = "ممتاز 🎉";
    message = "أحسنت! استمر على هذا الأداء الرائع.";
  } else if (percentage >= 60) {
    level = "جيد 🙂";
    message = "عمل جيد، لكن يمكنك التحسن أكثر.";
  } else {
    level = "ضعيف 😕";
    message = "يجب مراجعة الكلمات أكثر، لا تيأس!";
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative">
      <h2 className="text-xl mb-4">
        السؤال {currentIndex + 1} من {quizWords.length}
      </h2>

      <p className="text-2xl font-bold mb-4">{currentWord.word}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 w-full max-w-md">
        {options.map((opt) => {
          const correctAnswer = currentWord.meaning;
          let bgColor = "bg-gray-800 hover:bg-gray-700";

          if (selectedAnswer) {
            if (opt === correctAnswer) bgColor = "bg-green-600";
            else bgColor = "bg-red-600";
          }

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className={`p-3 rounded border border-gray-700 transition ${bgColor}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <p className="mb-4">النقاط الحالية: {score}</p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={nextQuestion}
          className="flex-1 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          السؤال التالي
        </button>
        <button
          onClick={closeResult}
          className="flex-1 bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
        >
          إنهاء الاختبار
        </button>
      </div>

      {showResult && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">نتيجة الاختبار</h2>
            <p className="mb-2">
              مجموع النقاط: {score} من {maxScore}
            </p>
            <p className="mb-2 text-lg font-semibold">المستوى: {level}</p>
            <p className="mb-4">{message}</p>
            <button
              onClick={closeResult}
              className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-500 transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
