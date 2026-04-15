import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function FacialExpression({
  setSongs,
  setPlaying,
  setCurrentMood,
}) {
  const videoRef = useRef();
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState("");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detectedExpression, setDetectedExpression] = useState(null);

  const loadModels = async () => {
    try {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setIsModelLoaded(true);
    } catch (err) {
      console.error("Error loading models:", err);
      setError("Failed to load AI models. Please refresh the page.");
    }
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
        setError("Unable to access webcam. Please check permissions.");
      });
  };

  async function detectMood() {
    if (!videoRef.current) return;

    setError("");
    setIsDetecting(true);
    setDetectedExpression(null);

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      let expressionPoint = 0;
      let expressionType = "";

      if (!detections || detections.length === 0) {
        console.log("No face detected");
        setError(
          "No face detected. Please position your face clearly in the camera.",
        );
        setIsDetecting(false);
        return;
      }

      for (const expression of Object.keys(detections[0].expressions)) {
        if (detections[0].expressions[expression] > expressionPoint) {
          expressionPoint = detections[0].expressions[expression];
          expressionType = expression;
        }
      }

      setDetectedExpression(expressionType);
      setCurrentMood(expressionType);
      console.log("Detected mood:", expressionType);

      const response = await axios.get(
        `https://vibify-p0rh.onrender.com/api/songs?mood=${expressionType}`,
      );

      setSongs(response.data.song || []);
      setPlaying(null);

      if (!response.data.song || response.data.song.length === 0) {
        setError(`No songs found for mood: ${expressionType}`);
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Could not fetch songs. Please check if the server is running.");
    } finally {
      setIsDetecting(false);
    }
  }

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  const moodEmoji = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
    neutral: "😐",
    fearful: "😨",
    disgusted: "😖",
  };

  return (
    <div className="facial flex flex-col gap-4 relative">
      {/* Video and Controls Container */}
      <div className="flex flex-col gap-4">
        {/* Video Feed */}
        <div className="relative flex-1">
          <div className="relative rounded-xl overflow-hidden border-2 border-slate-700/50 bg-slate-950 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-[25vh] lg:h-[39vh] object-cover mirror-video"
            />

            {/* Overlay indicators */}
            {!isModelLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-300">Loading AI models...</p>
                </div>
              </div>
            )}

            {/* Detection overlay */}
            {isDetecting && (
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-slate-900/90 backdrop-blur-sm border border-purple-500/50 rounded-lg px-4 py-2 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-purple-300">
                    Analyzing facial expression...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Camera indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs text-slate-300">Camera Active</span>
          </div>
        </div>

        {/* Controls and Instructions */}
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between gap-4">
            {/* Stats */}
            <div className="w-1/2 min-h-fit flex lg:block justify-center bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl px-3 py-4">
              <p className="text-[3.5vw] xl:text-[1.3vw] font-bold capitalize flex items-center justify-center gap-2 text-center text-purple-300">
                <span className="text-2xl">
                  {moodEmoji[detectedExpression]}
                </span>
                {detectedExpression ? detectedExpression : "Unknown mood"}
              </p>
            </div>

            {/* detect button */}

            <button className="group w-1/2 min-h-fit text-[3.5vw] xl:text-[1.3vw] relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl px-3 py-4 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50 disabled:hover:shadow-none"
              onClick={detectMood}
              disabled={isDetecting || !isModelLoaded}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isDetecting ? (
                  <span>Detecting...</span>
                ) : (
                  <span>Detect Mood</span>
                )}
              </span>
            </button>
          </div>

          {/* Instructions Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hidden lg:block">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              How it works
            </h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Position your face in the camera frame</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Ensure good lighting for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Click "Detect My Mood" to analyze</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Get personalized song recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500 w-full absolute border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-300">Error</p>
            <p className="text-xs text-red-200/80 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
