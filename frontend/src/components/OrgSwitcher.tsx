import React, { useState, useRef, useEffect } from 'react';
import { useOrganization } from '../hooks/useOrganization';

export const OrgSwitcher: React.FC = () => {
  const { organizations, currentOrg, switchOrganization } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!currentOrg || organizations.length <= 1) {
    return (
      <div style={{ fontSize: '14px', color: 'var(--text-tertiary)', padding: '8px 16px' }}>
        {currentOrg?.name || 'Organization'}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'var(--layer-2)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'border-color var(--duration-sm)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-emphasis)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentOrg.name}
        </span>
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{
            flexShrink: 0,
            color: 'var(--text-tertiary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--duration-sm)',
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--layer-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {organizations.map((org) => {
            const isSelected = currentOrg.id === org.id;
            return (
              <button
                key={org.id}
                onClick={() => {
                  switchOrganization(org.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--accent-primary-dim)' : 'transparent',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'background-color var(--duration-sm)',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--layer-1)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ fontWeight: 600 }}>{org.name}</div>
                {org.description && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {org.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
