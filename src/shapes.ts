export const PAIRS = [
  ["Circle", "Circle"],
  ["Circle", "Square"],
  ["Square", "Square"],
  ["Triangle", "Circle"],
  ["Triangle", "Triangle"],
  ["Square", "Triangle"],
] as const;

const PAIR_WORDS = ["Pair one", "Pair two", "Pair three", "Pair four", "Pair five", "Pair six"] as const;

export type ShapeState = {
  index: number;
  done: boolean;
};

export const EMPTY_SHAPES: ShapeState = {
  index: 0,
  done: false,
};

export function pairLabel(state: ShapeState): string {
  if (state.done) return "Done";
  return PAIR_WORDS[state.index] ?? PAIR_WORDS[0];
}

export function leftShape(state: ShapeState): string {
  if (state.done) return "";
  return PAIRS[state.index]?.[0] ?? PAIRS[0][0];
}

export function rightShape(state: ShapeState): string {
  if (state.done) return "";
  return PAIRS[state.index]?.[1] ?? PAIRS[0][1];
}

export function shapesText(state: ShapeState): string {
  if (state.done) return "All checked.";
  const pair = PAIRS[state.index] ?? PAIRS[0];
  return `${pair[0]} and ${pair[1]}.`;
}

export function hasProgress(state: ShapeState): boolean {
  return state.done || state.index > 0;
}

export function parseShapes(raw: string | null): ShapeState {
  if (!raw) return EMPTY_SHAPES;
  try {
    const data = JSON.parse(raw) as Partial<ShapeState>;
    const index = typeof data.index === "number" && data.index >= 0 && data.index < PAIRS.length
      ? Math.floor(data.index)
      : 0;
    const done = data.done === true;
    return { index: done ? 0 : index, done };
  } catch {
    return EMPTY_SHAPES;
  }
}

export function answerPair(state: ShapeState, choice: string): { state: ShapeState; note: string } {
  if (state.done) return { state, note: "All checked." };
  const pair = PAIRS[state.index];
  const expected = pair[0] === pair[1] ? "Same" : "Different";
  if (choice !== "Same" && choice !== "Different") return { state, note: "Look at the shapes." };
  if (choice !== expected) return { state, note: "Look again." };
  if (state.index + 1 >= PAIRS.length) return { state: { index: state.index, done: true }, note: "All checked." };
  return { state: { index: state.index + 1, done: false }, note: "Matched." };
}

export function resetShapes(): { state: ShapeState; note: string } {
  return { state: EMPTY_SHAPES, note: "Look at the shapes." };
}
