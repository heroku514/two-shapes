import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { answerPair, hasProgress, leftShape, pairLabel, resetShapes, rightShape, shapesText, type ShapeState } from "./src/shapes";
import { loadShapes, saveShapes } from "./src/store";

export default function App() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<ShapeState | null>(null);
  const [note, setNote] = useState("Look at the shapes.");
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    loadShapes()
      .then((loaded) => {
        setState(loaded);
        setNote(loaded.done ? "All checked." : hasProgress(loaded) ? "Saved shapes loaded." : "Look at the shapes.");
      })
      .catch(() => {
        setState(null);
        setNote("Could not read the shapes.");
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !state) return;
    saveShapes(state).catch(() => setNote("Could not save the shapes."));
  }, [ready, state]);

  if (!ready || !state) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the shapes</Text>
        </View>
      </SafeAreaView>
    );
  }

  const left = leftShape(state);
  const right = rightShape(state);

  function onAnswer(choice: "Same" | "Different") {
    const result = answerPair(state!, choice);
    setState(result.state);
    setNote(result.note);
    setConfirmNew(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.body}>
        <Text style={styles.title}>Two Shapes</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.pair}>{pairLabel(state)}</Text>
        <Text style={styles.line}>{shapesText(state)}</Text>
        {state.done ? null : (
          <View style={styles.row}>
            <ShapeMark name={left} />
            <ShapeMark name={right} />
          </View>
        )}
        <View style={styles.row}>
          <BigButton label="Same" filled inRow onPress={() => onAnswer("Same")} />
          <BigButton label="Different" inRow onPress={() => onAnswer("Different")} />
        </View>
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New shapes" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetShapes();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New shapes canceled.");
  }
}

function ShapeMark({ name }: { name: string }) {
  return (
    <View style={styles.shapeWrap} accessibilityLabel={name}>
      <View
        style={[
          name === "Circle" && styles.circle,
          name === "Square" && styles.square,
          name === "Triangle" && styles.triangle,
        ]}
      />
      <Text style={styles.shapeName}>{name}</Text>
    </View>
  );
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7FB" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#1F2A44" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  title: { fontSize: 32, fontWeight: "800", color: "#1F2A44" },
  note: { fontSize: 18, color: "#3E4C6A", minHeight: 28 },
  pair: { fontSize: 22, fontWeight: "700", color: "#1F2A44" },
  line: { fontSize: 36, fontWeight: "800", color: "#C2410C", lineHeight: 44, minHeight: 88 },
  row: { flexDirection: "row", gap: 8 },
  shapeWrap: { flex: 1, alignItems: "center", gap: 8, minHeight: 120 },
  shapeName: { fontSize: 22, fontWeight: "800", color: "#1F2A44" },
  circle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#C2410C" },
  square: { width: 72, height: 72, borderRadius: 8, backgroundColor: "#1F2A44" },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 36,
    borderRightWidth: 36,
    borderBottomWidth: 64,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#0F766E",
  },
  button: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1F2A44",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#1F2A44" },
  buttonText: { fontSize: 22, fontWeight: "800", color: "#1F2A44", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
