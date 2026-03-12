import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Navbar from "Navbar";


// ─── Styled wrappers ────────────────────────────────────────────────


const SCREEN_W = Dimensions.get("window").width;
const FRAME = SCREEN_W * 0.68;

// ─── Corner bracket component ───────────────────────────────────────
const Corner = ({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) => {
  const isTop = position.startsWith("t");
  const isLeft = position.endsWith("l");
  return (
    <View
      style={{
        position: "absolute",
        top: isTop ? -2 : undefined,
        bottom: !isTop ? -2 : undefined,
        left: isLeft ? -2 : undefined,
        right: !isLeft ? -2 : undefined,
        width: 28,
        height: 28,
        borderColor: "#00FFC2",
        borderTopWidth: isTop ? 3 : 0,
        borderBottomWidth: !isTop ? 3 : 0,
        borderLeftWidth: isLeft ? 3 : 0,
        borderRightWidth: !isLeft ? 3 : 0,
        borderTopLeftRadius: position === "tl" ? 4 : 0,
        borderTopRightRadius: position === "tr" ? 4 : 0,
        borderBottomLeftRadius: position === "bl" ? 4 : 0,
        borderBottomRightRadius: position === "br" ? 4 : 0,
      }}
    />
  );
};

// ─── Main Screen ────────────────────────────────────────────────────
export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Scan line animation
  const scanAnim = useRef(new Animated.Value(0)).current;
  // Modal scale animation
  const modalScale = useRef(new Animated.Value(0.7)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  // Pulse for success/error ring
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous scan line loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const openModal = (data: string, ok: boolean) => {
    setScannedData(data);
    setSuccess(ok);
    setModalVisible(true);

    // Animate modal in
    modalScale.setValue(0.7);
    modalOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse ring
    pulseAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
      { iterations: 4 }
    ).start();
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    const isValid = data.trim().length > 0;
    openModal(data, isValid);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(modalScale, { toValue: 0.7, duration: 180, useNativeDriver: true }),
      Animated.timing(modalOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setModalVisible(false);
      setScanned(false);
      setScannedData(null);
    });
  };

  // Permission not loaded yet
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-[#080C14]">
        <Text className="text-[#00FFC2] text-base font-medium tracking-widest">
          Initialising…
        </Text>
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-[#080C14] px-8">
        <Text className="text-white text-2xl font-bold tracking-tight mb-3 text-center">
          Camera Access Required
        </Text>
        <Text className="text-[#8892A4] text-sm text-center mb-8 leading-6">
          Allow camera permission to scan QR codes and process payments.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#00FFC2] rounded-2xl px-10 py-4"
        >
          <Text className="text-[#080C14] font-bold text-base tracking-wide">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Scan line Y translation
  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME - 4],
  });

  return (
    <View className="flex-1 bg-[#080C14]">
      <StatusBar barStyle="light-content" backgroundColor="#080C14" />

      {/* ── Header ── */}
      <View className="pt-14 pb-5 px-6">
        <Text
          style={{ fontFamily: "System", letterSpacing: 6 }}
          className="text-[#00FFC2] text-xs font-semibold uppercase opacity-70"
        >
          Secure Payments
        </Text>
        <Text className="text-white text-3xl font-bold mt-1 tracking-tight">
          Scan QR Code
        </Text>
      </View>

      {/* ── Camera + Viewfinder ── */}
      <View className="flex-1 items-center justify-center">
        {/* Full-screen camera behind overlay */}
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
          }}
        >
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />
        </View>

        {/* Dark overlay with cut-out illusion */}
        <View
          style={{
            width: FRAME,
            height: FRAME,
            position: "relative",
          }}
        >
          {/* Dim corners overlay */}
          <View
            style={{
              position: "absolute",
              top: -999, left: -999, right: -999, bottom: -999,
              borderWidth: 999,
              borderColor: "rgba(8,12,20,0.75)",
              borderRadius: 999 + 16,
            }}
            pointerEvents="none"
          />

          {/* Viewfinder border frame */}
          <View
            style={{
              width: FRAME,
              height: FRAME,
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(0,255,194,0.25)",
            }}
          >
            {/* Animated scan line */}
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: "#00FFC2",
                opacity: 0.7,
                transform: [{ translateY: scanTranslateY }],
                shadowColor: "#00FFC2",
                shadowOpacity: 1,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
          </View>

          {/* Corner brackets */}
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
        </View>

        {/* Hint text */}
        <Text className="text-[#8892A4] text-sm mt-8 tracking-wide text-center px-10">
          Position the QR code within the frame to scan
        </Text>
      </View>

      {/* ── Bottom pill ── */}
      <View className="pb-12 px-6 items-center">
        <View className="flex-row items-center bg-[#0F1623] rounded-full px-5 py-3 border border-[#1E2736]">
          <View className="w-2 h-2 rounded-full bg-[#00FFC2] mr-3" style={{ opacity: scanned ? 0.4 : 1 }} />
          <Text className="text-[#8892A4] text-xs tracking-widest uppercase">
            {scanned ? "Processing…" : "Ready to Scan"}
          </Text>
        </View>
      </View>

      {/* ── Result Modal ── */}
      <Modal transparent visible={modalVisible} animationType="none">
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(8,12,20,0.85)" }}
        >
          <Animated.View
            style={{
              transform: [{ scale: modalScale }],
              opacity: modalOpacity,
              width: SCREEN_W - 48,
              borderRadius: 28,
              backgroundColor: "#0F1623",
              borderWidth: 1,
              borderColor: success ? "rgba(0,255,194,0.3)" : "rgba(255,80,80,0.3)",
              padding: 32,
              alignItems: "center",
            }}
          >
            {/* Animated ring */}
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: success
                  ? "rgba(0,255,194,0.12)"
                  : "rgba(255,80,80,0.12)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: success ? "#00FFC2" : "#FF5050",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 26 }}>
                  {success ? "✓" : "✕"}
                </Text>
              </View>
            </Animated.View>

            {/* Status label */}
            <Text
              className="text-2xl font-bold mb-2 tracking-tight"
              style={{ color: success ? "#00FFC2" : "#FF5050" }}
            >
              {success ? "Payment Success" : "Payment Failed"}
            </Text>

            {/* Sub message */}
            <Text className="text-[#8892A4] text-sm text-center mb-6 leading-6">
              {success
                ? "Transaction completed successfully."
                : "Nop… an error happened. Please try again."}
            </Text>

            {/* Scanned value card */}
            <View
              className="w-full rounded-2xl px-4 py-3 mb-8"
              style={{ backgroundColor: "#161D2A" }}
            >
              <Text className="text-[#4A5568] text-xs uppercase tracking-widest mb-1">
                Scanned Value
              </Text>
              <Text
                className="text-white text-sm font-mono"
                numberOfLines={3}
                ellipsizeMode="middle"
              >
                {scannedData ?? "—"}
              </Text>
            </View>

            {/* Action button */}
            <TouchableOpacity
              onPress={handleClose}
              className="w-full rounded-2xl py-4 items-center"
              style={{
                backgroundColor: success ? "#00FFC2" : "#FF5050",
              }}
            >
              <Text
                className="font-bold text-base tracking-wide"
                style={{ color: "#080C14" }}
              >
                {success ? "Done" : "Try Again"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <Navbar></Navbar>
    </View>
  );
}