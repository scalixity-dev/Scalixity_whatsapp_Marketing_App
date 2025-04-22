import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Template } from '../types';
import TemplateCard from '../components/Templates/TemplateCard';
import TemplateForm from '../components/Templates/TemplateForm';
import TemplatePreview from '../components/Templates/TemplatePreview';
import { templateService } from '../services/templateService';

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const data = await templateService.getAllTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  const handleCreateTemplate = async (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    setIsCreating(true);
    try {
      const newTemplate = await templateService.createTemplate(templateData);
      setTemplates(prev => [...prev, newTemplate]);
      setShowNewTemplateForm(false);
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleUpdateTemplate = async (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    if (!editingTemplate) return;
    
    setIsCreating(true);
    try {
      const updatedTemplate = await templateService.updateTemplate(editingTemplate.id, templateData);
      if (updatedTemplate) {
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        setEditingTemplate(null);
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteTemplate = async (templateId: number) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const success = await templateService.deleteTemplate(templateId);
        if (success) {
          setTemplates(prev => prev.filter(t => t.id !== templateId));
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template. Please try again.');
      }
    }
  };
  
  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowNewTemplateForm(false);
  };
  
  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Message Templates</h1>
        
        <button
          className="flex items-center px-4 py-2 mt-3 md:mt-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            setShowNewTemplateForm(!showNewTemplateForm);
            setEditingTemplate(null);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Template
        </button>
      </div>
      
      {/* New Template Form */}
      {showNewTemplateForm && (
        <div className="mb-6">
          <TemplateForm 
            onSubmit={handleCreateTemplate}
            isLoading={isCreating}
          />
        </div>
      )}
      
      {/* Edit Template Form */}
      {editingTemplate && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Edit Template</h2>
          <TemplateForm 
            onSubmit={handleUpdateTemplate}
            initialTemplate={editingTemplate}
            isLoading={isCreating}
          />
        </div>
      )}
      
      {/* Templates Display */}
      {templates.length === 0 && !showNewTemplateForm && !editingTemplate ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">No templates found</p>
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            onClick={() => setShowNewTemplateForm(true)}
          >
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onPreview={handlePreviewTemplate}
            />
          ))}
        </div>
      )}
      
      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreview 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
        />
      )}
    </div>
  );
};

export default Templates;