import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImportGroupCSVProps {
  onImport: (groupName: string, contacts: { name: string; phone: string }[]) => void;
  onCancel: () => void;
}

const ImportGroupCSV: React.FC<ImportGroupCSVProps> = ({ onImport, onCancel }) => {
  const [groupName, setGroupName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !groupName) {
      setError('Please provide both group name and CSV file');
      return;
    }

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.trim()).filter(row => row);
      
      // Skip header row and parse contacts
      const contacts = rows.slice(1).map(row => {
        const [name, phone] = row.split(',').map(field => field.trim());
        return { name, phone };
      });

      if (contacts.length === 0) {
        setError('No contacts found in CSV file');
        return;
      }

      onImport(groupName, contacts);
    } catch (err) {
      setError('Error processing CSV file');
      console.error('Error processing CSV:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Import Group from CSV</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter group name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CSV File
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV file with name,phone columns</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: {file.name}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Import
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportGroupCSV; 