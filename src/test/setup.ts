import React from 'react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

import './mocks/react-router';


vi.mock('@mui/icons-material', async () => {
  const actual = await vi.importActual('@mui/icons-material');
  return {
    ...actual,
    Visibility: () => React.createElement('span', { 'data-testid': 'icon-Visibility' }, '👁'),
    VisibilityOff: () => React.createElement('span', { 'data-testid': 'icon-VisibilityOff' }, '👁‍🗨'),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});
