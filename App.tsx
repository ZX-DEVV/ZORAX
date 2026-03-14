import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './global.css';
import Dash from 'Dash';
import Qrcode from 'Qrcode';
import Minerscreen from 'Minerscreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Mine"
        screenOptions={{ headerShown: false }}
      >
        {/* 2. Define your screens inside the Navigator */}
       
        
        <Stack.Screen  name="Dash"  component={Dash} />
       <Stack.Screen  name="Qr"  component={Qrcode} />
<Stack.Screen  name="Mine"  component={Minerscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}