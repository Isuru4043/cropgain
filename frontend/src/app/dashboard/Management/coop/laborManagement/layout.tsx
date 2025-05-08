'use client';
import React from 'react';

export default function LabourLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}