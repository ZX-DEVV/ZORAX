import { View, Text, Pressable } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function Header() {
  return (
     <View className='w-full flex flex-row justify-between items-center mx-10'>
         {/* logo  */}
                <View className='  flex flex-row gap-2ù items-center justify-center '>
                    <View className='bg-zinc-950 w-14 h-14 rounded-full justify-center items-center  '>
                      <Text className='text-white text-2xl font-semibold'>Z</Text>
                    </View>
                     <View className='text-zinc-950 flex flex-col text-xl font-bold ml-2'>
                      <Text className='text-zinc-950 text-xl font-bold ml-2'>Hi, Zayd</Text>
                     <Text className='text-zinc-950 text-sm font-light ml-2'>Welcome back!</Text>
                    </View>  
                </View>
             {/* notif btn */}
            <View className='flex flex-row gap-5 items-center justify-center  '>
                <Pressable>
                    <Ionicons name="notifications-outline" size={30} color="black" />
                </Pressable>
                <Pressable>
                        <MaterialCommunityIcons name="pickaxe" size={30} color="black" />
                </Pressable>
            </View>

        </View>
  )
}