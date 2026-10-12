export interface ScreenTimeTickInput {
  currentMinutes: number;
  dailyLimitMinutes: number;
  isVisible: boolean;
}

export interface ScreenTimeTickResult {
  nextMinutes: number;
  shouldAlert: boolean;
}

export function computeScreenTimeTick({
  currentMinutes,
  dailyLimitMinutes,
  isVisible,
}: ScreenTimeTickInput): ScreenTimeTickResult {
  if (!isVisible) {
    return {
      nextMinutes: currentMinutes,
      shouldAlert: false,
    };
  }

  const nextMinutes = currentMinutes + 1;
  return {
    nextMinutes,
    shouldAlert: nextMinutes >= (dailyLimitMinutes || 30),
  };
}
