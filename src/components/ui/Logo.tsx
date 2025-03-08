import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 180, height = 45 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 70" width={width} height={height}>
    {/* Background Elements */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#003366" />
        <stop offset="100%" stopColor="#0066cc" />
      </linearGradient>
    </defs>
    
    {/* Network Node Elements */}
    <circle cx="30" cy="35" r="10" fill="url(#logoGradient)" />
    <circle cx="65" cy="22" r="7" fill="url(#logoGradient)" />
    <circle cx="48" cy="55" r="6" fill="url(#logoGradient)" />
    
    {/* Connection Lines */}
    <line x1="30" y1="35" x2="65" y2="22" stroke="#003366" strokeWidth="2.5" />
    <line x1="30" y1="35" x2="48" y2="55" stroke="#003366" strokeWidth="2.5" />
    <line x1="65" y1="22" x2="48" y2="55" stroke="#003366" strokeWidth="2.5" strokeDasharray="3,2" />
    
    {/* Text: "Linked" */}
    <text x="85" y="40" fontFamily="Roboto, sans-serif" fontSize="28" fontWeight="500" fill="#003366">Linked</text>
    
    {/* Text: "Scholar" */}
    <text x="165" y="40" fontFamily="Roboto, sans-serif" fontSize="28" fontWeight="700" fill="#0066cc">Scholar</text>
  </svg>
);

export default Logo;