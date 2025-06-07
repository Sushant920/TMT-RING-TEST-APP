import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const MainMenuScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: 1,
      title: 'Ring Test',
      description: 'Analyze TMT bar cross-section for quality',
      icon: '🔍',
      onPress: () => navigation.navigate('DiameterSelection'),
    },
    {
      id: 2,
      title: 'History',
      description: 'View previous test results',
      icon: '📊',
      onPress: () => alert('History feature coming soon'),
    },
    {
      id: 3,
      title: 'Settings',
      description: 'Configure app settings',
      icon: '⚙️',
      onPress: () => alert('Settings feature coming soon'),
    },
    {
      id: 4,
      title: 'Help',
      description: 'User guide and support',
      icon: '❓',
      onPress: () => alert('Help feature coming soon'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TMT Quality Testing</Text>
        <Text style={styles.headerSubtitle}>Select a test to begin</Text>
      </View>
      
      <ScrollView style={styles.menuContainer}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  arrow: {
    fontSize: 30,
    color: '#ccc',
  },
});

export default MainMenuScreen;