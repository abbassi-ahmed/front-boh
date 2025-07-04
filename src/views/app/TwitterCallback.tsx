import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../hooks/fetch-api.hook";

const TwitterCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const oauthToken = searchParams.get("oauth_token");
    const oauthVerifier = searchParams.get("oauth_verifier");

    if (oauthToken && oauthVerifier) {
      axios
        .post(`${baseUrl}twitter/callback`, {
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier,
        })
        .then((response) => {
          const oauthData = {
            oauth_token: response.data.data.oauth_token,
            oauth_token_secret: response.data.data.oauth_token_secret,
            user_id: response.data.data.user_id,
            screen_name: response.data.data.screen_name,
          };

          localStorage.setItem("oauth_data", JSON.stringify(oauthData));
          navigate("/user/twitter");
        })
        .catch((error) => {
          console.error("Error exchanging tokens:", error);
        });
    }
  }, [searchParams, navigate]);

  return <div style={{ textAlign: "center", padding: "2rem" }}></div>;
};

export default TwitterCallback;
