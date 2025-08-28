import React, { useState } from 'react';
import { useWxtStorage } from '@/hooks/useWxtStorage';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { globalDisabledItem } from '@/hooks/useWxtStorage';

const SiderIconSettings: React.FC = () => {
  const {
    globalDisabled,
    setGlobalDisabledValue,
    disabledDomains,
    removeDisabledDomain
  } = useWxtStorage();

  const [isAlwaysDisplay, setIsAlwaysDisplay] = useState(!globalDisabled);

  // 当 globalDisabled 状态变化时，同步更新本地状态
  React.useEffect(() => {
    console.log('useEffect triggered, globalDisabled:', globalDisabled);
    setIsAlwaysDisplay(!globalDisabled);
  }, [globalDisabled]);

  const handleAlwaysDisplayToggle = async (checked: boolean) => {
    console.log("checked", checked);
    console.log("current globalDisabled", globalDisabled);
    
    // 立即更新本地状态
    setIsAlwaysDisplay(checked);
    
    // 更新存储 - globalDisabled 应该与 isAlwaysDisplay 相同
    // 如果 isAlwaysDisplay 为 true，则 globalDisabled 应该为 false（不禁用）
    // 如果 isAlwaysDisplay 为 false，则 globalDisabled 应该为 true（禁用）
    await setGlobalDisabledValue(!checked);
    
    // 强制重新获取存储值来确保同步
    const currentValue = await globalDisabledItem.getValue();
    console.log("Storage value after update:", currentValue);
    
    console.log("after setGlobalDisabledValue, globalDisabled should be:", !checked);
  };

  const handleRemoveDomain = (domain: string) => {
    removeDisabledDomain(domain);
  };

  return (
    <Card className="bg-white border-0 py-0 mt-3">
      <CardContent className="p-0">
        <div className="p-[12px] space-y-6">
          {/* Always display Yomo icon */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-gray-800 mb-1">
                Always display Yomo icon
              </h3>
              <p className="text-[13px] text-gray-600">
                When enabled, the Yomo icon will appear in the bottom right corner and can be dragged
              </p>
            </div>
            <div className="ml-4">
              <Switch
                checked={isAlwaysDisplay}
                onCheckedChange={handleAlwaysDisplayToggle}
              />
            </div>
          </div>

          {/* Disabled on websites */}
          <div className="space-y-3">
            <h3 className="text-[16px] font-semibold text-gray-800">
              Disabled on websites
            </h3>
            <div className="space-y-2">
              {disabledDomains.length === 0 ? (
                <p className="text-[13px] text-gray-600">No disabled websites</p>
              ) : (
                disabledDomains.map((domain, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-[13px] text-gray-700 font-mono">{domain}</span>
                    <button
                      onClick={() => handleRemoveDomain(domain)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      title="Remove"
                    >
                      <X size={12} className="text-gray-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiderIconSettings; 