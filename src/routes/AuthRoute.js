import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Signup from "../screens/Signup";


const Stack = createStackNavigator();

export default function AuthRoute({ }) {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={"Login"}
        >
            <Stack.Screen name="Signup" component={Signup} />

            <Stack.Screen name="Login" component={Login} />

        </Stack.Navigator>
    )

}; 