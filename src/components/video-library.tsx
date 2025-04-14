import { Card, CardBody, CardFooter, Button, Skeleton } from "@heroui/react";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

export default function VideoLibrary({ videos, loading }: any) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    if (playingVideo === videoId) {
      video.pause();
      setPlayingVideo(null);
    } else {
      if (playingVideo) {
        const currentVideo = videoRefs.current[playingVideo];
        currentVideo?.pause();
      }

      video
        .play()
        .then(() => setPlayingVideo(videoId))
        .catch((error) => console.error("Error playing video:", error));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gradient-to-b from-purple-900/20 to-black p-6 rounded-xl min-h-screen">
      {loading
        ? Array(8)
            .fill(null)
            .map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="w-full h-full bg-black/40 backdrop-blur-sm"
              >
                <CardBody className="p-0 h-48">
                  <Skeleton className="rounded-lg h-full">
                    <div className="h-full rounded-lg bg-default-300"></div>
                  </Skeleton>
                </CardBody>
                <CardFooter className="flex flex-col gap-2 p-4">
                  <Skeleton className="w-3/4 rounded-lg">
                    <div className="h-4 w-3/4 rounded-lg bg-default-300"></div>
                  </Skeleton>
                  <Skeleton className="w-1/2 rounded-lg">
                    <div className="h-3 w-1/2 rounded-lg bg-default-200"></div>
                  </Skeleton>
                </CardFooter>
              </Card>
            ))
        : videos.map((video: any, index: any) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="w-full h-full bg-black/40 backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 flex flex-col">
                <CardBody className="p-0 group relative flex-1">
                  <div className="relative h-full aspect-video overflow-hidden rounded-t-xl">
                    <video
                      ref={(el) => {
                        videoRefs.current[video.id] = el;
                      }}
                      src={video.originalAudioUrl}
                      className="w-full h-full object-cover"
                      loop
                      onClick={() => togglePlay(video.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        isIconOnly
                        className="bg-purple-600 text-white hover:bg-purple-700"
                        size="lg"
                        radius="full"
                        onPress={(e) => {
                          togglePlay(video.id);
                        }}
                      >
                        {playingVideo === video.id ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="flex flex-col items-start gap-2 p-4">
                  <Link
                    to={`/user/video-detail/${video.id}`}
                    className="flex justify-between items-start w-full cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-400 line-clamp-2 text-sm">
                        {video.transcript || "Untitled Video"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded on {formatDate(video.createdAt)}
                      </p>
                    </div>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
    </div>
  );
}
