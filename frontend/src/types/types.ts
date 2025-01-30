export interface WebSocketPayload {
    method: string;
    id?: string;
    room_id?: string;
    state?: any;
    owner?: string;
    target?: string;
    caller?: string;
    sdp?: RTCSessionDescription;
    candidate?: RTCIceCandidate;
    joined_user_id?: Array<{id: string}>;
    room_data?: {
      id: string;
    };
  }

  export interface ExcalidrawState {
    elements: any[];
    appState: {
      collaborators: Map<string, any>;
    };
  }