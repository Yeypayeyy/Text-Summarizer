import React from 'react';

function SummaryOutput({ summary, onSave }) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hasil Ringkasan</h2>
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-md min-h-[120px] max-h-96 overflow-auto relative">
        {summary ? (
          <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
        ) : (
          <p className="text-gray-500 italic">Ringkasan akan muncul di sini setelah Anda memasukkan teks.</p>
        )}
      </div>
      {summary && (
        <button
          onClick={onSave}
          className="mt-4 w-full py-2 px-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300"
        >
          Simpan Ringkasan
        </button>
      )}
    </div>
  );
}

export default SummaryOutput;