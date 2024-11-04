import React, { useState, useEffect, useRef } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw';
import { useAppContext } from '../Mycontext';

const ExcalidrawCanvas = () => {
  const UserStream = useRef()
  
  const [excalidrawAPI1, setExcalidrawAPI1] = useState(null)
  const { Ws, setWs, client_id, setClient_id, room_id, setRoom_id } = useAppContext()
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  let m = 1;
  let payload;
  let sceneData2
  const userVideo = useRef();
  const partnerVideo = useRef()
  const peerRef = useRef()
  const OtherUser = useRef()
 

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true , audio: true}).then(strean => {
      userVideo.current.srcObject = strean;
      UserStream.current = strean;
      
     
    });
   
   
    // const initUserStream = async () => {
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //     UserStream.current = stream;
    //     userVideo.current.srcObject = stream;
     
    //   } catch (error) {
    //     console.error('Error accessing media devices:', error);
    //   }
    // };

    // initUserStream();
  }, []);




  const callUser = (id) => {
    if (!isStreamReady) {
      console.error('Stream not ready');
      return;
    }
    peerRef.current = createPeer(id)
    UserStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, UserStream.current)

    );
    console.log(UserStream.current);
    
    
    
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
    peer.onicecandidate = HandleIceCandidateEvent;
    peer.ontrack = HandleTrackEvent;
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
  
    
  peerRef.current = createPeer()
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

  const HandleIceCandidateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        "method": "ice-candidate",
        "target": OtherUser.current,
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
  const HandleTrackEvent = (e) => {
    partnerVideo.current.srcObject = e.streams[0];
    
    
  }
  

 
Ws.onmessage = (event) => {
    const newMessage = event.data;
    const parsedMessage = JSON.parse(newMessage)
console.log(parsedMessage);


    if (parsedMessage.method === "user_joined") {


      const id = parsedMessage.joined_user_id
      console.log(id);
      
      // callUser(id);
      // OtherUser.current = id;
    
      
    }
    if (parsedMessage.method === "offer") {
      HandleRecieveCall(parsedMessage)
      
      
    }

    if (parsedMessage.method === "answer") {
      HandleAnswer(parsedMessage)
      console.log("answer"+parsedMessage);
    }

    if (parsedMessage.method === "ice-candidate") {
      HandleIceCandidateMsg(parsedMessage)
      
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
      //     // console.log("Action running every 750 ms");
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
    <>
      <div onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ height: "500px", width: "500px", display: "inline-block" }}>
        <p style={{ fontSize: "16px" }}>Excalidraw 1</p>

        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI1(api)} />
      </div>

      <div><video autoPlay ref={userVideo} ></video>my</div>
      <div><video autoPlay ref={partnerVideo} ></video>their</div>
    </>
  )
}

export default ExcalidrawCanvas