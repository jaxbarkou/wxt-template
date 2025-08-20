import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRootStore } from "@/store";

interface DisplayHoverCardProps {
  title?: string;
  description?: string;
  settingKey?: string;
  className?: string;
}

const DisplayHoverCard: React.FC<DisplayHoverCardProps> = ({
  title = "Display hover card",
  description = "You can also enable or disable these in Web widgets.",
  settingKey = "displayHoverCard",
  className = ""
}) => {
  const { settings, updateSetting } = useRootStore();

  const isEnabled = settings[settingKey] || false;

  const handleToggle = (checked: boolean) => {
    console.log("handleToggle", checked);
    updateSetting(settingKey, checked);
  };

  return (
    <Card className={`bg-white border-0 py-0 ${className}`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-[12px]">
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-gray-800 mb-1">
              {title}
            </h3>
            <p className="text-[13px] text-gray-600">
              {description}
            </p>
          </div>
          <div className="ml-4">
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayHoverCard; 