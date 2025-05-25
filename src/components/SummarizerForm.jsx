import React, { useState } from 'react';

// Menerima props baru: models, selectedModel, onModelChange
function SummarizerForm({ onSubmit, loading, models, selectedModel, onModelChange }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) { // Pastikan teks tidak kosong sebelum submit
      onSubmit(text);
      setText(''); // Bersihkan textarea setelah submit
    } else {
      alert('Silakan masukkan teks yang ingin diringkas.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4"> {/* Mengatur jarak antar elemen form */}
      <div>
        <label htmlFor="model-select" className="block text-gray-700 text-sm font-bold mb-2">
          Pilih Model AI:
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={loading} // Nonaktifkan saat loading
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
          Masukkan Teks:
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="6"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
          placeholder="Tulis atau tempel teks di sini..."
          required
          disabled={loading} // Nonaktifkan saat loading
        ></textarea>
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-300 ${
          loading ? 'bg-blue-300 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:shadow-outline`}
        disabled={loading} // Nonaktifkan tombol saat loading
      >
        {loading ? 'Meringkas...' : 'Ringkas Teks'}
      </button>
    </form>
  );
}

export default SummarizerForm;