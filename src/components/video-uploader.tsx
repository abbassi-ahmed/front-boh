import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Upload, FileVideo } from "lucide-react";

export default function VideoUploader({ onUploadSuccess }: any) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    // In a real app, you would handle the file upload here
    onUploadSuccess();
  };

  const handleFileSelect = () => {
    // In a real app, you would handle the file selection here
    onUploadSuccess();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors  bg-gradient-to-b from-purple-900/20 to-black ${
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
          <h3 className="text-xl text-purple-800 font-semibold mb-2">
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
  );
}
