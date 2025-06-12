import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const DiameterSelectionScreen = ({ navigation }) => {
  const [selectedDiameter, setSelectedDiameter] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const diameters = [
    { 
      value: 12, 
      label: '12 mm',
      rimMin: 0.84,
      rimMax: 1.2,
      icon: 'looks-one'
    },
    { 
      value: 16, 
      label: '16 mm',
      rimMin: 1.12,
      rimMax: 1.6,
      icon: 'looks-two'
    },
    { 
      value: 20, 
      label: '20 mm',
      rimMin: 1.4,
      rimMax: 2.0,
      icon: 'looks-3'
    },
    { 
      value: 25, 
      label: '25 mm',
      rimMin: 1.75,
      rimMax: 2.5,
      icon: 'looks-4'
    },
  ];

  const handleDiameterSelect = (diameter) => {
    setSelectedDiameter(diameter);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleProceed = () => {
    if (selectedDiameter) {
      navigation.navigate('Camera', { diameter: selectedDiameter });
    }
  };

  const selectedDiameterData = diameters.find(d => d.value === selectedDiameter);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D47A1', '#1976D2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Select TMT Bar Diameter</Text>
        <Text style={styles.headerSubtitle}>
          Choose the diameter of the bar you want to test
        </Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.diameterGrid}>
          {diameters.map((diameter) => (
            <TouchableOpacity
              key={diameter.value}
              style={[
                styles.diameterCard,
                selectedDiameter === diameter.value && styles.selectedCard,
              ]}
              onPress={() => handleDiameterSelect(diameter.value)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.cardContent,
                  selectedDiameter === diameter.value && {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <View style={[
                  styles.iconContainer,
                  selectedDiameter === diameter.value && styles.selectedIconContainer,
                ]}>
                  <Icon 
                    name={diameter.icon} 
                    size={40} 
                    color={selectedDiameter === diameter.value ? 'white' : '#0D47A1'} 
                  />
                </View>
                <Text style={[
                  styles.diameterLabel,
                  selectedDiameter === diameter.value && styles.selectedLabel,
                ]}>
                  {diameter.label}
                </Text>
                <View style={styles.rimInfo}>
                  <Text style={[
                    styles.rimLabel,
                    selectedDiameter === diameter.value && styles.selectedRimLabel,
                  ]}>
                    Rim Thickness
                  </Text>
                  <Text style={[
                    styles.rimValue,
                    selectedDiameter === diameter.value && styles.selectedRimValue,
                  ]}>
                    {diameter.rimMin} - {diameter.rimMax} mm
                  </Text>
                </View>
                {selectedDiameter === diameter.value && (
                  <View style={styles.selectedIndicator}>
                    <Icon name="check-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedDiameter && (
          <Animated.View style={styles.infoCard}>
            <Icon name="info" size={24} color="#0D47A1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Selected: {selectedDiameterData.label}</Text>
              <Text style={styles.infoText}>
                Expected rim thickness: {selectedDiameterData.rimMin} - {selectedDiameterData.rimMax} mm
              </Text>
              <Text style={styles.infoText}>
                This represents 7-10% of the bar diameter
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            !selectedDiameter && styles.disabledButton,
          ]}
          onPress={handleProceed}
          disabled={!selectedDiameter}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedDiameter ? ['#4CAF50', '#388E3C'] : ['#BDBDBD', '#9E9E9E']}
            style={styles.proceedGradient}
          >
            <Text style={styles.proceedButtonText}>
              {selectedDiameter ? 'PROCEED TO CAMERA' : 'SELECT A DIAMETER'}
            </Text>
            {selectedDiameter && <Icon name="arrow-forward" size={24} color="white" />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  diameterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diameterCard: {
    width: (width - 50) / 2,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#0D47A1',
    elevation: 8,
    shadowOpacity: 0.2,
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedIconContainer: {
    backgroundColor: '#0D47A1',
  },
  diameterLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  selectedLabel: {
    color: '#0D47A1',
  },
  rimInfo: {
    alignItems: 'center',
  },
  rimLabel: {
    fontSize: 12,
    color: '#666',
  },
  selectedRimLabel: {
    color: '#0D47A1',
  },
  rimValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  selectedRimValue: {
    color: '#0D47A1',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  proceedButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  proceedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default DiameterSelectionScreen;
