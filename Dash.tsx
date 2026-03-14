import { View, Text, Pressable, ImageBackground, ScrollView ,Image, Alert} from 'react-native';
import * as Progress from 'react-native-progress';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import Header from 'Header';
import Navbar from 'Navbar';

import {
  
  TouchableOpacity,
  Animated,
  useWindowDimensions,
 
  Modal,
} from "react-native";
import  { useEffect, useRef, useState } from "react";



export default function Dash() {

{/* animated counder */}
function AnimatedCounter({ value, fontSize = 28, color = "#1d4ed8" }: { value: number; fontSize?: number; color?: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 1200, useNativeDriver: false }).start();
    const l = anim.addListener(({ value: v }) => setDisplay(Math.floor(v)));
    return () => anim.removeListener(l);
  }, [value]);
  return <Text style={{ fontSize, fontWeight: "bold", color }}>{display.toLocaleString()}</Text>;
}
{/* anime end */}

  return (
    <ImageBackground 
      source={require('./assets/blurbg.jpg')} 
      resizeMode="cover" 
      className='h-screen w-screen'
    >

    <View className=' bg-[#ede3f8]/50  h-screen w-screen flex items-center justify-start gap-2 pt-12 p-5'>
        {/* logo and notif */}
        <Header></Header>
     
     {/* logo and notif end */}


    {/* balance view */}
     <View className='w-full flex flex-col justify-start items-start mt-7'>
        <Text className='font-semibold text-black text-lg'>Your Balance</Text>
        <Text className='text-black text-6xl font-semibold mt-2'>$ <AnimatedCounter value={1680} fontSize={48} color="#000" />
</Text>
     </View>
   {/* balance view end */}

 <Navbar/>

 {/* button view */}
   <View className='w-full flex flex-row gap-2 mt-6'>
    <Pressable className='flex flex-row justify-center items-center gap-3 bg-black rounded-xl w-1/2 py-3'><FontAwesome6 name="add" size={24} color="white" /><Text className='text-white font-semibold text-xl'>Deposit</Text></Pressable>
    <Pressable  className='flex flex-row justify-center items-center gap-3 bg-white rounded-xl  w-1/2 py-3'><Feather name="arrow-up-right" size={24} color="black" /><Text className='text-black font-semibold text-xl'>Transfer</Text></Pressable>
   </View>
 {/* button view end */}



 {/* cars view  */}
 <View className='bg-white/90 w-full py-1 px-3 h-56 rounded-2xl flex flex-col justify-start items-start'>

 <View className='w-full flex flex-row justify-between items-center mt-2'>
     <Text className='text-black font-semibold text-lg'>Cards</Text>
     <Pressable><FontAwesome6 name="add" size={20} color="black" /></Pressable>
 </View>

<ScrollView 
  horizontal 
  pagingEnabled 
  showsHorizontalScrollIndicator={true}
  snapToAlignment="center"
  decelerationRate="fast"
  
>

  
  {/* cards----------*/}
  <ImageBackground source={require('./assets/cards/pink.jpg')} resizeMode="cover" 
      className='w-52 h-36 m-1 rounded-lg'
      imageStyle={{ borderRadius: 10 }}
    >
        <Image source={require('./assets/MISA.png')} resizeMode="contain" className='w-12 h-12  ml-2' />
         <Text className='text-white text-2xl  mt-1 ml-2'>$ 1234.0</Text>
         <View className='px-4 flex-row items-center justify-between '>
                    <Text className='text-white text-md font-light mt-4 ml-2'>Credit</Text>
        <Text className='text-white text-md font-light mt-4 ml-2'>1234 ****</Text>
         </View>
    </ImageBackground>


     <ImageBackground source={require('./assets/cards/skyblue.jpg')} resizeMode="cover" 
      className='w-52 h-36 m-1 rounded-lg'
      imageStyle={{ borderRadius: 10 }}
    >
        <Image source={require('./assets/MISA.png')} resizeMode="contain" className='w-12 h-12  ml-2' />
         <Text className='text-white text-2xl  mt-1 ml-2'>$ 345.0</Text>
         <View className='px-4 flex-row items-center justify-between '>
                    <Text className='text-white text-md font-light mt-4 ml-2'>Credit</Text>
        <Text className='text-white text-md font-light mt-4 ml-2'>1234 ****</Text>
         </View>
    </ImageBackground>

 <ImageBackground source={require('./assets/cards/black.jpg')} resizeMode="cover" 
      className='w-52 h-36 m-1 rounded-lg'
      imageStyle={{ borderRadius: 10 }}
    >
        <Image source={require('./assets/MISA.png')} resizeMode="contain" className='w-12 h-12  ml-2' />
         <Text className='text-white text-2xl  mt-1 ml-2'>$ 45.0</Text>
         <View className='px-4 flex-row items-center justify-between '>
                    <Text className='text-white text-md font-light mt-4 ml-2'>Credit</Text>
        <Text className='text-white text-md font-light mt-4 ml-2'>1234 ****</Text>
         </View>
    </ImageBackground>
</ScrollView>

   
{/* cars view end */}
 </View>

{/* stats */}
<View className='bg-white/90  w-full  h-28 rounded-2xl flex justify-center items-center shadow-black shadow-lg'>

<View className='justify-between items-center flex flex-row w-full px-3'>
    
     <View className='flex flex-col gap-3'>
        <Text className='text-black font-semibold text-lg  ml-3'><FontAwesome6 name="money-bill-trend-up" size={24} color="black" />Spending Limit</Text>
         <Text className='text-black font-light text-md  ml-3'>Your spending</Text>
      </View>
           <View className='flex flex-col gap-3'>
        <Text className='text-black font-semibold text-xl  ml-3'>$5000.0</Text>
         <Text className='text-black font-light text-md  ml-3'>$299.0</Text>
      </View>
</View>

{/* stats end */}
</View>


{/* history  */}
<View className='bg-white/90  w-full  h-96 rounded-2xl flex justify-start items-center p-2'>
 <View className='w-full flex flex-row justify-between items-center mt-2'>
     <Text className='text-black font-semibold text-lg'>Transactions</Text>
     <Pressable><Ionicons name="arrow-forward-sharp" size={24} color="black" /></Pressable>
 </View>


<ScrollView>
    <View className='w-full flex flex-row justify-between items-center mt-6 px-2'>
        <View className='flex flex-row items-center gap-3'>
           <Image source={require('./assets/amazon.png')} resizeMode="contain" className='w-10 h-10 rounded-full  ' />
            <View>
                <Text className='text-black font-semibold text-md'>Amazon</Text>
                <Text className='text-black/50 font-normal text-sm'>12:44</Text>
            </View>
        </View>
        <Text className='text-black font-semibold text-xl'>-$299.0</Text>
    </View>

     <View className='w-full flex flex-row justify-between items-center mt-6 px-2'>
        <View className='flex flex-row items-center gap-3'>
            <Image source={require('./assets/betcord.png')} resizeMode="contain" className='w-10 h-10 rounded-full  ' />
            <View>
                <Text className='text-black font-semibold text-md'>Betcord</Text>
                <Text className='text-black/50 font-normal text-sm'>1:45</Text>
            </View>
        </View>
        <Text className='text-black font-semibold text-xl'>-$199.0</Text>
    </View>

     <View className='w-full flex flex-row justify-between items-center mt-6 px-2'>
        <View className='flex flex-row items-center gap-3'>
            <Image source={require('./assets/LARA.png')} resizeMode="contain" className='w-10 h-10 rounded-full  ' />
            <View>
                <Text className='text-black font-semibold text-md'>Lara</Text>
                <Text className='text-black/50 font-normal text-sm'>1:45</Text>
            </View>
        </View>
        <Text className='text-black font-semibold text-xl'>-$1799.0</Text>
    </View>
</ScrollView>







{/* history end  */}

</View>






 {/* page end  */}
    </View>
     </ImageBackground>
  )
}