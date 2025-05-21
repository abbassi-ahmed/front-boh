import { Route, Routes } from "react-router-dom";
import { LoadingProvider } from "../context/Loader.context";
import { AuthProvider } from "../context/AuthContext";
import LoginGuard from "../guard/login-guard";
import Login from "../views/auth/login";
import HomePage from "../views/app/home";
import Signup from "../views/auth/signup";
import AuthGuard from "../guard/auth-gurad";
import DefaultLayout from "../layouts/default";
import MyVideos from "../views/app/my-videos";
import VideoDetailsPage from "../views/app/videoDetailPage";
import Settings from "../views/app/settings";
import TwitterPost from "../views/app/test";
import TwitterCallback from "../views/app/TwitterCallback";

const AppRoutes = () => {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <LoginGuard>
                <Signup />
              </LoginGuard>
            }
          />
          <Route
            path="/user"
            element={
              <AuthGuard>
                <DefaultLayout />
              </AuthGuard>
            }
          >
            <Route path="home" element={<HomePage />} />
            <Route path="my-videos" element={<MyVideos />} />
            <Route path="settings" element={<Settings />} />
            <Route path="video-detail/:id" element={<VideoDetailsPage />} />
            <Route path="test" element={<TwitterPost />} />
            <Route path="twitter-callback" element={<TwitterCallback />} />

            <Route index element={<HomePage />} />
          </Route>
          <Route
            path="*"
            element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            }
          />
        </Routes>
      </AuthProvider>
    </LoadingProvider>
  );
};

export default AppRoutes;
