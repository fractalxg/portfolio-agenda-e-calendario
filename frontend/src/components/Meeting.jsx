import "./Meeting.css";
import { useEffect, useRef, useState } from "react";

import Peer from "simple-peer";
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
      setUsername(data.name);
      setCallerSignal(data.signal);
    });

  }, []);

  const callUser = (id) => {
    console.log("Calling user:", id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("open", (id) => {
      console.log("Peer ID:", id);
    });

    peer.on("connect", () => {
      console.log("Connected to peer!");
    });

    peer.on("signal", (data) => {
      console.log("Signal data:", data);
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: username,
      });
      console.log("CallUser parameters:", id, me, username);
    });

    console.log("Peer initialized:", peer);

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
      console.log("Stream:", stream);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    socket.on("callAccepted", (signal) => {
      console.log("Call accepted signal:", signal);
      setCallAccepted(true);
      peer.signal(signal);
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

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
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
