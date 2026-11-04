import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../constants/colors';

export const FormInput = ({ label, error, ...props }: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, error && styles.errorBorder]} {...props} />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);
const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 6 },
  input: { backgroundColor: COLORS.input, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, padding: 12, fontSize: 15 },
  errorBorder: { borderColor: COLORS.error },
  error: { color: COLORS.error, fontSize: 12, marginTop: 4 },
});