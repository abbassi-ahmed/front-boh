import { useState } from "react";
import { Textarea, Chip, Divider, Button, Card, CardBody } from "@heroui/react";
import { Copy, Check, Clock, Calendar, Globe } from "lucide-react";

export interface PostingTime {
  best_days: string[];
  best_hours: string;
  timezone: string;
  notes: string;
}

export interface PlatformData {
  title: string;
  description: string;
  tags: string[];
  posting_time: PostingTime;
}

export interface PlatformContentProps {
  platform: string;
  isLoading: boolean;
  isVideoUploaded: boolean;
  onSave: () => void;
  loading: boolean;
  generatedContent?: {
    transcript: string;
    [key: string]: any;
  };
}

export default function PlatformContent({
  platform,
  isLoading,
  isVideoUploaded,
  generatedContent,
  onSave,
  loading,
}: PlatformContentProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const content = generatedContent?.[platform];
  const postingTime = content?.posting_time;

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
      <div className="min-h-[400px] flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-pulse opacity-50"></div>
        </div>
        <div className="mt-8 space-y-2 text-center">
          <p className="text-lg font-semibold text-purple-300">
            AI Magic in Progress
          </p>
          <p className="text-sm text-purple-400/80">
            Crafting engaging content for{" "}
            {platform.charAt(0).toUpperCase() + platform.slice(1)}...
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-purple-300">
          No content generated yet. Click "Generate Content" to start.
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
          {content.tags.map((tag: any, index: any) => (
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
            handleCopy(
              content.tags.map((tag: any) => `#${tag}`).join(" "),
              "tags"
            )
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

      {/* Posting Time Section */}
      {postingTime && (
        <Card className="bg-purple-900/10 border border-purple-800/30">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="font-medium text-purple-300">
                Optimal Posting Time
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Best Days</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {postingTime.best_days.map((day: any, index: any) => (
                    <Chip
                      key={index}
                      classNames={{
                        base: "bg-purple-900/50 text-purple-200",
                        content: "text-xs",
                      }}
                    >
                      {day}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Best Time</span>
                </div>
                <Chip
                  classNames={{
                    base: "bg-purple-900/50 text-purple-200",
                    content: "text-xs",
                  }}
                >
                  {postingTime.best_hours}
                </Chip>
              </div>

              <div className="space-y-2 col-span-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Timezone</span>
                </div>
                <p className="text-sm text-purple-200">
                  {postingTime.timezone}
                </p>
              </div>

              {postingTime.notes && (
                <div className="col-span-2">
                  <p className="text-xs text-purple-300 italic">
                    {postingTime.notes}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <Divider className="bg-purple-800/30" />

      <div className="flex justify-end gap-2 mt-4">
        <Button
          color="success"
          className="bg-green-700 hover:bg-green-600 text-white border border-green-600/50"
          startContent={<Check size={16} />}
          onPress={onSave}
          isLoading={loading}
          disabled={loading}
        >
          {loading ? "Loading..." : "Save Content"}
        </Button>
      </div>
    </div>
  );
}
