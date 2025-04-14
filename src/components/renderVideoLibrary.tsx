import { motion } from "framer-motion";
import VideoLibrary from "./video-library";

export default function RenderVideoLibrary({ videos, loading }: any) {
  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-400">
        My Video Library
      </h2>
      <VideoLibrary videos={videos} loading={loading} />
    </motion.div>
  );
}
