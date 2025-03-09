import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  color: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = navigator.mediaDevices.getUserMedia({ audio: true });

    microphone.then(stream => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) return;

      const draw = () => {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasContext.fillStyle = 'transparent';
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          canvasContext.fillStyle = color;
          canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

          x += barWidth + 1;
        }
      };

      draw();
    }).catch(err => console.error("Error accessing microphone:", err));

    return () => {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [color]);

  return (
    <canvas
      width="200"
      height="50"
      ref={canvasRef}
      style={{ display: 'block' }}
    />
  );
};

export default AudioVisualizer;
