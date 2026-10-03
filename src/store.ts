import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseShapes, type ShapeState } from "./shapes";

const KEY = "two-shapes-v1";

export async function loadShapes(): Promise<ShapeState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseShapes(raw);
}

export async function saveShapes(state: ShapeState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
