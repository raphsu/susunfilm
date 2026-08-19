import type { Status } from '../content/site'

/**
 * 資料誠信的程式化保證。
 *
 * 需求書第 32 條：不要把 NEED REVIEW 直接當成 VERIFIED。
 * 這裡把它變成 build 時強制執行，而不是靠人記得——
 * production build 只放行 status === 'verified' 的內容，
 * dev 模式全部顯示，並在畫面上標出狀態，方便你看到哪些還沒放行。
 */
export const IS_PROD = import.meta.env.PROD

export function isPublished(status?: Status) {
  return !IS_PROD || status === 'verified'
}

/** 過濾陣列。prod 只留 verified。 */
export function published<T extends { status?: Status }>(items: T[]): T[] {
  return IS_PROD ? items.filter(i => i.status === 'verified') : items
}

/** 單一欄位：沒放行就用 fallback。 */
export function pick<T>(value: T, status: Status | undefined, fallback: T): T {
  return isPublished(status) ? value : fallback
}
