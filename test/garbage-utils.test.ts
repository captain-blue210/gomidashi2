import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as garbageUtils from "../src/garbage-utils";

describe("Garbage Utilities", () => {
  // Store the original Date implementation
  const originalDate = global.Date;
  // Store original schedules
  const originalSchedules = [...garbageUtils.garbageSchedules];

  // Setup and teardown
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore the original Date after each test
    global.Date = originalDate;
    // Restore original schedules
    Object.defineProperty(garbageUtils, "garbageSchedules", {
      value: originalSchedules,
      writable: true,
    });
  });

  /**
   * Helper function to mock a specific date
   * @param year - The year
   * @param month - The month (0-11)
   * @param day - The day of the month
   */
  function mockDate(year: number, month: number, day: number): void {
    const mockDate = new Date(year, month, day);

    // Create a Date mock that returns our fixed date when instantiated without args
    // but behaves normally when args are provided
    class MockDate extends Date {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(mockDate.getTime());
        } else {
          super(...(args as [number, number, number]));
        }
      }
    }

    // Replace the global Date with our mock
    global.Date = MockDate as DateConstructor;
  }

  /**
   * Helper function to set up test schedules
   */
  function setupTestSchedules(): void {
    // Define test schedules
    const testSchedules: garbageUtils.GarbageSchedule[] = [
      { type: garbageUtils.GARBAGE_TYPES.BURNABLE, dayOfWeek: 2 }, // 毎週火曜日
      { type: garbageUtils.GARBAGE_TYPES.BURNABLE, dayOfWeek: 5 }, // 毎週金曜日
      { type: garbageUtils.GARBAGE_TYPES.RESOURCE, dayOfWeek: 4 }, // 毎週木曜日
      { type: garbageUtils.GARBAGE_TYPES.NON_BURNABLE, dayOfWeek: 1 }, // 毎週月曜日
    ];

    // Replace the schedules with our test schedules
    Object.defineProperty(garbageUtils, "garbageSchedules", {
      value: testSchedules,
      writable: true,
    });
  }

  describe("Unit Tests", () => {
    /**
     * Test case: getGarbageDisplayName function
     */
    it("should return detailed display names for garbage types", () => {
      // Test with each garbage type
      expect(
        garbageUtils.getGarbageDisplayName(garbageUtils.GARBAGE_TYPES.BURNABLE)
      ).toBe("燃えるゴミ");

      expect(
        garbageUtils.getGarbageDisplayName(garbageUtils.GARBAGE_TYPES.RESOURCE)
      ).toBe("資源ゴミ（びん・かん・ペットボトル・紙・布類）");

      expect(
        garbageUtils.getGarbageDisplayName(
          garbageUtils.GARBAGE_TYPES.NON_BURNABLE
        )
      ).toBe(
        "不燃ゴミ（プラスチック・せともの・ガラス・金物類・\n小型家電製品・蛍光灯・電球・乾電池・充電式機器・\nスプレー缶・ライター）"
      );

      // Test with unknown type (should return the type as is)
      expect(garbageUtils.getGarbageDisplayName("未知のゴミ")).toBe(
        "未知のゴミ"
      );
    });
  });

  describe("Integration Tests", () => {
    /**
     * Test case: No garbage collection tomorrow
     */
    it("should return empty string when no garbage collection is scheduled for tomorrow", () => {
      // Set up test schedules
      setupTestSchedules();

      // Mock Saturday so tomorrow is Sunday (no garbage collection scheduled)
      mockDate(2025, 2, 15); // March 15, 2025 is a Saturday

      // The function should return an empty string
      expect(garbageUtils.createTomorrowGarbageMessage()).toBe("");
    });

    /**
     * Test case: Single type of garbage collection tomorrow (Tuesday - 燃えるゴミ)
     */
    it("should return correct message for Tuesday (燃えるゴミ)", () => {
      // Set up test schedules
      setupTestSchedules();

      // Mock Monday so tomorrow is Tuesday (燃えるゴミ day)
      mockDate(2025, 2, 17); // March 17, 2025 is a Monday

      // Expected message for Tuesday, March 18, 2025
      const expectedMessage =
        "【ゴミ出し通知】\n明日（3月18日・火曜日）は\n燃えるゴミの日です。\n忘れずに出してください！";

      expect(garbageUtils.createTomorrowGarbageMessage()).toBe(expectedMessage);
    });

    /**
     * Test case: Single type of garbage collection tomorrow (Friday - 燃えるゴミ)
     */
    it("should return correct message for Friday (燃えるゴミ)", () => {
      // Set up test schedules
      setupTestSchedules();

      // Mock Thursday so tomorrow is Friday (燃えるゴミ day)
      mockDate(2025, 2, 20); // March 20, 2025 is a Thursday

      // Expected message for Friday, March 21, 2025
      const expectedMessage =
        "【ゴミ出し通知】\n明日（3月21日・金曜日）は\n燃えるゴミの日です。\n忘れずに出してください！";

      expect(garbageUtils.createTomorrowGarbageMessage()).toBe(expectedMessage);
    });

    /**
     * Test case: getGarbageByDate returns the correct garbage types
     */
    it("should correctly identify garbage types for specific dates", () => {
      // Set up test schedules
      setupTestSchedules();

      // Test with a Tuesday (燃えるゴミ day)
      // March 18, 2025 is a Tuesday
      const tuesday = new Date(2025, 2, 18);
      const tuesdayResult = garbageUtils.getGarbageByDate(tuesday);
      expect(tuesdayResult).toContain(garbageUtils.GARBAGE_TYPES.BURNABLE);

      // Test with a Friday (燃えるゴミ day)
      // March 21, 2025 is a Friday
      const friday = new Date(2025, 2, 21);
      const fridayResult = garbageUtils.getGarbageByDate(friday);
      expect(fridayResult).toContain(garbageUtils.GARBAGE_TYPES.BURNABLE);

      // Test with a Monday (不燃ゴミ day)
      // March 17, 2025 is a Monday
      const monday = new Date(2025, 2, 17);
      const mondayResult = garbageUtils.getGarbageByDate(monday);
      expect(mondayResult).toContain(garbageUtils.GARBAGE_TYPES.NON_BURNABLE);
    });

    /**
     * Test case: getTomorrowGarbage returns tomorrow's garbage
     */
    it("should return tomorrow's garbage", () => {
      // Set up test schedules
      setupTestSchedules();

      // Mock Monday so tomorrow is Tuesday (燃えるゴミ day)
      mockDate(2025, 2, 17); // March 17, 2025 is a Monday

      // Get tomorrow's garbage
      const tomorrowGarbage = garbageUtils.getTomorrowGarbage();

      // Verify that it contains 燃えるゴミ
      expect(tomorrowGarbage).toContain(garbageUtils.GARBAGE_TYPES.BURNABLE);
    });

    /**
     * Test case: 資源ゴミ on every Thursday
     */
    it("should collect 資源ゴミ every Thursday", () => {
      // Set up test schedules
      setupTestSchedules();

      // Mock Wednesday so tomorrow is Thursday (資源ゴミ day)
      mockDate(2025, 2, 19); // March 19, 2025 is a Wednesday

      // Get tomorrow's garbage
      const tomorrowGarbage = garbageUtils.getTomorrowGarbage();

      // Verify that it contains 資源ゴミ
      expect(tomorrowGarbage).toContain(garbageUtils.GARBAGE_TYPES.RESOURCE);
      expect(tomorrowGarbage.length).toBe(1);

      // Verify the message is correct
      const message = garbageUtils.createTomorrowGarbageMessage();
      const expectedMessage =
        "【ゴミ出し通知】\n明日（3月20日・木曜日）は\n資源ゴミ（びん・かん・ペットボトル・紙・布類）の日です。\n忘れずに出してください！";
      expect(message).toBe(expectedMessage);

      // Test with a Thursday
      const thursday = new Date(2025, 2, 20); // March 20, 2025 (a Thursday)
      const thursdayResult = garbageUtils.getGarbageByDate(thursday);
      expect(thursdayResult).toContain(garbageUtils.GARBAGE_TYPES.RESOURCE);
      expect(thursdayResult.length).toBe(1);
    });

    /**
     * Test case: 不燃ゴミ on every Monday
     */
    it("should collect 不燃ゴミ every Monday", () => {
      // Set up test schedules
      setupTestSchedules();

      // Mock Sunday so tomorrow is Monday (不燃ゴミ day)
      mockDate(2025, 2, 16); // March 16, 2025 is a Sunday

      // Get tomorrow's garbage
      const tomorrowGarbage = garbageUtils.getTomorrowGarbage();

      // Verify that it contains 不燃ゴミ
      expect(tomorrowGarbage).toContain(
        garbageUtils.GARBAGE_TYPES.NON_BURNABLE
      );
      expect(tomorrowGarbage.length).toBe(1);

      // Verify the message is correct
      const message = garbageUtils.createTomorrowGarbageMessage();
      const expectedMessage =
        "【ゴミ出し通知】\n明日（3月17日・月曜日）は\n不燃ゴミ（プラスチック・せともの・ガラス・金物類・\n小型家電製品・蛍光灯・電球・乾電池・充電式機器・\nスプレー缶・ライター）の日です。\n忘れずに出してください！";
      expect(message).toBe(expectedMessage);

      // Test with a Monday
      const monday = new Date(2025, 2, 17); // March 17, 2025 (a Monday)
      const mondayResult = garbageUtils.getGarbageByDate(monday);
      expect(mondayResult).toContain(garbageUtils.GARBAGE_TYPES.NON_BURNABLE);
      expect(mondayResult.length).toBe(1);
    });
  });
});
