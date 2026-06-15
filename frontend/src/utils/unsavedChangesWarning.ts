export const setupUnsavedChangesWarning = (
  hasUnsavedChanges: boolean
): void => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  if (hasUnsavedChanges) {
    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

export const showUnsavedChangesWarning = (): boolean => {
  return window.confirm(
    'You have unsaved changes. Are you sure you want to leave?'
  );
};
