export const UploadProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full mt-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-purple-400">Uploading...</span>
      <span className="text-sm font-medium text-purple-400">{progress}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className="bg-purple-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);
