import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function DashboardSkeleton() {
  return (
    <div className="p-3 bg-white rounded-lg">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-40 h-3" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>

        <div className="items-center hidden gap-3 md:flex">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </header>

      {/* 顶部按钮/标签行 */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>

      {/* 主卡片 2x2 区块 */}
      <main className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </main>

      {/* 底部操作条 */}
      <footer className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <Skeleton className="rounded-full h-9 w-9" />
          <Skeleton className="rounded-full h-9 w-28" />
          <Separator
            orientation="vertical"
            className="mx-2 h-6 bg-[#E9E9E9] w-[1px]"
          />
        </div>
        <Skeleton className="w-40 h-10 rounded-full" />
      </footer>
    </div>
  );
}

/** 单卡片骨架：标题 + 三行两列的条形块，底部有短按钮 */
function CardSkeleton() {
  return (
    <div className="p-3 bg-[#F6F6F8] rounded-[8px]">
      {/* 卡片头 */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="w-24 h-3" />
        </div>
        <Skeleton className="w-16 rounded-full h-7" />
      </div>

      {/* 内容网格（两列多行条形块） */}
      <div className="grid grid-cols-2 mt-4 gap-x-5 gap-y-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
  );
}
