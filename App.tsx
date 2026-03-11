import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './global.css';
import Dash from 'Dash';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Dash"
        screenOptions={{ headerShown: false }}
      >
        {/* 2. Define your screens inside the Navigator */}
       
        
        <Stack.Screen 
          name="Dash" 
          component={Dash} 
          options={{ title: 'Item Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}