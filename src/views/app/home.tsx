// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Card, CardBody, CardHeader, Button } from "@heroui/react";
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   Eye,
//   ThumbsUp,
//   BarChart3,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import axios from "axios";
// import { useAxios } from "../../hooks/fetch-api.hook";
// import { useGoogleLogin } from "@react-oauth/google";
// import { useAuth } from "../../context/AuthContext";

// interface YoutubeProfile {
//   name: string;
//   email: string;
//   picture: string;
//   youtubeId: string;
//   channelId?: string;
//   channelStats?: {
//     viewCount: string;
//     subscriberCount: string;
//     videoCount: string;
//     hiddenSubscriberCount: boolean;
//   };
//   analytics?: {
//     totalViews: number;
//     totalWatchTime: number;
//     totalSubscribers: number;
//     recentStats: Array<{
//       date: string;
//       views: number;
//       watchTime: number;
//       subscribers: number;
//     }>;
//   };
// }

// const COLORS = ["#9333ea", "#c084fc", "#a855f7", "#d8b4fe"];

// export default function Statistics() {
//   const { user } = useAuth();
//   const [isRefreshingYoutube, setIsRefreshingYoutube] = useState(false);
//   const [youtubeToken, setYoutubeToken] = useState<string | null>(null);
//   const [youtubeProfile, setYoutubeProfile] = useState<YoutubeProfile | null>(
//     null
//   );

//   const { userData } = useAxios(
//     `users/${user?.id}`,
//     "GET",
//     {},
//     "userData",
//     true,
//     {}
//   );
//   const { youtubeAssign } = useAxios(
//     "users",
//     "POST",
//     {},
//     "youtubeAssign",
//     false
//   );
//   const { youtubeUnAssign } = useAxios(
//     "users",
//     "PATCH",
//     {},
//     "youtubeUnAssign",
//     false
//   );

//   useEffect(() => {
//     const youtubeToken = localStorage.getItem("youtubeToken");
//     if (youtubeToken) {
//       setYoutubeToken(youtubeToken);
//     }
//     if (userData.responseData) {
//       if (userData.responseData.youtubeProfile) {
//         setYoutubeProfile({
//           name: userData.responseData.youtubeProfile.name,
//           email: userData.responseData.youtubeProfile.email,
//           picture: userData.responseData.youtubeProfile.profilePicUrl,
//           youtubeId: userData.responseData.youtubeProfile.youtubeId,
//           channelId: userData.responseData.youtubeProfile.channelId,
//           channelStats: userData.responseData.youtubeProfile.channelStats,
//           analytics: userData.responseData.youtubeProfile.analytics,
//         });
//       }
//     }
//   }, [userData.responseData]);

//   const fetchYoutubeData = async (tokenResponse: { access_token: string }) => {
//     try {
//       const res = await axios.get(
//         "https://www.googleapis.com/oauth2/v3/userinfo",
//         {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`,
//           },
//         }
//       );

//       const channelRes = await axios.get(
//         "https://www.googleapis.com/youtube/v3/channels",
//         {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`,
//           },
//           params: {
//             part: "snippet,statistics",
//             mine: true,
//           },
//         }
//       );

//       const channelData = channelRes.data.items[0];
//       const channelStats = channelData.statistics;
//       const channelId = channelData.id;

//       const analyticsRes = await axios.get(
//         "https://youtubeanalytics.googleapis.com/v2/reports",
//         {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`,
//           },
//           params: {
//             ids: "channel==MINE",
//             startDate: "2024-01-01",
//             endDate: new Date().toISOString().split("T")[0],
//             metrics: "views,estimatedMinutesWatched,subscribersGained",
//             dimensions: "day",
//           },
//         }
//       );

//       const analyticsData = analyticsRes.data;
//       const totalViews =
//         analyticsData.rows?.reduce(
//           (sum: number, row: any[]) => sum + row[1],
//           0
//         ) || 0;
//       const totalWatchTime =
//         analyticsData.rows?.reduce(
//           (sum: number, row: any[]) => sum + row[2],
//           0
//         ) || 0;
//       const totalSubscribers =
//         analyticsData.rows?.reduce(
//           (sum: number, row: any[]) => sum + row[3],
//           0
//         ) || 0;

