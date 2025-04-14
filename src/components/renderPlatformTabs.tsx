import { motion } from "framer-motion";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

import { Platform, PlatformKey } from "../views/app/my-videos";
import PlatformContent from "./platform-content";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
const PLATFORMS: Platform[] = [
  {
    key: "youtube",
    name: "YouTube",
    icon: <FaYoutube className="w-5 h-5 text-red-500" />,
  },
  {
    key: "tiktok",
    name: "TikTok",
    icon: <FaTiktok className="w-5 h-5 text-purple-500" />,
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: <FaFacebook className="w-5 h-5 text-blue-500" />,
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: <FaInstagram className="w-5 h-5 text-pink-500" />,
  },
];

export default function RenderPlatformTabs({
  selectedPlatform,
  setSelectedPlatform,
  isProcessing,
  handleSaveContent,
  isVideoUploaded,
  generatedContent,
  loading,
}: any) {
  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="w-full bg-black">
        <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
          <Tabs
            aria-label="Platform options"
            selectedKey={selectedPlatform}
            onSelectionChange={(key) => setSelectedPlatform(key as PlatformKey)}
            color="primary"
            variant="underlined"
            classNames={{ tabList: "gap-6" }}
          >
            {PLATFORMS.map((platform) => (
              <Tab
                key={platform.key}
                title={
                  <div className="flex items-center gap-2">
                    {platform.icon}
                    <span className="text-purple-800 dark:text-purple-400">
                      {platform.name}
                    </span>
                  </div>
                }
              >
                <PlatformContent
                  platform={platform.key}
                  isLoading={isProcessing}
                  onSave={handleSaveContent}
                  isVideoUploaded={isVideoUploaded}
                  generatedContent={generatedContent}
                  loading={loading}
                />
              </Tab>
            ))}
          </Tabs>
        </CardBody>
      </Card>
    </motion.div>
  );
}
