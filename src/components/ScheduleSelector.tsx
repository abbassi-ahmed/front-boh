import { useState } from "react";

function ScheduleSelector({
  value,
  onChange,
  privacyStatus,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  privacyStatus: "public" | "unlisted" | "private";
}) {
  const [customTime, setCustomTime] = useState<string>(
    value ? new Date(value).toISOString().slice(0, 16) : ""
  );

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomTime(newValue);
    onChange(newValue ? new Date(newValue).toISOString() : null);
  };

  if (privacyStatus !== "private") {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm font-medium text-gray-300">
        Schedule Posting
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            value={customTime}
            onChange={handleCustomTimeChange}
            className="bg-gray-700 text-white rounded px-3 py-2 text-sm"
            min={new Date().toISOString().slice(0, 16)}
          />
          <span className="text-xs text-gray-400">Custom Time</span>
        </div>
      </div>

      {value && (
        <p className="text-xs text-gray-400">
          Scheduled for: {new Date(value).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default ScheduleSelector;
