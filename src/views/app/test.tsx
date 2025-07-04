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
