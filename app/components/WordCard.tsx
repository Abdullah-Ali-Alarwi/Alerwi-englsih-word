// components/WordCard.tsx
interface WordCardProps {
  id: number; 
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

export default function WordCard({ id, word, meaning, example, exampleTranslation }: WordCardProps) {
  const speakText = (text: string, lang: string = "en-US") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis not supported in this browser.");
    }
  };

  return (
    <div className="bg-gray-800 text-gray-100 p-4 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow space-y-3">
      <p className="text-sm text-gray-400">{id}</p>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-yellow-400">{word}</h2>
        <button
          onClick={() => speakText(word)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          🔊
        </button>
      </div>

      <p className="text-gray-200">
        <span className="font-semibold text-green-400">Meaning:</span> {meaning}
      </p>

      <div className="flex items-center justify-between">
        <p className="text-gray-300">
          <span className="font-semibold text-blue-400">Example:</span> {example}
        </p>
        <button
          onClick={() => speakText(example)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          🔊
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          <span className="font-semibold text-pink-400">Translation:</span> {exampleTranslation}
        </p>
        <button
          onClick={() => speakText(exampleTranslation, "ar-SA")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          🔊
        </button>
      </div>
    </div>
  );
}
