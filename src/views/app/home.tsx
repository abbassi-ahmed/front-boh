import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  ChevronDown,
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

const viewsData = [
  { name: "Jan", youtube: 4000, tiktok: 2400, facebook: 1800, instagram: 2000 },
  { name: "Feb", youtube: 3000, tiktok: 3200, facebook: 2200, instagram: 2700 },
  { name: "Mar", youtube: 2000, tiktok: 4800, facebook: 2600, instagram: 3100 },
  { name: "Apr", youtube: 2780, tiktok: 5200, facebook: 3000, instagram: 3600 },
  { name: "May", youtube: 4890, tiktok: 6100, facebook: 3400, instagram: 4000 },
  { name: "Jun", youtube: 3390, tiktok: 5900, facebook: 3200, instagram: 3800 },
  { name: "Jul", youtube: 4490, tiktok: 6500, facebook: 3800, instagram: 4200 },
];

const engagementData = [
  { name: "Comments", value: 1200 },
  { name: "Likes", value: 8500 },
  { name: "Shares", value: 3200 },
  { name: "Saves", value: 2100 },
];

const audienceData = [
  { name: "18-24", value: 35 },
  { name: "25-34", value: 42 },
  { name: "35-44", value: 15 },
  { name: "45-54", value: 6 },
  { name: "55+", value: 2 },
];

const growthData = [
  { name: "Week 1", subscribers: 1200 },
  { name: "Week 2", subscribers: 1800 },
  { name: "Week 3", subscribers: 2400 },
  { name: "Week 4", subscribers: 3200 },
  { name: "Week 5", subscribers: 4500 },
  { name: "Week 6", subscribers: 5100 },
  { name: "Week 7", subscribers: 6200 },
  { name: "Week 8", subscribers: 7800 },
];

const platformPerformance = [
  { name: "YouTube", views: 28500, engagement: 4200, followers: 12500 },
  { name: "TikTok", views: 35200, engagement: 6800, followers: 18200 },
  { name: "Facebook", views: 18900, engagement: 2100, followers: 8400 },
  { name: "Instagram", views: 22300, engagement: 5100, followers: 15000 },
];

const COLORS = ["#9333ea", "#c084fc", "#a855f7", "#d8b4fe"];
const PLATFORM_COLORS = {
  youtube: "#9333ea",
  tiktok: "#c084fc",
  facebook: "#d8b4fe",
  instagram: "#e879f9",
};

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("Last 3 Months");

  const totalViews = platformPerformance.reduce(
    (sum, platform) => sum + platform.views,
    0
  );
  const totalEngagement = platformPerformance.reduce(
    (sum, platform) => sum + platform.engagement,
    0
  );
  const totalFollowers = platformPerformance.reduce(
    (sum, platform) => sum + platform.followers,
    0
  );

  const viewsGrowth = 18.5;
  const engagementGrowth = 24.3;
  const followersGrowth = 12.7;

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-purple-300 mb-4 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Content Performance Analytics
        </motion.h1>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="bg-purple-900/40 text-purple-300 border border-purple-800/30"
              endContent={<ChevronDown size={16} />}
            >
              {timeRange}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Time Range Options">
            <DropdownItem
              key="last7"
              onPress={() => setTimeRange("Last 7 Days")}
            >
              Last 7 Days
            </DropdownItem>
            <DropdownItem
              key="last30"
              onPress={() => setTimeRange("Last 30 Days")}
            >
              Last 30 Days
            </DropdownItem>
            <DropdownItem
              key="last3m"
              onPress={() => setTimeRange("Last 3 Months")}
            >
              Last 3 Months
            </DropdownItem>
            <DropdownItem
              key="last6m"
              onPress={() => setTimeRange("Last 6 Months")}
            >
              Last 6 Months
            </DropdownItem>
            <DropdownItem
              key="lastyear"
              onPress={() => setTimeRange("Last Year")}
            >
              Last Year
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

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
                  <p className="text-purple-400 text-sm mb-1">Total Views</p>
                  <h3 className="text-white text-2xl font-bold">
                    {totalViews.toLocaleString()}
                  </h3>
                  <div className="flex items-center mt-2">
                    {viewsGrowth > 0 ? (
                      <TrendingUp size={16} className="text-green-500 mr-1" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        viewsGrowth > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {Math.abs(viewsGrowth)}% from previous period
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
                    Total Engagement
                  </p>
                  <h3 className="text-white text-2xl font-bold">
                    {totalEngagement.toLocaleString()}
                  </h3>
                  <div className="flex items-center mt-2">
                    {engagementGrowth > 0 ? (
                      <TrendingUp size={16} className="text-green-500 mr-1" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        engagementGrowth > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {Math.abs(engagementGrowth)}% from previous period
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
                    Total Followers
                  </p>
                  <h3 className="text-white text-2xl font-bold">
                    {totalFollowers.toLocaleString()}
                  </h3>
                  <div className="flex items-center mt-2">
                    {followersGrowth > 0 ? (
                      <TrendingUp size={16} className="text-green-500 mr-1" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        followersGrowth > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {Math.abs(followersGrowth)}% from previous period
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
                Views by Platform
              </h3>
            </CardHeader>
            <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={viewsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#a78bfa" />
                    <YAxis stroke="#a78bfa" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="youtube"
                      stroke={PLATFORM_COLORS.youtube}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tiktok"
                      stroke={PLATFORM_COLORS.tiktok}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="facebook"
                      stroke={PLATFORM_COLORS.facebook}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="instagram"
                      stroke={PLATFORM_COLORS.instagram}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
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
                Platform Performance
              </h3>
            </CardHeader>
            <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={platformPerformance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#a78bfa" />
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
                      dataKey="engagement"
                      name="Engagement"
                      fill={COLORS[1]}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="followers"
                      name="Followers"
                      fill={COLORS[2]}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
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
                    data={growthData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#a78bfa" />
                    <YAxis stroke="#a78bfa" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="subscribers"
                      stroke="#9333ea"
                      fill="url(#colorSubscribers)"
                      strokeWidth={2}
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
                  Audience Age
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
                      data={audienceData}
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
                      {audienceData.map((entry, index) => (
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

      {/* Engagement Breakdown */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="bg-black border border-purple-800/30">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-semibold text-purple-300">
              Engagement Breakdown
            </h3>
          </CardHeader>
          <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={engagementData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#444"
                      horizontal={false}
                    />
                    <XAxis type="number" stroke="#a78bfa" />
                    <YAxis dataKey="name" type="category" stroke="#a78bfa" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#9333ea" radius={[0, 4, 4, 0]}>
                      {engagementData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                {engagementData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-purple-300 font-medium">
                          {item.name}
                        </span>
                        <span className="text-white font-semibold">
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${
                              (item.value /
                                Math.max(
                                  ...engagementData.map((d) => d.value)
                                )) *
                              100
                            }%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
