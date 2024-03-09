import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch data from your Express server
    fetch('exp://10.33.3.156:8081')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app, now dude!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
