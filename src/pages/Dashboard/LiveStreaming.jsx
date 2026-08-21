import { useEffect, useRef, useState } from "react";
import {
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Eye,
  Clock,
  Play,
  Square,
  Settings,
  MessageCircle,
} from "lucide-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  startAgoraSession,
  getAgoraViewerCount,
  endAgoraSession,
} from "../../services/agora";
import "./LiveStreaming.css";

const LiveStreaming = () => {
  const [isLive, setIsLive] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [sessionTitle, setSessionTitle] = useState(
    "Astrology Live Consultation"
  );
  const [category, setCategory] = useState("Astrology");
  const [viewerCount, setViewerCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);

  const clientRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const micTrackRef = useRef(null);
  const viewerIntervalRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const activeSessionIdRef = useRef(null);
  const partnerIdRef = useRef(null);

  useEffect(() => {
    const storedPartnerId = localStorage.getItem("partnerId");

    if (!storedPartnerId) return;

    let id = storedPartnerId;

    try {
      const parsed = JSON.parse(storedPartnerId);

      if (typeof parsed === "object" && parsed !== null) {
        id =
          parsed?._id ||
          parsed?.id ||
          parsed?.partnerId ||
          storedPartnerId;
      }
    } catch {
      id = storedPartnerId;
    }

    if (id) {
      setPartnerId(id);
      partnerIdRef.current = id;
    }
  }, []);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}:${String(secs).padStart(2, "0")}`;
    }

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const startDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }

    startTimeRef.current = Date.now();

    durationIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      setDuration(elapsed);
    }, 1000);
  };

  const stopDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    startTimeRef.current = null;
  };

  const fetchViewerCount = async () => {
    try {
      const currentSessionId = activeSessionIdRef.current;

      if (!currentSessionId) return;

      const response = await getAgoraViewerCount(currentSessionId);

      let count = 0;

      if (typeof response === "number") {
        count = response;
      } else if (response && typeof response === "object") {
        count =
          response?.count ??
          response?.viewerCount ??
          response?.viewers ??
          response?.data?.viewerCount ??
          response?.data?.count ??
          0;
      }

      setViewerCount(Number(count) || 0);
    } catch (error) {
      console.error("Viewer count error:", error);
    }
  };

  const startViewerPolling = () => {
    if (viewerIntervalRef.current) {
      clearInterval(viewerIntervalRef.current);
    }

    fetchViewerCount();

    viewerIntervalRef.current = setInterval(() => {
      fetchViewerCount();
    }, 10000);
  };

  const stopViewerPolling = () => {
    if (viewerIntervalRef.current) {
      clearInterval(viewerIntervalRef.current);
      viewerIntervalRef.current = null;
    }
  };

  const createAgoraClient = () => {
    const client = AgoraRTC.createClient({
      mode: "live",
      codec: "vp8",
    });

    clientRef.current = client;

    return client;
  };

  const handleStartLive = async () => {
    if (isStarting || isLive) return;

    const storedPartnerId = localStorage.getItem("partnerId");

    if (!storedPartnerId) {
      alert("Partner ID not found. Please login again.");
      return;
    }

    let currentPartnerId = storedPartnerId;

    try {
      const parsed = JSON.parse(storedPartnerId);

      if (typeof parsed === "object" && parsed !== null) {
        currentPartnerId =
          parsed?._id ||
          parsed?.id ||
          parsed?.partnerId ||
          storedPartnerId;
      }
    } catch {
      currentPartnerId = storedPartnerId;
    }

    if (!currentPartnerId) {
      alert("Partner ID not found. Please login again.");
      return;
    }

    if (!sessionTitle.trim()) {
      alert("Please enter session title.");
      return;
    }

    if (!category.trim()) {
      alert("Please enter session category.");
      return;
    }

    try {
      setIsStarting(true);
      setPartnerId(currentPartnerId);
      partnerIdRef.current = currentPartnerId;

      const payload = {
        partnerId: currentPartnerId,
        topic: sessionTitle.trim(),
        category: category.trim(),
      };

      const response = await startAgoraSession(payload);

      const currentSessionId =
        response?.data?.session?._id ||
        response?.data?.session?.id ||
        response?.session?._id ||
        response?.session?.id ||
        response?.data?._id ||
        response?.data?.id ||
        response?._id ||
        response?.id ||
        null;

      const appId =
        response?.data?.appId ||
        response?.appId ||
        response?.data?.session?.appId ||
        response?.data?.session?.agoraAppId ||
        response?.data?.agoraAppId ||
        response?.session?.appId ||
        response?.session?.agoraAppId ||
        "0228c9fe15a54e20a48e44835be49d7c";

      const rtcToken =
        response?.data?.rtcToken ||
        response?.data?.token ||
        response?.rtcToken ||
        response?.token ||
        response?.data?.session?.rtcToken ||
        response?.data?.session?.token ||
        response?.session?.rtcToken ||
        response?.session?.token ||
        null;

      const channelName =
        response?.data?.channelName ||
        response?.channelName ||
        response?.data?.session?.channelName ||
        response?.session?.channelName ||
        response?.data?.channel ||
        response?.channel ||
        null;

      const uid =
        response?.data?.uid ||
        response?.uid ||
        response?.data?.session?.uid ||
        response?.session?.uid ||
        0;

      if (!currentSessionId || !appId || !rtcToken || !channelName) {
        const missing = [];

        if (!currentSessionId) missing.push("sessionId");
        if (!appId) missing.push("appId");
        if (!rtcToken) missing.push("rtcToken");
        if (!channelName) missing.push("channelName");

        alert(`Missing Agora credentials: ${missing.join(", ")}`);
        return;
      }

      setSessionId(currentSessionId);
      activeSessionIdRef.current = currentSessionId;

      const client = createAgoraClient();

      await client.setClientRole("host");

      await client.join(
        appId,
        channelName,
        rtcToken,
        Number(uid)
      );

      const [microphoneTrack, cameraTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();

      micTrackRef.current = microphoneTrack;
      cameraTrackRef.current = cameraTrack;

      await microphoneTrack.setEnabled(true);
      await cameraTrack.setEnabled(true);

      await client.publish([
        microphoneTrack,
        cameraTrack,
      ]);

      const videoElement =
        document.getElementById("agora-local-video");

      if (videoElement) {
        cameraTrack.play(videoElement);
      }

      setMicOn(true);
      setCameraOn(true);
      setViewerCount(0);
      setDuration(0);
      setIsLive(true);

      startDurationTimer();
      startViewerPolling();
    } catch (error) {
      console.error("Start live error:", error);

      alert(
        error?.message ||
          "Failed to start live session."
      );

      await cleanupAgora();
    } finally {
      setIsStarting(false);
    }
  };

  const cleanupAgora = async () => {
    try {
      stopViewerPolling();
      stopDurationTimer();

      if (cameraTrackRef.current) {
        cameraTrackRef.current.stop();
        cameraTrackRef.current.close();
        cameraTrackRef.current = null;
      }

      if (micTrackRef.current) {
        micTrackRef.current.stop();
        micTrackRef.current.close();
        micTrackRef.current = null;
      }

      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }
    } catch (error) {
      console.error("Agora cleanup error:", error);
    }

    setIsLive(false);
    setViewerCount(0);
    setDuration(0);
    activeSessionIdRef.current = null;
  };

  const handleEndLive = async () => {
    if (isEnding) return;

    const currentSessionId =
      activeSessionIdRef.current || sessionId;

    let currentPartnerId =
      partnerIdRef.current ||
      localStorage.getItem("partnerId");

    try {
      if (currentPartnerId) {
        try {
          const parsed = JSON.parse(currentPartnerId);

          if (
            typeof parsed === "object" &&
            parsed !== null
          ) {
            currentPartnerId =
              parsed?._id ||
              parsed?.id ||
              parsed?.partnerId ||
              currentPartnerId;
          }
        } catch {}
      }

      setIsEnding(true);

      await cleanupAgora();

      if (currentSessionId || currentPartnerId) {
        await endAgoraSession({
          sessionId: currentSessionId || undefined,
          partnerId: currentPartnerId || undefined,
        });
      }

      setSessionId(null);
      setViewerCount(0);
      setDuration(0);
    } catch (error) {
      console.error("End live error:", error);

      alert(
        error?.message ||
          "Failed to end live session."
      );
    } finally {
      setIsEnding(false);
    }
  };

  const toggleCamera = async () => {
    if (!cameraTrackRef.current || !isLive) return;

    try {
      const nextState = !cameraOn;

      await cameraTrackRef.current.setEnabled(
        nextState
      );

      setCameraOn(nextState);

      const videoElement =
        document.getElementById("agora-local-video");

      if (videoElement && nextState) {
        cameraTrackRef.current.play(videoElement);
      }
    } catch (error) {
      console.error("Camera toggle error:", error);
    }
  };

  const toggleMic = async () => {
    if (!micTrackRef.current || !isLive) return;

    try {
      const nextState = !micOn;

      await micTrackRef.current.setEnabled(nextState);

      setMicOn(nextState);
    } catch (error) {
      console.error("Mic toggle error:", error);
    }
  };

  useEffect(() => {
    return () => {
      stopViewerPolling();
      stopDurationTimer();

      if (cameraTrackRef.current) {
        cameraTrackRef.current.stop();
        cameraTrackRef.current.close();
      }

      if (micTrackRef.current) {
        micTrackRef.current.stop();
        micTrackRef.current.close();
      }

      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, []);

  return (
    <div className="live-streaming-page">
      <div className="live-streaming-header">
        <div>
          <h1>Live Streaming</h1>
          <p>
            Start and manage your live astrology sessions
          </p>
        </div>

        <div
          className={`stream-status ${
            isLive ? "live" : ""
          }`}
        >
          <span className="status-dot" />
          {isLive ? "Live Now" : "Offline"}
        </div>
      </div>

      <div className="stream-layout">
        <div className="stream-main-card">
          <div className="stream-preview">
            {isLive && cameraOn ? (
              <div
                id="agora-local-video"
                className="agora-local-video"
              />
            ) : (
              <div className="camera-placeholder">
                {cameraOn ? (
                  <Video size={58} />
                ) : (
                  <VideoOff size={58} />
                )}

                <span>
                  {cameraOn
                    ? "Camera Preview"
                    : "Camera is Off"}
                </span>
              </div>
            )}

            {isLive && (
              <div className="live-badge">
                <span />
                LIVE
              </div>
            )}

            <div className="viewers-badge">
              <Eye size={15} />
              {viewerCount} Viewers
            </div>
          </div>

          <div className="stream-controls">
            <button
              type="button"
              className={`stream-control-btn ${
                !micOn ? "off" : ""
              }`}
              onClick={toggleMic}
              disabled={!isLive}
              title={
                micOn
                  ? "Mute microphone"
                  : "Unmute microphone"
              }
            >
              {micOn ? (
                <Mic size={19} />
              ) : (
                <MicOff size={19} />
              )}
            </button>

            <button
              type="button"
              className={`stream-control-btn ${
                !cameraOn ? "off" : ""
              }`}
              onClick={toggleCamera}
              disabled={!isLive}
              title={
                cameraOn
                  ? "Turn camera off"
                  : "Turn camera on"
              }
            >
              {cameraOn ? (
                <Video size={19} />
              ) : (
                <VideoOff size={19} />
              )}
            </button>

            <button
              type="button"
              className="stream-control-btn"
              disabled={!isLive}
            >
              <Settings size={19} />
            </button>

            {!isLive ? (
              <button
                type="button"
                className="start-stream-btn"
                onClick={handleStartLive}
                disabled={isStarting}
              >
                <Play size={18} />
                {isStarting
                  ? "Starting..."
                  : "Start Live"}
              </button>
            ) : (
              <button
                type="button"
                className="end-stream-btn"
                onClick={handleEndLive}
                disabled={isEnding}
              >
                <Square size={17} />
                {isEnding
                  ? "Ending..."
                  : "End Live"}
              </button>
            )}
          </div>
        </div>

        <div className="stream-sidebar">
          <div className="stream-card">
            <div className="stream-card-title">
              <div>
                <h3>Live Session</h3>
                <p>Session details</p>
              </div>

              <Radio size={20} />
            </div>

            <div className="session-field">
              <label>Session Title</label>

              <input
                type="text"
                value={sessionTitle}
                onChange={(e) =>
                  setSessionTitle(e.target.value)
                }
                placeholder="Enter session title"
                disabled={isLive}
              />
            </div>

            <div className="session-field">
              <label>Category</label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="Enter category"
                disabled={isLive}
              />
            </div>

            <div className="stream-stats">
              <div className="stream-stat">
                <Users size={20} />

                <div>
                  <strong>{viewerCount}</strong>
                  <span>Viewers</span>
                </div>
              </div>

              <div className="stream-stat">
                <Clock size={20} />

                <div>
                  <strong>
                    {formatDuration(duration)}
                  </strong>

                  <span>Duration</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stream-card">
            <div className="stream-card-title">
              <div>
                <h3>Quick Actions</h3>
                <p>Manage your stream</p>
              </div>

              <Settings size={20} />
            </div>

            <div className="quick-actions">
              <button type="button" disabled={!isLive}>
                <MessageCircle size={18} />
                Open Chat
              </button>

              <button type="button" disabled={!isLive}>
                <Users size={18} />
                View Participants
              </button>

              <button type="button" disabled={!isLive}>
                <Settings size={18} />
                Stream Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreaming;