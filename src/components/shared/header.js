import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { DrawerActions, useNavigation } from '@react-navigation/native'

const Header = ({ label, goBack = false, navigateTo, icon = "message-circle" }) => {
  const navigation = useNavigation()
  return (
    <SafeAreaView>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#bbb'
      }}>

        <TouchableOpacity onPress={() => goBack ? navigation.goBack() : navigation.dispatch(DrawerActions.openDrawer())}>
          <Feather name="chevron-left" size={30} />
        </TouchableOpacity>
        <Text>{label}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(navigateTo)}>
          <Feather name={icon} size={28} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

export default Header