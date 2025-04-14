import { motion } from "framer-motion";
import { Card, CardBody, Button } from "@heroui/react";
import { CheckCircle } from "lucide-react";

export default function RenderVideoDetails({
  uploadedVideo,
  isProcessing,
  handleGenerateContent,
  transcript,
}: any) {
  return (
    <motion.div
      className="mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="bg-black">
        <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
          <h3 className="text-lg text-purple-800 dark:text-purple-400 font-semibold mb-2">
            Video Details
          </h3>
          <p className="text-sm text-white dark:text-gray-300">
            <span className="font-medium">Duration:</span>{" "}
            {uploadedVideo.duration}
          </p>
          <p className="text-sm text-white dark:text-gray-300">
            <span className="font-medium">Uploaded:</span>{" "}
            {uploadedVideo.uploadDate}
          </p>
          <div className="mt-4">
            <Button
              color="primary"
              className="w-full"
              isLoading={isProcessing}
              startContent={
                !isProcessing && <CheckCircle className="w-4 h-4" />
              }
              onPress={handleGenerateContent}
            >
              {isProcessing ? "Processing with AI..." : "Generate Content"}
            </Button>
            {transcript && (
              <div className="mt-4 text-white dark:text-gray-200">
                <h4 className="font-semibold text-purple-400 mb-2">
                  Transcript:
                </h4>
                <p className="text-sm whitespace-pre-wrap">{transcript}</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
