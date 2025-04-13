import { useState } from "react";
import { Button } from "@heroui/react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function VideoPlayer({ video }: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <img
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          className="w-full h-full object-cover"
        />

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
          <div className="w-full h-1 bg-white/30 rounded-full mt-2">
            <div className="w-1/3 h-full bg-primary rounded-full"></div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold">{video.title}</h3>
    </div>
  );
}
