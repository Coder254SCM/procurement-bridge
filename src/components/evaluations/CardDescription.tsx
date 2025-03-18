
import React from 'react';

export interface CardDescriptionProps {
  children?: React.ReactNode;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return (
    <p className="text-sm text-muted-foreground">
      {children}
    </p>
  );
};

export default CardDescription;
