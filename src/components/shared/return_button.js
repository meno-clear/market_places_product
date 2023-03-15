import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ReturnButton({ color = '#000', label = 'Back' }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="arrow-left" size={20} color={color} />
      <Text style={{ color: color, fontWeight: "bold" }}> {label}</Text>
    </TouchableOpacity>
  );
}