import type React from "react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Upload, FileVideo } from "lucide-react";

interface VideoUploaderProps {
  onUploadSuccess: (file: File) => void;
}

export default function VideoUploader({ onUploadSuccess }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      onUploadSuccess(files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type.startsWith("video/")) {
      onUploadSuccess(files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
      <div
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-gray-300 dark:border-gray-700"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: "280px" }}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragging ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <FileVideo size={48} className="text-primary" />
            </div>
            <h3 className="text-xl text-purple-800 dark:text-purple-400 font-semibold mb-2">
              Upload your video
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Drag and drop your video file here, or click the button below to
              select a file
            </p>
            <Button
              color="primary"
              startContent={<Upload size={18} />}
              onPress={handleFileSelect}
            >
              Select Video
            </Button>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: MP4, MOV, AVI, WebM (Max 500MB)
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
