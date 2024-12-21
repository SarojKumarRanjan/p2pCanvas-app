/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

interface ExcalidrawComponentProps {
  onAPIChange: (api: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ExcalidrawComponent: React.FC<ExcalidrawComponentProps> = ({
  onAPIChange,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="h-[500px] w-[500px] inline-block"
    >
      <p className="text-base">Excalidraw Canvas</p>
      <Excalidraw excalidrawAPI={onAPIChange} />
    </div>
  );
};