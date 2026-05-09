const MemberBadge = ({ member, onRemove, isAdmin }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{member.name}</p>
          <p className="text-xs text-gray-400">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          member.ProjectMember?.role === 'Admin'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {member.ProjectMember?.role || 'Member'}
        </span>
        {isAdmin && (
          <button
            onClick={() => onRemove(member.id)}
            className="text-gray-300 hover:text-red-500 transition text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberBadge;