import React, { useState, useEffect } from 'react';
import SummarizerForm from './components/SummarizerForm';
import SummaryOutput from './components/SummaryOutput';
import HistoryList from './components/HistoryList';
import SavedSummaries from './components/SavedSummaries';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_APP_OPENROUTER_API_KEY, // Pastikan ini
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// Pilih model yang ingin Anda gunakan dari OpenRouter.
// Untuk deteksi bahasa otomatis, disarankan model yang lebih besar/multibahasa.
// Contoh: "openai/gpt-3.5-turbo" atau "openai/gpt-4o" (jika Anda memiliki kredit/akses)
// Atau model open-source multibahasa yang kuat seperti Mixtral, namun GPT seringkali lebih baik untuk deteksi bahasa ini.
const AI_MODEL = "openai/gpt-3.5-turbo"; // <-- Coba ini atau model yang lebih kuat/multibahasa

function App() {
  const [currentSummary, setCurrentSummary] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [savedSummaries, setSavedSummaries] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('summarizerHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
    const storedSavedSummaries = localStorage.getItem('savedSummaries');
    if (storedSavedSummaries) {
      setSavedSummaries(JSON.parse(storedSavedSummaries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('summarizerHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('savedSummaries', JSON.stringify(savedSummaries));
  }, [savedSummaries]);

  const summarizeText = async (text) => {
    setLoading(true);
    setError('');
    setCurrentSummary('');
    setOriginalText(text);

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten ringkasan teks. Tugas Anda adalah memberikan ringkasan yang ringkas dan akurat. Deteksi bahasa dari teks yang diberikan dan berikan ringkasan dalam bahasa yang sama dengan teks aslinya." // <-- Instruksi kunci untuk deteksi bahasa
          },
          {
            role: "user",
            content: `Tolong ringkas teks berikut ini. Pastikan ringkasan dalam bahasa yang sama dengan teks aslinya:\n\n${text}` // <-- Penegasan di prompt user
          }
        ],
        temperature: 0.2, // Turunkan temperature untuk ringkasan yang lebih faktual dan kurang kreatif
        max_tokens: 150,
      });

      const summary = response.choices[0].message.content;

      if (summary) {
        setCurrentSummary(summary);
        const newHistoryEntry = {
          original: text,
          summary: summary,
          date: new Date().toLocaleString(),
        };
        setHistory((prevHistory) => [newHistoryEntry, ...prevHistory]);
      } else {
        setError('OpenRouter API tidak mengembalikan ringkasan.');
      }

    } catch (err) {
      console.error("Error summarizing text with OpenRouter:", err);
      setError(`Gagal meringkas teks: ${err.message || 'Terjadi kesalahan pada OpenRouter API.'}`);
      setCurrentSummary('');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentSummary = () => {
    if (currentSummary && originalText) {
      const newSavedSummary = {
        id: Date.now(),
        original: originalText,
        summary: currentSummary,
        date: new Date().toLocaleString(),
      };
      setSavedSummaries((prevSaved) => [...prevSaved, newSavedSummary]);
      alert('Ringkasan berhasil disimpan!');
    } else {
      alert('Tidak ada ringkasan untuk disimpan.');
    }
  };

  const deleteSavedSummary = (id) => {
    setSavedSummaries((prevSaved) => prevSaved.filter(summary => summary.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Text Summarizer AI</h1>
        <p className="text-gray-600 mt-2">Ringkas teks Anda dengan cepat dan mudah!</p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <SummarizerForm onSubmit={summarizeText} loading={loading} />
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          <SummaryOutput summary={currentSummary} onSave={saveCurrentSummary} />
        </div>

        <div className="col-span-1">
          <HistoryList history={history} onClearHistory={clearHistory} />
          <SavedSummaries savedSummaries={savedSummaries} onDelete={deleteSavedSummary} />
        </div>
      </main>

      <footer className="text-center mt-10 text-gray-500">
        <p>&copy; {new Date().getFullYear()} Text Summarizer AI. Dibuat dengan ❤️ dan React.</p>
      </footer>
    </div>
  );
}

export default App;