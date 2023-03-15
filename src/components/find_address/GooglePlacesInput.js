import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../config/constants';
import { useDispatch } from 'react-redux';
import { setAddress } from '../../actions/address';

const GooglePlacesInput = () => {
  const dispatch = useDispatch();
  return (
      <GooglePlacesAutocomplete
        GooglePlacesDetailsQuery={{ fields: "geometry" }}
        fetchDetails={true}
        placeholder="Search"
        styles={{
          textInputContainer: {
            width: '100%',
          },
          listView: {
            position: 'absolute',
            top: 40,
          },
          textInput: {
            height: 38,
            width: '100%',
            color: '#5d5d5d',
            backgroundColor: '#eee',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
          row: {
            backgroundColor: '#eee',
            padding: 13,
            height: 44,
            flexDirection: 'row',
          }
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en', // language of the results
        }}
        onPress={(data, details = null) => dispatch(setAddress(details?.geometry?.location))}
        onFail={(error) => console.error(error)}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    padding: 5,
    borderColor: '#000',
    borderWidth: 1,
  },
});


export default GooglePlacesInput;