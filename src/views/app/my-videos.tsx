import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, Tab, Card, CardBody, Button } from "@heroui/react";
import { Clock, CheckCircle } from "lucide-react";
import VideoUploader from "../../components/video-uploader";
import VideoPlayer from "../../components/video-player";
import PlatformContent from "../../components/platform-content";
import VideoLibrary from "../../components/video-library";

// Dummy data
const dummyVideo = {
  id: "video-1",
  title: "My Awesome Video",
  thumbnail: "/placeholder.svg?height=720&width=1280",
  duration: "3:45",
  uploadDate: "2023-04-12",
  url: "https://example.com/video.mp4",
};

const platforms: {
  key: "youtube" | "tiktok" | "facebook";
  name: string;
  icon: ReactNode;
}[] = [
  { key: "youtube", name: "YouTube", icon: <Clock className="w-5 h-5" /> },
  { key: "tiktok", name: "TikTok", icon: <Clock className="w-5 h-5" /> },
  { key: "facebook", name: "Facebook", icon: <Clock className="w-5 h-5" /> },
];

export default function MyVideos() {
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);

  const handleUploadSuccess = () => {
    setIsVideoUploaded(true);
    // Simulate AI processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-purple-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI Video Content Generator
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Video Upload/Preview */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full bg-black">
            <CardBody className="bg-gradient-to-b from-purple-900/20 to-black ">
              {!isVideoUploaded ? (
                <VideoUploader onUploadSuccess={handleUploadSuccess} />
              ) : (
                <VideoPlayer video={dummyVideo} />
              )}
            </CardBody>
          </Card>

          {isVideoUploaded && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card>
                <CardBody>
                  <h3 className="text-lg font-semibold mb-2">Video Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Duration:</span>{" "}
                    {dummyVideo.duration}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Uploaded:</span>{" "}
                    {dummyVideo.uploadDate}
                  </p>
                  <div className="mt-4">
                    <Button
                      color="primary"
                      className="w-full"
                      isLoading={isProcessing}
                      startContent={
                        !isProcessing && <CheckCircle className="w-4 h-4" />
                      }
                    >
                      {isProcessing
                        ? "Processing with AI..."
                        : "Generate Content"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - AI Generated Content */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="w-full">
            <CardBody>
              <h2 className="text-2xl font-bold mb-4">AI Generated Content</h2>

              <Tabs
                aria-label="Platform options"
                selectedKey={selectedPlatform}
                onSelectionChange={(key) => setSelectedPlatform(key.toString())}
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6",
                }}
              >
                {platforms.map((platform) => (
                  <Tab
                    key={platform.key}
                    title={
                      <div className="flex items-center gap-2">
                        {platform.icon}
                        <span>{platform.name}</span>
                      </div>
                    }
                  >
                    <PlatformContent
                      platform={platform.key}
                      isLoading={isProcessing}
                      isVideoUploaded={isVideoUploaded}
                    />
                  </Tab>
                ))}
              </Tabs>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Video Library Section */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-800 dark:text-white">
          My Video Library
        </h2>
        <VideoLibrary />
      </motion.div>
    </div>
  );
}
