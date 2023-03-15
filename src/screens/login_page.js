import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayoutEffect, useState } from 'react';
import { useAuth } from '../contexts';
import Icon from 'react-native-vector-icons/Feather';
import ReturnButton from '../components/shared/return_button';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const { signIn } = useAuth()

  useLayoutEffect(() => {
    setEmail('')
    setPassword('')
  }, [])

  const handleSubmit = async () => {
    await signIn(email, password)
  };

  return (
    <SafeAreaView style={styles.container}>
      <ReturnButton />

      <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === "ios" ? 'height' : null}>
        <Text style={styles.title}>Login</Text>

        <View style={{ marginVertical: 10, width: "100%", alignItems: 'center', }}>
          <View style={{
            flexDirection: 'row',
            paddingVertical: 5,
            width: "90%",
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}>
            <Icon name='mail' size={20} color="#bbb" />

            <TextInput
              keyboardType='email-address'
              autoFocus={true}
              style={styles.input}
              placeholder="E-mail"
              autoCapitalize="none"
              value={email}
              onChangeText={email => setEmail(email)}
            />
          </View>
        </View>

        <View style={{ marginVertical: 10, width: "100%", alignItems: 'center', }}>
          <View style={{
            flexDirection: 'row',
            paddingVertical: 5,
            width: "90%",
            paddingEnd: 10,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}>
            <Icon name='lock' size={20} color="#bbb" />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              secureTextEntry={showPassword}
              onChangeText={password => setPassword(password)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ?
                <Icon name='eye' size={20} color="#bbb" />
                :
                <Icon name='eye-off' size={20} color="#bbb" />
              }
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createAccountbutton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.createAccountButtonText}>Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,

  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 15,
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#4286f4',
  },
  createAccountbutton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  createAccountButtonText: {
    fontSize: 18,
    color: '#4286f4',
  },
  input: {
    height: 40,
    padding: 10,
    width: '90%',
    paddingHorizontal: 10,
    fontSize: 18,
  }
})
