import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ResultsScreen = ({ route, navigation }) => {
  const { diameter } = route.params;

  // Simulated analysis results
  const level1Results = {
    layersDetected: { status: 'pass', value: '3 layers detected' },
    continuousRing: { status: 'pass', value: 'Continuous' },
    concentricRegions: { status: 'pass', value: 'Concentric' },
    uniformThickness: { status: 'pass', value: 'Uniform' },
  };

  const level2Results = {
    rimThickness: { status: 'pass', value: `${(diameter * 0.08).toFixed(2)} mm` },
    thicknessPercentage: { status: 'pass', value: '8%' },
    withinRange: { status: 'pass', value: '7-10% ✓' },
    meetsStandards: { status: 'pass', value: 'Yes' },
  };

  const ResultItem = ({ label, result }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultLabel}>{label}</Text>
      <View style={styles.resultValueContainer}>
        <Text style={[styles.resultValue, result.status === 'pass' ? styles.pass : styles.fail]}>
          {result.value}
        </Text>
        <Text style={[styles.statusIcon, result.status === 'pass' ? styles.pass : styles.fail]}>
          {result.status === 'pass' ? '✓' : '✗'}
        </Text>
      </View>
    </View>
  );

  const overallStatus = 'PASS'; // Calculate based on all results

  return (
    <ScrollView style={styles.container}>
      {/* Overall Status */}
      <View style={[styles.overallStatus, overallStatus === 'PASS' ? styles.passStatus : styles.failStatus]}>
        <Text style={styles.overallStatusText}>Overall Result: {overallStatus}</Text>
        <Text style={styles.diameterText}>Bar Diameter: {diameter} mm</Text>
      </View>

      {/* Visual Representation */}
      <View style={styles.visualContainer}>
        <Text style={styles.sectionTitle}>Layer Detection</Text>
        <View style={styles.layerDiagram}>
          <View style={styles.outerRing}>
            <Text style={styles.layerLabel}>Rim (Dark)</Text>
          </View>
          <View style={styles.transitionLayer}>
            <Text style={styles.layerLabel}>Transition</Text>
          </View>
          <View style={styles.core}>
            <Text style={styles.layerLabel}>Core (Light)</Text>
          </View>
        </View>
      </View>

      {/* Level 1 Results */}
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Level 1: Color & Shape Analysis</Text>
        <ResultItem label="Layers Detected" result={level1Results.layersDetected} />
        <ResultItem label="Outer Ring" result={level1Results.continuousRing} />
        <ResultItem label="Regions" result={level1Results.concentricRegions} />
        <ResultItem label="Thickness" result={level1Results.uniformThickness} />
      </View>

      {/* Level 2 Results */}
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Level 2: Dimensional Analysis</Text>
        <ResultItem label="Rim Thickness" result={level2Results.rimThickness} />
        <ResultItem label="Percentage" result={level2Results.thicknessPercentage} />
        <ResultItem label="Range Check" result={level2Results.withinRange} />
        <ResultItem label="Standards" result={level2Results.meetsStandards} />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate('Report', { diameter, results: { level1Results, level2Results, overallStatus } })}
        >
          <Text style={styles.reportButtonText}>Generate Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.newTestButton}
          onPress={() => navigation.navigate('DiameterSelection')}
        >
          <Text style={styles.newTestButtonText}>New Test</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  overallStatus: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  passStatus: {
    backgroundColor: '#4CAF50',
  },
  failStatus: {
    backgroundColor: '#f44336',
  },
  overallStatusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  diameterText: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  visualContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  layerDiagram: {
    width: 200,
    height: 200,
    marginTop: 15,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transitionLayer: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  core: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultsSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  statusIcon: {
    fontSize: 20,
  },
  pass: {
    color: '#4CAF50',
  },
  fail: {
    color: '#f44336',
  },
  actionButtons: {
    padding: 20,
  },
  reportButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reportButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newTestButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  newTestButtonText: {
    color: '#1976d2',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;
