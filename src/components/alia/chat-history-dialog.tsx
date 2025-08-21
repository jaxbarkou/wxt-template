// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { useTranslations } from "@/hooks/useTranslations";
import { useState } from "react";
import { Check, FileText, Newspaper, Users, GraduationCap } from "lucide-react";
import { History } from "@/components/alia/icons/history";
import { Button } from "@/components/base/button";
import { MoreIcon } from "@/components/alia/icons/more";
import { Collecte } from "@/components/alia/icons/collecte";
import {
    Dialog,
    DialogContentBottom,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/base/dialog";

import { setReportStyle, useSettingsStore } from "@/core/store";
import { cn } from "@/lib/utils";

import { Tooltip } from "./tooltip";
import { Delete } from "./icons/delete";
import MoreActionsMenu from "./more-action";

const REPORT_STYLES = [
    {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    },
    {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    }, {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    },
    {
        value: "popular_science" as const,
        labelKey: "popularScience",
        descriptionKey: "popularScienceDesc",
        icon: FileText,
    },
     {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    },
    {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    }, {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    },
    {
        value: "popular_science" as const,
        labelKey: "popularScience",
        descriptionKey: "popularScienceDesc",
        icon: FileText,
    }, {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    },
    {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    }, {
        value: "academic" as const,
        labelKey: "academic",
        descriptionKey: "academicDesc",
        icon: GraduationCap,
    },
    {
        value: "popular_science" as const,
        labelKey: "popularScience",
        descriptionKey: "popularScienceDesc",
        icon: FileText,
    },
    {
        value: "news" as const,
        labelKey: "news",
        descriptionKey: "newsDesc",
        icon: Newspaper,
    },
    {
        value: "social_media" as const,
        labelKey: "socialMedia",
        descriptionKey: "socialMediaDesc",
        icon: Users,
    },
];

export function ChatHistoryDialog() {
    const t = useTranslations("chat.history");
    const [open, setOpen] = useState(false);
    const currentStyle = useSettingsStore((state) => state.general.reportStyle);

    const handleStyleChange = (
        style: "academic" | "popular_science" | "news" | "social_media",
    ) => {
        setReportStyle(style);
        // setOpen(false);
    };

    const currentStyleConfig =
        REPORT_STYLES.find((style) => style.value === currentStyle) ||
        REPORT_STYLES[0]!;
    const CurrentIcon = currentStyleConfig.icon;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip
                // className="max-w-60"
                title={t("title")}
            >
                <DialogTrigger asChild >
                    <div onClick={() => setOpen(true)}><History /></div>
                </DialogTrigger>
            </Tooltip>
            <DialogContentBottom className="h-[80%]">
                <DialogHeader className="flex flex-row">
                    <DialogTitle>
                        {t("chatHistory")}
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm">
                        (0)
                    </p>
                </DialogHeader>
                <div className="h-[calc(100vh-22%)] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm mt-2">
                            Today
                        </p>
                        <Delete />
                    </div>
                    <div className="grid gap-1 py-2">
                        {REPORT_STYLES.map((style) => {
                            const Icon = style.icon;
                            const isSelected = currentStyle === style.value;

                            return (
                                <button
                                    key={style.value}
                                    className={cn(
                                        "hover:bg-accent flex items-start gap-3 rounded-lg p-4 text-left transition-colors",
                                        isSelected && "bg-[#FFF4E8]",
                                    )}
                                    onClick={() => handleStyleChange(style.value)}
                                >
                                    <div className="flex-1 space-y-1 w-full">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-sm">{t(style.labelKey)}</h4>
                                            <div className="flex items-center gap-2">
                                                {/* <MoreIcon /> */}
                                                <MoreActionsMenu />
                                                <Collecte />
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm max-w-[300px]  truncate">
                                            {t(style.descriptionKey)} text that is very long and should be truncated if it exceeds the width of the container. This is a test to see how the text behaves in this dialog component. It should not overflow and should be neatly contained within the bounds of the dialog.
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                    <p className="text-center text-sm mt-2">
                        No more history
                    </p>
                    <p className="text-center text-sm mt-2">
                        Only show sessions within 30 days
                    </p>
                </div>
            </DialogContentBottom>
        </Dialog>
    );
}
