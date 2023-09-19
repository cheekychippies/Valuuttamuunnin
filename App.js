import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_KEY } from '@env';

export default function App() {
  const [maara, setMaara] = useState('');
  const [muunnos, setMuunnos] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');

  useEffect(() => {
    getSymbols();
  }, []);

  const getMuunnos = () => {
    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${selectedSymbol}&amount=${maara}`, {
      headers: {
        'apikey': API_KEY
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {

          setMuunnos(responseJson.result.toString());
        } else {
          Alert.alert('Error', 'Conversion failed');
        }
      })
      .catch(error => {
        Alert.alert('Error', error);
      });
  }
  const getSymbols = () => {
    fetch(`https://api.apilayer.com/exchangerates_data/symbols`, {
      headers: {
        'apikey': API_KEY
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        const symbolArray = Object.keys(responseJson.symbols);
        setSymbols(symbolArray);
      })
      .catch(error => {
        Alert.alert('Error', error);
      });
  }
  const buttonPressed = () => {
    getMuunnos();

  };

  return (
    <View style={styles.container}>
      {muunnos !== null && <Text>{muunnos} €</Text>}
      <View style={styles.row}>
        <TextInput style={styles.input} onChangeText={maara => setMaara(maara)} value={maara} />
        <Picker
          selectedValue={selectedSymbol}
          onValueChange={(itemValue) => setSelectedSymbol(itemValue)}
          style={styles.picker}
        >
          {symbols.map(symbol => (
            <Picker.Item key={symbol} label={symbol} value={symbol} />
          ))}
        </Picker>
      </View>
      <Button onPress={buttonPressed} title="Convert to €" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
  },
  picker: {
    width: 150,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
