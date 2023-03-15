import { useState, useCallback } from 'react';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../contexts/auth';
import { AddressItem } from './address_list_item';

export default function PostListPage() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      refreshList();
    }, [])
  );

  function refreshList() {
    api_client.get(`/addresses?user=${user.id}&type=Client`).then((response) => {
      setAddresses(response.data);
    });
  }

  function deleteItem(item) {
    api_client.delete(`addresses/${item}`).then(() => {
      setItemToDelete(null)
      setModalVisible(false)
      refreshList()
    })
      .catch(err => console.error(err));
  }

  const ModalComponent = ({ item }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Do you want to delete this item?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDelete]}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20, padding: 15 }}>
        <TouchableOpacity style={styles.buttonToReturn} onPress={() => navigation.goBack()}>
          <Text style={{ flexDirection: 'row', alignItems: 'center', color: "#fff" }}><Icon name="arrow-left" /> Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Addresses List</Text>
        <TouchableOpacity style={styles.buttonToAdd} onPress={() => navigation.navigate('AddressForm')}>
          <Text style={{ flexDirection: 'row', alignItems: 'center', color: '#fff' }}><Icon name="plus" /> New</Text>
        </TouchableOpacity>
      </View>

      <View>
        {addresses.length > 0 &&
          <FlatList
            data={addresses}
            renderItem={({item}) => <AddressItem item={item} navigation={navigation} setModalVisible={setModalVisible} setItemToDelete={setItemToDelete} />}
            keyExtractor={item => item.id}
          />
        }
      </View>
      {modalVisible && itemToDelete && <ModalComponent item={itemToDelete} setModalVisible={setModalVisible} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 35, flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 5 },
  title: {
    fontWeight: 'bold',
    color: '#4286f4'
  },
  data: {
    color: '#7e95cc'
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#e4e8f0',
    borderColor: '#4286f4'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginHorizontal: 20
  },
  buttonDelete: {
    backgroundColor: "red",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonToAdd: {
    backgroundColor: "#2196F3",
    padding: 5,
    borderWidth: 1,
    borderColor: '#4286f4',
    borderRadius: 4
  },
  buttonToReturn: {
    backgroundColor: "red",
    padding: 5,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 4
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
