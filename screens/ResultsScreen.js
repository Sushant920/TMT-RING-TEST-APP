import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const ResultsScreen = ({ route, navigation }) => {
  const { diameter, imageUri, analysisData } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const level1Results = {
    layersDetected: { 
      status: analysisData.layersDetected === 3 ? 'pass' : 'fail', 
      value: `${analysisData.layersDetected} layers detected` 
    },
    continuousRing: { 
      status: analysisData.continuousRing ? 'pass' : 'fail', 
      value: analysisData.continuousRing ? 'Continuous' : 'Discontinuous' 
    },
    concentricRegions: { 
      status: analysisData.concentricRegions ? 'pass' : 'fail', 
      value: analysisData.concentricRegions ? 'Concentric' : 'Non-concentric' 
    },
    uniformThickness: { 
      status: analysisData.uniformThickness ? 'pass' : 'fail', 
      value: analysisData.uniformThickness ? 'Uniform' : 'Non-uniform' 
    },
  };

  const level2Results = {
    rimThickness: { 
      status: 'info', 
      value: `${analysisData.rimThickness} mm` 
    },
    thicknessPercentage: { 
      status: analysisData.withinRange ? 'pass' : 'fail', 
      value: `${analysisData.thicknessPercentage}%` 
    },
    withinRange: { 
      status: analysisData.withinRange ? 'pass' : 'fail', 
      value: analysisData.withinRange ? '7-10% ✓' : 'Out of range ✗' 
    },
    meetsStandards: { 
      status: analysisData.withinRange && analysisData.uniformThickness ? 'pass' : 'fail', 
      value: analysisData.withinRange && analysisData.uniformThickness ? 'Yes' : 'No' 
    },
  };

  const overallPass = Object.values(level1Results).every(r => r.status === 'pass') &&
                     analysisData.withinRange;
  const overallStatus = overallPass ? 'PASS' : 'FAIL';

  const ResultItem = ({ label, result, icon }) => (
    <Animated.View 
      style={[
        styles.resultItem,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.resultLeft}>
        <Icon name={icon} size={20} color="#666" style={styles.resultIcon} />
        <Text style={styles.resultLabel}>{label}</Text>
      </View>
      <View style={styles.resultRight}>
        <Text style={[
          styles.resultValue, 
          result.status === 'pass' ? styles.pass : result.status === 'fail' ? styles.fail : styles.info
        ]}>
          {result.value}
        </Text>
        {result.status !== 'info' && (
          <Icon 
            name={result.status === 'pass' ? 'check-circle' : 'cancel'} 
            size={20} 
            color={result.status === 'pass' ? '#4CAF50' : '#f44336'} 
          />
        )}
      </View>
    </Animated.View>
  );

  const LayerVisualization = () => {
    const centerX = 100;
    const centerY = 100;
    const rimRadius = 90;
    const transitionRadius = 65;
    const coreRadius = 40;

    return (
      <Svg width={200} height={200} viewBox="0 0 200 200">
        <Circle
          cx={centerX}
          cy={centerY}
          r={rimRadius}
          fill="#2C3E50"
          opacity={0.9}
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={transitionRadius}
          fill="#7F8C8D"
          opacity={0.9}
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={coreRadius}
          fill="#BDC3C7"
          opacity={0.9}
        />
        
        <SvgText x={centerX} y={30} fill="white" fontSize="12" textAnchor="middle">
          Rim (Dark)
        </SvgText>
        <SvgText x={centerX} y={centerY} fill="#2C3E50" fontSize="12" textAnchor="middle">
          Core
        </SvgText>
        
        <Path
          d={`M ${centerX} ${centerY} L ${centerX + rimRadius} ${centerY}`}
          stroke="#4CAF50"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <SvgText 
          x={centerX + 45} 
          y={centerY - 5} 
          fill="#4CAF50" 
          fontSize="10" 
          textAnchor="middle"
        >
          {analysisData.rimThickness}mm
        </SvgText>
      </Svg>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.statusCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={overallStatus === 'PASS' ? ['#4CAF50', '#388E3C'] : ['#f44336', '#d32f2f']}
          style={styles.statusGradient}
        >
          <Icon 
            name={overallStatus === 'PASS' ? 'check-circle' : 'cancel'} 
            size={60} 
            color="white" 
          />
          <Text style={styles.statusText}>Test Result: {overallStatus}</Text>
          <Text style={styles.diameterInfo}>Bar Diameter: {diameter} mm</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        style={[
          styles.visualizationCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Layer Detection</Text>
        <View style={styles.visualizationContainer}>
          <LayerVisualization />
        </View>
        <Text style={styles.visualizationNote}>
          Cross-section analysis after NITOL application
        </Text>
      </Animated.View>

      <View style={styles.resultsSection}>
        <View style={styles.sectionHeader}>
          <Icon name="color-lens" size={24} color="#0D47A1" />
          <Text style={styles.sectionTitle}>Level 1: Color & Shape Analysis</Text>
        </View>
        <ResultItem label="Layers Detected" result={level1Results.layersDetected} icon="layers" />
        <ResultItem label="Outer Ring" result={level1Results.continuousRing} icon="panorama-fish-eye" />
        <ResultItem label="Concentricity" result={level1Results.concentricRegions} icon="adjust" />
        <ResultItem label="Thickness Uniformity" result={level1Results.uniformThickness} icon="straighten" />
      </View>

      <View style={styles.resultsSection}>
        <View style={styles.sectionHeader}>
          <Icon name="straighten" size={24} color="#0D47A1" />
          <Text style={styles.sectionTitle}>Level 2: Dimensional Analysis</Text>
        </View>
        <ResultItem label="Rim Thickness" result={level2Results.rimThickness} icon="format-size" />
        <ResultItem label="Thickness Percentage" result={level2Results.thicknessPercentage} icon="percent" />
        <ResultItem label="Range Compliance" result={level2Results.withinRange} icon="rule" />
        <ResultItem label="Meets Standards" result={level2Results.meetsStandards} icon="verified" />
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Report', { 
            diameter, 
            results: { level1Results, level2Results, overallStatus },
            analysisData 
          })}
        >
          <LinearGradient
            colors={['#0D47A1', '#1976D2']}
            style={styles.buttonGradient}
          >
            <Icon name="description" size={24} color="white" />
            <Text style={styles.buttonText}>Generate Report</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('DiameterSelection')}
        >
          <Icon name="add-circle-outline" size={24} color="#0D47A1" />
          <Text style={styles.secondaryButtonText}>New Test</Text>
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
  statusCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statusGradient: {
    padding: 30,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  diameterInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  visualizationCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  visualizationContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  visualizationNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  resultsSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
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
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultIcon: {
    marginRight: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  pass: {
    color: '#4CAF50',
  },
  fail: {
    color: '#f44336',
  },
  info: {
    color: '#2196F3',
  },
  actionContainer: {
    padding: 20,
    paddingTop: 0,
  },
  primaryButton: {
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#0D47A1',
  },
  secondaryButtonText: {
    color: '#0D47A1',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ResultsScreen;