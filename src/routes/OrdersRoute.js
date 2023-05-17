import { createStackNavigator } from "@react-navigation/stack";

import Orders from "../screens/Orders";
import PurchaseDetails from "../screens/PurchaseDetails";
const Stack = createStackNavigator();


export default function OrdersRoute({ navigation }) {

    return (
        <Stack.Navigator

            screenOptions={{
                headerShown: false
            }}

        >
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="OrderDetails" component={PurchaseDetails}/>
        </Stack.Navigator>
    )

};

