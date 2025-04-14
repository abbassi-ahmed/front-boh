import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  duration: string;
  uploadDate: string;
  url: string | File;
}

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Format duration as MM:SS
      const minutes = Math.floor(videoRef.current.duration / 60);
      const seconds = Math.floor(videoRef.current.duration % 60);
      video.duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  // Create object URL for File objects
  const [videoUrl, setVideoUrl] = useState("");
  useEffect(() => {
    if (video.url instanceof File) {
      const url = URL.createObjectURL(video.url);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoUrl(video.url);
    }
  }, [video.url]);

  return (
    <div className="w-full">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            loop
          />
        ) : (
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            isIconOnly
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            size="lg"
            radius="full"
            onPress={togglePlay}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
        </div>

        {/* Video controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-white"
                onPress={togglePlay}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
              <span className="text-xs text-white">{video.duration}</span>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-white"
              onPress={toggleMute}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-1 bg-white/30 rounded-full mt-2 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <h3 className="text-lg text-purple-800 dark:text-purple-400 font-semibold">
        {video.title}
      </h3>
    </div>
  );
}
