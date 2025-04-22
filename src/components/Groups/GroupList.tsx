import React from 'react';
import { Edit, Trash2, Users } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
}

interface GroupListProps {
  groups: Group[];
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({ 
  groups, 
  onClick,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-md">
      <ul className="divide-y divide-gray-200">
        {groups.map((group) => (
          <li key={group.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex-1" onClick={() => onClick(group.id)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.contactCount}</span>
                  </div>
                </div>
                {group.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">{group.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(group.id);
                  }}
                  className="p-1 text-gray-400 hover:text-emerald-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(group.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;