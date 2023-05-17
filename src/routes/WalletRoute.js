
import { createStackNavigator } from "@react-navigation/stack";
import Wallet from "../screens/settings/Wallet";
import Deposite from "../screens/settings/wellet/Deposite";
import Revenue from "../screens/settings/wellet/Revenue";
import RevenueValidation from "../screens/settings/wellet/RevenueValidation";
const Stack = createStackNavigator();

export default function WalletRoute({ }) {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,

            }}
            initialRouteName={"Wallet"}>
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen name="Revenue" component={Revenue} />
            <Stack.Screen name="Deposite" component={Deposite} />
            <Stack.Screen name="RevenueValidation" component={RevenueValidation} />
        </Stack.Navigator>

    )

};

