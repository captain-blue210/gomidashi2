export const lineConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
};

// 設定の検証
export function validateLineConfig(): void {
  if (!lineConfig.channelAccessToken) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  }
}
