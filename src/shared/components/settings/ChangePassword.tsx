import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/api/user";
import { Loader2 } from "lucide-react";

interface ChangePasswordSectionProps {
  onClose?: () => void;
}

export default function ChangePasswordSection({ onClose }: ChangePasswordSectionProps): React.ReactNode {
  const [formValues, setFormValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    gaCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 处理输入框值变化
  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // 清除对应字段的错误
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ""
      }));
    }
  };

  // 表单校验
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // 旧密码校验
    if (!formValues.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    }
    
    // 新密码校验
    if (!formValues.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formValues.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    // 确认密码校验
    if (!formValues.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formValues.newPassword !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // GA码校验
    if (!formValues.gaCode.trim()) {
      newErrors.gaCode = "Google Authenticator code is required";
    } else if (!/^\d{6}$/.test(formValues.gaCode)) {
      newErrors.gaCode = "Please enter a 6-digit code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理保存
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await changePassword(
        formValues.oldPassword,
        formValues.newPassword,
        formValues.confirmPassword,
        formValues.gaCode
      );
      
      if (response.code === 1) {
        // 成功
        setIsVisible(false);
        onClose?.();
        // 可以添加成功提示
        console.log("Password changed successfully");
      } else {
        // 接口返回错误
        setErrors({
          general: response.message || "Failed to change password"
        });
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      setErrors({
        general: error.message || "Network error, please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    setIsVisible(false);
    onClose?.();
  };

  // 如果不可见，不渲染
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
      <Card className="bg-white rounded-lg shadow-[0px_0px_2px_#ffffff1a] border-0 w-[90%] py-0">
        <CardContent className="space-y-4 p-0">
          {/* 标题栏和关闭按钮 */}
          <header className="h-[44px] flex items-center justify-between border-b border-[rgba(151, 151, 151, 0.2)] pl-4 pr-4 pt-2 pb-2">
            <h2 className="[font-family:'Arboria-Medium-Medium',Helvetica] font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal]">
              Change Password
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 w-3.5 h-3.5 hover:bg-transparent"
              onClick={handleCancel}
            >
              <img
                className="w-3.5 h-3.5"
                alt="Close"
                src="https://c.animaapp.com/mei6qdpiZQZsoo/img/vector-1.svg"
              />
            </Button>
          </header>
          
          <div className="p-4">
            {/* 通用错误提示 */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* 表单字段 */}
            <div className="space-y-6 translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
                              {/* 旧密码 */}
              <div className="space-y-2">
                <Label
                  htmlFor="oldPassword"
                  className="[font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#979797] text-sm tracking-[0] leading-[normal]"
                >
                  Old Password
                </Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Enter old password"
                  value={formValues.oldPassword}
                  onChange={(e) => handleInputChange("oldPassword", e.target.value)}
                  className={`h-10 bg-white rounded-lg border border-solid text-sm [font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#000] tracking-[0] leading-[normal] placeholder:text-[#979797] ${
                    errors.oldPassword ? 'border-red-300 focus:border-red-500' : 'border-[#e9e9e9] focus:border-[#F67C00]'
                  }`}
                  disabled={isLoading}
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>
                )}
              </div>

                              {/* 新密码 */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="[font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#979797] text-sm tracking-[0] leading-[normal]"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formValues.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  className={`h-10 bg-white rounded-lg border border-solid text-sm [font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#000] tracking-[0] leading-[normal] placeholder:text-[#979797] ${
                    errors.newPassword ? 'border-red-300 focus:border-red-500' : 'border-[#e9e9e9] focus:border-[#F67C00]'
                  }`}
                  disabled={isLoading}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>

                              {/* 确认密码 */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="[font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#979797] text-sm tracking-[0] leading-[normal]"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={formValues.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`h-10 bg-white rounded-lg border border-solid text-sm [font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#000] tracking-[0] leading-[normal] placeholder:text-[#979797] ${
                    errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-[#e9e9e9] focus:border-[#F67C00]'
                  }`}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

                              {/* 谷歌验证码 */}
              <div className="space-y-2">
                <Label
                  htmlFor="gaCode"
                  className="[font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#979797] text-sm tracking-[0] leading-[normal]"
                >
                  Ga
                </Label>
                <Input
                  id="gaCode"
                  placeholder="Enter Ga"
                  value={formValues.gaCode}
                  onChange={(e) => handleInputChange("gaCode", e.target.value)}
                  className={`h-10 bg-white rounded-lg border border-solid text-sm [font-family:'Arboria-Book-Book',Helvetica] font-normal text-[#000] tracking-[0] leading-[normal] placeholder:text-[#979797] ${
                    errors.gaCode ? 'border-red-300 focus:border-red-500' : 'border-[#e9e9e9] focus:border-[#F67C00]'
                  }`}
                  disabled={isLoading}
                />
                {errors.gaCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.gaCode}</p>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-2 translate-y-[-1rem] animate-fade-in [--animation-delay:400ms] mt-4">
              <Button
                variant="outline"
                className="flex-1 h-auto rounded-[40px] border border-solid border-[#f67c00] bg-transparent hover:bg-[#f67c00]/10 [font-family:'Arboria-Medium-Medium',Helvetica] font-medium text-[#f67c00] text-sm text-center tracking-[0] leading-[normal] py-2.5"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-auto bg-[#f67c00] hover:bg-[#f67c00]/90 rounded-[40px] [font-family:'Arboria-Medium-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0] leading-[normal] py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 