import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ChartContainerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  className = "",
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <Card className={`bg-gray-100 border border-gray-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-500">加载中...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-gray-100 border border-gray-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-red-500">加载失败: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
          <Card className={`bg-white border border-gray-200 ${className} p-0`}>
        {title && (
          <div className="px-3 py-2 border-b border-gray-100">
            <h3 className="text-xs font-medium text-gray-600">{title}</h3>
          </div>
        )}
        <CardContent className="p-0 m-0">{children}</CardContent>
      </Card>
  );
};

export default ChartContainer;
