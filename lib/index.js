"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("@google-cloud/functions-framework"));
const line = __importStar(require("@line/bot-sdk"));
const garbage_utils_1 = require("./garbage-utils");
const line_config_1 = require("./line-config");
// LINE設定を検証
(0, line_config_1.validateLineConfig)();
// LINEクライアント初期化
const client = new line.Client(line_config_1.lineConfig);
/**
 * 定期通知処理関数（Pub/Subトリガー用）
 * 毎日23時に実行される想定
 */
functions.cloudEvent("sendGarbageNotification", async (cloudEvent) => {
    try {
        console.log("Starting garbage notification process...");
        // 明日のゴミ出し予定を取得
        const message = (0, garbage_utils_1.createTomorrowGarbageMessage)();
        console.log(`Generated message: ${message}`);
        // 明日ゴミ出しがある場合のみ通知
        if (message !== "") {
            // LINE Broadcast API を使用して、LINE公式アカウントをフォローしているすべてのユーザーにメッセージを送信
            // これは無料プランでも利用可能
            await client.broadcast({
                type: "text",
                text: message,
            });
            console.log("Garbage notification sent successfully");
        }
        else {
            console.log("No garbage collection tomorrow, skipping notification");
        }
    }
    catch (error) {
        console.error("Error sending notifications:", error);
        throw error;
    }
});
