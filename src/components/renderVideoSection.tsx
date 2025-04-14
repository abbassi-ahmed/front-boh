import { motion } from "framer-motion";
import { Card, CardBody, Button } from "@heroui/react";
import { Trash2, Upload } from "lucide-react";

import VideoUploader from "./video-uploader";
import { UploadProgressBar } from "./uploadProgress";
import VideoPlayer from "./video-player";
import RenderVideoDetails from "./renderVideoDetails";
import { Video } from "../views/app/my-videos";
import { useRef } from "react";

export default function RenderVideoSection({
  isVideoUploaded,
  uploadProgress,
  uploadedVideo,
  handleUploadSuccess,
  isProcessing,
  handleGenerateContent,
  transcript,
  handleRemoveVideo,
}: {
  isVideoUploaded: boolean;
  uploadProgress: number;
  uploadedVideo: Video;
  isProcessing: boolean;
  handleUploadSuccess: (file: File) => void;
  handleGenerateContent: () => void;
  transcript: string | null;
  handleRemoveVideo: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectNewVideo = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type.startsWith("video/")) {
      handleUploadSuccess(files[0]);
    }
  };

  return (
    <motion.div
      className="lg:col-span-1"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full bg-black">
        <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
          {!isVideoUploaded ? (
            <div>
              <VideoUploader onUploadSuccess={handleUploadSuccess} />
              {uploadProgress > 0 && (
                <UploadProgressBar progress={uploadProgress} />
              )}
            </div>
          ) : (
            <>
              <VideoPlayer video={uploadedVideo} />
              <div className="flex gap-2 mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />
                <Button
                  color="primary"
                  variant="bordered"
                  startContent={<Upload size={18} />}
                  onPress={handleSelectNewVideo}
                  fullWidth
                >
                  Choose Another Video
                </Button>
                <Button
                  color="danger"
                  variant="bordered"
                  startContent={<Trash2 size={18} />}
                  onPress={handleRemoveVideo}
                  fullWidth
                >
                  Remove Video
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {isVideoUploaded && (
        <RenderVideoDetails
          uploadedVideo={uploadedVideo}
          isProcessing={isProcessing}
          handleGenerateContent={handleGenerateContent}
          transcript={transcript}
        />
      )}
    </motion.div>
  );
}
