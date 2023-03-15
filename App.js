import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { AuthProvider, CartProvider } from './src/contexts';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {enableLatestRenderer} from 'react-native-maps';
import Navigator from './src/Navigator';
import reducers from './src/reducers';

const store = createStore(reducers);

export default function App() {
enableLatestRenderer(true);
  return (
  <AuthProvider>
  <CartProvider>
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </Provider>
  </CartProvider>
  </AuthProvider>
  );
}