import colors from "@/constants/colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { detectObstacle } from "../lib/detection";
import { warnHaptics } from "../lib/haptics";
import { speakDistance } from "../lib/tts";
import { sendFrameToBackend } from "../lib/backend";

export default function DetectScreen() {
  const { start } = useLocalSearchParams();
  const router = useRouter();

  const [navigationActive, setNavigationActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const captureIntervalRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);

  const cameraRef = useRef(null);
  const lastAlertRef = useRef(0); //timer for TTS and haptics
  const isSendingref = useRef(false);

  //set navigationActive to true
  useEffect(() => {
    if (start === "true") {
      setNavigationActive(true);
      requestPermission();
    }
  }, [start]);

  //
  useEffect(() => {
    if (navigationActive && permission?.granted && cameraReady) {
      startFrameCapture(); // begin captureing frames when navigation starts
    }

    return () => {
      stopFrameCapture(); //clean up interval when screen unmounts
    };
  }, [navigationActive, permission, cameraReady]);

  //capture frame
  const startFrameCapture = () => {
    if (captureIntervalRef.current) return;

    captureIntervalRef.current = setInterval(async () => {
      if (!cameraRef.current || !cameraReady) return;


      if(isSendingref.current) return;
      isSendingref.current = true;

      try {
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
          shutterSound: false,
        });

       const detectionResult = await sendFrameToBackend(photo)
        if (detectionResult?.obstacle) {
          const now = Date.now();

          if (now - lastAlertRef.current > 2000) {
            lastAlertRef.current = now; //limit alerts to 2s
            warnHaptics();
          }

          setTimeout(() => {
            const { object, direction, distance_label } = detectionResult;

            if (!object || !distance_label) return;

            const message =
              direction && direction !== "center"
                ? `${object} on your ${direction}, ${distance_label}`
                : `${object} ahead, ${distance_label}`;

            speakDistance(message);   
          }, 500);
        }

        console.log("Detection result: ", detectionResult);
        console.log("Frame captured:", photo.uri);
        // photo = null;
      } catch (error) {
        console.warn("Frame capture failed", error);
      }finally{
        isSendingref.current=false
      }
    }, 2000);
  };

  //stop frame capturing
  const stopFrameCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  if (!navigationActive) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Navigation not started</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (permission?.granted === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          Camera permission is required to continue
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Navigation Active",
        }}
      />

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          onCameraReady={() => setCameraReady(true)}
          animateShutter={false}
        />
      </View>

      <View style={styles.overlay}>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={() => {
            stopFrameCapture();
            setNavigationActive(false);
          }}
        >
          <Text style={styles.stopText}>Stop Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => router.push("/emergency")}
        >
          <Text style={styles.emergencyText}>Emergency</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  stopButton: {
    backgroundColor: "#555",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  stopText: {
    color: "#fff",
    fontSize: 16,
  },
  emergencyButton: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  emergencyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
