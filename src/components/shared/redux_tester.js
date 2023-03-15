import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import setMain from '../../actions/main'

export default function ReduxTester() {
  const dispatch = useDispatch();

  function testRedux() {
    dispatch(setMain({ redux_state: 'Success' }));
  }

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity style={styles.button} onPress={() =>  testRedux()}>
        <Text style={styles.buttonText}>
          Test Redux
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#4286f4',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  }
})