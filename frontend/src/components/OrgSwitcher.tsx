import React, { useState } from 'react';
import { useOrganization } from '../hooks/useOrganization';

export const OrgSwitcher: React.FC = () => {
  const { organizations, currentOrg, switchOrganization } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentOrg || organizations.length <= 1) {
    return (
      <div className="text-sm text-slate-400 px-4 py-2">
        {currentOrg?.name || 'Organization'}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm transition-colors w-full"
      >
        <span className="truncate">{currentOrg.name}</span>
        <svg
          className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10">
          {organizations.map(org => (
            <button
              key={org.id}
              onClick={() => {
                switchOrganization(org.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-slate-600 text-sm transition-colors ${
                currentOrg.id === org.id ? 'bg-cyan-600 bg-opacity-30 text-cyan-300' : 'text-slate-300'
              }`}
            >
              <div className="font-medium">{org.name}</div>
              {org.description && <div className="text-xs text-slate-500 mt-1">{org.description}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
