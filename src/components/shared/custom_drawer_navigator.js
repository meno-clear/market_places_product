import { DrawerItemList } from "@react-navigation/drawer";
import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/SimpleLineIcons";
import { useAuth } from "../../contexts";
import Icon2 from 'react-native-vector-icons/Ionicons';

export const CustomDrawerContent = (props) => {
  const { signOut, user } = useAuth();

  const handleNavigateToProfile = () => {
    props.navigation.navigate("Profile");
  };

  return (
    <ScrollView
      style={{
        flex: 1
      }}
      {...props}
    >
      <View>
        <TouchableOpacity style={styles.header} onPress={handleNavigateToProfile}>
          <Icon2 style={{paddingVertical: 10}} name='close-circle-outline' size={30} color='#fff' />
          <View style={styles.headerInner}>
            <Text style={{color: '#fff', marginVertical: 5 }}>{[user?.first_name, user?.last_name].join(' ')}</Text>
            <Text style={{color: '#fff'}}>{user?.email}</Text>
          </View>
        </TouchableOpacity>
        <DrawerItemList {...props} />
      </View>
      
      <View style={styles.divider} />
      
      <View>
        <View style={styles.logout}>
          <TouchableOpacity
            onPress={() => {
              signOut();
            }}
          >
            <Text style={styles.logoutText}>
              <Icon name="logout" size={16} color="#F45A5A" /> Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#4286f4",
    marginBottom: 5
  },
  headerInner: {
    marginVertical: 15,
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 50,
  },
  logoutText: {
    color: "red",
  },
  logout: {
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingBottom: 50,
    marginTop: 100,
    marginBottom: 100,
  },
  logoutIcon: {
    color: "red",
  },
  divider: {
    marginLeft: '5%',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderColor: '#cecece',
    width: '90%'
  },
});