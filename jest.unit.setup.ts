import '@testing-library/jest-dom';

// Mock do navigator.geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
  writable: true,
});

// Mock do navigator.share
Object.defineProperty(navigator, 'share', {
  value: jest.fn(),
  writable: true,
});

// Mock do navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
  writable: true,
});

// Mock do window.print (apenas em ambiente browser)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'print', {
    value: jest.fn(),
    writable: true,
  });
}

// Mock do fetch global
global.fetch = jest.fn();

// Mock do ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
