import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

describe('Footer', () => {
  it('renders footer content correctly', () => {
    render(<Footer />)
    
    // Test main heading
    const mainHeading = screen.getByRole('heading', { name: /CropGain/i })
    expect(mainHeading).toBeInTheDocument()
    
    // Test copyright text
    expect(screen.getByText(/© 2024 CropGain\. All Rights Reserved\./i)).toBeInTheDocument()
    
    // Test navigation sections
    expect(screen.getByText(/About/i)).toBeInTheDocument()
    expect(screen.getByText(/Our Standards/i)).toBeInTheDocument()
    expect(screen.getByText(/Membership/i)).toBeInTheDocument()
    expect(screen.getByText(/Resources/i)).toBeInTheDocument()
    
    // Test social media links
    expect(screen.getByLabelText(/LinkedIn/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Twitter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Facebook/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/YouTube/i)).toBeInTheDocument()
  })
})