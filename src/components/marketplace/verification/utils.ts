
export const calculateDummyHash = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
};

export const getLevelDescription = (level: string): string => {
  switch (level) {
    case 'basic':
      return 'Basic identity and business registry checks';
    case 'standard':
      return 'Standard verification including tax compliance';
    case 'advanced':
      return 'Advanced verification with financial and performance history';
    default:
      return '';
  }
};
