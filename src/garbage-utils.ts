export interface GarbageSchedule {
  type: string;
  displayName?: string; // 表示用の名前（詳細情報を含む）
  dayOfWeek: number; // 0: 日曜日, 1: 月曜日, ... 6: 土曜日
  weekOfMonth?: number[]; // 第何週目か (1-5)、未指定の場合は毎週
}

// ゴミ種類の定義
export const GARBAGE_TYPES = {
  BURNABLE: "燃えるゴミ",
  RESOURCE: "資源ゴミ",
  NON_BURNABLE: "不燃ゴミ",
};

// 詳細表示用の定義
export const GARBAGE_DISPLAY_NAMES = {
  [GARBAGE_TYPES.BURNABLE]: "燃えるゴミ",
  [GARBAGE_TYPES.RESOURCE]: "資源ゴミ（びん・かん・ペットボトル・紙・布類）",
  [GARBAGE_TYPES.NON_BURNABLE]:
    "不燃ゴミ（プラスチック・せともの・ガラス・金物類・\n小型家電製品・蛍光灯・電球・乾電池・充電式機器・\nスプレー缶・ライター）",
};

// ゴミ出しスケジュール
// 実際のスケジュールに合わせて修正してください
export const garbageSchedules: GarbageSchedule[] = [
  { type: GARBAGE_TYPES.BURNABLE, dayOfWeek: 2 }, // 毎週火曜日
  { type: GARBAGE_TYPES.BURNABLE, dayOfWeek: 5 }, // 毎週金曜日
  { type: GARBAGE_TYPES.RESOURCE, dayOfWeek: 4 }, // 毎週木曜日
  { type: GARBAGE_TYPES.NON_BURNABLE, dayOfWeek: 1 }, // 毎週月曜日
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
 * ゴミ種類の表示名を取得する
 */
export function getGarbageDisplayName(garbageType: string): string {
  return GARBAGE_DISPLAY_NAMES[garbageType] || garbageType;
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

  const garbageTypes = getTomorrowGarbage();

  if (garbageTypes.length === 0) {
    return "";
  }

  const month = tomorrow.getMonth() + 1;
  const date = tomorrow.getDate();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const day = dayNames[tomorrow.getDay()];

  // 標準の種類名を表示用の詳細名に変換
  const garbageDisplayNames = garbageTypes.map(getGarbageDisplayName);

  return `【ゴミ出し通知】\n明日（${month}月${date}日・${day}曜日）は\n${garbageDisplayNames.join(
    "と"
  )}の日です。\n忘れずに出してください！`;
}
