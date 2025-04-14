import { useState } from "react";
import { Textarea, Spinner, Chip, Divider, Button } from "@heroui/react";
import { Copy, Check, RefreshCw } from "lucide-react";

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
  instagram: {
    title: "Weekend Smart Home Glow-Up ✨🏡",
    description:
      "Swipe to see the before & after! 😍 I turned my basic house into a smart home in just one weekend. From smart lights to voice controls — everything is now connected! 🔌📱\n\nWould you try this at home?\n\n#SmartHomeGoals #WeekendProject #HomeTech #DIYUpgrade #SmartLiving",
    tags: [
      "SmartHomeGoals",
      "WeekendProject",
      "HomeTech",
      "DIYUpgrade",
      "SmartLiving",
    ],
    transcription:
      "This weekend, I challenged myself to make my house smarter — and it totally worked! The lights, the thermostat, even my coffee machine… all automated now. Here’s how I pulled it off 👇",
  },
};

interface PlatformContentProps {
  platform: keyof typeof platformContent;
  isLoading: boolean;
  isVideoUploaded: boolean;
}

export default function PlatformContent({
  platform,
  isLoading,
  isVideoUploaded,
}: PlatformContentProps) {
  const content = platformContent[platform];
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isVideoUploaded) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-purple-300">
          Upload a video to generate AI content for{" "}
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner color="secondary" size="lg" />
        <p className="mt-4 text-purple-300">
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
          <label className="text-sm text-purple-300 font-medium">Title</label>
          <Button
            size="sm"
            variant="flat"
            className="text-xs bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"
            onPress={() => handleCopy(content.title, "title")}
            startContent={
              copied === "title" ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} />
              )
            }
          >
            {copied === "title" ? "Copied!" : "Copy"}
          </Button>
        </div>
        <Textarea
          value={content.title}
          variant="bordered"
          className="w-full bg-zinc-900/80 border-purple-800/30 text-white"
          minRows={2}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-purple-300 font-medium">
            Description
          </label>
          <Button
            size="sm"
            variant="flat"
            className="text-xs bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"
            onPress={() => handleCopy(content.description, "description")}
            startContent={
              copied === "description" ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} />
              )
            }
          >
            {copied === "description" ? "Copied!" : "Copy"}
          </Button>
        </div>
        <Textarea
          value={content.description}
          variant="bordered"
          className="w-full bg-zinc-900/80 border-purple-800/30 text-white"
          minRows={4}
        />
      </div>

      <div>
        <label className="text-sm text-purple-300 font-medium block mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {content.tags.map((tag, index) => (
            <Chip
              key={index}
              color="secondary"
              variant="flat"
              classNames={{
                base: "bg-purple-900/50 text-purple-200 border border-purple-700/50",
                content: "text-purple-200",
              }}
            >
              #{tag}
            </Chip>
          ))}
        </div>
        <Button
          size="sm"
          variant="flat"
          className="text-xs bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"
          onPress={() =>
            handleCopy(content.tags.map((tag) => `#${tag}`).join(" "), "tags")
          }
          startContent={
            copied === "tags" ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} />
            )
          }
        >
          {copied === "tags" ? "Copied!" : "Copy All Tags"}
        </Button>
      </div>

      <Divider className="bg-purple-800/30" />

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-purple-300 font-medium">
            Transcription
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              className="text-xs bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"
              onPress={() => handleCopy(content.transcription, "transcription")}
              startContent={
                copied === "transcription" ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} />
                )
              }
            >
              {copied === "transcription" ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="flat"
              className="text-xs bg-purple-900/40 text-purple-300 hover:bg-purple-800/50"
              startContent={<RefreshCw size={14} />}
            >
              Regenerate
            </Button>
          </div>
        </div>
        <Textarea
          value={content.transcription}
          variant="bordered"
          className="w-full bg-zinc-900/80 border-purple-800/30 text-white"
          minRows={6}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="flat"
          className="bg-purple-900/60 text-purple-300 hover:bg-purple-800/70 border border-purple-700/50"
          startContent={<RefreshCw size={16} />}
        >
          Regenerate All
        </Button>
        <Button
          color="success"
          className="bg-green-700 hover:bg-green-600 text-white border border-green-600/50"
          startContent={<Check size={16} />}
        >
          Save Content
        </Button>
      </div>
    </div>
  );
}
