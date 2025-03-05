"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTomorrowGarbageMessage = exports.getGarbageByDate = exports.getTomorrowGarbage = exports.garbageSchedules = void 0;
// ゴミ出しスケジュール
// 実際のスケジュールに合わせて修正してください
exports.garbageSchedules = [
    { type: "燃えるゴミ", dayOfWeek: 2 },
    { type: "燃えるゴミ", dayOfWeek: 5 },
    { type: "資源ゴミ", dayOfWeek: 3, weekOfMonth: [2, 4] },
    { type: "不燃ゴミ", dayOfWeek: 3, weekOfMonth: [1, 3] }, // 第1・第3水曜日
];
/**
 * 明日のゴミ出し予定を取得する
 */
function getTomorrowGarbage() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getGarbageByDate(tomorrow);
}
exports.getTomorrowGarbage = getTomorrowGarbage;
/**
 * 指定日のゴミ出し予定を取得する
 */
function getGarbageByDate(date) {
    const dayOfWeek = date.getDay();
    const weekOfMonth = getWeekOfMonth(date);
    const garbageList = exports.garbageSchedules.filter((schedule) => {
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
exports.getGarbageByDate = getGarbageByDate;
/**
 * 日付から第何週目かを計算する (1-5)
 */
function getWeekOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekday = firstDay.getDay();
    return Math.ceil((date.getDate() + firstDayWeekday) / 7);
}
/**
 * 明日のゴミ出し通知メッセージを作成する
 */
function createTomorrowGarbageMessage() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const garbageList = getTomorrowGarbage();
    if (garbageList.length === 0) {
        return "明日のゴミ出しはありません。";
    }
    const month = tomorrow.getMonth() + 1;
    const date = tomorrow.getDate();
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const day = dayNames[tomorrow.getDay()];
    return `【ゴミ出し通知】\n明日（${month}月${date}日・${day}曜日）は\n${garbageList.join("と")}の日です。\n忘れずに出してください！`;
}
exports.createTomorrowGarbageMessage = createTomorrowGarbageMessage;
