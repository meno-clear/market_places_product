
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from './components/shared/header';
import HomePage from './screens/home_page';
import Products from './screens/buy/products.js';
import Cart from './screens/cart';
import Orders from './screens/finished_orders/orders';
import OrderDetails from './screens/finished_orders/order_details';
import ProductList from './screens/products/product_list_page.js';
import ProductForm from './screens/products/product_form_page.js';
import CartList from './screens/carts/cart_list_page.js';
import CartForm from './screens/carts/cart_form_page.js';
import CartItemList from './screens/cart_items/cart_item_list_page.js';
import CartItemForm from './screens/cart_items/cart_item_form_page.js';
import OrderList from './screens/orders/order_list_page.js';
import OrderForm from './screens/orders/order_form_page.js';
import OrderItemList from './screens/order_items/order_item_list_page.js';
import OrderItemForm from './screens/order_items/order_item_form_page.js';
import api_client from './config/api_client';
import { useAuth } from './contexts';
import { CustomDrawerContent } from './components/shared/custom_drawer_navigator';
import UserPage from './screens/user_page';
import FindAddress from './screens/find_address';
import AddressForm from './screens/address/address_form_page.js';
import AddressList from './screens/address/address_list_page.js';
// Imports End

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function PrivateRoutes() {
  const { user } = useAuth();
  api_client.defaults.headers['Authorization'] = `Bearer ${user?.token}`;
    
  const DrawerRoutes = () =>
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} backBehavior='initialRoute' initialRouteName='Home' screenOptions={{ sceneContainerStyle: { backgroundColor: '#fff' } }}>
      {/* Drawer Routes Start */}
      <Drawer.Screen name='Home' component={HomePage} />
       <Drawer.Screen name='Products' component={Products} options={{headerShown: false}}/>
       <Drawer.Screen name='Orders' component={Orders} options={{headerShown: false}}/>
      <Drawer.Screen name='ProductList' component={ProductList} options={{headerShown: false}}/>
      <Drawer.Screen name='CartList' component={CartList} options={{headerShown: false}}/>
      <Drawer.Screen name='CartItemList' component={CartItemList} options={{headerShown: false}}/>
      <Drawer.Screen name='OrderList' component={OrderList} options={{headerShown: false}}/>
      <Drawer.Screen name='OrderItemList' component={OrderItemList} options={{headerShown: false}}/>
      <Drawer.Screen name='AddressList' component={AddressList} options={{headerShown: false}}/>
      <Drawer.Screen name='FindAddress' component={FindAddress} />
      {/* Drawer Routes End */} 
    </Drawer.Navigator>

  return (
    <Stack.Navigator initialRouteName='Root' screenOptions={{cardStyle: { backgroundColor: '#fff' }}}>
      <Stack.Group>
      {/* Stack Routes Start */}
       <Stack.Screen name='Root' component={DrawerRoutes} options={{headerShown: false}}/>
       <Stack.Screen name='Cart' component={Cart} options={{headerShown: false}}/>
       <Stack.Screen name='OrderDetails' component={OrderDetails} options={{headerShown: false}}/>
       <Stack.Screen name='Profile' component={UserPage} options={{headerShown: false}}/>
       <Stack.Screen name='ProductForm' component={ProductForm} options={{headerShown: false}}/>
       <Stack.Screen name='CartForm' component={CartForm} options={{headerShown: false}}/>
       <Stack.Screen name='CartItemForm' component={CartItemForm} options={{headerShown: false}}/>
       <Stack.Screen name='OrderForm' component={OrderForm} options={{headerShown: false}}/>
       <Stack.Screen name='OrderItemForm' component={OrderItemForm} options={{headerShown: false}}/>
      <Stack.Screen name='AddressForm' component={AddressForm} options={{headerShown: false}}/>
      {/* Stack Routes End */}
      </Stack.Group>
    </Stack.Navigator>

  );
}
