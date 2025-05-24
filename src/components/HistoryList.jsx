import React from 'react';

function HistoryList({ history, onClearHistory }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Riwayat Ringkasan</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada riwayat ringkasan.</p>
      ) : (
        <>
          <ul className="max-h-60 overflow-y-auto pr-2">
            {history.map((entry, index) => (
              <li key={index} className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm font-semibold text-blue-700 mb-1">Tanggal: {entry.date}</p>
                <details>
                  <summary className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
                    Teks Asli (Klik untuk melihat)
                  </summary>
                  <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{entry.original.substring(0, Math.min(entry.original.length, 200))}...</p>
                </details>
                <details className="mt-2">
                  <summary className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
                    Ringkasan (Klik untuk melihat)
                  </summary>
                  <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{entry.summary}</p>
                </details>
              </li>
            ))}
          </ul>
          <button
            onClick={onClearHistory}
            className="mt-4 w-full py-2 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300"
          >
            Hapus Riwayat
          </button>
        </>
      )}
    </div>
  );
}

export default HistoryList;