import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { RTCService } from '@/services/WebRTCService';
import { WebSocketService } from '../../services/WebSocketService';
import { VideoComponent } from './VideoComponent';
import { ExcalidrawComponent } from './ExcalidrawComponent';
import { WebSocketPayload, ExcalidrawState } from '../../types/types';

const ExcalidrawCanvas: React.FC = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isStreamReady, setIsStreamReady] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  
  const userStreamRef = useRef<MediaStream>();
  let { client_id,  room_id } = useAppContext();
  
  const rtcService = RTCService.getInstance();
  const wsService = WebSocketService.getInstance();

  useEffect(() => {
    const initUserStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        userStreamRef.current = stream;
        setIsStreamReady(true);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    wsService.send({
      "method":"who_joined"
    });


    initUserStream();

  
  }, []);

  const handleIceCandidate = (e: RTCPeerConnectionIceEvent, targetId: string) => {
    if (e.candidate) {
      wsService.send({
        method: 'ice-candidate',
        target: targetId,
        candidate: e.candidate
      });
    }
  };

  const HandleIceCandidateMsg = (incoming : any) => {
    const candidate = new RTCIceCandidate(incoming.candidate)
    const peer = rtcService.getPeerConnection(client_id);
    if (peer) {
    peer.addIceCandidate(candidate).catch(e => console.log(e)
    )}
  }

  const HandleNegotiationNeededEvent = (id :string) => {
    const peer = rtcService.getPeerConnection(id);
    peer?.createOffer().then(offer => {
      return peer.setLocalDescription(offer);
    }).then(() => {

      wsService.send({
        "method": "offer",
        "target": id,
        "caller": client_id,
        "sdp": peer.localDescription
      });
  
    }).catch(e => console.log(e))
  }
  const handleTrackEvent = (e: RTCTrackEvent, id: string) => {
    setRemoteStreams(prev => new Map(prev).set(id, e.streams[0]));
  };

  const handleReceivedMessage = async (event: MessageEvent) => {
    const message: WebSocketPayload = JSON.parse(event.data);

    switch (message.method) {
      case 'offer':
        handleOffer(message);
        break;
      case 'answer':
        handleAnswer(message);
        break;
      case 'ice-candidate':
        HandleIceCandidateMsg(message);
        break;
      case 'update':
        handleExcalidrawUpdate(message);
        break;
    }
  };

  const handleOffer = async (message: WebSocketPayload) => {
    if (!message.caller || !message.sdp) return;

    const peer = rtcService.createPeerConnection(
      message.caller,
      handleIceCandidate,
      handleTrackEvent,
      HandleNegotiationNeededEvent
    );

    await peer.setRemoteDescription(new RTCSessionDescription(message.sdp));
    
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach(track => 
        peer.addTrack(track, userStreamRef.current!)
      );
    }

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    wsService.send({
      method: 'answer',
      target: message.caller,
      sdp: peer.localDescription
    });
  };

  const handleAnswer = async (message: WebSocketPayload) => {
    if (!message.sdp) return;

    const peer = rtcService.getPeerConnection(message.target!);
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(message.sdp));
    }
  };

  const handleExcalidrawUpdate = (message: WebSocketPayload) => {
    if (!message.state || !excalidrawAPI) return;

    const sceneData: ExcalidrawState = message.state;
    sceneData.appState.collaborators = new Map(sceneData.appState.collaborators);
    excalidrawAPI.updateScene(sceneData);
  };

  const syncExcalidrawState = () => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    appState.collaborators = Array.from(appState.collaborators.entries());

    wsService.send({
      method: 'state',
      state: { elements, appState },
      room_id: room_id,
      owner: client_id
    });
  };

  const handleMouseEnter = () => {
    const id = setInterval(syncExcalidrawState, 350);
    setIntervalId(id);
  };

  const handleMouseLeave = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <div className="p-4">
      <ExcalidrawComponent
        onAPIChange={setExcalidrawAPI}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      <div className="mt-4">
        <h2 className="text-lg mb-2">Video Streams</h2>
        <div className="flex flex-wrap">
          {userStreamRef.current && (
            <VideoComponent
              stream={userStreamRef.current}
              isSelf={true}
            />
          )}
          {Array.from(remoteStreams.entries()).map(([id, stream]) => (
            <VideoComponent
              key={id}
              stream={stream}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExcalidrawCanvas;