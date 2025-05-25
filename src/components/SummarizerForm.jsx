import React, { useState } from 'react';

function SummarizerForm({ onSubmit, loading, models, selectedModel, onModelChange }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    } else {
      alert('Please enter text to summarize.'); // Changed alert
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="model-select" className="block text-gray-700 text-sm font-bold mb-2">
          Select AI Model: {/* Changed text */}
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={loading}
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
          Enter Your Text: {/* Changed text */}
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="6"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
          placeholder="Type or paste text here..." // Changed placeholder
          required
          disabled={loading}
        ></textarea>
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-300 ${
          loading ? 'bg-blue-300 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:shadow-outline`}
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Summarize Text'} {/* Changed text */}
      </button>
    </form>
  );
}

export default SummarizerForm;