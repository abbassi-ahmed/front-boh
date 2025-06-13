export interface PostingTime {
  notes: string;
  timezone: string;
  best_days: string[];
  best_hours: string;
}

export interface PlatformData {
  tags: string[];
  title: string;
  description: string;
  posting_time: PostingTime;
}

export interface CrossPlatformTips {
  general_advice: string;
  recommendations: string[];
}

export interface VideoData {
  id: number;
  createdAt: string;
  modifiedAt: string;
  originalAudioUrl: string;
  transcript: string;
  youtube: PlatformData;
  facebook: PlatformData;
  instagram: PlatformData;
  twitter: PlatformData;
  cross_platform_tips: CrossPlatformTips;
}
export interface PlatformCardProps {
  platform: string;
  id: number;
  refetch: () => void;
  data: {
    title: string;
    description: string;
    tags: string[];
    posting_time: {
      notes: string;
      timezone: string;
      best_days: string[];
      best_hours: string;
    };
  };
  setYoutubeAccessToken: React.Dispatch<React.SetStateAction<string>>;
  youtubeAccessToken: string;
  isUploading: boolean;
  uploadProgress: number;
  handleYoutubeLogin: () => void;
  uploadToYouTube: () => void;
  privacyStatus: "public" | "unlisted" | "private";
  handlePostToTwitter: () => void;
  isTwitterAuthenticated: boolean;
  setPrivacyStatus: React.Dispatch<
    React.SetStateAction<"public" | "unlisted" | "private">
  >;
  scheduledPublishTime: string | null;
  setScheduledPublishTime: React.Dispatch<React.SetStateAction<string | null>>;
}
