export class RTCService {
  private static instance: RTCService;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();

  private constructor() {}

  public static getInstance(): RTCService {
    if (!RTCService.instance) {
      RTCService.instance = new RTCService();
    }
    return RTCService.instance;
  }

  public createPeerConnection(
    id: string,
    onIceCandidate: (e: RTCPeerConnectionIceEvent, id: string) => void,
    onTrack: (e: RTCTrackEvent, id: string) => void
  ): RTCPeerConnection {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = (e) => onIceCandidate(e, id);
    peer.ontrack = (e) => onTrack(e, id);

    this.peerConnections.set(id, peer);
    return peer;
  }

  public getPeerConnection(id: string): RTCPeerConnection | undefined {
    return this.peerConnections.get(id);
  }

  public removePeerConnection(id: string): void {
    this.peerConnections.get(id)?.close();
    this.peerConnections.delete(id);
  }
}