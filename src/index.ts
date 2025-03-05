import * as functions from "@google-cloud/functions-framework";
import { CloudEvent } from "@google-cloud/functions-framework/build/src/functions";
import * as line from "@line/bot-sdk";
import { createTomorrowGarbageMessage } from "./garbage-utils";
import { lineConfig, validateLineConfig } from "./line-config";

// LINE設定を検証
validateLineConfig();

// LINEクライアント初期化
const client = new line.Client(lineConfig);

/**
 * 定期通知処理関数（Pub/Subトリガー用）
 * 毎日23時に実行される想定
 */
functions.cloudEvent<CloudEvent<unknown>>(
  "sendGarbageNotification",
  async (cloudEvent: CloudEvent<unknown>) => {
    try {
      console.log("Starting garbage notification process...");

      // 明日のゴミ出し予定を取得
      const message = createTomorrowGarbageMessage();
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
      } else {
        console.log("No garbage collection tomorrow, skipping notification");
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      throw error;
    }
  }
);
