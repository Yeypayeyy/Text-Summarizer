import React from 'react';

function HistoryList({ history, onClearHistory }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Summary History:</h2> {/* Changed text */}
      {history.length > 0 ? (
        <ul className="max-h-60 overflow-y-auto pr-2 divide-y divide-gray-200">
          {history.map((item, index) => (
            <li key={index} className="py-4">
              <p className="text-sm text-gray-500">Date: {item.date}</p> {/* Changed text */}
              <details>
                <summary className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
                  Original Text (Click to view) {/* Changed text */}
                </summary>
                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{item.original.substring(0, Math.min(item.original.length, 200))}...</p>
              </details>
              <details className="mt-2">
                <summary className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
                  Summary (Click to view) {/* Changed text */}
                </summary>
                <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{item.summary}</p>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        // BARIS INI YANG PERLU DIPERHATIKAN. PASTIKAN HANYA ADA SATU KURUNG KURAWAL JIKA DIBUTUHKAN UNTUK KOMENTAR.
        <p className="text-gray-600 italic">No summary history yet.</p> 
      )}
      {history.length > 0 && (
        <button
          onClick={onClearHistory}
          className="mt-4 w-full py-2 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300 focus:outline-none focus:shadow-outline"
        >
          Clear History {/* Changed text */} 
        </button>
      )}
    </div>
  );
}

export default HistoryList;