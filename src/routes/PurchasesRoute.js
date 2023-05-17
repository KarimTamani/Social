import { createStackNavigator } from "@react-navigation/stack"; 
import PurchaseDetails from "../screens/PurchaseDetails";

import Purshases from "../screens/Purshases" ; 

const Stack = createStackNavigator()  ; 


export default function PurchsesRoute({ navigation  }) { 

    return(
        <Stack.Navigator
        
            screenOptions={{
                headerShown : false 
            }}
        >
            <Stack.Screen name="Purshases" component={Purshases} />
            <Stack.Screen name="PurchaseDetails" component={PurchaseDetails}/>
        </Stack.Navigator>
    )

} ; 

