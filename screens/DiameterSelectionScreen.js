import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const DiameterSelectionScreen = ({ navigation }) => {
  const [selectedDiameter, setSelectedDiameter] = useState(null);

  const diameters = [
    { value: 12, label: '12 mm' },
    { value: 16, label: '16 mm' },
    { value: 20, label: '20 mm' },
    { value: 25, label: '25 mm' },
  ];

  const handleDiameterSelect = (diameter) => {
    setSelectedDiameter(diameter);
  };

  const handleProceed = () => {
    if (selectedDiameter) {
      navigation.navigate('Camera', { diameter: selectedDiameter });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Bar Diameter</Text>
        <Text style={styles.headerSubtitle}>
          Choose the diameter of the TMT bar you want to test
        </Text>
      </View>

      <ScrollView style={styles.diameterContainer}>
        {diameters.map((diameter) => (
          <TouchableOpacity
            key={diameter.value}
            style={[
              styles.diameterOption,
              selectedDiameter === diameter.value && styles.selectedOption,
            ]}
            onPress={() => handleDiameterSelect(diameter.value)}
          >
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.diameterText,
                  selectedDiameter === diameter.value && styles.selectedText,
                ]}
              >
                {diameter.label}
              </Text>
              <Text
                style={[
                  styles.rimThicknessText,
                  selectedDiameter === diameter.value && styles.selectedSubText,
                ]}
              >
                Rim thickness: {(diameter.value * 0.07).toFixed(1)} - {(diameter.value * 0.10).toFixed(1)} mm
              </Text>
            </View>
            {selectedDiameter === diameter.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            !selectedDiameter && styles.disabledButton,
          ]}
          onPress={handleProceed}
          disabled={!selectedDiameter}
        >
          <Text style={styles.proceedButtonText}>
            {selectedDiameter
              ? `Proceed with ${selectedDiameter} mm`
              : 'Select a diameter to continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  diameterContainer: {
    flex: 1,
    padding: 20,
  },
  diameterOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  optionContent: {
    flex: 1,
  },
  diameterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    color: '#1976d2',
  },
  rimThicknessText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  selectedSubText: {
    color: '#1976d2',
  },
  checkmark: {
    fontSize: 24,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  proceedButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiameterSelectionScreen;
