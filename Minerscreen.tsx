import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  Animated, Easing, ImageBackground, StatusBar,
  StyleSheet, Dimensions, Clipboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import Navbar from "./Navbar";

const W = Dimensions.get("window").width;
const CARD_MX = 20;
const CARD_W  = W - CARD_MX * 2;

// ── Animated counter ─────────────────────────────────────────────────
function AnimatedCounter({ value, fontSize = 46, color = "#7c3aed" }: { value: number; fontSize?: number; color?: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 1400, useNativeDriver: false }).start();
    const id = anim.addListener(({ value: v }) => setDisplay(Math.floor(v)));
    return () => anim.removeListener(id);
  }, [value]);
  return <Text style={{ fontSize, fontWeight: "bold", color }}>{display.toLocaleString()}</Text>;
}

// ── Pulse rings ───────────────────────────────────────────────────────
function PulseRings({ active }: { active: boolean }) {
  const r1 = useRef(new Animated.Value(1)).current;
  const r2 = useRef(new Animated.Value(1)).current;
  const o1 = useRef(new Animated.Value(0)).current;
  const o2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      Animated.timing(o1, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      Animated.timing(o2, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      return;
    }
    const pulse = (s: Animated.Value, o: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(s, { toValue: 1.65, duration: 1800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(o, { toValue: 0,    duration: 1800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(s, { toValue: 1,    duration: 0, useNativeDriver: true }),
          Animated.timing(o, { toValue: 0.45, duration: 0, useNativeDriver: true }),
        ]),
      ])).start();
    pulse(r1, o1, 0);
    pulse(r2, o2, 900);
  }, [active]);

  return (
    <>
      {[{ s: r1, o: o1 }, { s: r2, o: o2 }].map((ring, i) => (
        <Animated.View key={i} style={[s.pulseRing, { transform: [{ scale: ring.s }], opacity: ring.o }]} />
      ))}
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function MinerScreen() {
  const navigation = useNavigation<any>();
  const [active, setActive] = useState(true);
  const [copied, setCopied] = useState(false);

  const swing  = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(swing, { toValue: 1, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(swing, { toValue: 0, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])).start();
    } else {
      swing.stopAnimation();
      Animated.timing(swing, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [active]);

  const rotate = swing.interpolate({ inputRange: [0, 1], outputRange: ["-22deg", "22deg"] });
  const SERIAL = "Z4865Z85F9ZE";

  const handleCopy = () => {
    Clipboard.setString(SERIAL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: "Hashrate", value: active ? "142 MH/s" : "0 MH/s", icon: "⚡" },
    { label: "Uptime",   value: active ? "99.4%"    : "—",       icon: "🕐" },
    { label: "Shares",   value: active ? "4,821"    : "0",        icon: "📦" },
  ];

  return (
    <ImageBackground source={require("./assets/blurbg.jpg")} resizeMode="cover" style={s.root}>
      <View style={s.overlay}>
        <StatusBar barStyle="dark-content" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* Header */}
          <View style={s.headerWrap}><Header /></View>

          <Animated.View style={{ opacity: fadeIn }}>

            {/* Page title */}
            <View style={s.titleBlock}>
              <Text style={s.titleLabel}>Mining Node</Text>
              <Text style={s.titleMain}>My Miner</Text>
            </View>

            {/* ── Hero card ── */}
            <View style={s.card}>

              {/* Pickaxe + rings */}
              <View style={s.iconWrap}>
                <PulseRings active={active} />
                <View style={[s.iconCircle, { backgroundColor: active ? "#7c3aed" : "#d1d5db" }]}>
                  <Animated.Text style={{ fontSize: 50, transform: [{ rotate }] }}>⛏️</Animated.Text>
                </View>
              </View>

              {/* Status pill */}
              <View style={[s.statusPill, { backgroundColor: active ? "rgba(124,58,237,0.12)" : "rgba(156,163,175,0.15)" }]}>
                <View style={[s.statusDot, { backgroundColor: active ? "#7c3aed" : "#9ca3af" }]} />
                <Text style={[s.statusText, { color: active ? "#7c3aed" : "#9ca3af" }]}>
                  {active ? "Active" : "Inactive"}
                </Text>
              </View>

              {/* Divider */}
              <View style={s.divider} />

              {/* Earnings */}
              <Text style={s.earnedLabel}>Earned Today</Text>
              <View style={s.earnedRow}>
                <Text style={s.earnedSign}>$</Text>
                <AnimatedCounter value={active ? 12 : 0} fontSize={48} color="#7c3aed" />
                <Text style={s.earnedDecimal}>.48</Text>
              </View>
              <Text style={s.btcLabel}>≈ 0.00031 BTC</Text>
            </View>

            {/* ── Stats row ── */}
            <View style={s.statsRow}>
              {stats.map((st) => (
                <View key={st.label} style={s.statCard}>
                  <Text style={{ fontSize: 22 }}>{st.icon}</Text>
                  <Text style={s.statValue}>{st.value}</Text>
                  <Text style={s.statLabel}>{st.label}</Text>
                </View>
              ))}
            </View>

            {/* ── Serial ID ── */}
            <View style={s.card2}>
              <Text style={s.cardLabel}>Miner Serial ID</Text>
              <View style={s.serialRow}>
                <Text style={s.serialText}>{SERIAL}</Text>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={[s.copyBtn, { backgroundColor: copied ? "#22c55e" : "#7c3aed" }]}
                  activeOpacity={0.75}
                >
                  <Text style={s.copyBtnText}>{copied ? "Copied!" : "Copy"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Withdraw ── */}
            <TouchableOpacity style={s.withdrawBtn} activeOpacity={0.85}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>💸</Text>
              <Text style={s.withdrawText}>Withdraw Earnings</Text>
            </TouchableOpacity>

            {/* ── Start / Stop ── */}
            <TouchableOpacity
              onPress={() => setActive(v => !v)}
              style={[s.toggleBtn, { borderColor: active ? "#ef4444" : "#7c3aed" }]}
              activeOpacity={0.8}
            >
              <Text style={[s.toggleText, { color: active ? "#ef4444" : "#7c3aed" }]}>
                {active ? "⏹  Stop Miner" : "▶  Start Miner"}
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>

        <Navbar />
      </View>
    </ImageBackground>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:         { flex: 1 },
  overlay:      { flex: 1, backgroundColor: "rgba(237,227,248,0.52)" },
  scroll:       { paddingBottom: 130 },
  headerWrap:   { paddingTop: 48,},

  titleBlock:   { paddingHorizontal: 24, marginTop: 20, marginBottom: 4 },
  titleLabel:   { fontSize: 10, fontWeight: "700", color: "#9333ea", letterSpacing: 5, textTransform: "uppercase", marginBottom: 4 },
  titleMain:    { fontSize: 30, fontWeight: "800", color: "#000", letterSpacing: -0.5 },

  // Hero card
  card: {
    marginHorizontal: CARD_MX, marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 28, paddingVertical: 32, paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#7c3aed", shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  iconWrap:     { width: 140, height: 140, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  pulseRing:    { position: "absolute", width: 138, height: 138, borderRadius: 69, borderWidth: 2, borderColor: "#7c3aed" },
  iconCircle:   {
    width: 110, height: 110, borderRadius: 55,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#7c3aed", shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  statusPill:   { flexDirection: "row", alignItems: "center", borderRadius: 999, paddingHorizontal: 18, paddingVertical: 6 },
  statusDot:    { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText:   { fontSize: 11, fontWeight: "800", letterSpacing: 4, textTransform: "uppercase" },
  divider:      { width: "100%", height: 1, backgroundColor: "rgba(0,0,0,0.06)", marginVertical: 20 },
  earnedLabel:  { fontSize: 10, color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: 4, marginBottom: 6 },
  earnedRow:    { flexDirection: "row", alignItems: "baseline" },
  earnedSign:   { fontSize: 24, fontWeight: "600", color: "#000", marginRight: 4 },
  earnedDecimal:{ fontSize: 24, color: "rgba(0,0,0,0.2)", marginLeft: 2 },
  btcLabel:     { fontSize: 11, color: "rgba(0,0,0,0.2)", marginTop: 6, letterSpacing: 1 },

  // Stats
  statsRow:     { flexDirection: "row", marginHorizontal: CARD_MX, marginTop: 14, gap: 10 },
  statCard:     {
    flex: 1, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 20,
    paddingVertical: 16, alignItems: "center",
    shadowColor: "#7c3aed", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statValue:    { fontSize: 13, fontWeight: "700", color: "#111", marginTop: 6 },
  statLabel:    { fontSize: 9,  fontWeight: "600", color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: 2, marginTop: 3 },

  // Serial card
  card2: {
    marginHorizontal: CARD_MX, marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 22, padding: 18,
    shadowColor: "#7c3aed", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardLabel:    { fontSize: 10, fontWeight: "700", color: "rgba(0,0,0,0.3)", textTransform: "uppercase", letterSpacing: 4, marginBottom: 10 },
  serialRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(237,227,248,0.7)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 },
  serialText:   { fontSize: 15, fontWeight: "800", color: "#6d28d9", letterSpacing: 4 },
  copyBtn:      { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  copyBtnText:  { fontSize: 10, fontWeight: "800", color: "#fff", textTransform: "uppercase", letterSpacing: 2 },

  // Buttons
  withdrawBtn:  {
    marginHorizontal: CARD_MX, marginTop: 16,
    backgroundColor: "#000", borderRadius: 20, paddingVertical: 17,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  withdrawText: { fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  toggleBtn:    {
    marginHorizontal: CARD_MX, marginTop: 12, marginBottom: 8,
    borderRadius: 20, paddingVertical: 16,
    alignItems: "center", borderWidth: 2,
  },
  toggleText:   { fontSize: 13, fontWeight: "800", letterSpacing: 3, textTransform: "uppercase" },
});