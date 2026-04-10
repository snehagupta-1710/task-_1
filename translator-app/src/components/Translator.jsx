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
    ...prev.slice(0, 2),  // Only keep 3 items  
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
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">

  <div className="w-full max-w-4xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 text-white">  

    <h1 className="text-3xl font-bold text-center mb-6">🌍 AI Translator</h1>  

    {/* Language Controls */}  
    <div className="flex gap-3 mb-4 items-center justify-center">  

      <select  
        value={sourceLang}  
        onChange={(e) => setSourceLang(e.target.value)}  
        className="p-2 rounded bg-white/20 text-white"  
      >  
        <option value="en" className="text-black">English</option>  
        <option value="hi" className="text-black">Hindi</option>  
        <option value="es" className="text-black">Spanish</option>  
        <option value="fr" className="text-black">French</option>  
        <option value="de" className="text-black">German</option>  
      </select>  

      <button  
        onClick={handleSwap}  
        className="px-3 py-2 bg-white text-black rounded hover:bg-gray-200"  
      >⇄</button>  

      <select  
        value={targetLang}  
        onChange={(e) => setTargetLang(e.target.value)}  
        className="p-2 rounded bg-white/20 text-white"  
      >  
        <option value="hi" className="text-black">Hindi</option>  
        <option value="en" className="text-black">English</option>  
        <option value="es" className="text-black">Spanish</option>  
        <option value="fr" className="text-black">French</option>  
        <option value="de" className="text-black">German</option>  
      </select>  

      <button  
        onClick={handleTranslate}  
        disabled={loading}  
        className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"  
      >  
        {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : "Go"}  
      </button>  
    </div>  

    {/* Translation Area: Side-by-side Input/Output */}  
    <div className="grid md:grid-cols-2 gap-4 mb-4">  

      <textarea  
        className="w-full h-40 p-4 border border-white/30 rounded-lg bg-white/20 resize-none focus:outline-none"  
        placeholder="Enter text..."  
        value={text}  
        onChange={(e) => setText(e.target.value)}  
      />  

      <div className="relative h-40 p-4 border border-white/30 rounded-lg bg-white/20">  
        {loading ? (  
          <p className="text-gray-200">Translating...</p>  
        ) : (  
          <p className="text-lg">{translated}</p>  
        )}  

        {translated && (  
          <button  
            onClick={() => handleCopy()}  
            className="absolute top-2 right-2 text-xs bg-green-500 px-2 py-1 rounded hover:bg-green-600"  
          >{copied ? "Copied ✓" : "Copy"}</button>  
        )}  
      </div>  

    </div>  

    {/* Error */}  
    {error && <p className="text-red-300 text-sm mb-3">{error}</p>}  

    {/* Recent Translations (max 3) */}  
    {history.length > 0 && (  
      <div className="mt-4">  
        <h2 className="text-sm font-semibold mb-2">Recent Translations</h2>  

        {history.map((item, index) => (  
          <div  
            key={index}  
            className="bg-white/20 p-3 rounded mb-2 text-sm cursor-pointer hover:bg-white/30"  
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