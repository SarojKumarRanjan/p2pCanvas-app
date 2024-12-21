export interface ExcalidrawElement {
    id: string;
    type: 'line' | 'rectangle' | 'ellipse' | 'text' | 'arrow' | 'image';
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    isDeleted: boolean;
    zIndex: number;
    createdAt: number;
    updatedAt: number;
  }
  
  export interface ExcalidrawState {
    elements: ExcalidrawElement[];
    appState: {
      isDragging: boolean;
      zoom: number;
    };
  }
  