import React, { useState } from 'react';
import { FaVolumeMute, FaVideoSlash, FaPhoneAlt, FaQuestionCircle } from 'react-icons/fa';

const ToolBar: React.FC = () => {
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(false);

  const toggleAudioMute = (): void => setAudioMuted(!audioMuted);
  const toggleVideoMute = (): void => setVideoMuted(!videoMuted);

  const handleEndVideo = (): void => {
    console.log('End video or leave room');
  };

  const handleAsk = (): void => {
    console.log('Ask button clicked');
  };

  return (
    <div className="flex w-[200px] h-[120px] bg-gray-200 rounded-lg p-2 shadow-md justify-between items-center">
      <button
        onClick={toggleAudioMute}
        className="flex items-center justify-between bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
      >
        <FaVolumeMute className="mr-2 text-lg" />
        {audioMuted ? 'Unmute Audio' : 'Mute Audio'}
      </button>
      <button
        onClick={toggleVideoMute}
        className="flex items-center justify-between bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
      >
        <FaVideoSlash className="mr-2 text-lg" />
        {videoMuted ? 'Unmute Video' : 'Mute Video'}
      </button>
      <button
        onClick={handleEndVideo}
        className="flex items-center justify-between bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
      >
        <FaPhoneAlt className="mr-2 text-lg" />
        End Video / Leave Room
      </button>
      <button
        onClick={handleAsk}
        className="flex items-center justify-between bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
      >
        <FaQuestionCircle className="mr-2 text-lg" />
        Ask
      </button>
    </div>
  );
};

export default ToolBar;