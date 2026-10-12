import { describe, it, expect } from 'vitest';

import { computeScreenTimeTick } from './timeUtils';

describe('computeScreenTimeTick', () => {
  it('không tăng thời gian khi tab ẩn', () => {
    const result = computeScreenTimeTick({
      currentMinutes: 12,
      dailyLimitMinutes: 30,
      isVisible: false,
    });

    expect(result.nextMinutes).toBe(12);
    expect(result.shouldAlert).toBe(false);
  });

  it('tăng thời gian khi tab đang hiển thị và cảnh báo khi đạt giới hạn', () => {
    const result = computeScreenTimeTick({
      currentMinutes: 29,
      dailyLimitMinutes: 30,
      isVisible: true,
    });

    expect(result.nextMinutes).toBe(30);
    expect(result.shouldAlert).toBe(true);
  });
});
