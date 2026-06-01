// src/components/SafeHTML.tsx
'use client';
import { sanitizeHTML } from '@/lib/sanitize';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export default function SafeHTML({ html, className = '' }: SafeHTMLProps) {
  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }} 
    />
  );
}