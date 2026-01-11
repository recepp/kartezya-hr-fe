import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  show, 
  message = 'İşlem yapılıyor...' 
}) => {
  if (!show) return null;

  return (
    <div 
      className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1050,
        borderRadius: '0.375rem'
      }}
    >
      <Spinner 
        animation="border" 
        variant="primary" 
        style={{ width: '3rem', height: '3rem' }}
      />
      <div className="mt-3 text-muted fw-medium">
        {message}
      </div>
    </div>
  );
};

export default LoadingOverlay;