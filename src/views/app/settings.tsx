import { Card, Button, Avatar, Chip, Divider } from "@heroui/react";
import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { useAxios } from "../../hooks/fetch-api.hook";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

interface FacebookProfile {
  name: string;
  email: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  id: string;
}

interface InstagramProfile {
  username: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  profilePic: string;
}

interface YoutubeProfile {
  name: string;
  email: string;
  picture: string;
  youtubeId: string;
  channelId?: string;
  channelStats?: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
    hiddenSubscriberCount: boolean;
  };
  analytics?: {
    totalViews: number;
    totalWatchTime: number;
    totalSubscribers: number;
    recentStats: Array<{
      date: string;
      views: number;
      watchTime: number;
      subscribers: number;
    }>;
  };
}

interface TiktokProfile {
  username: string;
  followers: number;
  likes: number;
  videos: number;
  verified: boolean;
  profilePic: string;
}

export default function SocialSettings() {
  const { user } = useAuth();
  const { userData } = useAxios(
    `users/${user?.id}`,
    "GET",
    {},
    "userData",
    true,
    {}
  );

  const [facebookProfile, setFacebookProfile] =
    useState<FacebookProfile | null>(null);
  const [instagramProfile, setInstagramProfile] =
    useState<InstagramProfile | null>(null);
  const [youtubeProfile, setYoutubeProfile] = useState<YoutubeProfile | null>(
    null
  );
  const [tiktokProfile, setTiktokProfile] = useState<TiktokProfile | null>(
    null
  );

  useEffect(() => {
    if (userData.responseData) {
      setFacebookProfile(userData.responseData.facebookProfile);
      setInstagramProfile(userData.responseData.instagram);
      if (userData.responseData.youtubeProfile) {
        setYoutubeProfile({
          name: userData.responseData.youtubeProfile.name,
          email: userData.responseData.youtubeProfile.email,
          picture: userData.responseData.youtubeProfile.profilePicUrl,
          youtubeId: userData.responseData.youtubeProfile.youtubeId,
          channelId: userData.responseData.youtubeProfile.channelId,
          channelStats: userData.responseData.youtubeProfile.channelStats,
          analytics: userData.responseData.youtubeProfile.analytics,
        });
      }
      setTiktokProfile(userData.responseData.tiktok);
    }
  }, [userData.responseData]);

  const { facebookAssign } = useAxios(
    "users",
    "POST",
    {},
    "facebookAssign",
    false
  );

  const { facebookUnAssign } = useAxios(
    "users",
    "PATCH",
    {},
    "facebookUnAssign",
    false
  );
  const { youtubeAssign } = useAxios(
    "users",
    "POST",
    {},
    "youtubeAssign",
    false
  );

  const { youtubeUnAssign } = useAxios(
    "users",
    "PATCH",
    {},
    "youtubeUnAssign",
    false
  );
  const handleLoginFb = () => {
    (window as any).FB.login(
      (response: any) => {
        if (response.authResponse) {
          fetchUserFbProfile();
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };
  const handleLoginYt = useGoogleLogin({
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
    ].join(" "),
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const channelRes = await axios.get(
          "https://www.googleapis.com/youtube/v3/channels",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
            params: {
              part: "snippet,statistics",
              mine: true,
            },
          }
        );

        const channelData = channelRes.data.items[0];
        const channelStats = channelData.statistics;
        const channelId = channelData.id;

        const analyticsRes = await axios.get(
          "https://youtubeanalytics.googleapis.com/v2/reports",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
            params: {
              startDate: "2024-01-01",
              endDate: new Date().toISOString().split("T")[0],
              metrics: "views,estimatedMinutesWatched,subscribersGained",
              dimensions: "day",
            },
          }
        );

        const analyticsData = analyticsRes.data;
        const totalViews =
          analyticsData.rows?.reduce(
            (sum: number, row: any[]) => sum + row[1],
            0
          ) || 0;
        const totalWatchTime =
          analyticsData.rows?.reduce(
            (sum: number, row: any[]) => sum + row[2],
            0
          ) || 0;
        const totalSubscribers =
          analyticsData.rows?.reduce(
            (sum: number, row: any[]) => sum + row[3],
            0
          ) || 0;

        const recentStats =
          analyticsData.rows.map((row: any[]) => ({
            date: row[0],
            views: row[1],
            watchTime: row[2],
            subscribers: row[3],
          })) || [];

        youtubeAssign.submitRequest(
          {
            youtubeId: res.data.sub,
            name: res.data.name,
            profilePicUrl: res.data.picture,
            email: res.data.email,
            channelId: channelId,
            channelStats: channelStats,
            analytics: {
              totalViews,
              totalWatchTime,
              totalSubscribers,
              recentStats,
            },
          },
          `users/${user?.id}/youtube`,
          true
        );

        setYoutubeProfile({
          youtubeId: res.data.sub,
          name: res.data.name,
          picture: res.data.picture,
          email: res.data.email,
          channelId: channelId,
          channelStats: channelStats,
          analytics: {
            totalViews,
            totalWatchTime,
            totalSubscribers,
            recentStats,
          },
        });
      } catch (err: any) {
        console.error("API Error:", err.response?.data || err.message);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const fetchUserFbProfile = () => {
    (window as any).FB.api(
      "/me",
      {
        fields:
          "id,name,first_name,last_name,email,picture.width(200).height(200),gender,birthday,location,hometown,link",
      },
      (profile: FacebookProfile) => {
        setFacebookProfile(profile);
        facebookAssign.submitRequest(
          {
            facebookId: profile.id,
            name: profile.name,
            profilePicUrl: profile.picture.data.url,
            email: profile.email,
          },
          `users/${user?.id}/facebook`,
          true
        );
      }
    );
  };

  const handleLoginInstagram = () => {
    setInstagramProfile({
      username: "john.doe",
      followers: 2450,
      following: 867,
      posts: 128,
      verified: false,
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    });
  };

  const handleLoginTikTok = () => {
    setTiktokProfile({
      username: "@johndoe",
      followers: 15700,
      likes: 124300,
      videos: 87,
      verified: true,
      profilePic: "https://randomuser.me/api/portraits/men/45.jpg",
    });
  };

  const handleConnect = (platform: string) => {
    if (platform === "facebook") {
      handleLoginFb();
    } else if (platform === "instagram") {
      handleLoginInstagram();
    } else if (platform === "tiktok") {
      handleLoginTikTok();
    } else if (platform === "youtube") {
      handleLoginYt();
    }
  };

  const handleDisconnect = (platform: string) => {
    if (platform === "facebook") {
      setFacebookProfile(null);
      facebookUnAssign.submitRequest(
        {},
        `users/${user?.id}/facebook/unassign`,
        true
      );
      userData.submitRequest({}, `users/${user?.id}`, false);
    } else if (platform === "instagram") {
      setInstagramProfile(null);
    } else if (platform === "youtube") {
      setYoutubeProfile(null);
      youtubeUnAssign.submitRequest(
        {},
        `users/${user?.id}/youtube/unassign`,
        true
      );
      setYoutubeProfile(null);
    } else if (platform === "tiktok") {
      setTiktokProfile(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Social Media Connections
        </h1>
      </div>

      <div className="space-y-4">
        <Card className="bg-zinc-900/60 border border-zinc-800 shadow-md overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  icon={<FaFacebook size={20} />}
                  className="bg-blue-600 text-white h-12 w-12"
                  src={
                    userData?.responseData?.facebookProfile?.profilePicUrl ||
                    facebookProfile?.picture?.data?.url
                  }
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <FaFacebook size={12} className="text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-lg">
                    Facebook
                  </span>
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="bg-blue-600/20 text-blue-400"
                  >
                    Personal
                  </Chip>
                </div>
                <p className="text-zinc-400 text-sm">
                  Connect your personal Facebook account
                </p>
              </div>
            </div>

            {facebookProfile ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <span>{facebookProfile.name}</span>
                  </div>
                </div>
                <Button
                  onPress={() => handleDisconnect("facebook")}
                  color="danger"
                  variant="flat"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onPress={() => handleConnect("facebook")}
                color="primary"
                variant="solid"
                size="sm"
                className="bg-blue-600 text-white"
              >
                Connect
              </Button>
            )}
          </div>
        </Card>

        {/* Instagram Card */}
        <Card className="bg-zinc-900/60 border border-zinc-800 shadow-md overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  icon={<FaInstagram size={20} />}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white h-12 w-12"
                  src={instagramProfile?.profilePic}
                />
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                  <FaInstagram size={12} className="text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-lg">
                    Instagram
                  </span>
                  <Chip
                    size="sm"
                    color="secondary"
                    variant="flat"
                    className="bg-pink-600/20 text-pink-400"
                  >
                    Creator
                  </Chip>
                </div>
                <p className="text-zinc-400 text-sm">
                  Connect your Instagram creator account
                </p>
              </div>
            </div>

            {instagramProfile ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <span>{instagramProfile.username}</span>
                    {instagramProfile.verified && (
                      <MdVerified className="text-blue-400" size={16} />
                    )}
                  </div>
                  <p className="text-zinc-400">
                    {instagramProfile.followers.toLocaleString()} followers
                  </p>
                </div>
                <Button
                  onPress={() => handleDisconnect("instagram")}
                  color="danger"
                  variant="flat"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onPress={() => handleConnect("instagram")}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Connect
              </Button>
            )}
          </div>

          {instagramProfile && (
            <>
              <Divider className="bg-zinc-800" />
              <div className="px-5 py-3 flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-zinc-400 text-xs">FOLLOWERS</p>
                    <p className="text-white font-medium">
                      {instagramProfile.followers.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-400 text-xs">FOLLOWING</p>
                    <p className="text-white font-medium">
                      {instagramProfile.following.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-400 text-xs">POSTS</p>
                    <p className="text-white font-medium">
                      {instagramProfile.posts.toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* <Button variant="ghost" size="sm" className="text-pink-400">
                  View Insights
                </Button> */}
              </div>
            </>
          )}
        </Card>

        {/* YouTube Card */}
        <Card className="bg-zinc-900/60 border border-zinc-800 shadow-md overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  icon={<FaYoutube size={20} />}
                  className="bg-red-600 text-white h-12 w-12"
                  src={
                    userData?.responseData?.youtubeProfile?.profilePicUrl ||
                    youtubeProfile?.picture
                  }
                />
                <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1">
                  <FaYoutube size={12} className="text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-lg">
                    YouTube
                  </span>
                  <Chip
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="bg-red-600/20 text-red-400"
                  >
                    Content Creator
                  </Chip>
                </div>
                <p className="text-zinc-400 text-sm">
                  Connect your YouTube channel
                </p>
              </div>
            </div>

            {youtubeProfile ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <span>{youtubeProfile.name}</span>
                  </div>
                </div>
                <Button
                  onPress={() => handleDisconnect("youtube")}
                  color="danger"
                  variant="flat"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onPress={() => handleConnect("youtube")}
                color="danger"
                variant="solid"
                size="sm"
                className="bg-red-600 text-white"
              >
                Connect
              </Button>
            )}
          </div>
          {(youtubeProfile?.channelStats || youtubeProfile?.analytics) && (
            <>
              <Divider className="bg-zinc-800" />
              <div className="px-5 py-3">
                <h4 className="text-sm font-medium text-zinc-300 mb-3">
                  Channel Statistics
                </h4>

                {youtubeProfile.channelStats && (
                  <div className="flex gap-6 mb-4">
                    <div className="text-center">
                      <p className="text-zinc-400 text-xs">CHANNEL VIEWS</p>
                      <p className="text-white font-medium">
                        {parseInt(
                          youtubeProfile.channelStats.viewCount
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-zinc-400 text-xs">SUBSCRIBERS</p>
                      <p className="text-white font-medium">
                        {youtubeProfile.channelStats.hiddenSubscriberCount
                          ? "Hidden"
                          : parseInt(
                              youtubeProfile.channelStats.subscriberCount
                            ).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-zinc-400 text-xs">VIDEOS</p>
                      <p className="text-white font-medium">
                        {parseInt(
                          youtubeProfile.channelStats.videoCount
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {youtubeProfile.analytics && (
                  <>
                    <h4 className="text-sm font-medium text-zinc-300 mb-3 mt-4">
                      Analytics (Last 6 Months)
                    </h4>
                    <div className="flex gap-6 mb-4">
                      <div className="text-center">
                        <p className="text-zinc-400 text-xs">TOTAL VIEWS</p>
                        <p className="text-white font-medium">
                          {youtubeProfile.analytics.totalViews.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-zinc-400 text-xs">WATCH TIME</p>
                        <p className="text-white font-medium">
                          {Math.floor(
                            youtubeProfile.analytics.totalWatchTime / 60
                          )}{" "}
                          hours
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-zinc-400 text-xs">
                          SUBSCRIBERS GAINED
                        </p>
                        <p className="text-white font-medium">
                          {youtubeProfile.analytics.totalSubscribers.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-zinc-400">
                        RECENT ACTIVITY
                      </h5>
                      {youtubeProfile.analytics.recentStats.map(
                        (stat, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-zinc-300">
                              {new Date(stat.date).toLocaleDateString()}
                            </span>
                            <div className="flex gap-4">
                              <span className="text-zinc-400">
                                {stat.views} views
                              </span>
                              <span className="text-zinc-400">
                                {stat.watchTime} mins
                              </span>
                              <span
                                className={
                                  stat.subscribers > 0
                                    ? "text-green-400"
                                    : "text-zinc-400"
                                }
                              >
                                {stat.subscribers} subs
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </Card>

        <Card className="bg-zinc-900/60 border border-zinc-800 shadow-md overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  icon={<FaTiktok size={20} />}
                  className="bg-zinc-800 text-white h-12 w-12"
                  src={tiktokProfile?.profilePic}
                />
                <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                  <FaTiktok size={12} className="text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-lg">
                    TikTok
                  </span>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-zinc-800 text-zinc-300"
                  >
                    Creator
                  </Chip>
                </div>
                <p className="text-zinc-400 text-sm">
                  Connect your TikTok creator account
                </p>
              </div>
            </div>

            {tiktokProfile ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <span>{tiktokProfile.username}</span>
                    {tiktokProfile.verified && (
                      <MdVerified className="text-teal-400" size={16} />
                    )}
                  </div>
                  <p className="text-zinc-400">
                    {tiktokProfile.followers.toLocaleString()} followers
                  </p>
                </div>
                <Button
                  onPress={() => handleDisconnect("tiktok")}
                  color="danger"
                  variant="flat"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onPress={() => handleConnect("tiktok")}
                color="default"
                variant="solid"
                size="sm"
                className="bg-zinc-800 text-white"
              >
                Connect
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
