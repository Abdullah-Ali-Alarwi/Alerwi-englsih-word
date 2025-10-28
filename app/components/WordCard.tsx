// components/WordCard.tsx
interface WordCardProps {
  id: number; // رقم الكلمة
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

export default function WordCard({ id, word, meaning, example, exampleTranslation }: WordCardProps) {
  return (
    <div className="bg-gray-800 text-gray-100 p-4 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-shadow">
      {/* رقم الكلمة أعلى البطاقة */}
      <p className="text-sm text-gray-400 mb-1">{id}</p>

      <h2 className="text-xl font-bold text-yellow-400 mb-2">{word}</h2>
      <p className="text-gray-200 mb-2">
        <span className="font-semibold text-green-400">Meaning:</span> {meaning}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold text-blue-400">Example:</span> {example}
      </p>
      <p className="text-gray-400">
        <span className="font-semibold text-pink-400">Translation:</span> {exampleTranslation}
      </p>
    </div>
  );
}
