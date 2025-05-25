import React, { useState, useEffect } from 'react';
import SummarizerForm from './components/SummarizerForm';
import SummaryOutput from './components/SummaryOutput';
import HistoryList from './components/HistoryList';
import SavedSummaries from './components/SavedSummaries';

// Import OpenAI SDK
import OpenAI from 'openai';

// Inisialisasi klien OpenAI untuk OpenRouter
// Pastikan Anda telah mengatur VITE_APP_OPENROUTER_API_KEY di .env.local untuk lokal,
// dan di Environment Variables Vercel untuk deployment.
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_APP_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true, // HANYA UNTUK KEPERLUAN PEMBELAJARAN/LOKAL. JANGAN PRODUKSI!
});

// --- DAFTAR MODEL AI YANG TERSEDIA ---
// Anda bisa menyesuaikan daftar ini berdasarkan model yang Anda inginkan dari OpenRouter.
// Kunjungi https://openrouter.ai/docs#models untuk daftar lengkap model, biaya, dan ketersediaan.
// Disarankan menggunakan model yang kuat untuk deteksi bahasa dan ringkasan berkualitas.
// PERHATIAN: GPT-3.5 dan Claude umumnya BERBAYAR di OpenRouter. Mistral 7B seringkali gratis.
const AVAILABLE_MODELS = [
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo (OpenAI)" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku (Anthropic)" },
  { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B Instruct (MistralAI)" },
  // Tambahkan model lain di sini jika diinginkan, contoh:
  // { id: "mistralai/mixtral-8x7b-instruct-v0.1", name: "Mixtral 8x7B Instruct (MistralAI) - Lebih Kuat" },
  // { id: "google/gemma-7b-it", name: "Gemma 7B Instruct (Google)" },
];

function App() {
  const [currentSummary, setCurrentSummary] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]); // Array of { original, summary, date }
  const [savedSummaries, setSavedSummaries] = useState([]); // Array of { original, summary, date, id }
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id); // Default ke model pertama

  // Load history and saved summaries from localStorage on initial render
  useEffect(() => {
    const storedHistory = localStorage.getItem('summarizerHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
    const storedSavedSummaries = localStorage.getItem('savedSummaries');
    if (storedSavedSummaries) {
      setSavedSummaries(JSON.parse(storedSavedSummaries));
    }
  }, []); // [] agar hanya berjalan sekali saat komponen mount

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('summarizerHistory', JSON.stringify(history));
  }, [history]); // Dipanggil setiap kali history berubah

  // Save savedSummaries to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savedSummaries', JSON.stringify(savedSummaries));
  }, [savedSummaries]); // Dipanggil setiap kali savedSummaries berubah

  const summarizeText = async (text) => {
    setLoading(true);
    setError('');
    setCurrentSummary('');
    setOriginalText(text); // Simpan teks asli untuk riwayat

    if (!text.trim()) {
      setError('Teks tidak boleh kosong.');
      setLoading(false);
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: selectedModel, // Menggunakan model yang dipilih dari state
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten ringkasan teks yang sangat membantu. Tugas Anda adalah memberikan ringkasan yang ringkas dan akurat. Deteksi bahasa dari teks yang diberikan dan berikan ringkasan dalam bahasa yang sama dengan teks aslinya. Jangan menerjemahkan jika tidak diminta. Fokus pada meringkas."
          },
          {
            role: "user",
            content: `Tolong ringkas teks berikut ini. Pastikan ringkasan dalam bahasa yang sama dengan teks aslinya:\n\n${text}`
          }
        ],
        temperature: 0.2, // Turunkan temperature untuk ringkasan yang lebih faktual dan kurang kreatif
        max_tokens: 200,  // Tingkatkan sedikit batas token untuk ringkasan yang lebih komprehensif
      });

      const summary = response.choices[0]?.message?.content; // Gunakan optional chaining untuk keamanan

      if (summary) {
        setCurrentSummary(summary);
        const newHistoryEntry = {
          original: text,
          summary: summary,
          date: new Date().toLocaleString(), // Menyimpan tanggal dan waktu
        };
        setHistory((prevHistory) => [newHistoryEntry, ...prevHistory]); // Tambahkan ke awal riwayat
      } else {
        setError('OpenRouter API tidak mengembalikan ringkasan. Coba lagi atau ganti model.');
      }

    } catch (err) {
      console.error("Error summarizing text with OpenRouter:", err);
      // Tangani berbagai jenis error API dengan pesan yang lebih informatif
      let errorMessage = 'Terjadi kesalahan pada API OpenRouter.';
      if (err.message) {
        errorMessage = `Gagal meringkas teks: ${err.message}`;
      } else if (err.status) {
        errorMessage = `Gagal meringkas teks: Status API ${err.status}.`;
      }
      setError(errorMessage);
      setCurrentSummary('');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menyimpan ringkasan saat ini ke daftar ringkasan yang disimpan
  // PASTIKAN FUNGSI INI BERADA DI DALAM KOMPONEN APP
  const saveCurrentSummary = () => {
    if (currentSummary && originalText) {
      // Periksa apakah ringkasan sudah ada di savedSummaries untuk menghindari duplikasi
      const isAlreadySaved = savedSummaries.some(item => item.original === originalText && item.summary === currentSummary);
      if (isAlreadySaved) {
        alert('Ringkasan ini sudah tersimpan!');
        return;
      }

      const newSavedSummary = {
        id: Date.now(), // ID unik berdasarkan timestamp
        original: originalText,
        summary: currentSummary,
        date: new Date().toLocaleString(),
      };
      setSavedSummaries((prevSaved) => [...prevSaved, newSavedSummary]); // Tambahkan ke akhir daftar
      alert('Ringkasan berhasil disimpan!');
    } else {
      alert('Tidak ada ringkasan yang bisa disimpan. Silakan ringkas teks terlebih dahulu.');
    }
  };

  // Fungsi untuk menghapus ringkasan dari daftar yang disimpan berdasarkan ID
  // PASTIKAN FUNGSI INI BERADA DI DALAM KOMPONEN APP
  const deleteSavedSummary = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ringkasan ini?")) {
      setSavedSummaries((prevSaved) => prevSaved.filter(summary => summary.id !== id));
    }
  };

  // Fungsi untuk menghapus semua riwayat ringkasan
  // PASTIKAN FUNGSI INI BERADA DI DALAM KOMPONEN APP
  const clearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat? Tindakan ini tidak dapat dibatalkan.")) {
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
        {/* Input & Output Section */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          {/* Meneruskan props yang diperlukan ke SummarizerForm */}
          <SummarizerForm
            onSubmit={summarizeText}
            loading={loading}
            models={AVAILABLE_MODELS}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
          <SummaryOutput summary={currentSummary} onSave={saveCurrentSummary} />
        </div>

        {/* History & Saved Summaries Section */}
        <div className="col-span-1 flex flex-col gap-8"> {/* Tambah flex-col dan gap untuk jarak antar komponen */}
          <HistoryList history={history} onClearHistory={clearHistory} />
          <SavedSummaries savedSummaries={savedSummaries} onDelete={deleteSavedSummary} />
        </div>
      </main>

      <footer className="text-center mt-10 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Text Summarizer AI. Dibuat dengan ❤️ dan React.</p>
        <p>Didukung oleh OpenRouter API dan Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;