//       const recentStats =
//         analyticsData.rows?.map((row: any[]) => ({
//           date: row[0],
//           views: row[1],
//           watchTime: row[2],
//           subscribers: row[3],
//         })) || [];

//       youtubeAssign.submitRequest(
//         {
//           youtubeId: res.data.sub,
//           name: res.data.name,
//           profilePicUrl: res.data.picture,
//           email: res.data.email,
//           channelId: channelId,
//           channelStats: channelStats,
//           analytics: {
//             totalViews,
//             totalWatchTime,
//             totalSubscribers,
//             recentStats,
//           },
//         },
//         `users/${user?.id}/youtube`,
//         false
//       );

//       setYoutubeProfile({
//         youtubeId: res.data.sub,
//         name: res.data.name,
//         picture: res.data.picture,
//         email: res.data.email,
//         channelId: channelId,
//         channelStats: channelStats,
//         analytics: {
//           totalViews,
//           totalWatchTime,
//           totalSubscribers,
//           recentStats,
//         },
//       });
//     } catch (err: any) {
//       console.error("API Error:", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   const handleLoginYt = useGoogleLogin({
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email",
//       "https://www.googleapis.com/auth/yt-analytics.readonly",
//       "https://www.googleapis.com/auth/youtube.readonly",
//       "https://www.googleapis.com/auth/youtube",
//       "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
//     ].join(" "),
//     onSuccess: async (tokenResponse) => {
//       setYoutubeToken(tokenResponse.access_token);
//       localStorage.setItem("youtubeToken", tokenResponse.access_token);
//       await fetchYoutubeData(tokenResponse);
//     },
//     onError: (error) => {
//       console.error("Login Failed:", error);
//     },
//   });

//   const handleRefreshYoutube = async () => {
//     if (!youtubeToken) {
//       console.error("No YouTube token available");
//       return;
//     }

//     try {
//       setIsRefreshingYoutube(true);
//       try {
//         await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//           headers: {
//             Authorization: `Bearer ${youtubeToken}`,
//           },
//         });

//         await fetchYoutubeData({ access_token: youtubeToken });
//       } catch (error) {
//         console.log("Token expired or invalid, re-authenticating...");
//         handleLoginYt();
//       }
//     } catch (error) {
//       console.error("Refresh failed:", error);
//     } finally {
//       setIsRefreshingYoutube(false);
//     }
//   };

//   const handleDisconnect = () => {
//     setYoutubeProfile(null);
//     localStorage.removeItem("youtubeToken");
//     youtubeUnAssign.submitRequest(
//       {},
//       `users/${user?.id}/youtube/unassign`,
//       true
//     );
//     setYoutubeProfile(null);
//   };

//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-zinc-900 p-3 border border-purple-800/30 rounded-md shadow-lg">
//           <p className="text-purple-300 font-medium">{label}</p>
//           {payload.map((entry: any, index: number) => (
//             <p
//               key={`item-${index}`}
//               style={{ color: entry.color }}
//               className="text-sm"
//             >
//               {entry.name}: {entry.value.toLocaleString()}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Calculate growth percentages (simplified for demo)
//   const viewsGrowth = youtubeProfile?.analytics?.recentStats?.length
//     ? ((youtubeProfile.analytics.totalViews -
//         youtubeProfile.analytics.recentStats[0].views) /
//         youtubeProfile.analytics.recentStats[0].views) *
//         100 || 0
//     : 0;

//   const watchTimeGrowth = youtubeProfile?.analytics?.recentStats?.length
//     ? ((youtubeProfile.analytics.totalWatchTime -
//         youtubeProfile.analytics.recentStats[0].watchTime) /
//         (youtubeProfile.analytics.recentStats[0].watchTime || 1)) *
//         100 || 0
//     : 0;

