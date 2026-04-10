import { useState, useEffect } from "react";
import { translateText } from "../services/api";

const Translator = () => {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Auto-translate with debounce
  useEffect(() => {
    if (!text.trim()) return;
    const timer = setTimeout(() => handleTranslate(), 500);
    return () => clearTimeout(timer);
  }, [text, sourceLang, targetLang]);

  const handleTranslate = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setError("");

      const result = await translateText(text, sourceLang, targetLang);
      setTranslated(result || "No translation found");

      setHistory((prev) => [
        { text, translated: result },
        ...prev.slice(0, 2),
      ]);
    } catch {
      setError("Translation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translated);
    setTranslated("");
  };

  const handleCopy = async (value = translated) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Copy failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-gray-800">

        <h1 className="text-3xl font-bold text-center mb-6">
          🌍 AI Translator
        </h1>

        {/* Language Controls */}
        <div className="flex flex-wrap gap-3 mb-4 items-center justify-center">

          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="p-2 rounded bg-gray-50 border border-gray-300"
          >
            <option>English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>

          <button
            onClick={handleSwap}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            ⇄
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="p-2 rounded bg-gray-50 border border-gray-300"
          >
            <option value="hi">Hindi</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>

          <button
            onClick={handleTranslate}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Translate"
            )}
          </button>
        </div>

        {/* Input & Output */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">

          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="relative h-40 p-4 border border-gray-300 rounded-lg bg-gray-50">
            {loading ? (
              <p className="text-gray-500">Translating...</p>
            ) : (
              <p className="text-lg">{translated}</p>
            )}

            {translated && (
              <button
                onClick={() => handleCopy()}
                className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2">
              Recent Translations
            </h2>

            {history.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-3 rounded mb-2 text-sm cursor-pointer hover:bg-gray-200"
                onClick={() => setText(item.text)}
              >
                <p className="opacity-70">{item.text}</p>
                <p className="font-medium">{item.translated}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Translator;