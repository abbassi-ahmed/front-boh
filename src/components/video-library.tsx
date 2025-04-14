import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { MoreVertical, Trash, Edit, Download } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Dummy data for video library
const libraryVideos = [
  {
    id: "video-1",
    title: "Smart Home Setup Guide",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "12:34",
    uploadDate: "2023-04-10",
    platforms: ["youtube", "facebook"],
  },
  {
    id: "video-2",
    title: "10 Productivity Tips for Developers",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "8:21",
    uploadDate: "2023-04-05",
    platforms: ["youtube", "tiktok", "facebook"],
  },
  {
    id: "video-3",
    title: "My Morning Routine as a Software Engineer",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "5:45",
    uploadDate: "2023-03-28",
    platforms: ["tiktok"],
  },
  {
    id: "video-4",
    title: "Building a React App in 30 Minutes",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "31:18",
    uploadDate: "2023-03-15",
    platforms: ["youtube"],
  },
];

const platformIcons: Record<string, ReactNode> = {
  youtube: <Edit className="w-4 h-4 text-red-600" />,
  tiktok: <Edit className="w-4 h-4 text-black dark:text-white" />,
  facebook: <Edit className="w-4 h-4 text-blue-600" />,
};

export default function VideoLibrary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-b from-purple-900/20 to-black p-4 rounded-lg">
      {libraryVideos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="w-full bg-black h-full">
            <CardBody className="p-0">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex flex-col items-start text-left">
              <div className="flex justify-between w-full">
                <h3 className="font-semibold text-sm text-purple-800 dark:text-purple-400 line-clamp-2">
                  {video.title}
                </h3>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Video actions">
                    <DropdownItem key="edit" startContent={<Edit size={16} />}>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="download"
                      startContent={<Download size={16} />}
                    >
                      Download
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      startContent={<Trash size={16} />}
                      className="text-danger"
                      color="danger"
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Uploaded on {video.uploadDate}
              </p>

              <div className="flex gap-1 mt-2">
                {video.platforms.map((platform) => (
                  <Chip
                    key={platform}
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={platformIcons[platform]}
                    className="text-xs"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Chip>
                ))}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