//   const subscribersGrowth = youtubeProfile?.channelStats?.subscriberCount
//     ? parseInt(youtubeProfile.channelStats.subscriberCount) / 100
//     : 0;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//         <motion.h1
//           className="text-3xl font-bold text-purple-300 mb-4 md:mb-0"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           YouTube Analytics
//         </motion.h1>

//         {youtubeProfile ? (
//           <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
//             <div className="text-sm">
//               <div className="flex items-center gap-2 text-white">
//                 <img
//                   src={youtubeProfile.picture}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <span>{youtubeProfile.name}</span>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 onPress={handleRefreshYoutube}
//                 color="success"
//                 variant="flat"
//                 size="sm"
//                 isLoading={isRefreshingYoutube}
//                 isDisabled={isRefreshingYoutube}
//               >
//                 {isRefreshingYoutube ? "Refreshing..." : "Refresh Stats"}
//               </Button>
//               <Button
//                 onPress={handleDisconnect}
//                 color="danger"
//                 variant="flat"
//                 size="sm"
//                 isDisabled={isRefreshingYoutube}
//               >
//                 Disconnect
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <Button
//             onPress={() => handleLoginYt()}
//             color="danger"
//             variant="solid"
//             size="sm"
//             className="bg-red-600 text-white"
//           >
//             Connect YouTube
//           </Button>
//         )}
//       </div>

