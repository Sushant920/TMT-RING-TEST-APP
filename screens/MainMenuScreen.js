// ==================== screens/MainMenuScreen.js ====================
import React, { useRef, useEffect } from 'react';
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

const MainMenuScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const menuItems = [
    {
      id: 1,
      title: 'Ring Test',
      subtitle: 'Analyze TMT bar quality',
      icon: 'assessment',
      color: ['#4CAF50', '#388E3C'],
      onPress: () => navigation.navigate('DiameterSelection'),
    },
    {
      id: 2,
      title: 'Test History',
      subtitle: 'View previous results',
      icon: 'history',
      color: ['#2196F3', '#1565C0'],
      onPress: () => alert('History feature coming soon'),
    },
    {
      id: 3,
      title: 'Standards',
      subtitle: 'Quality parameters',
      icon: 'rule',
      color: ['#FF9800', '#F57C00'],
      onPress: () => alert('Standards documentation coming soon'),
    },
    {
      id: 4,
      title: 'Settings',
      subtitle: 'App configuration',
      icon: 'settings',
      color: ['#9C27B0', '#6A1B9A'],
      onPress: () => alert('Settings coming soon'),
    },
  ];

  const renderMenuItem = (item, index) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        { scale: scaleAnim },
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View
        key={item.id}
        style={[styles.menuItemContainer, animatedStyle]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={item.onPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={item.color}
            style={styles.menuGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <Icon name={item.icon} size={40} color="white" />
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D47A1', '#1976D2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.headerTitle}>TMT Quality Testing</Text>
          <Text style={styles.headerSubtitle}>Ensuring excellence in every bar</Text>
        </View>
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.menuContainer}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Tests Today</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98.5%</Text>
              <Text style={styles.statLabel}>Pass Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Bar Types</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  menuContainer: {
    flex: 1,
    marginTop: -20,
  },
  menuContent: {
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  menuItemContainer: {
    width: (width - 40) / 2,
    marginBottom: 15,
  },
  menuItem: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuGradient: {
    padding: 25,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
  },
  menuSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    textAlign: 'center',
  },
  statsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default MainMenuScreen;
