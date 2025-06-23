import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
} from "@heroui/react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface TwitterMetrics {
  name: string;
  username: string;
  id: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count: number;
    media_count: number;
  };
}

const dummyData: TwitterMetrics = {
  name: "Ahmed Abbassi",
  username: "3ibsi_69",
  id: "1589719224578088961",
  public_metrics: {
    followers_count: 3,
    following_count: 22,
    tweet_count: 8,
    listed_count: 0,
    like_count: 7,
    media_count: 5,
  },
};

// Monthly engagement data for the line chart
const engagementData = [
  { month: "Jan", tweets: 2, likes: 3, retweets: 1 },
  { month: "Feb", tweets: 3, likes: 5, retweets: 2 },
  { month: "Mar", tweets: 1, likes: 2, retweets: 0 },
  { month: "Apr", tweets: 4, likes: 7, retweets: 3 },
  { month: "May", tweets: 2, likes: 4, retweets: 1 },
  { month: "Jun", tweets: 3, likes: 6, retweets: 2 },
];

export default function TwitterDashboard() {
  const [metrics, setMetrics] = useState<TwitterMetrics | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDummyData, setIsDummyData] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setDummyData = () => {
    setMetrics(dummyData);
    setIsDummyData(true);
  };

  useEffect(() => {
    const initiateTwitterAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/twitter/test"
        );
        setAuthUrl(response.data.data.url);
      } catch (err) {
        setError("Failed to initiate Twitter authentication");
        console.error(err);
      }
    };

    initiateTwitterAuth();
  }, []);

  useEffect(() => {
    const storedOauthData = JSON.parse(
      localStorage.getItem("oauth_data") || "{}"
    );

    if (storedOauthData.oauth_token && storedOauthData.user_id) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = authUrl;
  };

  useEffect(() => {
    const user = localStorage.getItem("oauth_data");
    const parsedUser = user ? JSON.parse(user) : null;

    const getStats = async () => {
      setIsLoading(true);
      try {
        if (parsedUser?.user_id) {
          const response = await axios.get(
            `http://localhost:3000/api/twitter/public-metrics/${parsedUser.user_id}`
          );
          if (
            response.data.public_metrics?.error ||
            response.data.public_metrics?.details?.status === 429
          ) {
            setIsRateLimited(true);
            setDummyData();
          } else {
            setMetrics(response.data.public_metrics.data);
            setIsRateLimited(false);
          }
          console.log(response.data);
          if (response.data.public_metrics.details?.status === 429) {
            setIsRateLimited(true);
            setDummyData();
          }
        } else {
          setDummyData();
          setIsDummyData(true);
        }
      } catch (err: any) {
        setError("Failed to fetch Twitter data");
        setDummyData();
      } finally {
        setIsLoading(false);
      }
    };

    getStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Spinner color="secondary" size="lg" />
          <div className="text-white text-xl">Loading Twitter data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
              Connect your Twitter account to analytics
            </h3>
            <p className="text-gray-400 mb-6">
              Get detailed insights about your account performance, audience,
              and growth.
            </p>
            <Button
              onPress={() => handleLogin()}
              color="primary"
              className="bg-purple-600 text-white mx-auto"
              size="lg"
            >
              Connect Twitter Account
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const barChartData = [
    {
      name: "Followers",
      value: metrics.public_metrics.followers_count,
    },
    {
      name: "Following",
      value: metrics.public_metrics.following_count,
    },
    {
      name: "Tweets",
      value: metrics.public_metrics.tweet_count,
    },
    {
      name: "Likes",
      value: metrics.public_metrics.like_count,
    },
    {
      name: "Media",
      value: metrics.public_metrics.media_count,
    },
  ];

  const pieChartData = [
    { name: "Followers", value: metrics.public_metrics.followers_count },
    { name: "Following", value: metrics.public_metrics.following_count },
  ];

  const COLORS = ["#9333ea", "#a855f7", "#d8b4fe", "#f0abfc", "#c084fc"];

  return (
    <div className="container px-4 py-8 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-purple-300 mb-4 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Twitter User Dashboard
        </motion.h1>

        {isAuthenticated ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
            <div className="flex gap-2">
              <Button
                onPress={() => {
                  localStorage.removeItem("oauth_data");
                  setIsAuthenticated(false);
                }}
                color="danger"
                variant="flat"
                size="sm"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onPress={() => handleLogin()}
            color="danger"
            variant="solid"
            size="sm"
            className="bg-blue-600 text-white"
          >
            Connect Twitter
          </Button>
        )}
      </div>
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <p className="text-3xl font-bold text-purple-300 mb-8">
          Twitter User Dashboard
        </p>
        <Button
          onPress={() => {
            localStorage.removeItem("oauth_data");
            setIsAuthenticated(false);
            setUserData(null);
          }}
          color="primary"
          className="bg-purple-600 text-white mx-auto"
          size="sm"
        >
          Disconnect Twitter
        </Button>
      </motion.div> */}
      {isRateLimited && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-4 rounded-lg mb-6 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            Twitter API rate limit exceeded. Showing demo data for now.
          </span>
        </motion.div>
      )}

      {isDummyData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/50 border border-blue-700 text-blue-300 p-4 rounded-lg mb-6 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Currently displaying demo data. This is not real Twitter data.
          </span>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-semibold text-white">
          {metrics.name}{" "}
          <span className="text-purple-400">@{metrics.username}</span>
          {isDummyData && (
            <Chip className="ml-2 bg-blue-600 text-white text-xs">DEMO</Chip>
          )}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="bg-black border border-purple-800/30 bg-gradient-to-b from-purple-900/20 to-black">
          <CardBody className="p-4">
            <h3 className="text-purple-400 text-sm mb-1">Followers</h3>
            <p className="text-white text-2xl font-bold">
              {metrics.public_metrics.followers_count}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-black border border-purple-800/30 bg-gradient-to-b from-purple-900/20 to-black">
          <CardBody className="p-4">
            <h3 className="text-purple-400 text-sm mb-1">Following</h3>
            <p className="text-white text-2xl font-bold">
              {metrics.public_metrics.following_count}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-black border border-purple-800/30 bg-gradient-to-b from-purple-900/20 to-black">
          <CardBody className="p-4">
            <h3 className="text-purple-400 text-sm mb-1">Tweets</h3>
            <p className="text-white text-2xl font-bold">
              {metrics.public_metrics.tweet_count}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-black border border-purple-800/30 bg-gradient-to-b from-purple-900/20 to-black">
          <CardBody className="p-4">
            <h3 className="text-purple-400 text-sm mb-1">Likes</h3>
            <p className="text-white text-2xl font-bold">
              {metrics.public_metrics.like_count}
            </p>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <Card className="bg-black border border-purple-800/30 h-full">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-semibold text-purple-300 text-center w-full">
              Activity Overview
            </h3>
          </CardHeader>
          <CardBody className="p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#a78bfa" />
                  <YAxis stroke="#a78bfa" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderColor: "#9333ea",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-black border border-purple-800/30 h-full">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-semibold text-purple-300 text-center w-full">
              Followers vs Following
            </h3>
          </CardHeader>
          <CardBody className="p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
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
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderColor: "#9333ea",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-black border border-purple-800/30 h-full">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-semibold text-purple-300 text-center w-full">
              Monthly Engagement
            </h3>
          </CardHeader>
          <CardBody className="p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#a78bfa" />
                  <YAxis stroke="#a78bfa" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderColor: "#9333ea",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tweets"
                    stroke="#9333ea"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="#a855f7"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="retweets"
                    stroke="#d8b4fe"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