//       {!youtubeProfile ? (
//         <div className="text-center py-16">
//           <div className="max-w-md mx-auto">
//             <h3 className="text-xl font-semibold text-purple-300 mb-4">
//               Connect your YouTube account to view analytics
//             </h3>
//             <p className="text-gray-400 mb-6">
//               Get detailed insights about your channel performance, audience,
//               and growth.
//             </p>
//             <Button
//               onPress={() => handleLoginYt()}
//               color="danger"
//               variant="solid"
//               size="md"
//               className="bg-red-600 text-white mx-auto"
//             >
//               Connect YouTube Account
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               <Card className="bg-black border border-purple-800/30">
//                 <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-purple-400 text-sm mb-1">
//                         Total Views
//                       </p>
//                       <h3 className="text-white text-2xl font-bold">
//                         {youtubeProfile.analytics?.totalViews.toLocaleString()}
//                       </h3>
//                       <div className="flex items-center mt-2">
//                         {viewsGrowth > 0 ? (
//                           <TrendingUp
//                             size={16}
//                             className="text-green-500 mr-1"
//                           />
//                         ) : (
//                           <TrendingDown
//                             size={16}
//                             className="text-red-500 mr-1"
//                           />
//                         )}
//                         <span
//                           className={
//                             viewsGrowth > 0 ? "text-green-500" : "text-red-500"
//                           }
//                         >
//                           {Math.abs(viewsGrowth).toFixed(1)}%{" "}
//                           {viewsGrowth > 0 ? "increase" : "decrease"}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-3 bg-purple-900/30 rounded-full">
//                       <Eye size={24} className="text-purple-300" />
//                     </div>
//                   </div>
//                 </CardBody>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <Card className="bg-black border border-purple-800/30">
//                 <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-purple-400 text-sm mb-1">
//                         Watch Time (min)
//                       </p>
//                       <h3 className="text-white text-2xl font-bold">
//                         {youtubeProfile.analytics?.totalWatchTime.toLocaleString()}
//                       </h3>
//                       <div className="flex items-center mt-2">
//                         {watchTimeGrowth > 0 ? (
//                           <TrendingUp
//                             size={16}
//                             className="text-green-500 mr-1"
//                           />
//                         ) : (
//                           <TrendingDown
//                             size={16}
//                             className="text-red-500 mr-1"
//                           />
//                         )}
//                         <span
//                           className={
//                             watchTimeGrowth > 0
//                               ? "text-green-500"
//                               : "text-red-500"
//                           }
//                         >
//                           {Math.abs(watchTimeGrowth).toFixed(1)}%{" "}
//                           {watchTimeGrowth > 0 ? "increase" : "decrease"}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-3 bg-purple-900/30 rounded-full">
//                       <ThumbsUp size={24} className="text-purple-300" />
//                     </div>
//                   </div>
//                 </CardBody>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               <Card className="bg-black border border-purple-800/30">
//                 <CardBody className="bg-gradient-to-b from-purple-900/20 to-black">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-purple-400 text-sm mb-1">
//                         Subscribers
//                       </p>
//                       <h3 className="text-white text-2xl font-bold">
//                         {youtubeProfile.channelStats?.subscriberCount}
//                       </h3>
//                       <div className="flex items-center mt-2">
//                         {subscribersGrowth > 0 ? (
//                           <TrendingUp
//                             size={16}
//                             className="text-green-500 mr-1"
//                           />
//                         ) : (
//                           <TrendingDown
//                             size={16}
//                             className="text-red-500 mr-1"
//                           />
//                         )}
//                         <span
//                           className={
//                             subscribersGrowth > 0
//                               ? "text-green-500"
//                               : "text-red-500"
//                           }
//                         >
//                           {Math.abs(subscribersGrowth).toFixed(1)}%{" "}
//                           {subscribersGrowth > 0 ? "increase" : "decrease"}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-3 bg-purple-900/30 rounded-full">
//                       <Users size={24} className="text-purple-300" />
//                     </div>
//                   </div>
//                 </CardBody>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Charts Row 1 */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//             >
//               <Card className="bg-black border border-purple-800/30 h-full">
//                 <CardHeader className="pb-0">
//                   <h3 className="text-xl font-semibold text-purple-300">
//                     Views Over Time
//                   </h3>
//                 </CardHeader>
//                 <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
//                   <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart
//                         data={youtubeProfile.analytics?.recentStats || []}
//                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                         <XAxis dataKey="date" stroke="#a78bfa" />
//                         <YAxis stroke="#a78bfa" />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="views"
//                           stroke="#9333ea"
//                           strokeWidth={2}
//                           activeDot={{ r: 8 }}
//                           name="Views"
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </CardBody>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.5 }}
//             >
//               <Card className="bg-black border border-purple-800/30 h-full">
//                 <CardHeader className="pb-0">
//                   <h3 className="text-xl font-semibold text-purple-300">
//                     Watch Time vs Views
//                   </h3>
//                 </CardHeader>
//                 <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
//                   <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={youtubeProfile.analytics?.recentStats || []}
//                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                         <XAxis dataKey="date" stroke="#a78bfa" />
//                         <YAxis stroke="#a78bfa" />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend />
//                         <Bar
//                           dataKey="views"
//                           name="Views"
//                           fill={COLORS[0]}
//                           radius={[4, 4, 0, 0]}
//                         />
//                         <Bar
//                           dataKey="watchTime"
//                           name="Watch Time (min)"
//                           fill={COLORS[1]}
//                           radius={[4, 4, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </CardBody>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Charts Row 2 */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.6 }}
//             >
//               <Card className="bg-black border border-purple-800/30 h-full">
//                 <CardHeader className="pb-0">
//                   <h3 className="text-xl font-semibold text-purple-300">
//                     Subscriber Growth
//                   </h3>
//                 </CardHeader>
//                 <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
//                   <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart
//                         data={youtubeProfile.analytics?.recentStats || []}
//                         margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                         <XAxis dataKey="date" stroke="#a78bfa" />
//                         <YAxis stroke="#a78bfa" />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Area
//                           type="monotone"
//                           dataKey="subscribers"
//                           stroke="#9333ea"
//                           fill="url(#colorSubscribers)"
//                           strokeWidth={2}
//                           name="Subscribers"
//                         />
//                         <defs>
//                           <linearGradient
//                             id="colorSubscribers"
//                             x1="0"
//                             y1="0"
//                             x2="0"
//                             y2="1"
//                           >
//                             <stop
//                               offset="5%"
//                               stopColor="#9333ea"
//                               stopOpacity={0.8}
//                             />
//                             <stop
//                               offset="95%"
//                               stopColor="#9333ea"
//                               stopOpacity={0.1}
//                             />
//                           </linearGradient>
//                         </defs>
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </CardBody>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.7 }}
//             >
//               <Card className="bg-black border border-purple-800/30 h-full">
//                 <CardHeader className="pb-0">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-xl font-semibold text-purple-300">
//                       Channel Stats
//                     </h3>
//                     <Button
//                       isIconOnly
//                       size="sm"
//                       variant="flat"
//                       className="bg-purple-900/40 text-purple-300"
//                     >
//                       <BarChart3 size={16} />
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardBody className="bg-gradient-to-b from-purple-900/10 to-black pt-4">
//                   <div className="h-80 flex items-center justify-center">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={[
//                             {
//                               name: "Views",
//                               value: youtubeProfile.analytics?.totalViews || 0,
//                             },
//                             {
//                               name: "Watch Time",
//                               value:
//                                 youtubeProfile.analytics?.totalWatchTime || 0,
//                             },
//                             {
//                               name: "Subscribers",
//                               value: parseInt(
//                                 youtubeProfile.channelStats?.subscriberCount ||
//                                   "0"
//                               ),
//                             },
//                             {
//                               name: "Videos",
//                               value: parseInt(
//                                 youtubeProfile.channelStats?.videoCount || "0"
//                               ),
//                             },
//                           ]}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           outerRadius={80}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, percent }) =>
//                             `${name}: ${(percent * 100).toFixed(0)}%`
//                           }
//                         >
//                           {[0, 1, 2, 3].map((index) => (
//                             <Cell
//                               key={`cell-${index}`}
//                               fill={COLORS[index % COLORS.length]}
//                             />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </CardBody>
//               </Card>
//             </motion.div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
interface FacebookProfile {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  perms: string[];
}

