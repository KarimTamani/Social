import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeNavigation from "./HomeNavigation";
import Profile from "../screens/Profile";
import Messenger from "../screens/Messenger";
import Conversation from "../screens/Conversation";
import EditProfile from "../screens/EditProfile";
import ImageViewer from "../screens/ImageViewer";
import ViewPosts from "../screens/ViewPosts";
import VideoPlayer from "../screens/VideoPlayer";
import WorkDetails from "../screens/WorkDetails";
import ServiceDetails from "../screens/ServiceDetails";
import PayedContentDetails from "../screens/PayedContentDetails";
import StoriesList from "../screens/StoriesList";
import NewPost from "../screens/NewPost";
import ServiceEditor from "../screens/ServiceEditor";
import WorkEditor from "../screens/WorkEditor";
import PayedContentEditor from "../screens/PayedContentEditor";
import CheckOut from "../screens/CheckOut";
import Contract from "../screens/Contract";
import DealsRoute from "./DealsRoute";
import ExploreRoute from "./ExploreRoute";
import MessageRequests from "../components/Cards/messenger/MessageRequests";
import AuthRoute from "./AuthRoute";
import SettingsRoute from "./SettingsRoute";
import CreateGroup from "../components/Cards/messenger/CreateGroup";

import AddStory from "../screens/AddStory";
import ReelsViewer from "../screens/ReelsViewer";
import { useContext, useEffect, useRef } from "react";
import { NotificationNavigator } from "./NotificationNavigator";
import { useEvent } from "../providers/EventProvider";
import { AuthContext } from "../providers/AuthContext";
import Favorites from "../screens/Favorites";
import HashTag from "../screens/HashTag";
import EditPost from "../screens/EditPost";
import ArchivedConversations from "../components/Cards/messenger/ArchivedConversations";
import ActivateAccount from "../screens/ActivateAccount";
import Report from "../screens/Report";
import QrScanner from "../screens/QrScanner";
import TermsAndServices from "../screens/TermsAndServices";
import PrivacyPolicy from "../screens/PrivacyPolicy";

const Stack = createStackNavigator();

export default function RootNavigation({ initialRouteName = "AuthRoute" }) {

    const navigationRef = useRef();
    const event = useEvent();
    const auth = useContext(AuthContext)

    useEffect(() => {
        if (navigationRef.current) {

            NotificationNavigator.setTopLevelNavigator(navigationRef.current)

            const onTokenExpired = () => {
                auth.logOut();
                //                navigationRef.current.navigate("AuthRoute")
            }

            event.addListener("token-expired", onTokenExpired);

            return () => {
                event.removeListener("token-expired", onTokenExpired)
            }
        }

    }, [navigationRef])

    return (
        <NavigationContainer

            ref={navigationRef}
        >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={initialRouteName}
            >
                <Stack.Screen name="PrivacyPolicy" component={ PrivacyPolicy} />
                <Stack.Screen name="TermsAndServices" component={ TermsAndServices } />
                <Stack.Screen name="QrScanner" component={ QrScanner} />  
                <Stack.Screen name="Report" component={Report}/>
                <Stack.Screen name="ActivateAccount" component={ActivateAccount}/>
                <Stack.Screen name="HashTag" component={HashTag} />
                <Stack.Screen name="EditPost" component={EditPost} />
                <Stack.Screen name="Favorites" component={Favorites} />
                <Stack.Screen name="ReelsViewer" component={ReelsViewer} />
                <Stack.Screen name="HomeNavigation" component={HomeNavigation} />
                <Stack.Screen name="SettingsRoute" component={SettingsRoute} />
                <Stack.Screen name="AuthRoute" component={AuthRoute} />
                <Stack.Screen name="ExploreRoute" component={ExploreRoute} />
                <Stack.Screen name="DealsRoute" component={DealsRoute} />
                <Stack.Screen name="CheckOut" component={CheckOut} />
                <Stack.Screen name="Contract" component={Contract} />
                <Stack.Screen name="PayedContentEditor" component={PayedContentEditor} />
                <Stack.Screen name="WorkEditor" component={WorkEditor} />
                <Stack.Screen name="ServiceEditor" component={ServiceEditor} />
                <Stack.Screen name="NewPost" component={NewPost} />
                <Stack.Screen name="StoriesList" component={StoriesList} />
                <Stack.Screen name="PayedContentDetails" component={PayedContentDetails} />
                <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
                <Stack.Screen name="WorkDetails" component={WorkDetails} />
                <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
                <Stack.Screen name="ViewPosts" component={ViewPosts} />
                <Stack.Screen name="ImageViewer" component={ImageViewer} />
                <Stack.Screen name="Conversation" component={Conversation} />
                <Stack.Screen name="Messenger" component={Messenger} />
                <Stack.Screen name="ArchivedConversations" component={ArchivedConversations} />
                <Stack.Screen name='Profile' component={Profile} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="MessageRequests" component={MessageRequests} />
                <Stack.Screen name="CreateGroup" component={CreateGroup} />
                <Stack.Screen name="AddStory" component={AddStory} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}


