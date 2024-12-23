import  { useState, useEffect, useRef } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw';
import { useAppContext } from '@/context/AppContext';


const ExcalidrawCanvas = () => {
  const UserStream = useRef()
  const partnerVideo = useRef([]);
  const userVideo = useRef();
   const peerRef = useRef()
const [callUserId, setCallUserId] = useState([]); 
  const [excalidrawAPI1, setExcalidrawAPI1] = useState(null)
  const { ws, client_id, room_id } = useAppContext()
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [videos, setVideos] = useState([]);

  let m = 1;
  let payload:any;
  let sceneData2:any;
  const Ws = ws;

  useEffect(() => {
    
    const initUserStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        UserStream.current = stream;
        userVideo.current.srcObject = stream;
        setIsStreamReady(true); 
     
     
     
     
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
  
    initUserStream();
  }, []);

  useEffect(() => {
    if (isStreamReady && callUserId) {
     all_video_setup(callUserId)
    
     
    }
  }, [isStreamReady, callUserId]);
  
  const initiateCallUser = (id) => {
    setCallUserId(id);
  };

  const callUser = (id) => {
    peerRef.current = createPeer(id)
    UserStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, UserStream.current)
    );
    
    
    
    
    
    
  }

  const createPeer = (id) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com"
        }
      ]
    });
    peer.onicecandidate = (e) => HandleIceCandidateEvent(e,id);
    peer.ontrack = (e)=> HandleTrackEvent(e,id);
    peer.onnegotiationneeded = ()=>HandleNegotiationNeededEvent(id)
    return peer;
  }

  const HandleNegotiationNeededEvent = (id) => {
    peerRef.current.createOffer().then(offer => {
      return peerRef.current.setLocalDescription(offer);
    }).then(() => {
      const payload = {
        "method": "offer",
        "target": id,
        "caller": client_id,
        "sdp": peerRef.current.localDescription
      }
      Ws.send(JSON.stringify(payload))
    }).catch(e => console.log(e))
  }

  const HandleRecieveCall = (incoming) => {
  peerRef.current = createPeer(incoming.caller)
    const desc = new RTCSessionDescription(incoming.sdp)
    peerRef.current.setRemoteDescription(desc).then(() => {
        UserStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, UserStream.current))
    }).then(() => {
      return peerRef.current.createAnswer()
    }).then(answer => {
      return peerRef.current.setLocalDescription(answer)
    }).then(() => {
      const payload = {
        "method": "answer",
        "target": incoming.caller,
        "sdp": peerRef.current.localDescription
      }
      Ws.send(JSON.stringify(payload))
    })
  }

  const HandleAnswer = (incoming) => {
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current.setRemoteDescription(desc).catch(e => console.log(e))
  }

  const HandleIceCandidateEvent = (e,id) => {
    if (e.candidate) {
      const payload = {
        "method": "ice-candidate",
        "target": id,
        "candidate": e.candidate
      }



     
      

      if (payload.target) {
        Ws.send(JSON.stringify(payload))
      }
    }
  }



  const HandleIceCandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming.candidate)
    if (peerRef.current) {
    peerRef.current.addIceCandidate(candidate).catch(e => console.log(e)
    )}
  }


  const HandleTrackEvent = (e,id) => {
    partnerVideo.current[id] = e.streams[0];
    setVideos(...videos , id)
  }
  
  const all_video_setup = (id_array )=>{
    if (!isStreamReady) {
      initiateCallUser(id_array)
      console.warn("User stream is not ready yet.");
      return; 
    }
    
    
    function callWithDelay(index) {
      if (index >= id_array.length) return;

      const element = id_array[index];
      callUser(element.id);

      setTimeout(() => {
        callWithDelay(index + 1);
      }, 1000);
    }
    callWithDelay(0)
    }
    
Ws.onmessage = (event) => {
    const newMessage = event.data;
    const parsedMessage = JSON.parse(newMessage)
console.log(parsedMessage);


    if (parsedMessage.method === "user_joined") {
      const id = parsedMessage.joined_user_id
       all_video_setup(id)
    }

    if (parsedMessage.method === "join") {
      console.log(parsedMessage?.room_data?.id + "ahahhaha");
}
    
    if (parsedMessage.method === "offer") {
      HandleRecieveCall(parsedMessage)
      console.log("giving offer");
    }

    if (parsedMessage.method === "answer") {
      HandleAnswer(parsedMessage)
      console.log("answer recieving");
    }

    if (parsedMessage.method === "ice-candidate") {
      HandleIceCandidateMsg(parsedMessage)
      console.log("giving ice");
      
    }
    if (parsedMessage.method === "update") {
      const sceneData1 = parsedMessage.state
      if (sceneData1) {
        sceneData1.appState.collaborators = new Map(sceneData1.appState.collaborators);
      }

      if (sceneData1) {
        if (excalidrawAPI1) {
          excalidrawAPI1.updateScene(sceneData1);
        }
      }
    }
}
 

  const getSceneData = () => {

    if (excalidrawAPI1) {
      var currentElements = excalidrawAPI1.getSceneElements();
      var currentAppState = excalidrawAPI1.getAppState();
      currentAppState.collaborators = Array.from(currentAppState.collaborators.entries());
    }
    if (currentElements && currentAppState) {
      sceneData2 = {
        elements: currentElements,
        appState: currentAppState,
      };
    }


    if (m == 1) {
      if (sceneData2) {
        payload = {
          "method": "state",
          "state": sceneData2,
          "room_id": room_id,
          "owner": client_id
        }

      }
      m = 2;
      console.log("applying once");
      if (payload) {
        Ws.send(JSON.stringify(payload))
        console.log("sending data");
      }

    } else {
      if (JSON.stringify(payload.state) !== JSON.stringify(sceneData2)) {
        if (sceneData2) {
          payload = {
            "method": "state",
            "state": sceneData2,
            "room_id": room_id,
            "owner": client_id
          }
        }
        console.log("applying second times");
        if (payload) {
          Ws.send(JSON.stringify(payload))
          console.log("sending data");
        }

      }
    }
  };

  const handleMouseEnter = () => {

    const id = setInterval(() => {
      getSceneData();
    }, 350);
    setIntervalId(id);

  };

  const handleMouseLeave = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };






  return (
    <div className="flex h-screen w-full p-4 gap-4">
      <div className="w-3/4 h-full">
        <div 
          className="h-full w-full border rounded-lg overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI1(api)} />
        </div>
      </div>

      <div className="w-1/4 flex flex-col gap-4">
        <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video 
            autoPlay 
            ref={userVideo}
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          {Object.keys(partnerVideo.current).map((id, index) => (
            <div key={index} className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                autoPlay
                ref={(videoElement) => {
                  if (videoElement && id) {
                    videoElement.srcObject = partnerVideo.current[id];
                    videoElement.play().catch((error) => {
                      console.error('Error playing video:', error);
                    });
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExcalidrawCanvas