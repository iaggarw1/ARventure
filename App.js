import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapsComponent from './components/MapComponent'; // Make sure the path matches the location of your MapsComponent file

const App = () => {
  return (
      <View style={styles.container}>
        <MapsComponent />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
