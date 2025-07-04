import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  ThumbsUp,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";
import { useAxios } from "../../hooks/fetch-api.hook";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

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

const COLORS = ["#9333ea", "#c084fc", "#a855f7", "#d8b4fe"];

export default function Statistics() {
  const { user } = useAuth();
  const [isRefreshingYoutube, setIsRefreshingYoutube] = useState(false);

  const [youtubeToken, setYoutubeToken] = useState<string | null>(null);
  const [youtubeProfile, setYoutubeProfile] = useState<YoutubeProfile | null>(
    null
  );

  const { userData } = useAxios(
    `users/${user?.id}`,
    "GET",
    {},
    "userData",
    true,
    {}
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

  useEffect(() => {
    const youtubeToken = localStorage.getItem("youtubeToken");
    if (youtubeToken) {
      setYoutubeToken(youtubeToken);
    }
    if (userData.responseData) {
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
    }
  }, [userData.responseData]);

  const fetchYoutubeData = async (tokenResponse: { access_token: string }) => {
    try {
      const res = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      console.log("dd", res.data);
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
            ids: "channel==MINE",
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
        analyticsData.rows?.map((row: any[]) => ({
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
        false
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
      throw err;
    }
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
      setYoutubeToken(tokenResponse.access_token);
      localStorage.setItem("youtubeToken", tokenResponse.access_token);
      await fetchYoutubeData(tokenResponse);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const handleRefreshYoutube = async () => {
    if (!youtubeToken) {
      console.error("No YouTube token available");
      return;
    }

    try {
      setIsRefreshingYoutube(true);
      try {
        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${youtubeToken}`,
          },
        });

        await fetchYoutubeData({ access_token: youtubeToken });
      } catch (error) {
        console.log("Token expired or invalid, re-authenticating...");
        handleLoginYt();
      }
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshingYoutube(false);
    }
  };

  const handleDisconnect = () => {
    setYoutubeProfile(null);
    localStorage.removeItem("youtubeToken");
    youtubeUnAssign.submitRequest(
      {},
      `users/${user?.id}/youtube/unassign`,
      true
    );
    setYoutubeProfile(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 p-3 border border-purple-800/30 rounded-md shadow-lg">
          <p className="text-purple-300 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate growth percentages (simplified for demo)
  const viewsGrowth = youtubeProfile?.analytics?.recentStats?.length
    ? ((youtubeProfile.analytics.totalViews -
        youtubeProfile.analytics.recentStats[0].views) /
        youtubeProfile.analytics.recentStats[0].views) *
        100 || 0
    : 0;

  const watchTimeGrowth = youtubeProfile?.analytics?.recentStats?.length
    ? ((youtubeProfile.analytics.totalWatchTime -
        youtubeProfile.analytics.recentStats[0].watchTime) /
        (youtubeProfile.analytics.recentStats[0].watchTime || 1)) *
        100 || 0
    : 0;

  const subscribersGrowth = youtubeProfile?.channelStats?.subscriberCount
    ? parseInt(youtubeProfile.channelStats.subscriberCount) / 100
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-purple-300 mb-4 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          YouTube Analytics
        </motion.h1>

        {youtubeProfile ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
            <div className="text-sm">
              <div className="flex items-center gap-2 text-white">
                <img
                  src={youtubeProfile.picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span>{youtubeProfile.name}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onPress={handleRefreshYoutube}
                color="success"
                variant="flat"
                size="sm"
                isLoading={isRefreshingYoutube}
                isDisabled={isRefreshingYoutube}
              >
                {isRefreshingYoutube ? "Refreshing..." : "Refresh Stats"}
              </Button>
              <Button
                onPress={handleDisconnect}
                color="danger"
                variant="flat"
                size="sm"
                isDisabled={isRefreshingYoutube}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onPress={() => handleLoginYt()}
            color="danger"
            variant="solid"
            size="sm"
            className="bg-red-600 text-white"
          >
            Connect YouTube
          </Button>
        )}
      </div>

      {!youtubeProfile ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
              Connect your YouTube account to view analytics
            </h3>
            <p className="text-gray-400 mb-6">
              Get detailed insights about your channel performance, audience,
              and growth.
            </p>
            <Button
              onPress={() => handleLoginYt()}
              color="danger"
              variant="solid"
              size="md"
              className="bg-red-600 text-white mx-auto"
            >
              Connect YouTube Account
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-black border border-purple-800/30">
                <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-purple-400 text-sm mb-1">
                        Total Views
                      </p>
                      <h3 className="text-white text-2xl font-bold">
                        {youtubeProfile.analytics?.totalViews.toLocaleString()}
                      </h3>
                      <div className="flex items-center mt-2">
                        {viewsGrowth > 0 ? (
                          <TrendingUp
                            size={16}
                            className="text-green-500 mr-1"
                          />
                        ) : (
                          <TrendingDown
                            size={16}
                            className="text-red-500 mr-1"
                          />
                        )}
                        <span
                          className={
                            viewsGrowth > 0 ? "text-green-500" : "text-red-500"
                          }
                        >
                          {Math.abs(viewsGrowth).toFixed(1)}%{" "}
                          {viewsGrowth > 0 ? "increase" : "decrease"}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-900/30 rounded-full">
                      <Eye size={24} className="text-purple-300" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-black border border-purple-800/30">
                <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-purple-400 text-sm mb-1">
                        Watch Time (min)
                      </p>
                      <h3 className="text-white text-2xl font-bold">
                        {youtubeProfile.analytics?.totalWatchTime.toLocaleString()}
                      </h3>
                      <div className="flex items-center mt-2">
                        {watchTimeGrowth > 0 ? (
                          <TrendingUp
                            size={16}
                            className="text-green-500 mr-1"
                          />
                        ) : (
                          <TrendingDown
                            size={16}
                            className="text-red-500 mr-1"
                          />
                        )}
                        <span
                          className={
                            watchTimeGrowth > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {Math.abs(watchTimeGrowth).toFixed(1)}%{" "}
                          {watchTimeGrowth > 0 ? "increase" : "decrease"}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-900/30 rounded-full">
                      <ThumbsUp size={24} className="text-purple-300" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-black border border-purple-800/30">
                <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-purple-400 text-sm mb-1">
                        Subscribers
                      </p>
                      <h3 className="text-white text-2xl font-bold">
                        {youtubeProfile.channelStats?.subscriberCount}
                      </h3>
                      <div className="flex items-center mt-2">
                        {subscribersGrowth > 0 ? (
                          <TrendingUp
                            size={16}
                            className="text-green-500 mr-1"
                          />
                        ) : (
                          <TrendingDown
                            size={16}
                            className="text-red-500 mr-1"
                          />
                        )}
                        <span
                          className={
                            subscribersGrowth > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {Math.abs(subscribersGrowth).toFixed(1)}%{" "}
                          {subscribersGrowth > 0 ? "increase" : "decrease"}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-900/30 rounded-full">
                      <Users size={24} className="text-purple-300" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-black border border-purple-800/30 h-full">
                <CardHeader className="pb-0">
                  <h3 className="text-xl font-semibold text-purple-300">
                    Views Over Time
                  </h3>
                </CardHeader>
                <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={youtubeProfile.analytics?.recentStats || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" stroke="#a78bfa" />
                        <YAxis stroke="#a78bfa" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#9333ea"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          name="Views"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-black border border-purple-800/30 h-full">
                <CardHeader className="pb-0">
                  <h3 className="text-xl font-semibold text-purple-300">
                    Watch Time vs Views
                  </h3>
                </CardHeader>
                <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={youtubeProfile.analytics?.recentStats || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" stroke="#a78bfa" />
                        <YAxis stroke="#a78bfa" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="views"
                          name="Views"
                          fill={COLORS[0]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="watchTime"
                          name="Watch Time (min)"
                          fill={COLORS[1]}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-black border border-purple-800/30 h-full">
                <CardHeader className="pb-0">
                  <h3 className="text-xl font-semibold text-purple-300">
                    Subscriber Growth
                  </h3>
                </CardHeader>
                <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={youtubeProfile.analytics?.recentStats || []}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" stroke="#a78bfa" />
                        <YAxis stroke="#a78bfa" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="subscribers"
                          stroke="#9333ea"
                          fill="url(#colorSubscribers)"
                          strokeWidth={2}
                          name="Subscribers"
                        />
                        <defs>
                          <linearGradient
                            id="colorSubscribers"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#9333ea"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#9333ea"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="bg-black border border-purple-800/30 h-full">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-purple-300">
                      Channel Stats
                    </h3>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-purple-900/40 text-purple-300"
                    >
                      <BarChart3 size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Views",
                              value: youtubeProfile.analytics?.totalViews || 0,
                            },
                            {
                              name: "Watch Time",
                              value:
                                youtubeProfile.analytics?.totalWatchTime || 0,
                            },
                            {
                              name: "Subscribers",
                              value: parseInt(
                                youtubeProfile.channelStats?.subscriberCount ||
                                  "0"
                              ),
                            },
                            {
                              name: "Videos",
                              value: parseInt(
                                youtubeProfile.channelStats?.videoCount || "0"
                              ),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {[0, 1, 2, 3].map((index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
