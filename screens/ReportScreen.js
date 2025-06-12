// ==================== screens/ReportScreen.js ====================
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewShot from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

const ReportScreen = ({ route, navigation }) => {
  const { diameter, results, analysisData } = route.params;
  const { level1Results, level2Results, overallStatus } = results;
  const viewShotRef = useRef();
  
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const testId = `TMT-${Date.now()}`;

  // Converts camelCase or snake_case keys to readable labels
  const formatLabel = (key) => {
    // Replace underscores with spaces, then insert spaces before uppercase letters
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const generatePDF = async () => {
    const payload = {
      diameter,
      level1: {
        grey_regions: level1Results.layersDetected.value === 'Yes',
        continuous_ring: level1Results.continuousRing.value === 'Yes',
        concentric: level1Results.concentricRegions.value === 'Yes',
        uniform_thickness: level1Results.uniformThickness.value === 'Yes',
      },
      level2: {
        min_thickness: parseFloat(level2Results.rimThickness.value),
        min_thickness_status: level2Results.rimThickness.status === 'pass',
        max_thickness: parseFloat(level2Results.thicknessPercentage.value),
        max_thickness_status: level2Results.thicknessPercentage.status === 'pass',
      },
      final_verdict:
        overallStatus === 'PASS'
          ? 'The TMT bar passed all quality checks.'
          : 'The TMT bar did not meet all quality standards.',
    };

    try {
      const response = await axios.post('http://192.168.0.106:5000/generate-report', payload, {
        responseType: 'arraybuffer',
      });

      const filePath = `${FileSystem.documentDirectory}TMT_Report_${testId}.pdf`;
      await FileSystem.writeAsStringAsync(filePath, response.data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(filePath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate report from backend.');
    }
  };

  const captureImage = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save or share image.');
    }
  };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
        <LinearGradient
          colors={['#0D47A1', '#1976D2']}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>TATA</Text>
              <Text style={styles.logoSubText}>STEEL</Text>
            </View>
          </View>
          <Text style={styles.reportTitle}>TMT Bar Ring Test Report</Text>
          <Text style={styles.reportId}>Report ID: {testId}</Text>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="info" size={24} color="#0D47A1" />
            <Text style={styles.sectionTitle}>Test Information</Text>
          </View>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{currentDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{currentTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bar Diameter</Text>
              <Text style={styles.detailValue}>{diameter} mm</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Test Type</Text>
              <Text style={styles.detailValue}>Ring Test (NITOL)</Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, overallStatus === 'PASS' ? styles.passBadge : styles.failBadge]}>
            <Icon name={overallStatus === 'PASS' ? 'check-circle' : 'cancel'} size={30} color="white" />
            <Text style={styles.statusText}>Overall Result: {overallStatus}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="color-lens" size={24} color="#0D47A1" />
            <Text style={styles.sectionTitle}>Level 1: Color & Shape Analysis</Text>
          </View>
          {Object.entries(level1Results).map(([key, result]) => (
            <View key={key} style={styles.resultRow}>
              <Text style={styles.resultLabel}>{formatLabel(key)}</Text>
              <View style={styles.resultValueContainer}>
                <Text style={[styles.resultValue, result.status === 'pass' ? styles.passText : styles.failText]}>
                  {result.value}
                </Text>
                <Icon 
                  name={result.status === 'pass' ? 'check' : 'close'} 
                  size={20} 
                  color={result.status === 'pass' ? '#4CAF50' : '#f44336'} 
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="straighten" size={24} color="#0D47A1" />
            <Text style={styles.sectionTitle}>Level 2: Dimensional Analysis</Text>
          </View>
          {Object.entries(level2Results).map(([key, result]) => (
            <View key={key} style={styles.resultRow}>
              <Text style={styles.resultLabel}>{formatLabel(key)}</Text>
              <View style={styles.resultValueContainer}>
                <Text style={[
                  styles.resultValue, 
                  result.status === 'pass' ? styles.passText : 
                  result.status === 'fail' ? styles.failText : styles.infoText
                ]}>
                  {result.value}
                </Text>
                {result.status !== 'info' && (
                  <Icon 
                    name={result.status === 'pass' ? 'check' : 'close'} 
                    size={20} 
                    color={result.status === 'pass' ? '#4CAF50' : '#f44336'} 
                  />
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="rule" size={24} color="#0D47A1" />
            <Text style={styles.sectionTitle}>Quality Standards</Text>
          </View>
          <View style={styles.standardItem}>
            <Icon name="check-circle-outline" size={16} color="#666" />
            <Text style={styles.standardText}>Rim thickness should be 7-10% of bar diameter</Text>
          </View>
          <View style={styles.standardItem}>
            <Icon name="check-circle-outline" size={16} color="#666" />
            <Text style={styles.standardText}>Three distinct layers: Rim (Dark), Transition, Core (Light)</Text>
          </View>
          <View style={styles.standardItem}>
            <Icon name="check-circle-outline" size={16} color="#666" />
            <Text style={styles.standardText}>Layers must be concentric and continuous</Text>
          </View>
          <View style={styles.standardItem}>
            <Icon name="check-circle-outline" size={16} color="#666" />
            <Text style={styles.standardText}>Uniform thickness throughout the cross-section</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by TMT Ring Test System v1.0.0</Text>
          <Text style={styles.footerText}>TATA Steel Quality Assurance Department</Text>
          <Text style={styles.footerText}>© 2024 TATA Steel. All rights reserved.</Text>
        </View>
      </ViewShot>

      <View style={styles.exportSection}>
        <Text style={styles.exportTitle}>Export Options</Text>
        <View style={styles.exportButtons}>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={generatePDF}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f44336', '#d32f2f']}
              style={styles.exportGradient}
            >
              <Icon name="picture-as-pdf" size={24} color="white" />
              <Text style={styles.exportButtonText}>Export PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.exportButton}
            onPress={captureImage}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4CAF50', '#388E3C']}
              style={styles.exportGradient}
            >
              <Icon name="image" size={24} color="white" />
              <Text style={styles.exportButtonText}>Save Image</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('MainMenu')}
        >
          <Icon name="home" size={24} color="#0D47A1" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  logoSubText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  reportId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    width: '48%',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  passBadge: {
    backgroundColor: '#4CAF50',
  },
  failBadge: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  passText: {
    color: '#4CAF50',
  },
  failText: {
    color: '#f44336',
  },
  infoText: {
    color: '#2196F3',
  },
  standardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  standardText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  exportSection: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  exportButton: {
    flex: 0.48,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  exportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  homeButtonText: {
    color: '#0D47A1',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ReportScreen;