import colors from '@/constants/colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CustomButton({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
  paddingVertical: 15,
  paddingHorizontal: 40,
  borderRadius: 10,
  elevation: 2,
  marginVertical: 10,
  },
  buttonText: {
    color: '#004AAD',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
