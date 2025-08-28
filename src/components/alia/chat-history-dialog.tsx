// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { useTranslations } from "@/hooks/useTranslations";
import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { History } from "@/components/alia/icons/history";
import { Collecte } from "@/components/alia/icons/collecte";
import {
    Dialog,
    DialogContentBottom,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/base/dialog";

import { cn, getStateValue } from "@/lib/utils";

import { Tooltip } from "./tooltip";
// import { DeleteAll } from "./icons/delete-all";
// import { Delete } from "./icons/delete";
import MoreActionsMenu from "./more-action";
import { queryHistoryMetadata, getThreadDetail, deleteThreads, updateStarred, updateTitle } from "@/core/api/history";
// import { useRootStore } from "@/store";
import { Thread, ThreadMessage } from "@/core/history";
import dayjs from "dayjs";
import type { Message, MessageRole } from "@/core/messages";
import { appendMessage, useStore } from "@/core/store";
import { useRootStore } from "@/store";
import { BaseDialog } from "../custom/Modal/BaseDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


function DeleteModal({ open, onClose, onSubmit }: 
    {
        open: boolean,
        onClose: () => void,
        onSubmit: () => void,
    }) {
    
    return (
        <BaseDialog open={open} onOpenChange={onClose}>
          <div className="bg-white rounded-lg border-0 h-[auto] p-4">
            <div className="p-0 space-y-4">
              <div className="flex flex-col items-center">
                <svg className="mt-4" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 30C6.71578 30 0 23.2842 0 15C0 6.71578 6.71578 0 15 0C23.2842 0 30 6.71578 30 15C30 23.2842 23.2842 30 15 30ZM16.4062 7.03125C16.4062 6.25453 15.7767 5.625 15 5.625C14.2233 5.625 13.5938 6.25453 13.5938 7.03125V17.3438C13.5938 18.1205 14.2233 18.75 15 18.75C15.7767 18.75 16.4062 18.1205 16.4062 17.3438V7.03125ZM15 21.5625C14.2233 21.5625 13.5938 22.192 13.5938 22.9688C13.5938 23.7455 14.2233 24.375 15 24.375C15.7767 24.375 16.4062 23.7455 16.4062 22.9688C16.4062 22.192 15.7767 21.5625 15 21.5625Z" fill="#F60000"/>
                </svg>
                <h3 className="text-brand-medium font-medium text-[16px] mt-5 mb-2">Delete this conversation?</h3>
                <p className="font-medium">This action cannot be undone.</p>
                <div className="flex w-full gap-3 pt-2 mt-6">
                  <Button
                    className="flex-1 bg-[#F3F3F3] h-[26px] rounded-[30px] font-medium text-sm text-center text-[#2C2C2C] hover:bg-[#F3F3F3]/90"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-[26px] bg-[#F60000] hover:bg-[#F60000]/90  rounded-[30px] font-medium text-white text-sm text-center tracking-[0] leading-[normal] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    onClick={onSubmit}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </BaseDialog>
    )
}

function EditModal({ thread, open, onClose, onSubmit }: {
    thread: Thread | undefined,
    open: boolean,
    onClose: () => void,
    onSubmit: (title: string) => void,
}) {
    const [title, setTitle] = useState(thread?.title || "");

    
    return (
        <BaseDialog open={open} onOpenChange={onClose}>
          <div className="bg-white rounded-lg border-0 h-[auto] p-4">
            <div className="p-0 space-y-4">
              <h3 className="mt-8 font-bold text-lg">Edit Title</h3>
              <div className="flex flex-col">
                <div className="relative">
                    <Input
                        className="h-8 pl-2 pr-20 mb-0 rounded-2"
                        placeholder="Long size title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex w-full gap-3 pt-2 mt-6">
                  <Button
                    className="flex-1 bg-[#F3F3F3] h-[26px] rounded-[30px] font-medium text-sm text-center text-[#2C2C2C] hover:bg-[#F3F3F3]/90 cursor-pointer"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-[26px] bg-primary hover:bg-primary/90  rounded-[30px] font-medium text-white text-sm text-center tracking-[0] leading-[normal] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    onClick={() => onSubmit(title)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </BaseDialog>
    )
}

export function ChatHistoryDialog() {
    const t = useTranslations("chat.history");
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [type, setType] = useState<"all" | "starred">('all');
    const [currentThread, setCurrentThread] = useState<Thread>();
    const [total, setTotal] = useState(0);

    const { token } = useRootStore();
    const [threads, setThreads] = useState<Record<string, Thread[]>>({})

    function groupByDayTimestamp(data: Thread[]): Record<string, Thread[]> {
        return data.reduce((acc, item) => {
            const dayStart = Math.floor(item.created_at / 86400) * 86400;
            if (!acc[dayStart.toString()]) {
                acc[dayStart] = [];
            }
            acc[dayStart].push(item);

            return acc;
        }, {} as Record<string, Thread[]>);
    }
    const fetchHistoryMetadata = async () => {
        try {
            const user_id = getStateValue("state.userDetail.uid");
            if (!user_id) return;
            const data = await queryHistoryMetadata(user_id, search.trim(), type)
            if (data && Array.isArray(data)) {
                setTotal(data.length)
                const dataObj = groupByDayTimestamp(data);
                setThreads(dataObj);
            }
        } catch (error) {
            console.error("Error fetching history metadata:", error);
        }
    }

    // function getRole(message: ThreadMessage) {
    //     if (message.type === "human") {
    //         return message.name === "reporter" ? "assistant" : "user";
    //     } else if (message.type === "ai") {
    //         return "assistant";
    //     } else if (message.type === "ai") {
    //         return "assistant";
    //     } else {
    //         return "assistant";
    //     }
    // }
    // function getAgent(message: ThreadMessage) {
    //     if (message.name === null && message.type === "ai") {
    //         return "coordinator"
    //     } else {
    //         return message.name as 
    //             | "coordinator"
    //             | "planner"
    //             | "researcher"
    //             | "coder"
    //             | "reporter"
    //             | "podcast"
    //     }
    // }

    const handlethreadClick = async (thread: Thread) => {
        try {
            useStore.getState().clearMessages();
            const data = await getThreadDetail(thread.thread_id)
            // const data = await getThreadDetail('WUVcMg7FKgnG2mR5NZSOn')
            console.log("thread detail:", data);
            let messages: Message[] = [];
            // let messageIds: string[] = [];
            if (data && data.messages && Array.isArray(data.messages)) {
                data.messages.forEach((message) => {
                    messages.push(message)
                });
            }
            if (messages.length) {
                messages.forEach((m) => {
                    appendMessage(m)
                })
                useStore.getState().setThreadId(thread.thread_id);
            }
            setOpen(false)
        } catch (error) {
            console.error("Error fetching history metadata:", error);
        }
    }

    const handleDelete = async () => {
        try {
            if (currentThread) {
                const res = await deleteThreads([currentThread.thread_id]);
                if (res.message) {
                    setDeleteOpen(false);
                    fetchHistoryMetadata();
                }
            }
        } catch (error) {
            
        }
    }

    const handleEdite = async (title: string) => {
        try {
            if (currentThread) {
                const res = await updateTitle(currentThread.thread_id, title); 
                if (res.message) {
                    setEditOpen(false);
                    fetchHistoryMetadata();
                }
            }
        } catch (error) {
            
        }
    }

    const handleUpdateStarred = async (thread_id: string, starred: boolean) => {
        try {
            const res = await updateStarred(thread_id, starred);
            if (res.message) {
                fetchHistoryMetadata();
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        if (token && open) {
            fetchHistoryMetadata();
        }
    }, [token, open, type, search]);


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
            <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onSubmit={() => handleDelete()} />
            <EditModal thread={currentThread} open={editOpen} onClose={() => setEditOpen(false)} onSubmit={(title) => handleEdite(title)}  />
            <DialogContentBottom className="h-[80%]">
                <DialogHeader className="flex flex-row">
                    <DialogTitle>
                        {t("chatHistory")}
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm">
                        ({total})
                    </p>
                </DialogHeader>
                <div className="flex flex-col h-full">
                    <div className="flex flex-col space-y-2 py-2">
                        <div className="flex items-center space-x-4 text-sm font-medium">
                            <button
                                className={type === 'all' ? cn("text-black border-b-2 border-black hover:text-black pb-1 cursor-pointer") :
                                    cn("text-gray-500 border-b-2 border-white hover:text-black pb-1 cursor-pointer")}
                                onClick={() => setType("all")}
                            >
                                All
                            </button>
                            <button 
                                className={type === 'starred' ? cn("text-black border-b-2 border-black hover:text-black pb-1 cursor-pointer") :
                                 cn("text-gray-500 border-b-2 border-white hover:text-black pb-1 cursor-pointer")}
                                onClick={() => setType("starred")}
                            >Starred</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="relative w-full">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="text"
                                    placeholder="Search"
                                    className="w-full rounded-md border border-gray-300 pl-8 pr-2 py-1 text-sm focus:outline-none focus:ring-2 focus:#F67C00"
                                />
                            </div>
                            {/* <button onClick={() => {}} className="p-2 rounded-md hover:text-red-500">
                                <Trash2 className="h-5 w-5" />
                            </button> */}
                        </div>
                    </div>
                    <div className="h-[calc(100vh-22%)] overflow-y-auto">
                        {Object.keys(threads).sort((a, b) => Number(b) - Number(a) ).map((key) => (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground text-sm mt-2">
                                        {dayjs.unix(key as unknown as number).format('YYYY-MM-DD')}
                                    </p>
                                </div>
                                <div className="grid gap-1 py-2">
                                    {threads[key].map((thread, index) => {
                                        return (
                                            <button
                                                key={index}
                                                className={cn(
                                                    "hover:bg-accent flex items-start gap-3 rounded-lg p-4 text-left transition-colors bg-[#F3F3F3]",
                                                    // isSelected && "bg-[#FFF4E8]",
                                                )}
                                                onClick={() => handlethreadClick(thread)}
                                            >
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <div className="flex-1 space-y-1">
                                                        <h4 className="text-sm font-medium">{thread.title || `Chat${index}`}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MoreActionsMenu
                                                            onDelete={() => {
                                                                setCurrentThread(thread);
                                                                setDeleteOpen(true);
                                                            }}
                                                            onEdit={() => {
                                                                setCurrentThread(thread);
                                                                setEditOpen(true);
                                                            }}
                                                        />
                                                        <div onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateStarred(thread.thread_id, !thread.is_starred);
                                                        }}>
                                                            <Collecte className="cursor-pointer" color={thread.is_starred ? '#F67C00' : ''} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ))}
                        <div className=" bg-white p-4">
                            <p className="text-center text-sm mt-2">
                                No more history
                            </p>
                            <p className="text-center text-sm mt-2">
                                Only show sessions within 30 days
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContentBottom>
        </Dialog>
    );
}

