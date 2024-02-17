import "./Meeting.css";
import { useEffect, useRef, useState } from "react";

import Peer from "peerjs";
import io from "socket.io-client";

const socket = io.connect(import.meta.env.VITE_SOCKET_SERVER);

const Meeting = ({ username, setUsername }) => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    socket.emit("userData");
  });

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("userData", (data) => {
      setMe(data.userId);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      //setUsername(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  useEffect(() => {
    console.log("My Socket ID: " + me);
    console.log("Socket ID Caller: " + caller);
    console.log("Peer Caller Signal: " + callerSignal);
    console.log("Receiving Call ID: " + receivingCall);
  });

  const callUser = (id) => {
    console.log("Calling user:", id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("open", (data) => {
      console.log("My signal ID is: " + data);
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    socket.on("answerCall", (signal) => {
      console.log("My caller ID is: " + signal);
      setCallAccepted(true);

      const call = peer.call(signal, stream);

      call.on("stream", (stream) => {
        console.log("My stream ID is: " + stream);
        userVideo.current.srcObject = stream;
      });
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("open", (data) => {
      console.log("My peer ID is: " + data);
      socket.emit("answerCall", { signal: data, to: caller });
    });

    // peer.on("stream", (stream) => {
    //   userVideo.current.srcObject = stream;
    // });

    peer.on("call", (call) => {
      console.log("My call ID is: " + call);
      // Answer the call, providing our mediaStream
      //userVideo.current.srcObject = call
      call.answer(stream);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="meeting-container">
      <div className="video-container">
        <div className="video">
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: "300px" }}
            />
          )}
        </div>
        <div className="video">
          {callAccepted && !callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{ width: "300px" }}
            />
          ) : null}
        </div>
      </div>
      <div className="myId">
        {/* <input
          id="filled-basic"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "20px" }}
        /> */}
        {/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
					<Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
						Copy ID
					</Button>
				</CopyToClipboard> */}
        <button onClick={() => copyToClipboard(me)}>copiar id</button>

        <input
          id="filled-basic"
          placeholder="ID to call"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
        />
        <div className="call-button">
          {callAccepted && !callEnded ? (
            <button onClick={leaveCall}>End Call</button>
          ) : (
            <button onClick={() => callUser(idToCall)}>
              ligar{/* <PhoneIcon fontSize="large" /> */}
            </button>
          )}
          {idToCall}
        </div>
      </div>
      <div>
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <h1>{username} is calling...</h1>
            <button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Meeting;
