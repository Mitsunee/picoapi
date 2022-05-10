export type HookName = "prefetch" | "error" | "success";

export interface HookAttacher {
  (hook: "prefetch", callback: PrefetchHookCallback): void;
  (hook: "error", callback: ErrorHookCallback): void;
  (hook: "success", callback: SuccessHookCallback): void;
}

export interface HookRemover {
  (hook?: HookName): void;
}

// hook callback
interface HookReq {
  url: string;
  method: string;
  id: string;
}

// prefetch hook
type PrefetchHookReturn = { url?: string; data?: any };
interface PrefetchHookReq extends HookReq {}
export type PrefetchHookCallback = (
  req: PrefetchHookReq
) => void | PrefetchHookReturn | Promise<PrefetchHookReturn>;

// error hook
type ErrorHookReturn = { data?: any; error?: string | Error };
interface ErrorHookReq extends HookReq {
  status: number;
  statusMessage: string;
}
export type ErrorHookCallback = (
  req: ErrorHookReq
) => void | ErrorHookReturn | Promise<ErrorHookReturn>;

// success hook
type SuccessHookReturn = { data?: any };
interface SuccessHookReq extends HookReq {
  data?: any;
}
export type SuccessHookCallback = (
  req: SuccessHookReq
) => void | SuccessHookReturn | Promise<SuccessHookReturn>;
