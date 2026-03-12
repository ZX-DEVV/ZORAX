import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function Navbar() {
  const navigation = useNavigation<any>()
  const route = useRoute()

  const active = (name: string) => route.name === name

  return (
    <View className="absolute h-screen w-screen items-center justify-end pb-12 p-5">
      <View className="bg-black rounded-xl w-52 h-16 z-20 py-1 px-1 flex-row gap-1">

        {/* Dashboard */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Dash')}
          className={`rounded-lg h-14 w-16 p-2 justify-center items-center ${active('Dash') ? 'bg-purple-600' : 'bg-purple-400'}`}
        >
          <Ionicons name="flash-outline" size={28} color="black" />
        </TouchableOpacity>

        {/* Cards */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Cards')}
          className={`rounded-lg h-14 w-16 p-2 justify-center items-center ${active('Cards') ? 'bg-purple-600' : 'bg-purple-400'}`}
        >
          <MaterialCommunityIcons name="credit-card-multiple-outline" size={24} color="black" />
        </TouchableOpacity>

        {/* QR Scanner */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Qr')}
          className={`rounded-lg h-14 w-16 p-2 justify-center items-center ${active('Qr') ? 'bg-purple-600' : 'bg-purple-400'}`}
        >
          <FontAwesome6 name="qrcode" size={24} color="black" />
        </TouchableOpacity>

      </View>
    </View>
  )
}