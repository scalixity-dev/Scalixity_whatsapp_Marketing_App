import React, { useState } from 'react';
import { UploadCloud, File, X, Check } from 'lucide-react';

interface ImportCSVFormProps {
  onImport: (csvData: string) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const ImportCSVForm: React.FC<ImportCSVFormProps> = ({ onImport, isLoading, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFileSelection(selectedFile);
    }
  };
  
  const handleFileSelection = (selectedFile: File) => {
    setErrorMessage(null);
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file.');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      setErrorMessage('File size exceeds 5MB limit.');
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setErrorMessage(null);
  };
  
  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage('Please select a CSV file to import.');
      return;
    }
    
    try {
      const fileContent = await readFileAsText(file);
      await onImport(fileContent);
    } catch (error) {
      setErrorMessage('Error reading the file. Please try again.');
      console.error('Error reading file:', error);
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file.'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Import Contacts</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div>
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag &amp; drop your CSV file here, or
            </p>
            <label className="mt-2 inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 cursor-pointer">
              Browse Files
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="mt-3 text-xs text-gray-500">
              Supported format: CSV. Max file size: 5MB
            </p>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="flex items-center p-2 bg-gray-100 rounded-md flex-1">
              <File className="h-6 w-6 text-emerald-600 mr-2" />
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB • CSV
                </p>
              </div>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={handleRemoveFile}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {errorMessage && (
        <div className="mt-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}
      
      <div className="mt-5">
        <h3 className="text-sm font-medium text-gray-700 mb-2">CSV Format Requirements:</h3>
        <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
          <li>First row should contain column headers</li>
          <li>Include columns for name and phone number</li>
          <li>Additional columns like company and position are optional</li>
          <li>Phone numbers should include country code (e.g., +1234567890)</li>
        </ul>
        
        <div className="mt-4 text-xs text-gray-500 p-3 bg-gray-50 rounded-md">
          <p className="font-medium mb-1">Example CSV format:</p>
          <code>name,phone_number,company,position</code><br />
          <code>John Doe,+1234567890,Acme Inc,CEO</code><br />
          <code>Jane Smith,+9876543210,Tech Corp,CTO</code>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          className={`flex-1 px-4 py-2 text-white font-medium rounded-md ${
            file && !isLoading
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Import Contacts'
          )}
        </button>
      </div>
    </div>
  );
};

export default ImportCSVForm;