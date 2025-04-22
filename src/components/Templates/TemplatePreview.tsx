import React, { useState } from 'react';
import { Template } from '../../types';
import { X } from 'lucide-react';

interface TemplatePreviewProps {
  template: Template;
  onClose: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose }) => {
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({
    name: 'John Doe',
    company: 'Acme Inc',
    position: 'CEO',
    problem: 'customer retention',
    topic: 'service upgrade',
    offer_details: '25% discount on premium plan',
    end_date: 'December 31, 2025',
  });
  
  // Extract placeholders from template content
  const extractPlaceholders = (content: string): string[] => {
    const placeholderRegex = /{{([^{}]+)}}/g;
    const placeholders: string[] = [];
    let match;
    
    while ((match = placeholderRegex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }
    
    return placeholders;
  };
  
  const placeholders = extractPlaceholders(template.content);
  
  // Apply variables to template
  const getPreviewContent = (): string => {
    let content = template.content;
    
    for (const [key, value] of Object.entries(previewVariables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return content;
  };
  
  const handleVariableChange = (name: string, value: string) => {
    setPreviewVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800">Template Preview: {template.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-h-[calc(90vh-130px)] overflow-y-auto">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview Variables</h3>
            <div className="space-y-3">
              {placeholders.map(placeholder => (
                <div key={placeholder}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {placeholder}
                  </label>
                  <input
                    type="text"
                    value={previewVariables[placeholder] || ''}
                    onChange={(e) => handleVariableChange(placeholder, e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={`Value for ${placeholder}`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Message Preview</h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-emerald-50 text-gray-800 whitespace-pre-line">
              {getPreviewContent()}
            </div>
            
            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Original Template</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-600 whitespace-pre-line text-sm">
                {template.content}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;