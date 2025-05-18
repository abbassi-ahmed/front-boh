import axios from "axios";
import { useState } from "react";

export default function TwitterPost() {
  const [text, setText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await axios
        .post("http://localhost:3000/api/twitter/post", {
          text,
          videoUrl: videoUrl || undefined,
        })
        .then((res) => {
          console.log(res);
          alert("Tweet posted successfully!");
        });
    } catch (error) {
      console.error("Error posting tweet:", error);
      alert("Failed to post tweet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-full w-full p-4">
      <h2 className="text-xl mb-4">Twitter Post</h2>
      <textarea
        className="w-full border p-2 mb-4"
        rows={4}
        placeholder="Write your tweet..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mb-4">
        <label className="block mb-2">Video URL (optional):</label>
        <input
          type="text"
          className="w-full border p-2"
          placeholder="https://example.com/video.mp4"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Posting..." : "Post Tweet"}
      </button>
    </div>
  );
}
