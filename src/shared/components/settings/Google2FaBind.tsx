import { CopyIcon, CheckIcon, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getGoogle2faSecret, google2faBind, changeGoogle2faSecret } from "@/lib/api/Google2fa";
import { QRCodeSVG } from "qrcode.react";
import { useUserDetail } from "@/hooks/useUserDetail";
import { useRootStore } from "@/store";

interface ChangeEmailSectionProps {
    onClose?: () => void;
  }

export default function TwoFactorAuthSection({ onClose }: ChangeEmailSectionProps): React.ReactNode {
  const { userDetail } = useRootStore();
  const { fetchUserDetail } = useUserDetail();
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [gaCode, setGaCode] = useState("");
  const [oldGaCode, setOldGaCode] = useState(""); // 原验证码
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // 判断是否已绑定2FA
  const isAuthenticatorBound = userDetail?.authenticatorStatus === 1;

  // 获取Google 2FA密钥
  const fetchGoogle2faSecret = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response: any = await getGoogle2faSecret();
      console.log("response", response);
      if (response.code === 1 && response.result) {
        setVerificationCode(response.result || "");
      } else {
        setError(response.message || "Failed to get 2FA secret");
      }
    } catch (error: any) {
      console.error("获取2FA密钥失败:", error);
      setError(error.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // 解绑2FA（实际上是更换密钥）
  const handleUnbind = async () => {
    if (!oldGaCode.trim()) {
      setError("Please enter the current verification code");
      return;
    }

    setIsSaving(true);
    setError("");
    
    try {
      const response: any = await changeGoogle2faSecret(oldGaCode);
      console.log("change secret response", response);
      if (response.code === 1) {
        // 更换密钥成功后获取新密钥
        await fetchGoogle2faSecret();
        setCurrentStep(2);
      } else {
        setError(response.message || "Failed to change 2FA secret");
      }
    } catch (error: any) {
      console.error("更换2FA密钥失败:", error);
      setError(error.message || "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  // 组件加载时根据绑定状态设置步骤
  useEffect(() => {
    if (isOpen) {
      if (isAuthenticatorBound) {
        // 已绑定，从步骤1开始（输入原验证码）
        setCurrentStep(1);
      } else {
        // 未绑定，从步骤1开始（直接获取密钥）
        setCurrentStep(1);
        fetchGoogle2faSecret();
      }
    }
  }, [isOpen, isAuthenticatorBound]);

  const handleCopyCode = () => {
    if (verificationCode) {
      navigator.clipboard.writeText(verificationCode);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = async () => {
    if (!gaCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsSaving(true);
    setError("");
    
    try {
      const response: any = await google2faBind(gaCode);
      console.log("bind response", response);
      if (response.code === 1) {
        // 绑定成功后刷新用户信息
        await fetchUserDetail();
        handleClose();
      } else {
        setError(response.message || "Failed to bind 2FA");
      }
    } catch (error: any) {
      console.error("绑定2FA失败:", error);
      setError(error.message || "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  // 生成Google Authenticator的URI
  const generateGoogleAuthURI = () => {
    if (!verificationCode) return "";
    
    const issuer = "Yomo"; // 应用名称
    const account = userDetail?.email || "user@example.com"; // 用户邮箱
    
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${verificationCode}&issuer=${encodeURIComponent(issuer)}`;
  };

  // 获取当前步骤的标题
  const getStepTitle = () => {
    if (isAuthenticatorBound) {
      // 已绑定状态
      switch (currentStep) {
        case 1:
          return "Enter current verification code";
        case 2:
          return "Import verification code";
        case 3:
          return "Enter the verification code";
        default:
          return "";
      }
    } else {
      // 未绑定状态
      switch (currentStep) {
        case 1:
          return "Import verification code";
        case 2:
          return "Enter the verification code";
        default:
          return "";
      }
    }
  };

  // 获取当前步骤的描述
  const getStepDescription = () => {
    if (isAuthenticatorBound) {
      switch (currentStep) {
        case 1:
          return "Please enter your current Google Authenticator code to proceed with the change.";
        case 2:
          return "Open Google Authenticator, click on the+sign in the bottom right corner, and then click to scan the QR code (please rescan after refreshing the page). Please make sure to save the key, as it cannot be retrieved if lost.";
        default:
          return "";
      }
    } else {
      if (currentStep === 1) {
        return "Open Google Authenticator, click on the+sign in the bottom right corner, and then click to scan the QR code (please rescan after refreshing the page). Please make sure to save the key, as it cannot be retrieved if lost.";
      }
      return "";
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[360px] max-w-[360px] p-0 bg-white rounded-2xl border-0 shadow-lg [&>button]:hidden">
          {/* 使用和ChangeEmail一样的header样式 */}
          <header className="h-[44px] flex items-center justify-between border-b border-[rgba(151, 151, 151, 0.2)] pl-4 pr-4 pt-2 pb-2">
            <h2 className="[font-family:'Arboria-Medium-Medium',Helvetica] font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal]">
              {isAuthenticatorBound ? "Change 2FA" : "Bind 2FA"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 w-3.5 h-3.5 hover:bg-transparent"
              onClick={handleClose}
              disabled={isSaving}
            >
              <img
                className="w-3.5 h-3.5"
                alt="Close"
                src="https://c.animaapp.com/mei6qdpiZQZsoo/img/vector-1.svg"
              />
            </Button>
          </header>

          <div className="p-4">
            {/* 步骤指示器 */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                {/* 步骤1 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-[#f67c00] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                
                {/* 连接线 */}
                <div className="w-12 h-0.5 mx-2 border-t-2 border-dashed border-gray-300"></div>
                
                {/* 步骤2 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-[#f67c00] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>

                {/* 如果是修改模式，显示步骤3 */}
                {isAuthenticatorBound && (
                  <>
                    <div className="w-12 h-0.5 mx-2 border-t-2 border-dashed border-gray-300"></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 3 ? 'bg-[#f67c00] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      3
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 步骤1内容 - 已绑定状态：输入原验证码 */}
            {currentStep === 1 && isAuthenticatorBound && (
              <>
                <h2 className="text-center [font-family:'Arboria-Medium-Medium',Helvetica] font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal] mb-4">
                  {getStepTitle()}
                </h2>
                
                <p className="mb-6 text-sm leading-relaxed text-left text-gray-600">
                  {getStepDescription()}
                </p>

                {error && (
                  <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Current Code</label>
                    <Input
                      placeholder="Enter current verification code"
                      value={oldGaCode}
                      onChange={(e) => {
                        setOldGaCode(e.target.value);
                        if (error) setError("");
                      }}
                      className="w-full text-sm bg-white border-gray-200"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-auto py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                      onClick={handleClose}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-auto py-3 bg-[#f67c00] hover:bg-[#e56b00] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleUnbind}
                      disabled={isSaving || !oldGaCode.trim()}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Next step'
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* 步骤1内容 - 未绑定状态：显示密钥 */}
            {currentStep === 1 && !isAuthenticatorBound && (
              <>
                <h2 className="text-center [font-family:'Arboria-Medium-Medium',Helvetica] font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal] mb-4">
                  {getStepTitle()}
                </h2>
                
                <p className="mb-6 text-sm leading-relaxed text-left text-gray-600">
                  {getStepDescription()}
                </p>

                {error && (
                  <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">密钥</span>
                    </div>

                    <div className="relative">
                      <Input
                        value={verificationCode}
                        readOnly
                        className="pr-10 font-mono text-sm border-gray-200 bg-gray-50"
                        placeholder={isLoading ? "Loading..." : "No secret available"}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute w-6 h-6 p-0 -translate-y-1/2 right-2 top-1/2 hover:bg-gray-100"
                        onClick={handleCopyCode}
                        disabled={!verificationCode || isLoading || isSaving}
                      >
                        {isCopied ? (
                          <CheckIcon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <CopyIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex items-center justify-center w-32 h-32 p-2 bg-white border border-gray-200 rounded-lg">
                      {isLoading ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f67c00]"></div>
                        </div>
                      ) : verificationCode ? (
                        <QRCodeSVG
                          value={generateGoogleAuthURI()}
                          size={120}
                          level="M"
                        />
                      ) : (
                        <div className="text-xs text-center text-gray-400">
                          {error ? "Failed to load QR code" : "No QR code available"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-auto py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                      onClick={handleClose}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-auto py-3 bg-[#f67c00] hover:bg-[#e56b00] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleNextStep}
                      disabled={!verificationCode || isLoading || isSaving}
                    >
                      Next step
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* 步骤2内容 - 已绑定状态：显示新密钥 */}
            {currentStep === 2 && isAuthenticatorBound && (
              <>
                <h2 className="text-center [font-family:'Arboria-Medium-Medium',Helvetica] font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal] mb-4">
                  {getStepTitle()}
                </h2>
                
                <p className="mb-6 text-sm leading-relaxed text-left text-gray-600">
                  {getStepDescription()}
                </p>

                {error && (
                  <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">密钥</span>
                    </div>

                    <div className="relative">
                      <Input
                        value={verificationCode}
                        readOnly
                        className="pr-10 font-mono text-sm border-gray-200 bg-gray-50"
                        placeholder={isLoading ? "Loading..." : "No secret available"}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute w-6 h-6 p-0 -translate-y-1/2 right-2 top-1/2 hover:bg-gray-100"
                        onClick={handleCopyCode}
                        disabled={!verificationCode || isLoading || isSaving}
                      >
                        {isCopied ? (
                          <CheckIcon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <CopyIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex items-center justify-center w-32 h-32 p-2 bg-white border border-gray-200 rounded-lg">
                      {isLoading ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f67c00]"></div>
                        </div>
                      ) : verificationCode ? (
                        <QRCodeSVG
                          value={generateGoogleAuthURI()}
                          size={120}
                          level="M"
                        />
                      ) : (
                        <div className="text-xs text-center text-gray-400">
                          {error ? "Failed to load QR code" : "No QR code available"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-auto py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                      onClick={handleClose}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-auto py-3 bg-[#f67c00] hover:bg-[#e56b00] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleNextStep}
                      disabled={!verificationCode || isLoading || isSaving}
                    >
                      Next step
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* 步骤2内容 - 未绑定状态：输入验证码 */}
            {currentStep === 2 && !isAuthenticatorBound && (
              <>
                <h2 className="text-center [font-family:'Arboria-Medium-Medium',Helvetica] font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal] mb-4">
                  {getStepTitle()}
                </h2>
                
                {error && (
                  <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Ga</label>
                    <Input
                      placeholder="Enter Ga"
                      className="w-full text-sm bg-white border-gray-200"
                      value={gaCode}
                      onChange={(e) => {
                        setGaCode(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-auto py-3 border-[#f67c00] text-[#f67c00] hover:bg-[#f67c00]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePrevStep}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-auto py-3 bg-[#f67c00] hover:bg-[#e56b00] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSave}
                      disabled={isSaving || !gaCode.trim()}
                    >
                      {isSaving ? (
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
              </>
            )}

            {/* 步骤3内容 - 已绑定状态：输入新验证码 */}
            {currentStep === 3 && isAuthenticatorBound && (
              <>
                <h2 className="text-center [font-family:'Arboria-Medium-Medium',Helvetica] font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal] mb-4">
                  {getStepTitle()}
                </h2>
                
                {error && (
                  <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Ga</label>
                    <Input
                      placeholder="Enter Ga"
                      className="w-full text-sm bg-white border-gray-200"
                      value={gaCode}
                      onChange={(e) => {
                        setGaCode(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-auto py-3 border-[#f67c00] text-[#f67c00] hover:bg-[#f67c00]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePrevStep}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-auto py-3 bg-[#f67c00] hover:bg-[#e56b00] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSave}
                      disabled={isSaving || !gaCode.trim()}
                    >
                      {isSaving ? (
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
