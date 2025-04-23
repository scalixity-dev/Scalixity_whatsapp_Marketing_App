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
  const [preview, setPreview] = useState<{ name: string; phone: string }[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
      
      try {
        // Generate preview
        const text = await selectedFile.text();
        const rows = text.split('\n').map(row => row.trim()).filter(row => row);
        
        if (rows.length <= 1) {
          setError('CSV file must contain header row and at least one contact');
          setPreview([]);
          return;
        }
        
        // Check header row
        const headerRow = rows[0].toLowerCase();
        if (!headerRow.includes('name') || !headerRow.includes('phone')) {
          setError('CSV file must have columns for "name" and "phone"');
          setPreview([]);
          return;
        }
        
        // Parse header to find column indices
        const headers = headerRow.split(',').map(h => h.trim());
        const nameIndex = headers.findIndex(h => h === 'name');
        const phoneIndex = headers.findIndex(h => h === 'phone');
        
        if (nameIndex === -1 || phoneIndex === -1) {
          setError('Could not find required "name" and "phone" columns');
          setPreview([]);
          return;
        }
        
        // Parse contacts with correct column mapping
        const contactPreviews = rows.slice(1, 4).map(row => {
          const fields = row.split(',').map(field => field.trim());
          return {
            name: fields[nameIndex] || '',
            phone: fields[phoneIndex] || ''
          };
        });
        
        setPreview(contactPreviews);
      } catch (err) {
        setError('Error processing CSV file');
        setPreview([]);
        console.error('Error processing CSV:', err);
      }
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
      setPreview([]);
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
      
      if (rows.length <= 1) {
        setError('CSV file must contain header row and at least one contact');
        return;
      }
      
      // Parse header to find column indices
      const headers = rows[0].toLowerCase().split(',').map(h => h.trim());
      const nameIndex = headers.findIndex(h => h === 'name');
      const phoneIndex = headers.findIndex(h => h === 'phone');
      
      if (nameIndex === -1 || phoneIndex === -1) {
        setError('Could not find required "name" and "phone" columns');
        return;
      }
      
      // Parse contacts with correct column mapping
      const contacts = rows.slice(1).map(row => {
        const fields = row.split(',').map(field => field.trim());
        return {
          name: fields[nameIndex] || '',
          phone: fields[phoneIndex] || ''
        };
      }).filter(contact => contact.name && contact.phone);

      if (contacts.length === 0) {
        setError('No valid contacts found in CSV file');
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
        
        {preview.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Preview</h3>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 px-2">Name</th>
                    <th className="text-left py-1 px-2">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((contact, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-1 px-2">{contact.name}</td>
                      <td className="py-1 px-2">{contact.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 3 && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  Showing first 3 contacts of {preview.length}
                </p>
              )}
            </div>
          </div>
        )}

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