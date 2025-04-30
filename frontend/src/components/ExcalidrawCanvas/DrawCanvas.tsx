import { useState, useEffect, useRef } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw';
import { toast } from 'sonner';
import { WebSocketService } from '@/services/WebSocketService';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';




const ExcalidrawCanvas = () => {

  const { id } = useParams()
  const webSocketService = WebSocketService.getInstance();
  const excalidrawAPI1 = useRef<null|ExcalidrawImperativeAPI>(null);
  const [startkru, setstartkru] = useState<boolean | null>(null);
  const [client_id, setClientId] = useState<string | null>(null)
  const [room_id,] = useState<string | null>(id ?? '')
  const UserStream = useRef<MediaStream>();
  const previousSceneRef = useRef<any| null>(null);
  const previousPayloadRef = useRef<any| null>(null);
  const previouscountref = useRef<any| null>(1);
  const partnerVideo = useRef<{ [id: string]: MediaStream | null }>({});

  const userVideo = useRef<HTMLVideoElement | null>(null);

  const peerRef = useRef<RTCPeerConnection>()
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [callUserId, setCallUserId] = useState<string[]>([]);

                               
  const [isStreamReady, setIsStreamReady] = useState(false);
  ;

  const [videos, setVideos] = useState<string[]>([]);


  
  

  /// started ///////////////////////////////////////////////////////////
  useEffect(() => {
    console.log("ran hk");

    const roomcheck = async () => {
      const res = await axios.get(`http://localhost:4445/${id}`)
      setstartkru(res.data.id)
    }




    roomcheck()



  }, []);

  useEffect(() => {
    console.log("ran wbrt");

    const initUserStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        UserStream.current = stream;
        userVideo.current!.srcObject = stream;
        setIsStreamReady(true);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };




    if (userVideo.current) {
      initUserStream();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (UserStream.current) {
        UserStream.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }
  }, [userVideo.current]);



  useEffect(() => {
    if (!startkru ) return
    console.log("ran ws");

    const initializedWebsocket = async () => {
      try {
        const websocket = await webSocketService.connect("ws://localhost:4444");

        websocket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log(message);

          switch (message.method) {

            case "connect":
              setClientId(message.id);
              webSocketService.send({
                method: "join",
                id: message.id,
                room_id: room_id
              })
              break;
            case "join":
              console.log("joined");
              const payload = {
                "method": "who_joined"
              }
              websocket.send(JSON.stringify(payload))
              break;

            case "user_joined":

              const id = message.joined_user_id
              console.log("array" + id);

              all_video_setup(id)

              break;


            case "offer":
              HandleRecieveCall(message)
              console.log("giving offer");

              break;
            case "answer":
              HandleAnswer(message)
              console.log("answer recieving");
              break;

            case "ice-candidate":
              HandleIceCandidateMsg(message)
              console.log("giving ice");
              break;


            case "user_left":
              console.log("someone left");

              HandleUserLeft(message)
              break;


            case "update":
              console.log(message);
              handleupdate(message)
              break;
            case "error":
              toast.error(message.message);
              break;
            default:
              break;
          }
        }


        websocket.onclose = () => {


        };



      } catch (error) {
        toast.error("Error initializing websocket");
        console.error("Error initializing websocket", error);

      }
    }

    initializedWebsocket();



    return () => {

      if (webSocketService.getWebSocket()) {
        WebSocketService.getInstance().disconnect()
      }
    }

  }, [startkru])


  useEffect(() => {
    if (isStreamReady && callUserId) {
      all_video_setup(callUserId)


    }
  }, [isStreamReady, callUserId]);

  const initiateCallUser = (idArray: string[]) => {
    setCallUserId(idArray);
  };

  const callUser = (id: string) => {
    peerRef.current = createPeer(id)
    UserStream.current!.getTracks().forEach(track => peerRef.current!.addTrack(track, UserStream.current!)
    );






  }

  const createPeer = (id: string) => {
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
    peer.onicecandidate = (e) => HandleIceCandidateEvent(e, id);
    peer.ontrack = (e) => HandleTrackEvent(e, id);
    peer.onnegotiationneeded = () => HandleNegotiationNeededEvent(id)
    return peer;
  }

  const HandleNegotiationNeededEvent = (id: string) => {
    if (peerRef.current) {
      peerRef.current.createOffer().then(offer => {
        if (peerRef.current) {
          return peerRef.current.setLocalDescription(offer);
        }
      }).then(() => {
        const payload = {
          "method": "offer",
          "target": id,
          "caller": client_id,
          "sdp": peerRef.current!.localDescription
        }
        webSocketService.send(payload)
      }).catch(e => console.log(e))
    }
  }

  const HandleRecieveCall = (incoming: any) => {
    peerRef.current = createPeer(incoming.caller)
    const desc = new RTCSessionDescription(incoming.sdp)
    peerRef.current.setRemoteDescription(desc).then(() => {
      UserStream.current!.getTracks().forEach(track => peerRef.current!.addTrack(track, UserStream.current!))
    }).then(() => {
      return peerRef.current!.createAnswer()
    }).then(answer => {
      return peerRef.current!.setLocalDescription(answer)
    }).then(() => {
      const payload = {
        "method": "answer",
        "target": incoming.caller,
        "sdp": peerRef.current!.localDescription
      }
      webSocketService.send(payload)
    })
  }


  const HandleUserLeft = (parsedMessage: any) => {
    delete partnerVideo.current[parsedMessage.id]
    setVideos(parsedMessage.id)
  }
  const HandleAnswer = (incoming: any) => {
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current!.setRemoteDescription(desc).catch(e => console.log(e))
  }

  const HandleIceCandidateEvent = (e: RTCPeerConnectionIceEvent, id: string) => {
    if (e.candidate) {
      const payload = {
        "method": "ice-candidate",
        "target": id,
        "candidate": e.candidate
      }






      if (payload.target) {
        webSocketService.send(payload)
      }
    }
  }



  const HandleIceCandidateMsg = (incoming: any) => {
    const candidate = new RTCIceCandidate(incoming.candidate)
    if (peerRef.current) {
      peerRef.current.addIceCandidate(candidate).catch(e => console.log(e)
      )
    }
  }


  const HandleTrackEvent = (e: RTCTrackEvent, id: string) => {
    partnerVideo.current[id] = e.streams[0];
    setVideos((prev) => [...prev, id])
    console.log(videos);

  }

  const all_video_setup = (id_array: string[]) => {
    if (!isStreamReady) {
      initiateCallUser(id_array)
      console.log(id_array);
      console.log("logging whole array");

      console.warn("User stream is not ready yet.");
      return;
    }




    function callWithDelay(index: number) {
      if (index >= id_array.length) return;

      const element = id_array[index];
      console.log(element);
      console.log("logging singk element");


      callUser(element);

      setTimeout(() => {
        callWithDelay(index + 1);
      }, 1000);
    }
    callWithDelay(0)
  }

 
  const handleupdate = (message: any) => {

    const sceneData1 = message.state
    const currentAppState = excalidrawAPI1.current?.getAppState();
    sceneData1.appState = currentAppState
    if (sceneData1 && sceneData1.appState) {

      sceneData1.appState.collaborators = new Map(sceneData1.appState.collaborators);
    }

    if (sceneData1) {

      if (excalidrawAPI1) {

        excalidrawAPI1.current?.updateScene(sceneData1);
      }
    }
  }


  const getSceneData = () => {
    var currentElements
    var currentAppState
    if (excalidrawAPI1.current) {
      currentElements = excalidrawAPI1.current?.getSceneElements();
      const originalAppState = excalidrawAPI1.current?.getAppState();
      currentAppState = {
        ...originalAppState,
        collaborators: Array.from(originalAppState.collaborators.entries()),
      };

    }
    if (currentElements && currentAppState) {
      previousSceneRef.current = {
        elements: currentElements,
        appState: currentAppState,
      };
    }


    if (previouscountref.current === 1) {
      if (previousSceneRef.current) {
        previousPayloadRef.current = {
          "method": "state",
          "state": previousSceneRef.current,
          "room_id": room_id,
          "owner": client_id
        }

      }
      previouscountref.current = 2;
      console.log("applying once");
      if (previousPayloadRef.current) {
        webSocketService.send(previousPayloadRef.current)
        console.log("sending data");
      }

    } else {

      if (JSON.stringify(previousPayloadRef.current?.state) !== JSON.stringify(previousSceneRef.current)) {
        if (previousSceneRef.current) {
          previousPayloadRef.current = {
            "method": "state",
            "state": previousSceneRef.current,
            "room_id": room_id,
            "owner": client_id
          }
        }
        if (previousPayloadRef.current) {
          webSocketService.send(previousPayloadRef.current)
        }

      }
    }
  };

  const handleMouseEnter = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        getSceneData();
      }, 350);
    }
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };


  if (startkru == null) {
    return (
      <div>invalid room_id</div>
    )
  }



  return (
    <div className="flex h-screen w-full p-4 gap-4">
      <div className="w-3/4 h-full">
        <div
          className="h-full w-full border rounded-lg overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Excalidraw
            excalidrawAPI={(api) => {
              excalidrawAPI1.current = api;
            }}
          />
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