import { createStackNavigator } from "@react-navigation/stack";
import AddCredentials from "../screens/settings/AddCredentials";
import ContactUs from "../screens/settings/ContactUs";
import Password from "../screens/settings/Password";
import VerifyAccount from "../screens/settings/VerifyAccount";
import AccountSettings from "../screens/settings/AccountSettings";
import BlockedUsers from "../screens/settings/accountSettings/BlockedUsers";
import ProfessionalMode from "../screens/settings/accountSettings/ProfessionalMode";
import DisableAccount from "../screens/settings/accountSettings/DisableAccount";
import DeactivateAccount from "../screens/settings/accountSettings/DeactivateAccount";
import RemoveAccount from "../screens/settings/accountSettings/RemoveAccount";
import ConfirmDisable from "../screens/settings/accountSettings/ConfirmDisable";
import Settings from "../screens/Settings";
import WalletRoute from "./WalletRoute";
const Stack = createStackNavigator();

export default function SettingsRoute({ navigation }) {


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={"Settings"}
        >

        
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="ConfirmDisable" component={ConfirmDisable} />
            <Stack.Screen name="DeactivateAccount" component={DeactivateAccount} />
            <Stack.Screen name="RemoveAccount" component={RemoveAccount} />
            <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
            <Stack.Screen name="ProfessionalMode" component={ProfessionalMode} />
            <Stack.Screen name="DisableAccount" component={DisableAccount} />
            <Stack.Screen name="AccountSettings" component={AccountSettings} />
            <Stack.Screen name="ContactUs" component={ContactUs} />
            <Stack.Screen name="VertifyAccount" component={VerifyAccount} />
            <Stack.Screen name="Password" component={Password} />
            <Stack.Screen name="AddCredentials" component={AddCredentials} />
            <Stack.Screen name="WalletRoute" component={WalletRoute}/>
        </Stack.Navigator>
    )

};

