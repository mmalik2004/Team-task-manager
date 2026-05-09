import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, onDelete, isAdmin }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className="cursor-pointer flex-1"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <h3 className="text-base font-semibold text-gray-800 hover:text-purple-600 transition">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {project.description || 'No description provided.'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => onDelete(project.id)}
            className="ml-3 text-gray-400 hover:text-red-500 transition text-lg"
            title="Delete project"
          >
            🗑️
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="w-7 h-7 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              title={member.name}
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {project.members?.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-400">
          By {project.creator?.name}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;