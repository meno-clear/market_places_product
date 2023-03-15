import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ReturnButton from '../components/shared/return_button';
import { useAuth } from '../contexts';


export default function SignupPage() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const { signUp } = useAuth();

  const handleSubmit = async () => {
    await signUp(email, password, first_name, last_name)
  };

  return (
    <SafeAreaView style={styles.container}>
      <ReturnButton />
      <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === "ios" ? 'padding' : null}>

        <Text style={styles.title}>Signup Page</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputContent}>
            <Icon name='user' size={20} color="#bbb" />

            <TextInput
              autoFocus={true}
              style={styles.input}
              placeholder="First name"
              autoCapitalize="none"
              value={first_name}
              onChangeText={name => setFirstName(name)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputContent}>
            <Icon name='user' size={20} color="#bbb" />

            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={last_name}
              onChangeText={(text) => setLastName(text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputContent}>
            <Icon name='mail' size={20} color="#bbb" />

            <TextInput
              style={styles.input}
              keyboardType='email-address'
              name="email"
              autoCapitalize="none"
              placeholder="E-mail"
              value={email}
              onChangeText={email => setEmail(email)}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={[styles.inputContent, { paddingEnd: 15 }]}>
            <Icon name='lock' size={20} color="#bbb" />

            <TextInput
              style={styles.input}
              name="password"
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry={showPassword}
              value={password}
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

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>
            Sign up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </SafeAreaView>
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
    width: "90%",
    alignItems: 'center',
    backgroundColor: '#4286f4',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  inputContainer: {
    marginVertical: 8,
    width: "100%",
    alignItems: 'center'
  },
  inputContent: {
    flexDirection: 'row',
    paddingVertical: 5,
    width: "90%",
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  input: {
    height: 40,
    padding: 10,
    width: '90%',
    paddingLeft: 10,
    fontSize: 18,
  }
})
