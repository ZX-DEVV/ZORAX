import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function Navbar() {
  return (
  <View className='absolute  h-screen w-screen flex items-center justify-end gap-2 pb-12 p-5'>
         <View className='bg-black  rounded-xl w-52 h-16 z-20  pb-9  py-1 px-1 flex flex-row gap-1 '>
                 <TouchableOpacity className=' bg-purple-400 rounded-lg  h-14 w-16 p-2 justify-center items-center'><Ionicons name="flash-outline" size={28} color="black" /></TouchableOpacity>
                  <TouchableOpacity className='bg-purple-400 rounded-lg  h-14 w-16 p-2 justify-center items-center'><MaterialCommunityIcons name="credit-card-multiple-outline" size={24} color="black" /></TouchableOpacity>
                   <TouchableOpacity className='bg-purple-400 rounded-lg  h-14 w-16 p-2 justify-center items-center'><FontAwesome6 name="qrcode" size={24} color="black" /></TouchableOpacity>
               
               
             </View>
     </View>
  )
}