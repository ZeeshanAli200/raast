export const getOS = () => {
  if (typeof window === 'undefined') return 'server';

  const userAgent = navigator.userAgent || navigator.vendor;

  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';

  return 'web';
};

export const ALLOWED_OPERATORS = ['EasyPaisa (Telenor MFB)', 'JazzCash (MFB)'];
