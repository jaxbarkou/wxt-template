import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useWxtStorage } from "@/hooks/useWxtStorage";

interface DisplayHoverCardProps {
  title?: string;
  description?: string;
  className?: string;
}

const DisplayHoverCard: React.FC<DisplayHoverCardProps> = ({
  title = "Display hover card",
  description = "You can also enable or disable these in Web widgets.",
  className = ""
}) => {
  const { isEnabled, setValue, loading } = useWxtStorage();

  const handleToggle = (checked: boolean) => {
    setValue(checked);
  };

  if (loading) {
    return (
      <Card className={`bg-white border-0 py-0 ${className}`}>
        <CardContent className="p-0">
          <div className="flex items-center justify-center p-[12px] h-[60px]">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

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