import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as MediaLibrary from 'expo-media-library';

const { width: screenWidth } = Dimensions.get('window');

const CameraScreen = ({ route, navigation }) => {
  const { diameter } = route.params;
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facing, setFacing] = useState('back'); // 'back' or 'front'
  const [flash, setFlash] = useState('off');   // 'off', 'on', 'auto'
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  // Permission hooks
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  // Handle camera ready event
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  // Take picture handler
  const takePicture = async () => {
    if (cameraRef.current && !isCapturing && isCameraReady) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9,
          base64: true,
          exif: true,
        });
        setCapturedImage(photo);
        processImage(photo);
      } catch (error) {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        setIsCapturing(false);
      }
    }
  };

  // Process image handler
  const processImage = async (imageData) => {
    try {
      // Save image to media library if permission granted
      if (Platform.OS !== 'web' && mediaPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(imageData.uri);
      }
      // Simulate analysis (replace with actual analysis logic)
      setTimeout(() => {
        setIsCapturing(false);
        navigation.navigate('Results', {
          diameter,
          imageUri: imageData.uri,
          analysisData: performAnalysis(diameter),
        });
      }, 2000);
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setIsCapturing(false);
    }
  };

  // Dummy analysis function
  const performAnalysis = (diameter) => {
    const baseThickness = diameter * 0.08;
    const variation = (Math.random() * 0.02 - 0.01) * diameter;
    const actualThickness = baseThickness + variation;
    const percentage = (actualThickness / diameter) * 100;
    return {
      rimThickness: actualThickness.toFixed(2),
      thicknessPercentage: percentage.toFixed(1),
      layersDetected: 3,
      continuousRing: true,
      concentricRegions: true,
      uniformThickness: Math.random() > 0.1,
      withinRange: percentage >= 7 && percentage <= 10,
    };
  };

  // Toggle flash handler
  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  // Permission UI logic
  if (!cameraPermission || !mediaPermission) {
    // Permissions are still loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0D47A1" />
        <Text style={styles.permissionText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !mediaPermission.granted) {
    // Permissions not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera and media permissions are required.</Text>
        {!cameraPermission.granted && (
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        )}
        {!mediaPermission.granted && (
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestMediaPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Media Permission</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Main camera UI
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        onCameraReady={onCameraReady}
        ratio="16:9"
      >
        <View style={styles.overlayContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.topBar}
          >
            <Text style={styles.instructionText}>
              Align TMT bar cross-section with the circle
            </Text>
            <Text style={styles.diameterText}>{diameter}mm Bar Selected</Text>
          </LinearGradient>

          <View style={styles.centerContainer}>
            <View
              style={[
                styles.circleOverlay,
                {
                  width: screenWidth * 0.7,
                  height: screenWidth * 0.7,
                  borderRadius: screenWidth * 0.35,
                },
              ]}
            />
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              <Icon
                name={flash === 'on' ? 'flash-on' : 'flash-off'}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, !isCameraReady && styles.buttonDisabled]}
              onPress={takePicture}
              disabled={!isCameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <View style={styles.controlButton} />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
  },
  topBar: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  diameterText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleOverlay: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#0D47A1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CameraScreen;