declare const FB: typeof window.FB;

export default function FacebookPageManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [facebookProfile, setFacebookProfile] =
    useState<FacebookProfile | null>(null);
  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postLink, setPostLink] = useState("");
  const [postImage, setPostImage] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [postResult, setPostResult] = useState<{
    success: boolean;
    message: string;
    postId?: string;
  } | null>(null);

  const handleAuthResponse = () => {
    setIsLoggedIn(true);
    fetchUserFbProfile();
    fetchUserPages();
  };

  const handleLogin = () => {
    setIsLoading(true);
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          handleAuthResponse();
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
        setIsLoading(false);
      },
      {
        scope:
          "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_engagement",
      }
    );
  };

  const handleLogout = () => {
    window.FB.logout(() => {
      setIsLoggedIn(false);
      setFacebookProfile(null);
      setFacebookPages([]);
      setSelectedPageId("");
      setPostContent("");
      setPostResult(null);
    });
  };

  const fetchUserFbProfile = () => {
    window.FB.api(
      "/me",
      "GET",
      {
        fields: "id,name,email,picture.width(200).height(200)",
      },
      (profile: FacebookProfile) => {
        setFacebookProfile(profile);
      }
    );
  };

  const fetchUserPages = () => {
    window.FB.api(
      "/me/accounts?fields=id,name,access_token,category,perms",
      "GET",
      {},
      (response: any) => {
        if (response.error) {
          console.error("Facebook API Error:", response.error);
          if (response.error.code === 200) {
            alert(
              "Missing permissions - please grant pages_show_list permission"
            );
          }
          return;
        }

        if (response.data && response.data.length > 0) {
          setFacebookPages(response.data);
        } else {
          console.log("User has no pages or insufficient permissions");
          console.log(response.data);
          alert(
            "No pages found. Please ensure you're an admin of at least one Facebook Page."
          );
        }
      }
    );
  };
  const createPost = async () => {
    if (!selectedPageId || !postContent.trim()) {
      setPostResult({
        success: false,
        message: "Please select a page and enter post content",
      });
      return;
    }

    const selectedPage = facebookPages.find(
      (page) => page.id === selectedPageId
    );
    if (!selectedPage) {
      setPostResult({ success: false, message: "Selected page not found" });
      return;
    }

    if (!selectedPage.perms.includes("CREATE_CONTENT")) {
      setPostResult({
        success: false,
        message: "You do not have permission to post on this page",
      });
      return;
    }

    setIsLoading(true);
    setPostResult(null);

    try {
      let response;
      const params: any = {
        message: postContent,
        access_token: selectedPage.access_token,
      };

      if (postLink) {
        params.link = postLink;
      }

      if (isScheduled && scheduledTime) {
        params.published = false;
        params.scheduled_publish_time = Math.floor(
          new Date(scheduledTime).getTime() / 1000
        );
      }

      if (postImage) {
        // Post with image
        params.url = postImage;
        response = await new Promise<any>((resolve) => {
          window.FB.api(
            `/${selectedPageId}/photos`,
            "POST",
            params,
            (res: any) => resolve(res)
          );
        });
      } else {
        // Regular post
        response = await new Promise<any>((resolve) => {
          window.FB.api(`/${selectedPageId}/feed`, "POST", params, (res: any) =>
            resolve(res)
          );
        });
      }

      if (!response || response.error) {
        throw new Error(response?.error?.message || "Failed to post");
      }

      setPostResult({
        success: true,
        message: `Successfully ${
          isScheduled ? "scheduled" : "posted"
        } to page!`,
        postId: response.id || response.post_id,
      });
      setPostContent("");
      setPostLink("");
      setPostImage("");
    } catch (error: any) {
      setPostResult({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => {
          window.FB.api("/me/permissions", "GET", {}, (response: any) => {
            console.log("Current permissions:", response);
          });
        }}
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Debug Permissions
      </button>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Facebook Page Manager
            </h1>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
              >
                {isLoading ? "Loading..." : "Login with Facebook"}
              </button>
            )}
          </div>

          {isLoading && !isLoggedIn && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}

          {isLoggedIn && facebookProfile && (
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                {facebookProfile.picture && (
                  <img
                    src={facebookProfile.picture.data.url}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {facebookProfile.name}
                  </h2>
                  {facebookProfile.email && (
                    <p className="text-sm text-gray-600">
                      {facebookProfile.email}
                    </p>
                  )}
                </div>
              </div>

              {facebookPages.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="page-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select a Page
                    </label>
                    <select
                      id="page-select"
                      value={selectedPageId}
                      onChange={(e) => setSelectedPageId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a page</option>
                      {facebookPages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.name} ({page.category}) - Permissions:{" "}
                          {page.perms.join(", ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="post-content"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Post Content
                    </label>
                    <textarea
                      id="post-content"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What would you like to post?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="post-link"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Link URL (optional)
                    </label>
                    <input
                      type="url"
                      id="post-link"
                      value={postLink}
                      onChange={(e) => setPostLink(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="post-image"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      id="post-image"
                      value={postImage}
                      onChange={(e) => setPostImage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="schedule-post"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="schedule-post"
                      className="text-sm font-medium text-gray-700"
                    >
                      Schedule Post
                    </label>
                  </div>

                  {isScheduled && (
                    <div>
                      <label
                        htmlFor="scheduled-time"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Scheduled Time
                      </label>
                      <input
                        type="datetime-local"
                        id="scheduled-time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={createPost}
                    disabled={
                      isLoading || !selectedPageId || !postContent.trim()
                    }
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 transition"
                  >
                    {isLoading
                      ? "Posting..."
                      : isScheduled
                      ? "Schedule Post"
                      : "Post to Page"}
                  </button>

                  {postResult && (
                    <div
                      className={`mt-4 p-3 rounded-md ${
                        postResult.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {postResult.message}
                      {postResult.success && postResult.postId && (
                        <div className="mt-2">
                          <a
                            href={`https://www.facebook.com/${postResult.postId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Post
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    No pages found or you don't have permission to manage pages.
                  </p>
                </div>
              )}
            </div>
          )}

          {!isLoggedIn && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Login with Facebook to manage your pages
              </p>
              <button
                onClick={handleLogin}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center mx-auto"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue with Facebook
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
