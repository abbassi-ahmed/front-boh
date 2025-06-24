import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import { formatDuration } from "../../utils/formatDuration";
import RenderVideoSection from "../../components/renderVideoSection";
import RenderVideoLibrary from "../../components/renderVideoLibrary";
import { addToast } from "@heroui/react";
import { useAxios } from "../../hooks/fetch-api.hook";
import RenderPlatformTabs from "../../components/renderPlatformTabs";

export type PlatformKey = "youtube" | "twitter" | "facebook" | "instagram";

export interface Platform {
  key: PlatformKey;
  name: string;
  icon: ReactNode;
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  uploadDate: string;
  url: string;
  playbackUrl?: string;
}

const INITIAL_VIDEO_STATE: Video = {
  id: "user-uploaded",
  title: "Your Uploaded Video",
  duration: "0:00",
  uploadDate: new Date().toLocaleDateString(),
  url: "",
};

export default function MyVideos() {
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformKey>("youtube");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);

  const [uploadedVideo, setUploadedVideo] =
    useState<Video>(INITIAL_VIDEO_STATE);
  const { data } = useAxios(`assembly`, "GET", {}, "data", true);
  useEffect(() => {
    if (data.responseData) {
      setVideos(data.responseData);
    }
  }, [data.responseData]);
  const handleGenerateContent = async () => {
    if (!uploadedVideo.url) {
      alert("Please upload a video first.");
      return;
    }

    setIsProcessing(true);
    try {
      const transcriptionResponse = await axios.post(
        "https://karriery-tech.com/api/assembly/transcribe",
        {
          fileUrl: uploadedVideo.url,
        }
      );
      setGeneratedContent(transcriptionResponse.data.result);
      setTranscript(transcriptionResponse.data.result.transcript);
    } catch (error) {
      console.error("Error processing video:", error);
      alert("Failed to generate transcript. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveContent = async () => {
    if (!generatedContent) {
      alert("Please generate content first.");
      return;
    }

    try {
      setIsSaving(true);

      const saveData = {
        originalAudioUrl: uploadedVideo.url,
        transcript: generatedContent.transcript,
        youtube: generatedContent.youtube,
        facebook: generatedContent.facebook,
        instagram: generatedContent.instagram,
        twitter: generatedContent.twitter,
        cross_platform_tips: generatedContent.cross_platform_tips,
      };

      await axios
        .post("https://karriery-tech.com/api/assembly", saveData)
        .then(() => {
          addToast({
            title: "Saved",
            description: "Content Saved successfully",
            color: "success",
          });
          data.refreshData();
        });
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<Video | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload-boh");
    formData.append("cloud_name", "doj3zwmwc");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/doj3zwmwc/video/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadProgress(0);
      return {
        id: res.data.asset_id,
        title: file.name,
        duration: formatDuration(res.data.duration),
        uploadDate: new Date(res.data.created_at).toLocaleDateString(),
        url: res.data.secure_url,
        playbackUrl: res.data.playback_url,
      };
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress(0);
      return null;
    }
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(INITIAL_VIDEO_STATE);
    setIsVideoUploaded(false);
    setTranscript(null);
  };
  const handleUploadSuccess = async (file: File) => {
    setIsProcessing(true);

    const videoData = await uploadToCloudinary(file);

    if (!videoData) {
      alert("Failed to upload video. Please try again.");
      setIsProcessing(false);
      return;
    }

    setUploadedVideo(videoData);
    setIsVideoUploaded(true);
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-purple-800 dark:text-purple-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI Video Content Generator
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RenderVideoSection
          handleUploadSuccess={handleUploadSuccess}
          isVideoUploaded={isVideoUploaded}
          uploadProgress={uploadProgress}
          uploadedVideo={uploadedVideo}
          isProcessing={isProcessing}
          handleGenerateContent={handleGenerateContent}
          transcript={transcript}
          handleRemoveVideo={handleRemoveVideo}
        />
        <RenderPlatformTabs
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          isProcessing={isProcessing}
          handleSaveContent={handleSaveContent}
          isVideoUploaded={isVideoUploaded}
          generatedContent={generatedContent}
          loading={isSaving}
        />
      </div>

      <RenderVideoLibrary videos={videos} loading={data.loaded} />
    </div>
  );
}
