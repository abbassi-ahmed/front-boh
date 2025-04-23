import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";

export default function YouTubeLogin() {
  const [user, setUser] = useState(null);

  const login = useGoogleLogin({
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
        setUser(res.data);
        console.log("User Info:", res.data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <div>
      <button onClick={() => login()}>Login with Google</button>
    </div>
  );
}
