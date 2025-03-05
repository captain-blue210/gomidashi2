export interface GarbageSchedule {
  type: string;
  dayOfWeek: number; // 0: 日曜日, 1: 月曜日, ... 6: 土曜日
  weekOfMonth?: number[]; // 第何週目か (1-5)、未指定の場合は毎週
}

// ゴミ出しスケジュール
// 実際のスケジュールに合わせて修正してください
export const garbageSchedules: GarbageSchedule[] = [
  { type: "燃えるゴミ", dayOfWeek: 2 }, // 毎週火曜日
  { type: "燃えるゴミ", dayOfWeek: 5 }, // 毎週金曜日
  { type: "資源ゴミ", dayOfWeek: 3, weekOfMonth: [2, 4] }, // 第2・第4水曜日
  { type: "不燃ゴミ", dayOfWeek: 3, weekOfMonth: [1, 3] }, // 第1・第3水曜日
];

/**
 * 明日のゴミ出し予定を取得する
 */
export function getTomorrowGarbage(): string[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getGarbageByDate(tomorrow);
}

/**
 * 指定日のゴミ出し予定を取得する
 */
export function getGarbageByDate(date: Date): string[] {
  const dayOfWeek = date.getDay();
  const weekOfMonth = getWeekOfMonth(date);

  const garbageList = garbageSchedules.filter((schedule) => {
    // 曜日チェック
    if (schedule.dayOfWeek !== dayOfWeek) {
      return false;
    }

    // 第何週目かチェック（指定がある場合）
    if (schedule.weekOfMonth && !schedule.weekOfMonth.includes(weekOfMonth)) {
      return false;
    }

    return true;
  });

  return garbageList.map((garbage) => garbage.type);
}

/**
 * 日付から第何週目かを計算する (1-5)
 */
function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeekday = firstDay.getDay();

  return Math.ceil((date.getDate() + firstDayWeekday) / 7);
}

/**
 * 明日のゴミ出し通知メッセージを作成する
 */
export function createTomorrowGarbageMessage(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const garbageList = getTomorrowGarbage();

  if (garbageList.length === 0) {
    return "";
  }

  const month = tomorrow.getMonth() + 1;
  const date = tomorrow.getDate();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const day = dayNames[tomorrow.getDay()];

  return `【ゴミ出し通知】\n明日（${month}月${date}日・${day}曜日）は\n${garbageList.join(
    "と"
  )}の日です。\n忘れずに出してください！`;
}
