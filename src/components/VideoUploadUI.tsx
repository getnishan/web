import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Pause, Play, RefreshCw, Video, XCircle } from 'lucide-react';
import designSystem from '../design-system.json';
import { Button } from './ui/Button';

type VideoUploadUIProps = {
  onRecordingComplete: (blob: Blob | null) => void;
};

export const VideoUploadUI = ({ onRecordingComplete }: VideoUploadUIProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRequestingStream, setIsRequestingStream] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestStream = useCallback(async (): Promise<MediaStream | null> => {
    if (stream || isRequestingStream) return stream ?? null;

    try {
      setIsRequestingStream(true);
      if (!navigator?.mediaDevices) {
        setError('Camera access is not supported in this browser.');
        return null;
      }
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });
      setStream(nextStream);
      setError(null);
      return nextStream;
    } catch (err) {
      setError('Unable to access camera/microphone. Please grant permissions.');
      return null;
    } finally {
      setIsRequestingStream(false);
    }
  }, [stream, isRequestingStream]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopStream = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }, [stream]);

  useEffect(() => stopStream, [stopStream]);

  const startRecording = async () => {
    const activeStream = stream ?? (await requestStream());
    if (!activeStream) return;

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(activeStream, { mimeType: 'video/webm' });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      onRecordingComplete(blob);
      setIsRecording(false);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const resetRecording = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedUrl(null);
    onRecordingComplete(null);
  };

  return (
    <div
      className="rounded-2xl border border-neutral-light bg-white p-6 space-y-4 shadow-sm"
      style={{ boxShadow: designSystem.components.card.shadow }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-secondary">Record a short video (max 2 minutes)</p>
          <p className="text-sm text-neutral-gray">Share your motivation in your own words.</p>
        </div>
        <Video className="text-primary" size={20} />
      </div>

      <div className="relative rounded-xl overflow-hidden bg-neutral-light aspect-video border border-dashed border-neutral-light flex items-center justify-center">
        {recordedUrl ? (
          <video
            controls
            src={recordedUrl}
            className="w-full h-full object-cover"
            aria-label="Recorded motivation video preview"
          />
        ) : stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            aria-label="Live camera preview"
          />
        ) : (
          <div className="flex flex-col items-center text-center text-neutral-gray">
            <Camera className="mb-3" />
            <p className="font-semibold">Camera preview</p>
            <p className="text-sm">Grant permission to start recording</p>
          </div>
        )}

        {isRecording && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-secondary/90 px-3 py-1 text-xs font-semibold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Recording…
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {!recordedUrl && !isRecording && (
          <Button
            type="button"
            onClick={startRecording}
            disabled={isRequestingStream}
            className="flex-1 min-w-[180px]"
          >
            {isRequestingStream ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} /> Enabling camera…
              </>
            ) : (
              <>
                <Play className="mr-2" size={18} /> Start recording
              </>
            )}
          </Button>
        )}

        {isRecording && (
          <Button
            type="button"
            variant="secondary"
            onClick={stopRecording}
            className="flex-1 min-w-[160px]"
          >
            <Pause className="mr-2" size={18} /> Stop &amp; save
          </Button>
        )}

        {recordedUrl && (
          <>
            <Button type="button" onClick={resetRecording} variant="outline" className="flex-1">
              <RefreshCw className="mr-2" size={18} /> Remove video
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                resetRecording();
                await startRecording();
              }}
              className="flex-1"
            >
              <Play className="mr-2" size={18} /> Record new clip
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-neutral-gray">
        We store your video securely for review. You can skip this step if you prefer to type your
        motivation above.
      </p>
    </div>
  );
};

