import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { MenuItem } from '../types/menu';

export const MenuCard = ({ item, onEdit, onDelete }: { item: MenuItem, onEdit: () => void, onDelete: () => void }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
    </View>
    <View style={styles.badge}><Text style={styles.badgeText}>{item.course}</Text></View>
    <Text style={styles.desc}>{item.description}</Text>
    <View style={styles.actions}>
      <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.secondary }]} onPress={onEdit}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.primary }]} onPress={onDelete}><Text style={styles.btnText}>Delete</Text></TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: COLORS.secondary, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  price: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  badge: { backgroundColor: '#e9dcc3', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginVertical: 8 },
  badgeText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  desc: { color: '#475569', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
});