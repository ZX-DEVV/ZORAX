import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, Modal, TouchableOpacity,
  Animated, Easing, StatusBar, Dimensions, ImageBackground,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";
// import axios from "axios";

const W = Dimensions.get("window").width;
const FRAME = W * 0.72;

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => (
  <View
    style={{
      position: "absolute",
      width: 24, height: 24,
      top:    pos[0] === "t" ? -2 : undefined,
      bottom: pos[0] === "b" ? -2 : undefined,
      left:   pos[1] === "l" ? -2 : undefined,
      right:  pos[1] === "r" ? -2 : undefined,
      borderColor: "#7c3aed",
      borderTopWidth:    pos[0] === "t" ? 3 : 0,
      borderBottomWidth: pos[0] === "b" ? 3 : 0,
      borderLeftWidth:   pos[1] === "l" ? 3 : 0,
      borderRightWidth:  pos[1] === "r" ? 3 : 0,
      borderTopLeftRadius:     pos === "tl" ? 4 : 0,
      borderTopRightRadius:    pos === "tr" ? 4 : 0,
      borderBottomLeftRadius:  pos === "bl" ? 4 : 0,
      borderBottomRightRadius: pos === "br" ? 4 : 0,
    }}
  />
);

export default function QRScannerScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setData]       = useState<string | null>(null);
  const [ok, setOk]           = useState(false);
  const [loading, setLoading] = useState(false);

  const scanY   = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pulse   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scanY, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onScanned = async ({ data: d }: { data: string }) => {
    if (scanned) return;
    setScanned(true); setData(d); setLoading(true);

    let success = false;
    try {
      // ── Send QR value to payment API ─────────────────────────────
      // const res = await axios.post("https://your-api.com/payments", { qr: d });
      // success = res.data.status === "success";
      // ─────────────────────────────────────────────────────────────
      success = !!d.trim(); // ← remove when API is live
    } catch { success = false; }
    finally  { setLoading(false); }

    setOk(success);
    setVisible(true);
    scale.setValue(0.8); opacity.setValue(0); pulse.setValue(1);
    Animated.parallel([
      Animated.spring(scale,   { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 650, useNativeDriver: true }),
      ]), { iterations: 5 }
    ).start();
  };

  const onClose = () => {
    Animated.parallel([
      Animated.timing(scale,   { toValue: 0.8, duration: 160, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0,   duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false); setScanned(false); setData(null);
      if (ok) navigation.navigate("Dash");
    });
  };

  if (!permission)
    return (
      <View className="flex-1 items-center justify-center bg-[#ede3f8]">
        <Text className="text-purple-600 text-sm tracking-[4px] font-semibold">LOADING…</Text>
      </View>
    );

  if (!permission.granted)
    return (
      <View className="flex-1 items-center justify-center bg-[#ede3f8] px-10">
        <Text className="text-black text-2xl font-bold text-center mb-3">Camera Required</Text>
        <Text className="text-black/40 text-sm text-center mb-8">
          Camera access is needed to scan QR codes and process payments.
        </Text>
        <TouchableOpacity onPress={requestPermission} className="bg-black rounded-2xl px-10 py-4">
          <Text className="text-white font-bold text-sm tracking-widest uppercase">Allow Access</Text>
        </TouchableOpacity>
      </View>
    );

  const lineY = scanY.interpolate({ inputRange: [0, 1], outputRange: [0, FRAME - 2] });

  return (
    <ImageBackground
      source={require("./assets/blurbg.jpg")}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-1 bg-[#ede3f8]/50">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="pt-16 pb-4 px-7">
          <Text className="text-purple-500 text-[10px] font-semibold tracking-[5px] uppercase mb-1">
            Secure Payments
          </Text>
          <Text className="text-black text-[28px] font-bold tracking-tight">Scan to Pay</Text>
        </View>

        {/* Camera area */}
        <View className="flex-1 items-center justify-center">
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={scanned ? undefined : onScanned}
            />
          </View>

          {/* Viewfinder frame */}
          <View style={{ width: FRAME, height: FRAME, position: "relative" }}>
            <View
              pointerEvents="none"
              style={{
                position: "absolute", top: -999, left: -999, right: -999, bottom: -999,
                borderWidth: 999, borderColor: "rgba(237,227,248,0.72)", borderRadius: 1015,
              }}
            />
            <View
              style={{
                width: FRAME, height: FRAME, borderRadius: 16, overflow: "hidden",
                borderWidth: 1, borderColor: "rgba(124,58,237,0.3)",
              }}
            >
              <Animated.View
                style={{
                  position: "absolute", left: 0, right: 0, height: 2,
                  backgroundColor: "#7c3aed", opacity: 0.7,
                  transform: [{ translateY: lineY }],
                  shadowColor: "#7c3aed", shadowOpacity: 1, shadowRadius: 8,
                  shadowOffset: { width: 0, height: 0 },
                }}
              />
            </View>
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
          </View>

          <Text className="text-black/30 text-xs tracking-[2px] uppercase mt-7 font-medium">
            Align QR code within the frame
          </Text>
        </View>

        {/* Status pill */}
        <View className="pb-28 items-center">
          <View className="flex-row items-center bg-white/80 rounded-full px-5 py-3">
            <View
              className="w-2 h-2 rounded-full mr-3 bg-purple-500"
              style={{ opacity: scanned ? 0.35 : 1 }}
            />
            <Text className="text-black/40 text-[10px] tracking-[3px] uppercase font-semibold">
              {scanned ? "Processing…" : "Ready to Scan"}
            </Text>
          </View>
        </View>

        {/* Loading overlay */}
        {loading && (
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: "rgba(237,227,248,0.7)" }}
          >
            <View className="bg-white rounded-2xl px-8 py-6 items-center">
              <Text className="text-purple-600 text-xs tracking-[4px] uppercase font-bold">
                Processing…
              </Text>
            </View>
          </View>
        )}

        {/* Result Modal */}
        <Modal transparent visible={visible} animationType="none">
          <View
            className="flex-1 items-center justify-center px-6"
            style={{ backgroundColor: "rgba(109,40,217,0.25)" }}
          >
            <Animated.View
              style={{
                transform: [{ scale }], opacity,
                width: W - 40, borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.95)",
                padding: 28, alignItems: "center",
                shadowColor: "#7c3aed", shadowOpacity: 0.2,
                shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
              }}
            >
              {/* Icon ring */}
              <Animated.View
                style={{
                  transform: [{ scale: pulse }], marginBottom: 16,
                  width: 84, height: 84, borderRadius: 42,
                  backgroundColor: ok ? "rgba(167,139,250,0.18)" : "rgba(239,68,68,0.10)",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 58, height: 58, borderRadius: 29,
                    backgroundColor: ok ? "#7c3aed" : "#ef4444",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 26, color: "#fff", fontWeight: "700" }}>
                    {ok ? "✓" : "✕"}
                  </Text>
                </View>
              </Animated.View>

              {/* Title */}
              <Text
                className="text-2xl font-bold mb-1 tracking-tight"
                style={{ color: ok ? "#7c3aed" : "#ef4444" }}
              >
                {ok ? "Payment Success" : "Payment Failed"}
              </Text>

              {/* Subtitle */}
              <Text className="text-black/40 text-sm text-center mb-5 leading-6">
                {ok
                  ? "Transaction completed successfully."
                  : "Nop… an error happened. Please try again."}
              </Text>

              {/* Scanned value card */}
              <View className="w-full rounded-2xl px-4 py-3 mb-6 bg-[#ede3f8]/60">
                <Text className="text-purple-400 text-[10px] uppercase tracking-[3px] mb-1 font-semibold">
                  Scanned Value
                </Text>
                <Text className="text-black font-semibold text-sm" numberOfLines={2} ellipsizeMode="middle">
                  {data ?? "—"}
                </Text>
              </View>

              {/* CTA */}
              <TouchableOpacity
                onPress={onClose}
                className="w-full rounded-2xl py-4 items-center"
                style={{ backgroundColor: ok ? "#7c3aed" : "#ef4444" }}
              >
                <Text className="font-bold text-base tracking-wide text-white">
                  {ok ? "Done" : "Try Again"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        <Navbar />
      </View>
    </ImageBackground>
  );
}
