import React, { useState } from 'react';
import { Template } from '../../types';

interface TemplateFormProps {
  onSubmit: (template: Omit<Template, 'id' | 'createdAt'>) => void;
  initialTemplate?: Template;
  isLoading?: boolean;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ 
  onSubmit, 
  initialTemplate,
  isLoading = false
}) => {
  const [name, setName] = useState(initialTemplate?.name || '');
  const [content, setContent] = useState(initialTemplate?.content || '');
  const [errors, setErrors] = useState<{ name?: string; content?: string }>({});
  
  const validateForm = (): boolean => {
    const newErrors: { name?: string; content?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Template content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const templateData: Omit<Template, 'id' | 'createdAt'> = {
        name,
        content,
      };
      
      onSubmit(templateData);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter template name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Template Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter template content with placeholders like {{name}}, {{company}}"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              <p className="font-medium">Available placeholders:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>{"{{name}}"} - Contact's name</li>
                <li>{"{{company}}"} - Contact's company</li>
                <li>{"{{position}}"} - Contact's position</li>
                <li>{"{{offer_details}}"} - Details of your offer</li>
                <li>{"{{end_date}}"} - Offer end date</li>
                <li>{"{{problem}}"} - Problem your product solves</li>
                <li>{"{{topic}}"} - Topic of previous conversation</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                initialTemplate ? 'Update Template' : 'Create Template'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;