export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    // Use modern Clipboard API if available (HTTPS)
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for non-HTTPS or older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('Copy command was unsuccessful');
      }
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

export const selectTextInElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.select();
  } else {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
