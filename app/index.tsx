import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';

import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type CourseType = 'Starter' | 'Main Course' | 'Dessert';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: CourseType;
  price: number;
}

type ActiveScreen = 'stats' | 'manage' | 'search';

export default function App(): React.JSX.Element {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('stats');

  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<CourseType>('Starter');
  const [price, setPrice] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [descError, setDescError] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilterCourse, setSelectedFilterCourse] = useState<string>('All');

  // Add or Update Dish Handler
  const handleSaveDish = (): void => {
    let isValid = true;

    setNameError('');
    setDescError('');
    setPriceError('');

    if (!dishName.trim()) {
      setNameError('Dish name is required.');
      isValid = false;
    }

    if (!description.trim()) {
      setDescError('Description is required.');
      isValid = false;
    }

    const parsedPrice = parseFloat(price);

    if (!price.trim()) {
      setPriceError('Price is required.');
      isValid = false;
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setPriceError('Please enter a valid price greater than 0.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    if (editingId) {
      // Update existing item
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingId
            ? { ...item, name: dishName.trim(), description: description.trim(), course, price: parsedPrice }
            : item
        )
      );
      setEditingId(null);
      Alert.alert('Success', 'Menu item updated successfully!');
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: description.trim(),
        course,
        price: parsedPrice,
      };
      setMenuItems((prevItems) => [...prevItems, newItem]);
      Alert.alert('Success', 'Menu item added successfully!');
    }

    // Reset form
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
  };

  // Edit Dish Setup
  const handleEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setDishName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price.toString());
    setActiveScreen('manage'); // Switch to form screen
  };

  // Delete Dish Handler
  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this dish from the menu?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((prev) => prev.filter((item) => item.id !== id));
            if (editingId === id) {
              setEditingId(null);
              setDishName('');
              setDescription('');
              setCourse('Starter');
              setPrice('');
            }
          },
        },
      ]
    );
  };

  // Statistics Calculations
  const totalItems = menuItems.length;
  const averagePrice =
    totalItems > 0 ? menuItems.reduce((acc, curr) => acc + curr.price, 0) / totalItems : 0;
  
  const starterCount = menuItems.filter((i) => i.course === 'Starter').length;
  const mainCount = menuItems.filter((i) => i.course === 'Main Course').length;
  const dessertCount = menuItems.filter((i) => i.course === 'Dessert').length;

  // Filtered List for Search Screen
  const filteredItems = menuItems.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedFilterCourse === 'All' || item.course === selectedFilterCourse;
    return matchesName && matchesCourse;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#5c1d05" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* App Header */}
        <View style={styles.header}>
          <Image
            source={require('C:\\Users\\thand\\OneDrive\\Documents\\ST10530267_Thandani Ntuli\\myChefMenuManager\\assets\\images\\Master Chef.png')}
            style={styles.headerImage}
            resizeMode="contain"
          />

        </View>

        {/* Custom Navigation Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeScreen === 'stats' && styles.activeTabButton,]}
            onPress={() => setActiveScreen('stats')}
          >
            <Text style={[styles.tabText, activeScreen === 'stats' && styles.activeTabText,]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeScreen === 'manage' && styles.activeTabButton,]}
            onPress={() => setActiveScreen('manage')}
          >
            <Text style={[styles.tabText, activeScreen === 'manage' && styles.activeTabText,]}>
              Add Dish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeScreen === 'search' && styles.activeTabButton,]}
            onPress={() => setActiveScreen('search')}
          >
            <Text style={[styles.tabText, activeScreen === 'search' && styles.activeTabText,]}>
              Search
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* ================= SCREEN 1: STATISTICS / DASHBOARD ================= */}
          {activeScreen === 'stats' && (
            <View style={styles.screenContainer}>
              <Text style={styles.screenTitle}>Menu Overview & Statistics</Text>

              <View style={styles.statsCard}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{totalItems}</Text>
                  <Text style={styles.statLabel}>Total Dishes</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>R {averagePrice.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Average Price</Text>
                </View>
              </View>

              <Text style={styles.sectionHeader}>Breakdown by Course</Text>
              
              <View style={styles.courseStatRow}>
                <View style={styles.courseStatCard}>
                  <Text style={styles.courseStatTitle}>Starters</Text>
                  <Text style={styles.courseStatCount}>{starterCount}</Text>
                </View>
                <View style={styles.courseStatCard}>
                  <Text style={styles.courseStatTitle}>Main Courses</Text>
                  <Text style={styles.courseStatCount}>{mainCount}</Text>
                </View>
                <View style={styles.courseStatCard}>
                  <Text style={styles.courseStatTitle}>Desserts</Text>
                  <Text style={styles.courseStatCount}>{dessertCount}</Text>
                </View>
              </View>

              {menuItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No dishes available yet. Add items in the 'Add Dish' tab.</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.primaryActionButton}
                  onPress={() => setActiveScreen('search')}
                >
                  <Text style={styles.primaryActionText}>View & Manage Full Menu →</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ================= SCREEN 2: ADD / MANAGE MENU ================= */}
          {activeScreen === 'manage' && (
            <View style={styles.screenContainer}>
              <Text style={styles.screenTitle}>
                {editingId ? 'Edit Existing Menu Item' : 'Add New Menu Item'}
              </Text>

              <View style={styles.formCard}>
                {/* Dish Name */}
                <Text style={styles.label}>Dish Name</Text>
                <TextInput
                  style={[styles.input, nameError ? styles.inputError : null]}
                  placeholder="e.g. Creamy Mushroom Soup"
                  value={dishName}
                  onChangeText={setDishName}
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                {/* Description */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea, descError ? styles.inputError : null]}
                  placeholder="e.g. Wild mushrooms simmered with herbs and fresh cream."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
                {descError ? <Text style={styles.errorText}>{descError}</Text> : null}

                {/* Course */}
                <Text style={styles.label}>Course</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={course}
                    onValueChange={(itemValue) => setCourse(itemValue as CourseType)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Starter" value="Starter" />
                    <Picker.Item label="Main Course" value="Main Course" />
                    <Picker.Item label="Dessert" value="Dessert" />
                  </Picker>
                </View>

                {/* Price */}
                <Text style={styles.label}>Price (R)</Text>
                <TextInput
                  style={[styles.input, priceError ? styles.inputError : null]}
                  placeholder="e.g. 90.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
                {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}

                {/* Submit / Update Button */}
                <TouchableOpacity style={styles.button} onPress={handleSaveDish} activeOpacity={0.8}>
                  <Text style={styles.buttonText}>{editingId ? 'Update Menu Item' : 'Save Menu Item'}</Text>
                </TouchableOpacity>

                {editingId && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setEditingId(null);
                      setDishName('');
                      setDescription('');
                      setCourse('Starter');
                      setPrice('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Editing</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* ================= SCREEN 3: SEARCH & FILTER ================= */}
          {activeScreen === 'search' && (
            <View style={styles.screenContainer}>
              
              {/* Search Bar */}
              <View style={styles.formCard}>
                <Text style={styles.label}>Search by Dish Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Type dish name..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />

                {/* Course Filter */}
                <Text style={styles.label}>Filter by Course</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedFilterCourse}
                    onValueChange={(itemValue) => setSelectedFilterCourse(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Courses" value="All" />
                    <Picker.Item label="Starter" value="Starter" />
                    <Picker.Item label="Main Course" value="Main Course" />
                    <Picker.Item label="Dessert" value="Dessert" />
                  </Picker>
                </View>

                {(searchQuery !== '' || selectedFilterCourse !== 'All') && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedFilterCourse('All');
                    }}
                  >
                    <Text style={styles.clearButtonText}>Clear Search & Filters</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Filtered Results List */}
              <View style={styles.listSection}>
                <Text style={styles.sectionHeader}>
                  Results ({filteredItems.length})
                </Text>

                {filteredItems.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No menu items found matching your search criteria.</Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <View style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
                        </View>

                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.course}</Text>
                        </View>

                        <Text style={styles.itemDesc}>{item.description}</Text>

                        {/* Action Buttons (Edit & Delete) */}
                        <View style={styles.cardActionRow}>
                          <TouchableOpacity
                            style={styles.editCardButton}
                            onPress={() => handleEditItem(item)}
                          >
                            <Text style={styles.cardButtonText}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.deleteCardButton}
                            onPress={() => handleDeleteItem(item.id)}
                          >
                            <Text style={styles.cardButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                )}
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5c1d05',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#ffffcc',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerImage: {
    width: '100%',
    height: 180,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#5c1d05',
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff3c2',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#5c1d05',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5c1d05',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffcc',
    marginBottom: 14,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffcc',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5c1d05',
  },
  statLabel: {
    fontSize: 12,
    color: '#b29e84',
    marginTop: 4,
    fontWeight: '600',
  },
  courseStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  courseStatCard: {
    flex: 1,
    backgroundColor: '#ffffcc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  courseStatTitle: {
    fontSize: 12,
    color: '#5c1d05',
    fontWeight: '600',
    textAlign: 'center',
  },
  courseStatCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5c1d05',
    marginTop: 4,
  },
  primaryActionButton: {
    backgroundColor: '#ffffcc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryActionText: {
    color: '#5c1d05',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#ffffcc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffcc',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5c1d05',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff3c2',
    borderWidth: 1,
    borderColor: '#5c1d05',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#fff3c2',
    borderWidth: 1,
    borderColor: '#5c1d05',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#5c1d05',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#b29e84',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#ffffcc',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#b29e84',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  clearButtonText: {
    color: '#5c1d05',
    fontSize: 14,
    fontWeight: '600',
  },
  listSection: {
    marginBottom: 24,
  },
  emptyContainer: {
    backgroundColor: '#ffffcc',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#b29e84',
    fontSize: 14,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#ffffcc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#b29e84',
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c1d05',
  },
  badge: {
    backgroundColor: '#b29e84',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 6,
  },
  badgeText: {
    color: '#5c1d05',
    fontSize: 12,
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 10,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  editCardButton: {
    backgroundColor: '#b29e84',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteCardButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});