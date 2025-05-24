import React, { useState } from 'react';

function SummarizerForm({ onSubmit, loading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    } else {
      alert('Silakan masukkan teks yang ingin diringkas.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input Teks Anda</h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-40 resize-y"
        placeholder="Masukkan teks yang ingin diringkas di sini..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      ></textarea>
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-300 ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={loading}
      >
        {loading ? 'Meringkas...' : 'Ringkas Teks'}
      </button>
    </form>
  );
}

export default SummarizerForm;