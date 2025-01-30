export interface WebRTCOffer {
    type: 'offer';
    sdp: string;
  }
  
  export interface WebRTCAnswer {
    type: 'answer';
    sdp: string;
  }
  
  export interface ICECandidate {
    candidate: string;
    sdpMid: string;
    sdpMLineIndex: number;
  }
  
  export interface WebRTCMessage {
    method: 'offer' | 'answer' | 'candidate';
    peerId: string;
    offer?: WebRTCOffer;
    answer?: WebRTCAnswer;
    candidate?: ICECandidate;
  }
  