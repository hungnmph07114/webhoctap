export const createParentModalDefaultState = () => ({
  isUnlocked: false,
  pinInput: '',
  errorMsg: '',
  mathAnswer: '',
  isConfirmingReset: false,
  newPin: '',
  pinSuccessMsg: '',
  toastMessage: ''
});

export const createLessonReplayReset = () => ({
  filterWrongOnly: false,
  currentIdx: 0,
  answeredState: 'idle' as const,
  showHint: false,
  correctCount: 0,
  isFinished: false,
  selectedOptionId: null as string | null,
  basketItems: [] as string[],
  blankInput: '',
  matchedPairIds: [] as string[],
  selectedLeftId: null as string | null,
  currentOrderItems: [] as Array<{ id: string; text: string; correctIndex: number }>,
  rightColumnOrder: [] as Array<{ id: string; text: string; emoji?: string }>
});
