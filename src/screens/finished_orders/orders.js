import { useState, useCallback } from 'react';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { trackPromise } from 'react-promise-tracker';
import ReturnButton from '../../components/shared/return_button';
import { useAuth } from '../../contexts';

export default function Orders() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      trackPromise(
        refreshList()
      )
    }, [])
  );

  async function refreshList() {
    await api_client.get(`orders?user_id=${user.id}`).then((response) => {
      setOrders(response.data);
    });
    setLoading(false)
  }

  const Item = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('OrderDetails', { order: item })}
      >
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.title}>Date: <Text style={styles.data}> {moment(item?.created_at).format("MMMM, D of YYYY, h:mm a")}</Text></Text>
          <Text style={styles.title}>Total: <Text style={styles.data}> {item?.total}</Text></Text>
          <Text style={styles.title}>Price In Cents: <Text style={styles.data}> {item?.price_in_cents}</Text></Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ?
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
        :
        <>
          <ReturnButton />
          {orders.length > 0 ?
            <>
              <View style={{ justifyContent: 'center', flexDirection: 'row', padding: 15 }}>
                <Text style={styles.headerTitle}> ORDERS LIST</Text>
              </View>
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <View style={{ marginBottom: 20 }}>
                  {orders.length > 0 &&
                    <FlatList
                      data={orders}
                      renderItem={Item}
                      keyExtractor={item => item.id}
                    />
                  }
                </View>
              </View>
            </>
            :
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
              <Text>You have no orders to show.</Text>
            </View>
          }
        </>
      }
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 5 },
  title: {
    fontWeight: 'bold',
    color: '#000'
  },
  data: {
    color: '#6d6d6d',
    fontWeight: 'normal'
  },
  item: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cecece',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 8,
    backgroundColor: 'white'
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginHorizontal: 20
  },
});
