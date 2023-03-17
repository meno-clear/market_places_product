import { useState, useCallback, useEffect } from 'react';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { trackPromise } from 'react-promise-tracker';
import ReturnButton from '../../components/shared/return_button';
import { useCart } from '../../contexts/cart';
export default function Products() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const {
    cart,
    getItemIndex,
    addToCart,
    increment,
    removeFromCart,
    decrement,
    getItem,
    clearCart,
    loading,
    activeItem
  } = useCart();
  const { total_items, total } = cart;

  useFocusEffect(
    useCallback(() => {
      trackPromise(
        refreshList()
      )
    }, [])
  );

  async function refreshList() {
    await api_client.get('products').then((response) => {
      let responseWithQuantity = response.data.map(res => {
        return {
          ...res,
        }
      })
      setProducts(responseWithQuantity);
    });
  }

  const deleteItem = (id) => {
    Alert.alert(
      'Remover produto do carrinho',
      'Tem certeza que deseja remover este produto?',
      [
        {
          text: 'Não',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => removeFromCart(getItemIndex(id))
        },
      ],
    )
  }

  function handleIncreaseQuantity(item) {
    console.log(activeItem && activeItem != getItemIndex(item.id))
    const index = getItemIndex(item.id)
    if (index != -1) {
      increment(index)
      return;
    }
    addToCart({ ...item })
  }

  function handleDecreaseQuantity(item) {
    const index = getItemIndex(item.id)
    decrement(index)
  }

  const TitleWithData = ({ title, product, data }) => {

    if (!data?.market_place_partner) {
      return (
        <Text style={[styles.title, { color: product ? '#4286f4' : '#000' }]}>{title}
          <Text style={[styles.data, { color: product ? '#2196F3' : '#6d6d6d' }]}> {data}</Text>
        </Text>
      )
    }
    return (
      <Text style={[styles.title, { color: product ? '#4286f4' : '#000' }]}>Market Place:{' '}
        <Text style={[styles.data, { color: product ? '#2196F3' : '#6d6d6d' }]}>{data?.market_place_partner}</Text>
      </Text>
    )
  };

  const ButtonQuantity = ({ item, product }) => (
    <View style={styles.quantityHandler}>
      <TouchableOpacity onPress={() => product && handleDecreaseQuantity(item)}>
        <Icon 
          name='minus-circle' 
          size={20} 
          color={!product || loading && activeItem != getItemIndex(item.id) ? '#ccc' : 'red'} 
          disabled={!product || loading && activeItem != getItemIndex(item.id)} />
      </TouchableOpacity>
      <Text style={styles.counter}>{product?.quantity || 0}</Text>
      <TouchableOpacity onPress={() => handleIncreaseQuantity(item)} disabled={loading && activeItem != getItemIndex(item.id)}>
        <Icon name='plus-circle' size={20} color={loading && activeItem != getItemIndex(item.id) ? '#ccc' : '#2196F3'} />
      </TouchableOpacity>
    </View>
  );

  const Item = ({ item }) => {
    const product = getItem(item.id)
    return (
      <TouchableOpacity style={[styles.item,
      {
        backgroundColor: "white",
        borderColor: product ? "#4286f4" : "#cecece",
        shadowColor: product ? "#2196F3" : "#000"
      }
      ]}
        onLongPress={() => deleteItem(item.id)}>
        <View style={styles.itemContent}>
          <View style={{ flexDirection: 'column' }}>
            <TitleWithData title='Name:' product={product} data={item?.name} />
            <TitleWithData title='Price In Cents:' product={product} data={item?.price_in_cents} />
            <TitleWithData title='Price:' product={product} data={item?.price_in_cents / 100} />
            <TitleWithData title='Name:' data={{ name: item?.name, market_place_partner: item?.market_place_name }} />
          </View>
          <ButtonQuantity item={item} product={product} />
        </View>
      </TouchableOpacity>
    )
  }

  const ButtonCheckout = () => (
    <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={[styles.cartButton, { width: '100%' }]} disabled={loading}>
      <View style={styles.icon}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{total_items}</Text>
        </View>
        <Icon name="shopping-cart" size={25} color="#fff" />
      </View>
      {loading ?
        <ActivityIndicator size="small" color="#fff" />
        :
        <>
          <Text style={{ color: "#fff", marginRight: !total ? 45 : 0 }}>Add to Cart</Text>
          <Text style={{ color: "#fff" }}>{total > 0 && `R$${total}`}</Text>
        </>
      }
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ReturnButton />
      {products.length > 0 ?
        <>
          <View style={styles.sectionTitle}>
            <Text style={styles.headerTitle}> PRODUCTS LIST</Text>
          </View>
          <View style={styles.list}>
            <View style={{ marginBottom: 20 }}>
              {products.length > 0 &&
                <FlatList
                  data={products}
                  renderItem={Item}
                  keyExtractor={item => item.id}
                />
              }
            </View>
            <View style={{ padding: 5 }}>
              {!!total &&
                <ButtonCheckout />
              }
            </View>
          </View>
        </>
        :
        <View style={styles.loaderView}>
          <Text>You have no products to show.</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductList")}>
            <Text style={{ color: "#fff" }}><Icon name="plus" size={16} /> Add Products</Text>
          </TouchableOpacity>
        </View>
      }
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5
  },
  list: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
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
  sectionTitle: {
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 15
  },
  cartButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#2196F3",
    borderColor: "#4286f4"
  },
  title: {
    fontWeight: 'bold',
  },
  data: {
    fontWeight: 'normal'
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 8,
  },
  itemContent: { flexDirection: 'row', justifyContent: 'space-between' },
  icon: {
    width: 40,
    height: 45,
    borderRadius: 40,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#4286f4",
    fontSize: 12,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#4286f4',
  },
  loaderView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
});
