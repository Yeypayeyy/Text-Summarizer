import React from 'react';

function SavedSummaries({ savedSummaries, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ringkasan Tersimpan</h2>
      {savedSummaries.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada ringkasan yang disimpan.</p>
      ) : (
        <ul className="max-h-60 overflow-y-auto pr-2">
          {savedSummaries.map((entry) => (
            <li key={entry.id} className="mb-3 p-3 bg-green-50 rounded-md border border-green-200 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-green-700">Tanggal: {entry.date}</p>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                >
                  Hapus
                </button>
              </div>
              <details>
                <summary className="cursor-pointer text-gray-700 font-medium hover:text-green-600">
                  Teks Asli (Klik untuk melihat)
                </summary>
                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{entry.original.substring(0, Math.min(entry.original.length, 200))}...</p>
              </details>
              <details className="mt-2">
                <summary className="cursor-pointer text-gray-700 font-medium hover:text-green-600">
                  Ringkasan Tersimpan (Klik untuk melihat)
                </summary>
                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{entry.summary}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedSummaries;