// File: src/components/SavedSummaries.jsx

import React from 'react';

function SavedSummaries({ savedSummaries, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Saved Summaries:</h2> {/* Changed text */}
      {savedSummaries.length > 0 ? (
        <ul className="max-h-60 overflow-y-auto pr-2 divide-y divide-gray-200">
          {savedSummaries.map((item) => (
            <li key={item.id} className="py-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-green-700">Date: {item.date}</p> {/* Changed text */}
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition duration-300 focus:outline-none focus:shadow-outline"
                >
                  Delete {/* Changed text */}
                </button>
              </div>
              <details>
                <summary className="cursor-pointer text-gray-700 font-medium hover:text-green-600">
                  Original Text (Click to view) {/* Changed text */}
                </summary>
                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{item.original.substring(0, Math.min(item.original.length, 200))}...</p>
              </details>
              <details className="mt-2">
                <summary className="cursor-pointer text-gray-700 font-medium hover:text-green-600">
                  Saved Summary (Click to view) {/* Changed text */}
                </summary>
                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{item.summary}</p>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        // BARIS INI YANG PERLU DIPERHATIKAN, PASTIKAN HANYA ADA SATU KURUNG KURAWAL JIKA DIBUTUHKAN UNTUK KOMENTAR
        <p className="text-gray-600 italic">No summaries saved yet.</p> /* Changed text */
      )}
    </div>
  );
}

export default SavedSummaries;