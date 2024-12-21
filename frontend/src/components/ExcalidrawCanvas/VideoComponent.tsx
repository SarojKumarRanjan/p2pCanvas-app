import React, { useRef, useEffect } from 'react';

interface VideoComponentProps {
  stream: MediaStream;
  isSelf?: boolean;
}

export const VideoComponent: React.FC<VideoComponentProps> = ({ stream, isSelf = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted={isSelf}
      className="w-64 h-48 rounded-lg m-2"
    />
  );
};