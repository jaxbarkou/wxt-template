// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

// import { useSearchParams } from "next/navigation";
// import { useMemo } from "react";

import { env } from "@/env";

import { extractReplayIdFromSearchParams } from "./get-replay-id";

export function useReplay() {
  // TODO: Re-enable this when we support replay in static website
  // const searchParams = useSearchParams();
  // const replayId = useMemo(
  //   () => extractReplayIdFromSearchParams(searchParams.toString()),
  //   [searchParams],
  // );
  // return {
  //   isReplay: replayId != null || env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY,
  //   replayId,
  // };
  return {
    isReplay: env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY,
    replayId: null, // Static website does not use replayId
  };
}
