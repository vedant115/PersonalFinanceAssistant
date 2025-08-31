import React, { useState, useRef, useCallback } from "react";

const CameraCapture = ({ onCapture, onClose }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Unable to access camera. Please check permissions and try again."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
          stopCamera();
        }
      },
      "image/jpeg",
      0.8
    );
  }, [stopCamera]);

  const useImage = useCallback(() => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "receipt-capture.jpg", {
            type: "image/jpeg",
          });
          onCapture(file);
        }
      },
      "image/jpeg",
      0.8
    );
  }, [capturedImage, onCapture]);

  const retakePhoto = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    startCamera();
  }, [capturedImage, startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    onClose();
  }, [stopCamera, capturedImage, onClose]);

  React.useEffect(() => {
    return () => {
      stopCamera();
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [stopCamera, capturedImage]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Capture Receipt</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          {!isStreaming && !capturedImage && (
            <div className="text-center">
              <div className="mb-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Click to start camera
                </p>
              </div>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Start Camera
              </button>
            </div>
          )}

          {isStreaming && (
            <div className="text-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
              <div className="mt-4 space-x-2">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="text-center">
              <img
                src={capturedImage}
                alt="Captured receipt"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
              <div className="mt-4 space-x-2">
                <button
                  onClick={useImage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Use This Photo
                </button>
                <button
                  onClick={retakePhoto}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="text-xs text-gray-500 text-center">
          <p>Position the receipt clearly in the frame</p>
          <p>Ensure good lighting and avoid shadows</p>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
