
import React from 'react';
import { Task } from '../types';
import { ChevronRight } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  isActive: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, isActive }) => {
  const handleClick = () => {
    onSelect(task);
  };

  return (
    <div
      className={`p-4 mb-2 rounded-md cursor-pointer transition-colors ${
        isActive
          ? 'bg-[#00A99D] text-white'
          : 'bg-[#0F141D] text-white hover:bg-gray-800/50'
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium">{task.title}</h3>
          <p className={`text-sm mt-1 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
            {task.description}
          </p>
        </div>
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  );
};

export default TaskCard;
