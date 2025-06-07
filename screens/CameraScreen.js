import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CameraScreen = ({ route, navigation }) => {
  const { diameter } = route.params;
  const [isCapturing, setIsCapturing] = useState(false);

  // Calculate overlay size based on diameter
  const overlaySize = (diameter / 25) * 200; // Scale overlay size

  const handleCapture = () => {
    setIsCapturing(true);
    
    // Simulate capture and processing
    setTimeout(() => {
      setIsCapturing(false);
      Alert.alert(
        'Image Captured',
        'The image has been captured and is ready for analysis.',
        [
          {
            text: 'Analyze',
            onPress: () => navigation.navigate('Results', { diameter }),
          },
        ]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Camera View Placeholder */}
      <View style={styles.cameraView}>
        <Text style={styles.cameraPlaceholder}>Camera View</Text>
        
        {/* Overlay Circle */}
        <View
          style={[
            styles.overlay,
            {
              width: overlaySize,
              height: overlaySize,
              borderRadius: overlaySize / 2,
            },
          ]}
        >
          <Text style={styles.overlayText}>{diameter}mm</Text>
        </View>
        
        {/* Alignment Guide */}
        <View style={styles.crosshair}>
          <View style={styles.crosshairVertical} />
          <View style={styles.crosshairHorizontal} />
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionsText}>
          1. Apply NITOL solution to TMT bar cross-section
        </Text>
        <Text style={styles.instructionsText}>
          2. Align the bar with the circular overlay
        </Text>
        <Text style={styles.instructionsText}>
          3. Ensure good lighting and focus
        </Text>
        <Text style={styles.instructionsText}>
          4. Tap capture when ready
        </Text>
      </View>

      {/* Capture Button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.capturingButton]}
          onPress={handleCapture}
          disabled={isCapturing}
        >
          <View style={styles.captureButtonInner}>
            <Text style={styles.captureButtonText}>
              {isCapturing ? 'CAPTURING...' : 'CAPTURE'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraPlaceholder: {
    color: '#666',
    fontSize: 20,
    position: 'absolute',
  },
  overlay: {
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  crosshair: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 1,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  crosshairHorizontal: {
    position: 'absolute',
    height: 1,
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  captureContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    padding: 5,
  },
  capturingButton: {
    backgroundColor: '#f44336',
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 35,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default CameraScreen;