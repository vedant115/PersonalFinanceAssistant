import React, { useState, useEffect, useRef, useCallback } from "react";
import CameraCapture from "./CameraCapture";
import apiService from "../services/apiService";

const ReceiptUpload = ({ onReceiptProcessed, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((files) => {
    if (files && files.length > 0) {
      const file = files[0];
      processReceiptFile(file);
    }
  }, []);

  const processReceiptFile = useCallback(
    async (file) => {
      setIsProcessing(true);
      setUploadedImage(URL.createObjectURL(file));

      try {
        const formData = new FormData();
        formData.append("receipt", file);

        console.log("Uploading file:", file.name, file.type, file.size);
        const response = await apiService.post("/receipts/upload", formData);
        console.log("Upload response:", response.data);
        onReceiptProcessed(response.data);
      } catch (error) {
        console.error("Upload error:", error);
        console.error("Error response:", error.response?.data);
        onError("Failed to process receipt");
      } finally {
        setIsProcessing(false);
      }
    },
    [onReceiptProcessed, onError]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleCameraCapture = useCallback(
    (file) => {
      setShowCamera(false);
      processReceiptFile(file);
    },
    [processReceiptFile]
  );

  const clearImage = useCallback(() => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadedImage]);

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedImage && !isProcessing ? (
          <div className="space-y-4">
            <img
              src={uploadedImage}
              alt="Uploaded receipt"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={clearImage}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {isProcessing ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Processing receipt...</p>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Upload Receipt
                  </p>
                  <p className="text-sm text-gray-600">
                    Drag and drop your receipt image here, or click to select
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
      </div>

      {!isProcessing && !uploadedImage && (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Choose File</span>
          </button>

          <button
            onClick={() => setShowCamera(true)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
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
            <span>Take Photo</span>
          </button>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Supported formats: JPEG, PNG, PDF • Max size: 10MB</p>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default ReceiptUpload;
