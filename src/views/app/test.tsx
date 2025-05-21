import { useState, useEffect } from "react";
import axios from "axios";

export default function TwitterTest() {
  const [authUrl, setAuthUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

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
      setUserData(storedOauthData);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Twitter OAuth Integration</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      {!isAuthenticated ? (
        <div>
          <p>Click the button below to authenticate with Twitter:</p>
          <button
            onClick={handleLogin}
            disabled={!authUrl}
            style={{
              padding: "10px 15px",
              backgroundColor: "#1DA1F2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: authUrl ? 1 : 0.5,
            }}
          >
            Sign in with Twitter
          </button>
          {!authUrl && (
            <p style={{ color: "#666" }}>Loading authentication...</p>
          )}
        </div>
      ) : (
        <div>
          <h2>Successfully Authenticated!</h2>
          {userData && (
            <div style={{ marginBottom: "20px" }}>
              <p>User ID: {userData.user_id}</p>
              <p>Screen Name: @{userData.screen_name}</p>
            </div>
          )}

          <button
            style={{
              padding: "10px 15px",
              backgroundColor: "#1DA1F2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Post Test Tweet
          </button>
        </div>
      )}
    </div>
  );
}
