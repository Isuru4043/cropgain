import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('Navigation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (usePathname as jest.Mock).mockReset();
  });

  it('renders all navigation links correctly', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Navigation />);
    
    // Check if main navigation links are present
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About us/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('shows the correct active link based on current route', () => {
    (usePathname as jest.Mock).mockReturnValue('/login');
    render(<Navigation />);
    
    const loginLink = screen.getByText(/Login/i).closest('a');
    expect(loginLink).toHaveClass('text-2xl hover:underline');
  });

  it('renders the brand logo/text', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Navigation />);
    
    expect(screen.getByText('CropGain')).toBeInTheDocument();
  });
});