"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLineConfig = exports.lineConfig = void 0;
exports.lineConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET || "",
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
};
// 設定の検証
function validateLineConfig() {
    if (!exports.lineConfig.channelSecret) {
        throw new Error("LINE_CHANNEL_SECRET is not set");
    }
    if (!exports.lineConfig.channelAccessToken) {
        throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
    }
}
exports.validateLineConfig = validateLineConfig;
