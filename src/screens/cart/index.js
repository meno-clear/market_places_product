import { useState, useCallback, useEffect } from "react";
import api_client from "../../config/api_client";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { useCart } from "../../contexts";
import { trackPromise } from "react-promise-tracker";

export default function Cart({ route }) {
  const { cart_id } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    cart,
    setCart,
    getItemIndex,
    removeFromCart,
    increment,
    decrement,
    clearCart,
  } = useCart();
  const {
    total_items,
    total,
    price_in_cents,
    cart_items,
  } = cart;

  useFocusEffect(
    useCallback(() => {
      trackPromise(refreshList());
    }, [])
  );

  async function refreshList() {
    await api_client.get(`carts/${cart_id}`).then(({ data }) => {
      setCart(data);
    });
    setLoading(false);
  }

  function deleteItem(item, index) {
    api_client
      .delete(`cart_items/${item}`)
      .then(() => {
        if (cart_items.length === 1) {
          deleteCart();
          return;
        }
        removeFromCart(index);
        setItemToDelete(null);
        setModalVisible(false);
      })
      .catch((err) => console.error(err));
  }

  function deleteCart() {
    api_client
      .delete(`carts/${cart_id}`)
      .then(() => {
        clearCart();
        setItemToDelete(null);
        setModalVisible(false);
        navigation.goBack();
      })
      .catch((err) => console.error(err));
  }

  function handleIncreaseQuantity(item) {
    const index = getItemIndex(item.product_id);
    increment(index);
    return;
  }

  function handleDecreaseQuantity(item) {
    const index = getItemIndex(item.product_id);
    if (cart_items[index].quantity === 1) {
      setModalVisible(true);
      setItemToDelete({ ...item, index });
      return;
    }
    decrement(index);
  }

  function createOrder() {
    setLoading(true);
    let cart_items_order = cart_items.map((item) => {
      return {
        quantity: item.quantity,
        cart_item_id: item.id,
        product_price_in_cents: item.product_price_in_cents,
      };
    });

    api_client
      .post("/order_items", {
        order_items: {
          cart_id,
          cart_items: cart_items_order,
        },
      })
      .then(() => navigation.navigate("Home"))
      .catch((err) => console.error(err))
      .finally(() => {
        clearCart();
        setLoading(false);
      });
  }

  const Item = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={{ flexDirection: 'column' }}>

            <Text style={styles.title}>Name:
              <Text style={styles.data}> {item?.product_name}</Text>
            </Text>

            <Text style={styles.title}>Total Price In Cents:
              <Text style={styles.data}> {item?.product_price_in_cents * item?.quantity}</Text>
            </Text>

            <Text style={styles.title}>Total:
              <Text style={styles.data}> {(item?.product_price_in_cents * item?.quantity) / 100}</Text>
            </Text>
          </View>

          <View style={styles.quantityHandler}>
            <TouchableOpacity onPress={() => item.quantity > 0 && handleDecreaseQuantity(item)}>
              <Icon name="minus-circle" size={20} color={item.quantity === 0 ? "#ccc" : "red"} disabled={item.quantity === 0 ? true : false} />
            </TouchableOpacity>
            <Text style={styles.counter}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncreaseQuantity(item)}>
              <Icon name="plus-circle" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
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
            <Text style={styles.modalText}>Do you want to delete this item from your cart?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDelete]}
                onPress={() => deleteItem(item.id, item.index)}
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
      {loading ?
        <View style={styles.loaderView}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
        :
        <>
          <View style={styles.buttonToReturn}>
            <TouchableOpacity onPress={() => deleteCart()}>
              <Text><Icon name="arrow-left" /> Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionTitle}>
            <Text style={styles.headerTitle}> CART ITEMS </Text>
          </View>

          <View style={{ flex: 1 }}>

            <View style={{ marginBottom: 20 }}>
              {cart_items.length > 0 &&
                <FlatList
                  data={cart_items}
                  renderItem={Item}
                  keyExtractor={item => item.id}
                />
              }
            </View>

          </View>
          <View style={styles.divider} />

          <View style={styles.summaryDataView}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.headerTitle}> Summary </Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.summaryDataTitle}>Total Price: </Text>
            <Text style={styles.summaryData}> R$ {total} </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.summaryDataTitle}>Total Price In Cents: </Text>
            <Text style={styles.summaryData}> R$ {price_in_cents} </Text>
          </View>

          <View style={styles.lastData}>
            <Text style={styles.summaryDataTitle}>Items: </Text>
            <Text style={styles.summaryData}> {total_items} </Text>
          </View>

          <View style={{ padding: 5 }}>
            <TouchableOpacity onPress={() => createOrder()} style={styles.orderButton}>
              <Text style={{ color: "#fff" }}>Buy</Text>
            </TouchableOpacity>
          </View>
          {modalVisible && itemToDelete && <ModalComponent item={itemToDelete} setModalVisible={setModalVisible} />}
        </>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  sectionTitle: { 
    justifyContent: 'center', 
    flexDirection: 'row', 
    padding: 15 
  },
  title: {
    fontWeight: 'bold',
    color: '#4286f4'
  },
  orderButton: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 6,
    backgroundColor: "#2196F3",
    borderColor: "#4286f4"
  },
  summaryDataView: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 5 
  },
  dataRow: { 
    paddingHorizontal: 15,
    flexDirection: 'row',
     justifyContent: 'space-between'
  },
  summaryDataTitle: { 
    fontWeight: "bold",
     color: "#000"
  },
  summaryData: { color: "#6d6d6d" },
  lastData: { 
    paddingHorizontal: 15, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  data: {
    fontWeight: 'normal',
    color: '#2196F3'
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4286f4',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 8,
    backgroundColor: 'white'
  },
  itemContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  quantityHandler: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10 
  },
  counter: { 
    paddingHorizontal: 15, 
    color: "#6d6d6d" 
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  buttonToReturn: {
    padding: 10
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  loaderView: { 
    alignItems: "center", 
    justifyContent: "center", 
    flex: 1 
  },
  divider: { 
    borderBottomWidth: 1, 
    marginBottom: 10, 
    borderColor: '#cecece' 
  },
});