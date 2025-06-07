// screens/ReportScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const ReportScreen = ({ route, navigation }) => {
  const { diameter, results } = route.params;
  const { level1Results, level2Results, overallStatus } = results;

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const handleExport = (format) => {
    Alert.alert(
      'Export Report',
      `Report will be exported as ${format}. This feature will be implemented with proper file handling.`,
      [{ text: 'OK' }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share Report',
      'Sharing functionality will be implemented with React Native Share API.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Report Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>TATA STEEL</Text>
        <Text style={styles.reportTitle}>TMT Bar Ring Test Report</Text>
        <Text style={styles.reportDate}>{currentDate} at {currentTime}</Text>
      </View>

      {/* Test Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bar Diameter:</Text>
          <Text style={styles.detailValue}>{diameter} mm</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Test Type:</Text>
          <Text style={styles.detailValue}>Ring Test (NITOL)</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Overall Result:</Text>
          <Text style={[styles.detailValue, overallStatus === 'PASS' ? styles.passText : styles.failText]}>
            {overallStatus}
          </Text>
        </View>
      </View>

      {/* Level 1 Results Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Level 1: Color & Shape Analysis</Text>
        {Object.entries(level1Results).map(([key, result]) => (
          <View key={key} style={styles.resultRow}>
            <Text style={styles.resultLabel}>{formatLabel(key)}</Text>
            <Text style={[styles.resultValue, result.status === 'pass' ? styles.passText : styles.failText]}>
              {result.value} {result.status === 'pass' ? '✓' : '✗'}
            </Text>
          </View>
        ))}
      </View>

      {/* Level 2 Results Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Level 2: Dimensional Analysis</Text>
        {Object.entries(level2Results).map(([key, result]) => (
          <View key={key} style={styles.resultRow}>
            <Text style={styles.resultLabel}>{formatLabel(key)}</Text>
            <Text style={[styles.resultValue, result.status === 'pass' ? styles.passText : styles.failText]}>
              {result.value} {result.status === 'pass' ? '✓' : '✗'}
            </Text>
          </View>
        ))}
      </View>

      {/* Standards Reference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Standards Reference</Text>
        <Text style={styles.standardText}>• Rim thickness: 7-10% of bar diameter</Text>
        <Text style={styles.standardText}>• Layers: Rim (Dark), Transition, Core (Light)</Text>
        <Text style={styles.standardText}>• Concentricity required for quality approval</Text>
      </View>

      {/* Export Options */}
      <View style={styles.exportSection}>
        <Text style={styles.exportTitle}>Export Options</Text>
        <View style={styles.exportButtons}>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => handleExport('PDF')}
          >
            <Text style={styles.exportButtonText}>Export as PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => handleExport('Image')}
          >
            <Text style={styles.exportButtonText}>Export as Image</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>Share Report</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('MainMenu')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Helper function to format label names
const formatLabel = (key) => {
  const labels = {
    layersDetected: 'Layers Detected',
    continuousRing: 'Continuous Ring',
    concentricRegions: 'Concentric Regions',
    uniformThickness: 'Uniform Thickness',
    rimThickness: 'Rim Thickness',
    thicknessPercentage: 'Thickness %',
    withinRange: 'Within Range',
    meetsStandards: 'Meets Standards',
  };
  return labels[key] || key;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    padding: 20,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  reportTitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  reportDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  passText: {
    color: '#4CAF50',
  },
  failText: {
    color: '#f44336',
  },
  standardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  exportSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  exportButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
  },
  homeButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  homeButtonText: {
    color: '#1976d2',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportScreen;
