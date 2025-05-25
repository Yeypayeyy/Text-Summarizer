import React from 'react';

function SummaryOutput({ summary, onSave }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Summary Output:</h2> {/* Changed text */}
      {summary ? (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <p className="text-gray-800">{summary}</p>
          <button
            onClick={onSave}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Summary {/* Changed text */}
          </button>
        </div>
      ) : (
        <p className="text-gray-600">No summary to display.</p>
      )}
    </div>
  );
}

export default SummaryOutput;