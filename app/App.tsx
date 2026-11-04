import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FormInput } from './components/FormInput';
import { MenuCard } from './components/MenuCard';
import { COLORS } from './constants/colors';
import { CourseType, MenuItem } from './types/menu';
import { getMenuStats } from './utils/calculations';
import { validateMenuItem } from './utils/validation';

const Stack = createNativeStackNavigator();

function MenuListScreen({ navigation, route }: any) {
  const [items, setItems] = useState<MenuItem[]>(route.params?.menuItems || []);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CourseType | 'All'>('All');

  React.useEffect(() => { if (route.params?.menuItems) setItems(route.params.menuItems); }, [route.params?.menuItems]);

  const filtered = useMemo(() => items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) && (filter === 'All' || i.course === filter)), [items, search, filter]);
  const stats = getMenuStats(items);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <Image source={require('./assets/images/Master Chef.png')} style={styles.heroImg} resizeMode="contain" />
        <View style={styles.statsPreview}>
          <Text style={styles.statsPreviewText}>Total: {stats.total} | Avg: R{stats.average.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <TextInput placeholder="Search dishes..." value={search} onChangeText={setSearch} style={styles.searchInput} />
        <View style={styles.filterRow}>
          <View style={styles.pickerWrap}><Picker selectedValue={filter} onValueChange={setFilter}><Picker.Item label="All" value="All"/><Picker.Item label="Starter" value="Starter"/><Picker.Item label="Main" value="Main Course"/><Picker.Item label="Dessert" value="Dessert"/></Picker></View>
          <TouchableOpacity style={styles.clear} onPress={() => { setSearch(''); setFilter('All'); }}><Text style={{color:'#fff'}}>Clear</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Stats', { menuItems: items })}><Text style={styles.navBtnText}>📊 Statistics ({stats.total})</Text></TouchableOpacity>
      </View>

      <FlatList data={filtered} keyExtractor={i => i.id} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} renderItem={({ item }) => (
        <MenuCard item={item} onEdit={() => navigation.navigate('AddEdit', { item, menuItems: items })} onDelete={() => {
          Alert.alert('Delete', `Delete ${item.name}?`, [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: () => setItems(items.filter(x => x.id !== item.id)) }]);
        }} />
      )} />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEdit', { menuItems: items })}><Text style={styles.fabText}>+ Add New Dish</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

function AddEditScreen({ navigation, route }: any) {
  const existing = route.params?.item as MenuItem;
  const menuItems = route.params?.menuItems as MenuItem[];
  const [name, setName] = useState(existing?.name || '');
  const [desc, setDesc] = useState(existing?.description || '');
  const [course, setCourse] = useState<CourseType>(existing?.course || 'Starter');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [errors, setErrors] = useState<any>({});

  const onSave = () => {
    const { isValid, errors, parsedPrice } = validateMenuItem(name, desc, price);
    if (!isValid) { setErrors(errors); return; }
    const updated = existing ? menuItems.map(i => i.id === existing.id ? { ...i, name, description: desc, course, price: parsedPrice } : i) : [...menuItems, { id: Date.now().toString(), name, description: desc, course, price: parsedPrice }];
    navigation.navigate('MenuList', { menuItems: updated });
  };

  return (
    <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.cardForm}>
        <Text style={styles.title}>{existing ? 'Update Dish' : 'Add New Dish'}</Text>
        <FormInput label="Dish Name" value={name} onChangeText={setName} error={errors.name} placeholder="e.g. Creamy Mushroom Soup" />
        <FormInput label="Description" value={desc} onChangeText={setDesc} error={errors.description} multiline placeholder="Description..." />
        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerWrap}><Picker selectedValue={course} onValueChange={setCourse}><Picker.Item label="Starter" value="Starter"/><Picker.Item label="Main Course" value="Main Course"/><Picker.Item label="Dessert" value="Dessert"/></Picker></View>
        <FormInput label="Price (R)" value={price} onChangeText={setPrice} error={errors.price} keyboardType="decimal-pad" placeholder="90.00" />
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}><Text style={styles.saveText}>{existing ? 'Update' : 'Save'} Menu Item</Text></TouchableOpacity>
      </View>
    </ScrollView></SafeAreaView>
  );
}

function StatsScreen({ route }: any) {
  const stats = getMenuStats(route.params?.menuItems || []);
  return (
    <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.bigTitle}>Menu Overview</Text>
      <View style={styles.grid}><View style={styles.statCard}><Text style={styles.statNum}>{stats.total}</Text><Text style={styles.statLabel}>Total Items</Text></View><View style={styles.statCard}><Text style={styles.statNum}>R {stats.average.toFixed(2)}</Text><Text style={styles.statLabel}>Average Price</Text></View></View>
      <View style={styles.cardForm}>
        <Text style={styles.title}>Breakdown by Course</Text>
        <View style={styles.row}><Text>Starter</Text><Text style={styles.bold}>{stats.starters}</Text></View>
        <View style={styles.row}><Text>Main Course</Text><Text style={styles.bold}>{stats.mains}</Text></View>
        <View style={styles.row}><Text>Dessert</Text><Text style={styles.bold}>{stats.desserts}</Text></View>
      </View>
    </ScrollView></SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.card }}><Stack.Screen name="MenuList" component={MenuListScreen} options={{ title: 'My Chef Menu' }} /><Stack.Screen name="AddEdit" component={AddEditScreen} options={{ title: 'Manage Dish' }} /><Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Statistics' }} /></Stack.Navigator></NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  hero: { backgroundColor: COLORS.card, margin: 16, borderRadius: 16, padding: 12, alignItems: 'center' },
  heroImg: { width: '100%', height: 100 },
  statsPreview: { marginTop: 8, backgroundColor: COLORS.input, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statsPreviewText: { color: COLORS.primary, fontWeight: '600' },
  searchBox: { backgroundColor: COLORS.card, marginHorizontal: 16, borderRadius: 12, padding: 12 },
  searchInput: { backgroundColor: COLORS.input, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: COLORS.primary },
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  pickerWrap: { flex: 1, backgroundColor: COLORS.input, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, overflow: 'hidden' },
  clear: { backgroundColor: COLORS.primary, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8 },
  topNav: { padding: 16 },
  navBtn: { backgroundColor: COLORS.secondary, padding: 12, borderRadius: 10, alignItems: 'center' },
  navBtnText: { color: COLORS.white, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: COLORS.card, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 4 },
  fabText: { color: COLORS.primary, fontWeight: '800', fontSize: 16 },
  cardForm: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 6, marginTop: 8 },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bigTitle: { fontSize: 24, fontWeight: '800', color: COLORS.card, textAlign: 'center', marginBottom: 16 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: 'center' },
  statNum: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.secondary, fontWeight: '600', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5d5b0' },
  bold: { fontWeight: '700' },
});