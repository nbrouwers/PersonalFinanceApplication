import React, { useState } from 'react';
import { formatEuro, formatDate } from '../utils/format';

const CsvUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/v1/import/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>CSV Import</h2>
      <form onSubmit={handleUpload}>
        <div>
          <label htmlFor="csv-file">Select CSV file:</label>
          <input type="file" id="csv-file" accept=".csv" onChange={handleFileChange} disabled={uploading} />
        </div>
        <button type="submit" disabled={uploading || !selectedFile}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {result && (
        <div className="success">
          <p>{result.message}</p>
          <p>Imported: {result.imported_count} transactions</p>
          <p>Duplicates skipped: {result.duplicate_count}</p>
          {result.duplicates && result.duplicates.length > 0 && (
            <div>
              <h3>Duplicates Detected:</h3>
              <ul>
                {result.duplicates.map((dup, index) => (
                  <li key={index}>
                    {formatDate(dup.date)}: {dup.description} — {formatEuro(dup.amount)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CsvUpload;