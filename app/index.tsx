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

export default function App(): React.JSX.Element {
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<CourseType>('Starter');
  const [price, setPrice] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [descError, setDescError] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleAddDish = (): void => {
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

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: parsedPrice,
    };

    setMenuItems((prevItems) => [...prevItems, newItem]);

    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');

    Alert.alert('Success', 'Menu item added successfully!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F4F5F7"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
         {/* Main App Header */}
<View style={styles.header}>
  <Image
    source={require('C:\\Users\\thand\\OneDrive\\Documents\\ST10530267_Thandani Ntuli\\myChefMenuManager\\assets\\images\\Master Chef.png')}
    style={styles.headerImage}
    resizeMode="contain"
  />
  <Text style={styles.subtitle}>
    Total Items: {menuItems.length}
  </Text>
</View>


          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.sectionHeader}>
              Add New Dish
            </Text>

            {/* Dish Name */}
            <Text style={styles.label}>
              Dish Name 
            </Text>

            <TextInput
              style={[
                styles.input,
                nameError ? styles.inputError : null,
              ]}
              placeholder="e.g. Creamy Mushroom Soup"
              value={dishName}
              onChangeText={setDishName}
            />

            {nameError ? (
              <Text style={styles.errorText}>
                {nameError}
              </Text>
            ) : null}

            {/* Description */}
            <Text style={styles.label}>
              Description 
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                descError ? styles.inputError : null,
              ]}
              placeholder="e.g. Wild mushrooms simmered with herbs and fresh cream."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {descError ? (
              <Text style={styles.errorText}>
                {descError}
              </Text>
            ) : null}

            {/* Course */}
            <Text style={styles.label}>
              Course 
            </Text>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={course}
                onValueChange={(itemValue) =>
                  setCourse(itemValue as CourseType)
                }
                style={styles.picker}
              >
                <Picker.Item
                  label="Starter"
                  value="Starter"
                />
                <Picker.Item
                  label="Main Course"
                  value="Main Course"
                />
                <Picker.Item
                  label="Dessert"
                  value="Dessert"
                />
              </Picker>
            </View>

            {/* Price */}
            <Text style={styles.label}>
              Price (R) 
            </Text>

            <TextInput
              style={[
                styles.input,
                priceError ? styles.inputError : null,
              ]}
              placeholder="e.g. 90.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            {priceError ? (
              <Text style={styles.errorText}>
                {priceError}
              </Text>
            ) : null}

            {/* Submit */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleAddDish}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                Save Menu Item
              </Text>
            </TouchableOpacity>
          </View>

          {/* Menu */}
          <View style={styles.listSection}>
            <Text style={styles.sectionHeader}>
              Current Menu
            </Text>

            {menuItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No menu items added yet. Enter dish details
                  above to populate the menu.
                </Text>
              </View>
            ) : (
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>
                        {item.name}
                      </Text>

                      <Text style={styles.itemPrice}>
                        R {item.price.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {item.course}
                      </Text>
                    </View>

                    <Text style={styles.itemDesc}>
                      {item.description}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
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
    paddingBottom: 30,
  },

 header: {
  backgroundColor: '#ffffcc',
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
  alignItems: 'center',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

headerImage: {
  width: '100%',
  height: 300,
  marginBottom: 10,
},

subtitle: {
  fontSize: 14,
  color: '#5c1d05',
  marginTop: 4,
},


  formCard: {
    backgroundColor: '#ffffcc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b29e84',
    marginBottom: 12,
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
  },
});
