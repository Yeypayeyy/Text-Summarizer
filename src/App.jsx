import React, { useState, useEffect } from 'react';
import SummarizerForm from './components/SummarizerForm';
import SummaryOutput from './components/SummaryOutput';
import HistoryList from './components/HistoryList';
import SavedSummaries from './components/SavedSummaries';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_APP_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

const AVAILABLE_MODELS = [
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo (OpenAI)" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku (Anthropic)" },
  { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B Instruct (MistralAI)" },
];

function App() {
  const [currentSummary, setCurrentSummary] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);

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

    if (!text.trim()) {
      setError('Text cannot be empty.'); // Changed from "Teks tidak boleh kosong."
      setLoading(false);
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes text. You will only answer with the summary of the text. Do not add any additional information or context." // Changed system prompt
          },
          {
            role: "user",
            content: `Summarize the following text without any addition answer.:\n\n${text}` // Changed user prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 200,
      });

      const summary = response.choices[0]?.message?.content;

      if (summary) {
        setCurrentSummary(summary);
        const newHistoryEntry = {
          original: text,
          summary: summary,
          date: new Date().toLocaleString(),
        };
        setHistory((prevHistory) => [newHistoryEntry, ...prevHistory]);
      } else {
        setError('OpenRouter API did not return a summary. Please try again or change the model.'); // Changed error message
      }

    } catch (err) {
      console.error("Error summarizing text with OpenRouter:", err);
      let errorMessage = 'An error occurred with the OpenRouter API.'; // Changed error message
      if (err.message) {
        errorMessage = `Failed to summarize text: ${err.message}`; // Changed error message
      } else if (err.status) {
        errorMessage = `Failed to summarize text: API status ${err.status}.`; // Changed error message
      }
      setError(errorMessage);
      setCurrentSummary('');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentSummary = () => {
    if (currentSummary && originalText) {
      const isAlreadySaved = savedSummaries.some(item => item.original === originalText && item.summary === currentSummary);
      if (isAlreadySaved) {
        alert('This summary is already saved!'); // Changed alert
        return;
      }

      const newSavedSummary = {
        id: Date.now(),
        original: originalText,
        summary: currentSummary,
        date: new Date().toLocaleString(),
      };
      setSavedSummaries((prevSaved) => [...prevSaved, newSavedSummary]);
      alert('Summary successfully saved!'); // Changed alert
    } else {
      alert('No summary to save. Please summarize text first.'); // Changed alert
    }
  };

  const deleteSavedSummary = (id) => {
    if (window.confirm("Are you sure you want to delete this summary?")) { // Changed confirm
      setSavedSummaries((prevSaved) => prevSaved.filter(summary => summary.id !== id));
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) { // Changed confirm
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Text Summarizer AI</h1>
        <p className="text-gray-600 mt-2">Summarize your text quickly and easily!</p> {/* Changed text */}
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
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

        <div className="col-span-1 flex flex-col gap-8">
          <HistoryList history={history} onClearHistory={clearHistory} />
          <SavedSummaries savedSummaries={savedSummaries} onDelete={deleteSavedSummary} />
        </div>
      </main>

      <footer className="text-center mt-10 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Text Summarizer AI. Built with ❤️ and React.</p> {/* Changed text */}
        <p>Powered by OpenRouter API and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;