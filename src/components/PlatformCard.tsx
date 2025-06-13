import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Divider,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { Clock, Calendar, Tag, Globe, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlatformCardProps } from "../types/types";
import PrivacySelector from "./PrivacySelector";
import ScheduleSelector from "./ScheduleSelector";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../hooks/fetch-api.hook";

export const PlatformCard = ({
  platform,
  data,
  id,
  youtubeAccessToken,
  isUploading,
  uploadProgress,
  handleYoutubeLogin,
  uploadToYouTube,
  privacyStatus,
  handlePostToTwitter,
  setPrivacyStatus,
  isTwitterAuthenticated,
  scheduledPublishTime,
  setScheduledPublishTime,
  refetch,
}: PlatformCardProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editedTitle, setEditedTitle] = useState(data.title);
  const [editedDescription, setEditedDescription] = useState(data.description);
  const [editedTags, setEditedTags] = useState(data.tags.join(", "));
  const navigate = useNavigate();

  const platformColors = {
    youtube: "bg-red-500/10 border-red-500/30 text-red-400",
    facebook: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    instagram: "bg-pink-500/10 border-pink-500/30 text-pink-400",
    twitter: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  };

  const colorClass = platformColors[platform as keyof typeof platformColors];

  const handleSaveChanges = () => {
    axios
      .put(`${baseUrl}assembly/${id}/${platform}`, {
        title: editedTitle,
        description: editedDescription,
        tags: editedTags.split(",").map((tag) => tag.trim()),
      })
      .then(() => {
        refetch();
        addToast({
          title: "Success",
          description: `Changes saved for ${
            platform.charAt(0).toUpperCase() + platform.slice(1)
          }`,
        });
        onOpenChange();
      });
  };

  return (
    <>
      <Card className={`w-full ${colorClass} border backdrop-blur-sm`}>
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <div className="w-full flex justify-between items-center">
            <h3 className="text-xl font-bold">{data.title}</h3>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onOpen}
              className="text-gray-300 hover:text-white"
            >
              <Edit size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tags.map((tag, index) => (
              <Chip
                key={index}
                size="sm"
                variant="flat"
                startContent={<Tag size={12} />}
                className={`${colorClass} text-xs`}
              >
                {tag}
              </Chip>
            ))}
          </div>
        </CardHeader>
        <CardBody className="py-2 px-4">
          <p className="text-sm text-gray-300">{data.description}</p>
        </CardBody>
        <Divider />
        <CardFooter className="flex-col items-start gap-2 px-4 py-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Clock size={14} /> Best Posting Time
          </h4>
          <div className="grid grid-cols-2 gap-2 w-full text-xs">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span className="text-gray-300">
                {data.posting_time.best_days.join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span className="text-gray-300">
                {data.posting_time.best_hours}
              </span>
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <Globe size={12} />
              <span className="text-gray-300">
                {data.posting_time.timezone}
              </span>
            </div>
          </div>

          <h4 className="text-xl font-bold">Posting Notes</h4>
          <p className="text-sm text-gray-300">{data.posting_time.notes}</p>
          {platform === "twitter" && (
            <div className="w-full mt-4 space-y-4">
              {!isTwitterAuthenticated ? (
                <Button
                  color="secondary"
                  onPress={() => navigate("/user/settings")}
                  className="w-full bg-purple-600 text-white"
                  isDisabled={isUploading}
                  isLoading={isUploading}
                >
                  Connect Twitter Account
                </Button>
              ) : (
                <div>
                  <Button
                    color="secondary"
                    onPress={handlePostToTwitter}
                    className="w-full bg-purple-600 text-white"
                    isDisabled={isUploading}
                    isLoading={isUploading}
                  >
                    {isUploading
                      ? "Uploading to Twitter..."
                      : "Post to Twitter"}
                  </Button>
                  {isUploading && (
                    <Progress
                      value={uploadProgress}
                      className="w-full"
                      color="secondary"
                    />
                  )}
                </div>
              )}
            </div>
          )}
          {platform === "youtube" && (
            <div className="w-full mt-4 space-y-4">
              <PrivacySelector
                value={privacyStatus}
                onChange={setPrivacyStatus}
              />

              <ScheduleSelector
                value={scheduledPublishTime}
                onChange={setScheduledPublishTime}
                privacyStatus={privacyStatus}
              />

              {!youtubeAccessToken ? (
                <Button
                  onPress={handleYoutubeLogin}
                  color="danger"
                  className="w-full bg-red-600 text-white"
                >
                  Connect YouTube Account
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onPress={uploadToYouTube}
                    color="danger"
                    className="w-full bg-red-600 text-white"
                    isDisabled={isUploading}
                    isLoading={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload to YouTube"}
                  </Button>
                  {isUploading && (
                    <Progress
                      value={uploadProgress}
                      className="w-full"
                      color="danger"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit {platform.charAt(0).toUpperCase() + platform.slice(1)} Post
                Details
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mb-4"
                />
                <Textarea
                  label="Description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="mb-4"
                />
                <Input
                  label="Tags (comma separated)"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  description="Separate tags with commas"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveChanges}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
