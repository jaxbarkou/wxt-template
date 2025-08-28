import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useWxtStorage } from "@/hooks/useWxtStorage";

interface DisplayHoverCardProps {
  title?: string;
  description?: string;
  className?: string;
  changeConfig?: () => void;
}

const DisplayHoverCard: React.FC<DisplayHoverCardProps> = ({
  title = "Display hover card",
  description = "You can also enable or disable these in Web widgets.",
  className = "",
  changeConfig,
}) => {
  const { hoverModelDisabled, setValue, loading } = useWxtStorage();

  const handleToggle = (checked: boolean) => {
    setValue(!checked);
    if (changeConfig) {
      changeConfig();
    }
  };

  if (loading) {
    return (
      <Card className={`bg-white border-0 py-0 ${className}`}>
        <CardContent className="p-0">
          <div className="flex items-center justify-center p-[12px] h-[60px]">
            <div className="text-[12px] text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white border-0 py-0 mb-0 ${className}`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-[12px]">
          <div className="flex-1">
            <h3 className="text-[14px] text-brand-black ">{title}</h3>
            <p className="text-[11px] text-brand-gray1">{description}</p>
          </div>
          <div className="ml-4">
            <Switch
              checked={!hoverModelDisabled}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayHoverCard;
