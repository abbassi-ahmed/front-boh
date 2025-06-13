import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Tabs,
  Tab,
  Divider,
  Spinner,
  addToast,
} from "@heroui/react";
import { Play, Pause, Info } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios } from "../../hooks/fetch-api.hook";
import axios from "axios";
import { VideoData } from "../../types/types";
import { PlatformCard } from "../../components/PlatformCard";

const platformIcons = {
  youtube: <FaYoutube size={24} className="text-red-500" />,
  facebook: <FaFacebook size={24} className="text-blue-500" />,
  instagram: <FaInstagram size={24} className="text-pink-500" />,
  twitter: <FaTwitter size={24} className="text-purple-500" />,
};

export default function VideoDetailsPage() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [youtubeAccessToken, setYoutubeAccessToken] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scheduledPublishTime, setScheduledPublishTime] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const { data } = useAxios(`assembly/${id}`, "GET", {}, "data", false);
  const [privacyStatus, setPrivacyStatus] = useState<
    "public" | "unlisted" | "private"
  >("public");

  useEffect(() => {
    if (id) data.submitRequest({}, `assembly/${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (data.responseData) setVideoData(data.responseData);
  }, [data.responseData]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlatform, setActivePlatform] = useState("youtube");
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Error playing video:", error));
    }
  };

  useEffect(() => {
    const storedOauthData = JSON.parse(
      localStorage.getItem("oauth_data") || "{}"
    );

    if (storedOauthData.oauth_token && storedOauthData.user_id) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("youtubeToken");
    if (token) {
      setYoutubeAccessToken(token);
    }
  }, []);

  const handleYoutubeLogin = async () => {
    navigate("/user/settings");
  };

  const uploadToYouTube = async () => {
    if (!youtubeAccessToken || !videoData) return;

    setIsUploading(true);
    setUploadProgress(0);

    const metadata = {
      snippet: {
        title: videoData.youtube.title,
        description: videoData.youtube.description,
        tags: videoData.youtube.tags,
      },
      status: {
        privacyStatus,
        ...(scheduledPublishTime && privacyStatus === "private"
          ? { publishAt: scheduledPublishTime }
          : {}),
      },
    };

    try {
      const videoResponse = await fetch(videoData.originalAudioUrl);
      const videoBlob = await videoResponse.blob();

      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append("file", videoBlob);

      const response = await axios.post(
        "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
        formData,
        {
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
            "Content-Type": "multipart/related",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      window.open(`https://youtube.com/watch?v=${response.data.id}`, "_blank");
    } catch (error: any) {
      console.error("Error uploading video:", error);
      if (
        error.response?.data?.error?.message?.includes(
          "exceeded the number of videos"
        )
      ) {
        alert(
          "Upload limit reached: Your YouTube account has exceeded its daily upload quota. Please try again tomorrow."
        );
      } else {
        alert("Failed to upload video");
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!videoData) {
    return (
      <div className="flex flex-col justify-center text-center">
        <Spinner size="lg" />
        <p className="text-lg text-purple-800">Loading...</p>
      </div>
    );
  }

  const handlePostToTwitter = async () => {
    try {
      setIsUploading(true);
      await axios
        .post("http://localhost:3000/api/twitter/post", {
          text: `${videoData.twitter.title} description: ${videoData.twitter.description}`,
          videoUrl: videoData.originalAudioUrl,
        })
        .then(() => {
          addToast({
            title: "Success",
            description: "Tweet posted successfully!",
          });
        });
    } catch (error) {
      console.error("Error posting tweet:", error);
      alert("Failed to post tweet");
    } finally {
      setIsUploading(false);
    }
  };

  const renderPlatformPreview = () => {
    switch (activePlatform) {
      case "youtube":
        return (
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-gray-700">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 flex items-center px-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-auto text-xs text-gray-400">YouTube</div>
            </div>
            <video
              ref={videoRef}
              src={videoData.originalAudioUrl}
              className="w-full h-full object-cover"
              loop
              onClick={togglePlay}
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
              <div className="text-white text-sm font-medium">
                {videoData.youtube.title}
              </div>
              <div className="text-gray-300 text-xs mt-1">
                {videoData.youtube.description.substring(0, 60)}...
              </div>
            </div>
          </div>
        );
      case "facebook":
        return (
          <div className="relative w-full h-full bg-white rounded-lg overflow-hidden border border-gray-300">
            <div className="absolute top-0 left-0 right-0 h-10 bg-blue-600 flex items-center px-3">
              <div className="text-white font-bold">facebook</div>
            </div>
            <video
              ref={videoRef}
              src={videoData.originalAudioUrl}
              className="w-full h-full object-cover"
              loop
              onClick={togglePlay}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200">
              <div className="text-gray-800 font-medium">
                {videoData.facebook.title}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {videoData.facebook.description.substring(0, 80)}...
              </div>
              <div className="flex mt-2 space-x-2">
                <span className="text-blue-500 text-sm">Like</span>
                <span className="text-gray-500 text-sm">Comment</span>
                <span className="text-gray-500 text-sm">Share</span>
              </div>
            </div>
          </div>
        );
      case "instagram":
        return (
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-pink-500/30">
            <div className="absolute top-0 left-0 right-0 h-10 flex items-center px-3 justify-between">
              <div className="text-white font-bold">Instagram</div>
              <div className="text-white text-sm">•••</div>
            </div>
            <video
              ref={videoRef}
              src={videoData.originalAudioUrl}
              className="w-full h-full object-cover"
              loop
              onClick={togglePlay}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
              <div className="text-white text-sm">
                {videoData.instagram.description.substring(0, 100)}...
              </div>
              <div className="flex mt-2 space-x-2">
                {videoData.instagram.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-blue-300 text-xs">
                    #{tag.split(",")[0].trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case "twitter":
        return (
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-purple-500/30">
            <div className="absolute top-0 left-0 right-0 h-10 flex items-center px-3 justify-between">
              <div className="text-white font-bold">For You</div>
              <div className="text-white text-sm">🔍</div>
            </div>
            <video
              ref={videoRef}
              src={videoData.originalAudioUrl}
              className="w-full h-full object-cover"
              loop
              onClick={togglePlay}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="text-white font-medium">
                @user123 • {videoData.twitter.title}
              </div>
              <div className="text-white text-sm mt-1">
                {videoData.twitter.description}
              </div>
              <div className="flex mt-2 space-x-2">
                {videoData.twitter.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-blue-300 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute right-2 bottom-20 flex flex-col space-y-3">
              <div className="text-white text-center">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  ♥
                </div>
                <span className="text-xs">1.2M</span>
              </div>
              <div className="text-white text-center">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  💬
                </div>
                <span className="text-xs">24K</span>
              </div>
              <div className="text-white text-center">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  ↻
                </div>
                <span className="text-xs">5.6K</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <video
            ref={videoRef}
            src={videoData.originalAudioUrl}
            className="w-full h-full object-cover rounded-lg"
            loop
            onClick={togglePlay}
          />
        );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full bg-black/40 backdrop-blur-sm border border-purple-500/20 overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start gap-4 pb-0">
            <div>
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Video Details
              </motion.h1>
              <motion.p
                className="text-purple-300 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ID: {videoData.id} • Created: {formatDate(videoData.createdAt)}
              </motion.p>
            </div>
          </CardHeader>

          <CardBody className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player Section */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="w-full bg-black/60 border border-purple-500/30 overflow-hidden">
                  <CardBody className="p-0 relative group">
                    <div className="aspect-video w-full overflow-hidden">
                      {renderPlatformPreview()}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          isIconOnly
                          className="bg-purple-600 text-white hover:bg-purple-700"
                          size="lg"
                          radius="full"
                          onPress={togglePlay}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="flex flex-col items-start gap-2 p-4">
                    <h3 className="font-semibold text-purple-400 text-lg">
                      Transcript
                    </h3>
                    <p className="text-gray-300 italic">
                      "{videoData.transcript}"
                    </p>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Platform Tabs Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Tabs
                  aria-label="Platform Options"
                  color="secondary"
                  className="w-full"
                  selectedKey={activePlatform}
                  onSelectionChange={(key) => setActivePlatform(key.toString())}
                  classNames={{
                    tabList:
                      "bg-black/40 p-0.5 rounded-lg border border-purple-500/20",
                    cursor: "bg-purple-600",
                    tab: "text-sm data-[selected=true]:text-white",
                  }}
                >
                  {Object.entries(platformIcons).map(([platform, icon]) => (
                    <Tab
                      key={platform}
                      title={
                        <div className="flex items-center gap-2 capitalize">
                          {icon}
                          <span>{platform}</span>
                        </div>
                      }
                    >
                      <PlatformCard
                        platform={platform}
                        refetch={() => {
                          data.submitRequest({}, `assembly/${videoData.id}`);
                        }}
                        id={videoData.id}
                        data={
                          videoData[platform as keyof typeof videoData] as any
                        }
                        isTwitterAuthenticated={isAuthenticated}
                        youtubeAccessToken={youtubeAccessToken}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                        handleYoutubeLogin={handleYoutubeLogin}
                        uploadToYouTube={uploadToYouTube}
                        setYoutubeAccessToken={setYoutubeAccessToken}
                        privacyStatus={privacyStatus}
                        setPrivacyStatus={setPrivacyStatus}
                        handlePostToTwitter={handlePostToTwitter}
                        scheduledPublishTime={scheduledPublishTime}
                        setScheduledPublishTime={setScheduledPublishTime}
                      />
                    </Tab>
                  ))}
                </Tabs>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-purple-900 to-black/90">
                <CardHeader className="flex gap-3">
                  <Info className="text-purple-400" />
                  <div className="flex flex-col">
                    <p className="text-md font-semibold text-white">
                      Cross Platform Tips
                    </p>
                    <p className="text-small text-purple-300">
                      {videoData.cross_platform_tips.general_advice}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <ul className="space-y-2">
                    {videoData.cross_platform_tips.recommendations.map(
                      (tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <div className="min-w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-xs mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-200">{tip}</p>
                        </motion.li>
                      )
                    )}
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
