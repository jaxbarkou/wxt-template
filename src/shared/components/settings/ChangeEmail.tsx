import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeEmail } from "@/lib/api/user";
import { useRootStore } from "@/store";
import { useUserDetail } from "@/hooks/useUserDetail";
import { Loader2 } from "lucide-react";

// 邮箱校验正则
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 错误类型
interface FormErrors {
  email?: string;
  ga?: string;
  general?: string;
}

interface ChangeEmailSectionProps {
  onClose?: () => void;
}

export default function ChangeEmailSection({ onClose }: ChangeEmailSectionProps): React.ReactNode {
  const { userDetail } = useRootStore();
  const { fetchUserDetail } = useUserDetail();
  
  // 状态管理
  const [formValues, setFormValues] = useState({
    email: userDetail?.email || "",
    ga: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const formFields = [
    {
      id: "email",
      label: "Email",
      placeholder: "Enter Email",
      value: formValues.email,
      error: errors.email,
    },
    {
      id: "ga",
      label: "Google Authenticator Code",
      placeholder: "Enter 6-digit code",
      value: formValues.ga,
      error: errors.ga,
    },
  ];

  // 邮箱校验函数
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return "Email is required";
    }
    if (!EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  // GA码校验函数
  const validateGACode = (code: string): string | undefined => {
    if (!code) {
      return "Google Authenticator code is required";
    }
    if (!/^\d{6}$/.test(code)) {
      return "Please enter a 6-digit code";
    }
    return undefined;
  };

  // 处理输入框值变化
  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // 清除对应字段的错误
    if (errors[fieldId as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: undefined
      }));
    }
  };

  // 处理清空按钮点击
  const handleClearInput = (fieldId: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: ""
    }));
    
    // 清除对应字段的错误
    if (errors[fieldId as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: undefined
      }));
    }
  };

  // 表单校验
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(formValues.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const gaError = validateGACode(formValues.ga);
    if (gaError) {
      newErrors.ga = gaError;
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
      const response = await changeEmail(formValues.email, formValues.ga);
      
      if (response.code === 1) {
        // 成功
        await fetchUserDetail(); // 刷新用户信息
        onClose?.(); // 调用关闭回调
        // 可以添加成功提示
        console.log("Email changed successfully");
      } else {
        // 接口返回错误
        setErrors({
          general: response.message || "Failed to change email"
        });
      }
    } catch (error: any) {
      console.error("Change email error:", error);
      setErrors({
        general: error.message || "Network error, please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    onClose?.(); // 调用关闭回调
  };

  // 如果不可见，不渲染
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
      <Card className="bg-white rounded-lg shadow-[0px_0px_2px_#ffffff1a] border-0 w-[90%] h-[auto] py-0">
        <CardContent className="p-0 space-y-4">
          {/* 标题栏和关闭按钮 */}
          <header className="h-[44px] flex items-center justify-between border-b border-[rgba(151, 151, 151, 0.2)] pl-4 pr-4 pt-2 pb-2">
            <h2 className=" font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal]">
              Change Email
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
              <div className="p-3 mb-8 border border-red-200 rounded-lg bg-red-50">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* 表单字段 */}
            <div className="space-y-6 translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
              {formFields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Label
                    htmlFor={field.id}
                    className=" font-normal text-[#979797] text-sm tracking-[0] leading-[normal]"
                  >
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={`h-10 bg-white rounded-lg border border-solid pr-10 font-normal text-[#000] text-sm tracking-[0] leading-[normal] placeholder:text-[#979797] ${
                        field.error ? 'border-red-300 focus:border-red-500' : 'border-[#e9e9e9] focus:border-[#F67C00]'
                      }`}
                      disabled={isLoading}
                    />
                    {/* 只有当输入框有内容时才显示清空按钮 */}
                    {field.value && !isLoading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute w-4 h-4 h-auto p-0 transition-opacity -translate-y-1/2 right-3 top-1/2 hover:bg-transparent"
                        onClick={() => handleClearInput(field.id)}
                      >
                        <img
                          className="w-4 h-4"
                          alt="Clear"
                          src="https://c.animaapp.com/mei6qdpiZQZsoo/img/shanchu-2.svg"
                        />
                      </Button>
                    )}
                  </div>
                  {/* 错误提示 */}
                  {field.error && (
                    <p className="mt-1 text-xs text-red-500">{field.error}</p>
                  )}
                </div>
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-2 translate-y-[-1rem] animate-fade-in [--animation-delay:400ms] mt-4">
              <Button
                variant="outline"
                className="flex-1 h-auto rounded-[40px] border border-solid border-[#f67c00] bg-transparent hover:bg-[#f67c00]/10 font-medium text-[#f67c00] text-sm text-center tracking-[0] leading-[normal] py-2.5"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-auto bg-[#f67c00] hover:bg-[#f67c00]/90 rounded-[40px] font-medium text-white text-sm text-center tracking-[0] leading-[normal] py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
