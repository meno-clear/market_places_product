import { useState, useCallback } from 'react';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function CartItemFormPage({route}) {
  const navigation = useNavigation();

  const [errors, setErrors] = useState({});
  
  const [product_name, setProductName] = useState('');
  
  const [product_price_in_cents, setProductPriceInCents] = useState('');
  
  const [quantity, setQuantity] = useState('');
  

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.id) {
        api_client.get(`cart_items/${route?.params?.id}`).then((response) => {
          
          setProductName(`${response.data.product_name}`);
          
          setProductPriceInCents(`${response.data.product_price_in_cents}`);
          
          setQuantity(`${response.data.quantity}`);
          
        });
      }
      else {
        resetFields();
      }
    }, [route])
   )

  function resetFields() {
    
      setProductName('');
    
      setProductPriceInCents('');
    
      setQuantity('');
    
  }

  const handleSubmit = () => {
    const cart_item = {
      
      product_name: product_name,
      
      product_price_in_cents: product_price_in_cents,
      
      quantity: quantity
      
    };

    if (route?.params?.id) {
      api_client.put(`cart_items/${route?.params?.id}`, cart_item).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('CartItemList');
        }
      });
    } else {
      api_client.post('cart_items', cart_item).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('CartItemList');
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart Item Form</Text>
        
          <TextInput
            type='text'
            name='product_name'
            id='product_name'
            placeholder='Product name'
            style={styles.input}
            value={product_name}
            onChangeText={(product_name) => setProductName(product_name)}
          />
          {errors.product_name && <p>{errors.product_name}</p>}
        
          <TextInput
            type='text'
            name='product_price_in_cents'
            id='product_price_in_cents'
            placeholder='Product price in cents'
            style={styles.input}
            value={product_price_in_cents}
            onChangeText={(product_price_in_cents) => setProductPriceInCents(product_price_in_cents)}
          />
          {errors.product_price_in_cents && <p>{errors.product_price_in_cents}</p>}
        
          <TextInput
            type='text'
            name='quantity'
            id='quantity'
            placeholder='Quantity'
            style={styles.input}
            value={quantity}
            onChangeText={(quantity) => setQuantity(quantity)}
          />
          {errors.quantity && <p>{errors.quantity}</p>}
        

        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 20 }}>
          <TouchableOpacity style={styles.backButton} onPress={(e) => [resetFields(), navigation.goBack()]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => [resetFields(), handleSubmit()]}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#4286f4',
  },
  backButton: {
    marginTop: 10,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    marginTop: 10,
    borderRadius: 20,
    width: '90%',
    height: 40,
    borderColor: '#bbb',
    padding: 10,
    paddingLeft: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
  }
})
