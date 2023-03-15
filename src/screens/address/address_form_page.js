import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import ReturnButton from '../../components/shared/return_button';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../config/constants';
import { useAuth } from '../../contexts/';
import api_client from '../../config/api_client';

export default function AddressForm({ route, navigation }) {
  const INITIAL_ADDRESS = {
    address: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    district: '',
    number: '',
  }
  const { addressCreated } = route?.params || {} ;
  const { user } = useAuth();
  const [address, setAddress] = useState(INITIAL_ADDRESS);

  const clearAddress = () => setAddress(INITIAL_ADDRESS);

  const handleAddress = (result, description) => {
    clearAddress();

    const { address_components, geometry } = result;
    const { lat: latitude, lng: longitude } = geometry.location

    const newAddress = INITIAL_ADDRESS

    Object.keys(address_components).forEach((key) => {
      const { long_name } = address_components[key];
      switch(address_components[key].types[0]){
        case 'postal_code':
          newAddress.postal_code = long_name
          break;
        case 'route':
          newAddress.street = long_name
          break;
        case 'sublocality_level_1':
          newAddress.district = long_name
          break;
        case 'administrative_area_level_2':
          newAddress.city = long_name
          break;
        case 'administrative_area_level_1':
          newAddress.state = long_name
          break;
        case 'country':
          newAddress.country = long_name
          break;
        default:
          break;
      }

    });

    setAddress({...newAddress, latitude, longitude, address: description})
  }

  const validateAddress = () => {
    const { street, city, state, country, postal_code, district, number } = address;
    if(street && city && state && country && postal_code && district && number){
      return true;
    }
    return false;
  }

  const handleSubmit = async () => {
    if(!validateAddress()) return Alert.alert('Please fill all fields');

    if( addressCreated ) {
      await api_client.patch(`/addresses/${addressCreated.id}`, { address }).then(() => {
        Alert.alert('Address updated successfully');
        navigation.goBack();
      }).catch(() => {
        Alert.alert('Error updating address');
      })
      return;
    }

    await api_client.post('/addresses', { 
      address: { ...address, user_id: user.id } 
    }).then(() => {
      Alert.alert('Address saved successfully');
      navigation.goBack();
    }).catch(() => {
      Alert.alert('Error saving address');
    })

  }

  useEffect(() => {
    if (addressCreated) {
      setAddress(addressCreated)
      return;
    }
    clearAddress();
  }, [])

  return (
    <View style={styles.container}>
      <ReturnButton />
      <View style={styles.form}>

        <Text style={styles.title}>Address Form</Text>

        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields :['address_components','geometry'] }}
          fetchDetails={true}
          placeholder={'Street'}
          textInputProps={{ onChangeText: (text) => setAddress({...address, street: text }), value: address.street  }} 
          enablePoweredByContainer={false}
          debounce={1000}
          styles={{
            container: {width: '100%', height:45,flex:0, justifyContent: 'center', alignItems: 'center', zIndex: 200},
            textInputContainer: {width: '90%'}, 
            textInput: styles.input,
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            row: {width: '100%', backgroundColor: '#fff',zIndex: 200},
            listView: {width: '91%', position: 'absolute', top: 50}
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en', // language of the results
          }}
          onPress={(data, details = null) => {
            handleAddress(details, data?.description)
          }}
          onFail={(error) => console.error(error)}
        />

        <TextInput
          style={styles.input}
          placeholder="Number"
          value={address.number}
          onChangeText={(text) => setAddress({ ...address, number:text})}
        />

        <TextInput
          style={styles.input}
          placeholder="District"
          value={address.district}
          onChangeText={(text) => setAddress({ ...address, district:text})}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={address.city}
          onChangeText={(text) => setAddress({...address, city:text })}
        />

        <TextInput
          style={styles.input}
          placeholder="State"
          value={address.state}
          onChangeText={(text) => setAddress({ ...address, state:text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Country"
          value={address.country}
          onChangeText={(text) => setAddress({ ...address, country:text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          maxLength={8}
          value={address.postal_code}
          onChangeText={(text) => setAddress({ ...address, postal_code:text})}
        />

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
            <Text style={styles.buttonText}>
              { addressCreated ? 'Update' : "Save" }
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 30,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#4286f4',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    marginTop: 10,
    borderRadius: 20,
    width: '90%',
    fontSize: 14,
    backgroundColor: '#fff',
    height: 40,
    borderWidth: 1,
    borderColor: '#bbb',
    paddingLeft: 25,
  },
})
