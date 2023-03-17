import React, { forwardRef } from 'react';
import api_client from '../../config/api_client';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

export const AddressItem = forwardRef(({ item, navigation, setModalVisible, setItemToDelete, getAddress }, ref ) => {

  function handleDeleteItem(item) {
    setModalVisible(true)
    setItemToDelete(item)
  }

  const getLeftContent = (item) => {
    return (
      <TouchableOpacity style={styles.left} onPress={() => handleDeleteItem(item)} >
        <Icon name="trash" size={25} color="#fff"/>
      </TouchableOpacity>
    )
  }

  const openAddressForm = () => {
    ref.addressCreated =  item
    ref.current?.open()
  }


  function deleteAddress(item) {
    api_client.delete(`addresses/${item}`).then(() => {
      getAddress()
    })
      .catch(err => console.error(err));
  }

  const alertToDelete = (item) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteAddress(item.id) },
      ],
      { cancelable: false },
    );
  }

  return (
    <Swipeable renderLeftActions={() => setItemToDelete && setModalVisible && getLeftContent(item)}>
      <TouchableOpacity
        style={styles.item}
        onLongPress={() => ref && alertToDelete(item)}
        onPress={() => ref ? openAddressForm() : navigation.navigate('AddressForm', { addressCreated: item })}
      >
          <Text style={styles.title}>Address: <Text style={styles.data}> {item?.address}</Text></Text> 
      </TouchableOpacity>
    </Swipeable>
  )
}
);

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#e4e8f0',
    borderColor: '#4286f4'
  },
  data: {
    color: '#7e95cc'
  },
  left: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    borderRadius: 4
  }
});