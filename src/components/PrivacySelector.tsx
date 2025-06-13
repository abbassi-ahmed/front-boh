import { Button } from "@heroui/react";

function PrivacySelector({
  value,
  onChange,
}: {
  value: "public" | "unlisted" | "private";
  onChange: (value: "public" | "unlisted" | "private") => void;
}) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm font-medium text-gray-300">
        Privacy Settings
      </label>
      <div className="flex gap-2">
        {[
          { value: "public", label: "Public", color: "bg-green-500/20" },
          { value: "unlisted", label: "Unlisted", color: "bg-yellow-500/20" },
          { value: "private", label: "Private", color: "bg-red-500/20" },
        ].map((option) => (
          <Button
            key={option.value}
            onPress={() => onChange(option.value as any)}
            variant={value === option.value ? "solid" : "flat"}
            className={`${
              value === option.value ? option.color : "bg-gray-700/50"
            } text-white`}
            size="sm"
          >
            {option.label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        {value === "public" && "Anyone can see this video"}
        {value === "unlisted" && "Only people with the link can see this video"}
        {value === "private" && "Only you can see this video"}
      </p>
    </div>
  );
}

export default PrivacySelector;
