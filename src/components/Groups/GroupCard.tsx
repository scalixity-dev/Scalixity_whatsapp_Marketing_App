import React from 'react';
import { Edit, Trash2, Users } from 'lucide-react';
import { Group } from '../../pages/Groups';

interface GroupCardProps {
  group: Group;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, onEdit, onDelete }) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(group.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
      onDelete(group.id);
    }
  };

  return (
    <div 
      onClick={() => onClick(group.id)}
      className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{group.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-500"
            title="Edit Group"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500"
            title="Delete Group"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {group.description && (
        <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-2">{group.description}</p>
      )}
      
      <div className="flex items-center mt-4 text-sm text-gray-500">
        <Users className="h-4 w-4 mr-2" />
        <span>{group.contactCount} {group.contactCount === 1 ? 'contact' : 'contacts'}</span>
      </div>
    </div>
  );
};

export default GroupCard;