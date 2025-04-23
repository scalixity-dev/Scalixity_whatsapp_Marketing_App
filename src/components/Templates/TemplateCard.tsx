import React from 'react';
import { Template } from '../../types';
import { FileText, Clock, Edit, Trash2 } from 'lucide-react';
import { templateService } from '../../services/templateService';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (templateId: number) => void;
  onPreview: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onEdit, 
  onDelete,
  onPreview
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(template);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(template.id);
  };

  const handlePreview = async () => {
    try {
      // Update last used timestamp
      await templateService.updateTemplateUsage(template.id);
      onPreview(template);
    } catch (error) {
      console.error('Error updating template usage:', error);
      // Still show preview even if usage update fails
      onPreview(template);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 cursor-pointer"
      onClick={handlePreview}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 mr-3">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">
          {template.content}
        </p>
      </div>
      
      <div className="flex items-center mt-4 text-xs text-gray-500">
        <Clock className="h-3 w-3 mr-1" />
        <span>Created: {formatDate(template.createdAt)}</span>
        {template.lastUsed && (
          <span className="ml-3">Last used: {formatDate(template.lastUsed)}</span>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;