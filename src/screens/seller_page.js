import { View, ScrollView, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, TextInput, Image, Switch, FlatList } from 'react-native';
import { useAuth } from '../contexts/auth';
import AddressForm from './address/address_form_page';
import { API_ENDPOINT } from '../config/constants';
import { useDirectUpload } from 'react-native-activestorage';
import { photoUploader } from '../services/upload_file_service';
import api_client from '../config/api_client';
import ReturnButton from '../components/shared/return_button';
import { useState, useRef, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { AddressItem } from './address/address_item_page';
import { Modalize } from 'react-native-modalize';
import { useFocusEffect } from '@react-navigation/native';

export default function UserPage() {
  const { user, setUser } = useAuth();
  const scrollViewRef = useRef(null);
  const [markerPlacePartner, setMarkerPlacePartner] = useState({...user?.market_place_partner, logo: user?.logo } || {
    name: '',
    email: '',
    cnpj: '',
    logo: '',
  });

  const [addresses, setAddresses] = useState([]);
  const [image, setImage] = useState(null);
  const addressFormRef = useRef(null);
  const [addedImage, setAddedImage] = useState(null);

  const handleSubmit = () => {
    if (markerPlacePartner.email.trim() !== '' || markerPlacePartner.name.trim() !== '' || markerPlacePartner.cnpj.trim() !== '') {
      addedImage ? uploadLogo() : updateSeller()
    }
    else {
      Alert.alert('Your e-mail address cannot be empty')
    }
  }

  const onSuccess = ({ signedIds }) => {
    updateSeller(signedIds[0])
  }

  const { upload } = useDirectUpload({ onSuccess });

  const onUploadButtonClick = async () => {
    const { files, images } = await photoUploader();
    console.log(files.assets[0].uri)
    setImage(files.assets[0].uri)
    setAddedImage(images)
  }

  const uploadLogo = async () => {
    await upload(addedImage);
  }


  const updateSeller = async (signedId) => {
    if (markerPlacePartner.id){
      api_client.put(`/market_place_partners/${markerPlacePartner.id}`, { market_place_partner : { ...markerPlacePartner, logo: signedId } })
        .then(response => {
          Toast.show({
            text1: "Seller updated successfully.",
            type: "success",
          })
          setUser({ ...user, market_place_partner: response.data, logo: signedId })
          setImage(null) 
          setAddedImage(null)
        }).catch(error => {
          console.log(error);
          Toast.show({
            text1: "Something went wrong.",
            type: "error",
          })
        })
      return;
    }

    api_client.post(`/market_place_partners`, { market_place_partner : { ...markerPlacePartner, logo: signedId, status: 1, user_id: user.id } })
    .then(response => {
      Toast.show({
        text1: "Seller save successfully.",
        type: "success",
      })
      setUser(state => ({ ...state, market_place_partner: response.data, logo: signedId }))
      setImage(null)
      setAddedImage(null)
    }).catch(error => {
      console.log(error);
      Toast.show({
        text1: "Something went wrong.",
        type: "error",
      })
    })
  }

  const getAddress = async () => {
    api_client.get(`/addresses?user=${user.id}&type=MarketPlacePartner`)
      .then(response => {
        setAddresses(response.data)
      }).catch(error => {
        console.log(error);
      })
    addressFormRef.addressCreated = null;
  }


  const IncrementAddress = () => {
    return (
      <TouchableOpacity style={styles.incrementButton} onPress={() =>  addressFormRef.current?.open()}>
        <FontAwesome name="plus" size={20}/>
        <Text style={{ marginLeft: 10 }}>Add Address</Text>
      </TouchableOpacity>
    )
  }

  useFocusEffect(
    useCallback(() => {
      getAddress()
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#4286f4', borderBottomRightRadius: 24, borderBottomLeftRadius: 24 }}>
          <ReturnButton color="#fff" />

          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
            <TouchableOpacity
              onPress={onUploadButtonClick}
              activeOpacity={0.8}
            >
              { user.logo ? (
                <Image style={{ width: 150, height: 150, borderRadius: 112, borderWidth: 5, borderColor: '#fff' }} source={{ uri: image ? image : `${API_ENDPOINT}/${user.logo}` }} />
              ) : (
                <View style={{ padding: 45 }}>
                  <Ionicons style={{ paddingVertical: 20 }} name='camera-outline' size={30} color='#fff' />
                </View>
              )}
            </TouchableOpacity>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>{markerPlacePartner.name}</Text>
              <Text style={{ color: '#fff' }}>{markerPlacePartner.email}</Text>
            </View>
          </View>
        </View>

        <ScrollView ref={scrollViewRef} style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={{ alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          </View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={markerPlacePartner.name}
              placeholder="Company Name"
              onChangeText={(text) => setMarkerPlacePartner(state => ({ ...state, name: text }))}
            />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={markerPlacePartner.email}
              placeholder="Company E-mail"
              onChangeText={(text) => setMarkerPlacePartner(state => ({ ...state, email: text }))}
            />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={markerPlacePartner.cnpj}
              placeholder="Company CNPJ"
              onChangeText={(text) => setMarkerPlacePartner(state => ({ ...state, cnpj: text }))}
            />
            <IncrementAddress />
            { addresses && addresses.length > 0 &&
              addresses.map((address, index) => (
                <AddressItem key={index} item={address} ref={addressFormRef} getAddress={getAddress} />
              ))
            }
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{user?.market_place_partner ? 'Update' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modalize ref={addressFormRef} snapPoint={600} modalHeight={600} onClose={() => getAddress()}>
        <View style={{paddingTop: 30}}>
          <AddressForm addressFormRef={addressFormRef} />
        </View>
      </Modalize>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  button: {
    marginTop: 30,
    borderRadius: 4,
    width: 80,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4286f4',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    marginTop: 20,
    borderRadius: 20,
    width: '100%',
    height: 40,
    borderColor: '#bbb',
    paddingVertical: 10,
    paddingLeft: 40,
    borderWidth: 1,
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 30,
    left: 15,
  },
  incrementButton: { 
    width: '100%',
    height: 60,
    marginTop: 20,
    marginBottom: 8,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'transparent', 
    borderRadius: 10,
    borderStyle: 'dashed',
    opacity: 0.5,
    borderWidth: 1 
  }
})