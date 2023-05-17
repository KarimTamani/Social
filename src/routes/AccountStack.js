import { createStackNavigator } from "@react-navigation/stack";

import Account from "../screens/Account";
import Profile from "../screens/Profile" ; 

const Stack = createStackNavigator() ; 



export default function AccountStack({ }) { 


    return(
        <Stack.Navigator
            screenOptions={{ 
                headerShown : false
            }}
            initialRouteName="Account"
        >
            <Stack.Screen name="Account" component={Account}/>
            <Stack.Screen name="MyProfile" component={Profile}/>
            
        </Stack.Navigator>
    )
} ; 


