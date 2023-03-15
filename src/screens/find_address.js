import { useSelector, useDispatch } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import GooglePlacesInput from '../components/find_address/GooglePlacesInput';
import { View, Text, StyleSheet, PermissionsAndroid, ActivityIndicator, Pressable, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setAddress } from '../actions/address';
import { useAuth } from '../contexts';
import { useState } from 'react';


export default function FindAddress() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const address = useSelector(state => state.address);
  const getCurrentPosition = () => {
    setLoading(true)

    if(Platform.OS === 'ios'){
      Geolocation.requestAuthorization('always') // or 'whenInUse'
      Geolocation.getCurrentPosition(
        (position) => {
          if(position){
            const {latitude, longitude} = position.coords 
            dispatch(setAddress({lat: latitude, lng: longitude}))
            setLoading(false)
          }
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
          setLoading(false)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
      return
    }

    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: `Hello ${user.first_name}`,
      message: 'We need access to your location',
    }).then((hasLocationPermission) => {
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
            (position) => {
              if(position){
                const {latitude, longitude} = position.coords 
                dispatch(setAddress({lat: latitude, lng: longitude}))
                setLoading(false)
              }
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
              setLoading(false)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        return;
      }
    }).catch((err) =>{
      console.log(err);
      setLoading(false)
    });
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', height:120, zIndex:2000}}>
        <Text style={styles.title}>Maps</Text>
        <GooglePlacesInput />
      </View>
      <View style={styles.mapContainer}>
      <MapView
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: address.latitude || 37.78825,
          longitude: address.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={
            address.latitude && address.longitude ? 
            address : 
            {latitude: 37.78825, longitude: -122.4324}
          }
          title={"Aqui"}
          description={"Seu local pesquisado"}
        />
      </MapView>
      </View>
      <Pressable style={styles.compassIcon} onPress={!loading && getCurrentPosition}>
        { loading ?
          <ActivityIndicator size='large' color='#f9f9f9'/>
          :
          <Icon name="compass" size={60} color="#f1f1f1" />  
        }
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    width: '100%',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapContainer: {
    zIndex: 0,
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  compassIcon:{
    width:65,
    height:65,
    borderRadius:32.5,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    backgroundColor:'#393939',
    bottom:15,
    right:15,
  }
})