import { Textarea, Spinner, Chip, Divider, Button } from "@heroui/react";
import { Copy, Check, RefreshCw } from "lucide-react";

// Dummy data for different platforms
const platformContent = {
  youtube: {
    title: "How I Built a Smart Home System in One Weekend | DIY Tech Project",
    description:
      "In this video, I show you how I transformed my regular home into a smart home in just one weekend. I cover everything from choosing the right devices to setting them up and connecting them to a central hub. Perfect for beginners looking to get into home automation!\n\n#SmartHome #DIY #TechTutorial",
    tags: ["SmartHome", "DIY", "TechTutorial", "HomeAutomation", "SmartTech"],
    transcription:
      "Hey everyone! Welcome back to my channel. Today I'm going to show you how I transformed my regular home into a smart home in just one weekend. It was actually much easier than I expected...",
  },
  tiktok: {
    title: "Built a SMART HOME in 48hrs 🏠✨ #techtok",
    description:
      "DIY smart home setup in one weekend! Voice control everything now 🔊 #smarthome #diytech",
    tags: ["techtok", "smarthome", "diytech", "homeautomation", "techlife"],
    transcription:
      "POV: You decide to make your entire house smart in just one weekend! First, I got these smart bulbs that change colors with voice commands...",
  },
  facebook: {
    title: "I Built a Complete Smart Home System (and You Can Too!)",
    description:
      "Just finished setting up my entire house with smart devices this weekend! Now I can control everything from my phone or with voice commands. The whole project cost less than $500 and was surprisingly easy to set up. Check out the video to see how I did it and get some ideas for your own home! 🏠✨",
    tags: [
      "SmartHome",
      "DIYProject",
      "TechTips",
      "HomeImprovement",
      "SmartLiving",
    ],
    transcription:
      "Hello friends! I'm really excited to share this project with you today. Over the past weekend, I decided to upgrade my home with some smart technology, and I'm going to walk you through exactly how I did it...",
  },
};

export default function PlatformContent({
  platform,
  isLoading,
  isVideoUploaded,
}: {
  platform: keyof typeof platformContent;
  isLoading: boolean;
  isVideoUploaded: boolean;
}) {
  const content = platformContent[platform];

  if (!isVideoUploaded) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Upload a video to generate AI content for{" "}
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner color="primary" size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Analyzing video and generating content for{" "}
          {platform.charAt(0).toUpperCase() + platform.slice(1)}...
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Title</label>
          <Button
            size="sm"
            variant="light"
            startContent={<Copy size={14} />}
            className="text-xs"
          >
            Copy
          </Button>
        </div>
        <Textarea
          value={content.title}
          variant="bordered"
          className="w-full"
          minRows={2}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Description</label>
          <Button
            size="sm"
            variant="light"
            startContent={<Copy size={14} />}
            className="text-xs"
          >
            Copy
          </Button>
        </div>
        <Textarea
          value={content.description}
          variant="bordered"
          className="w-full"
          minRows={4}
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {content.tags.map((tag, index) => (
            <Chip key={index} color="primary" variant="flat">
              #{tag}
            </Chip>
          ))}
        </div>
        <Button
          size="sm"
          variant="light"
          startContent={<Copy size={14} />}
          className="text-xs"
        >
          Copy All Tags
        </Button>
      </div>

      <Divider />

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Transcription</label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="light"
              startContent={<Copy size={14} />}
              className="text-xs"
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="light"
              startContent={<RefreshCw size={14} />}
              className="text-xs"
            >
              Regenerate
            </Button>
          </div>
        </div>
        <Textarea
          value={content.transcription}
          variant="bordered"
          className="w-full"
          minRows={6}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          color="primary"
          variant="flat"
          startContent={<RefreshCw size={16} />}
        >
          Regenerate All
        </Button>
        <Button color="success" startContent={<Check size={16} />}>
          Save Content
        </Button>
      </div>
    </div>
  );
}
