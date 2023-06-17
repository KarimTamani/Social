import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useCallback, useContext, useState } from "react";
import ProfileOptions from "./profile/ProfileOptions";
import Sender from "../../components/Cards/Sender";
import Slider from "../../components/Cards/Slider";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";


export default function ProfileHeader({ myProfile, onBack, navigation, user }) {


    const [showOptions, setShowOptions] = useState(false);
    const [showSender, setShowSender] = useState(false);
    const openSettings = useCallback(() => {
        navigation.navigate("SettingsRoute", {
            screen: "Settings",
            params: {

                user
            }
        });
    }, [navigation, user]);


    const toggleOptions = useCallback(() => {
        setShowOptions(!showOptions);
    }, [showOptions])

    const toggleProfileSender = useCallback(() => {
        setShowSender(!showSender);

    }, [showSender]);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    return (
        <View style={styles.container}>
            {
                !myProfile &&
                <TouchableOpacity onPress={toggleOptions}>
                    <Entypo name="dots-three-vertical" style={styles.icon} />
                </TouchableOpacity>
            }
            {
                myProfile &&
                <TouchableOpacity onPress={openSettings}>
                    <Feather name="settings" style={styles.icon} />
                </TouchableOpacity>
            }
            <TouchableOpacity onPress={onBack}>
                <AntDesign name="arrowright" style={styles.icon} />
            </TouchableOpacity>
            {
                showOptions &&
                <Modal
                    transparent
                    onRequestClose={toggleOptions}
                >
                    <ProfileOptions
                        onClose={toggleOptions}
                        user={user}
                        toggleProfileSender={toggleProfileSender}
                    />

                </Modal>
            }
            {

                showSender &&
                <Modal
                    transparent
                    onRequestClose={toggleProfileSender}
                >
                    <Slider
                        onClose={toggleProfileSender}
                    >
                        <Sender

                        />
                    </Slider>

                </Modal>

            }
        </View>
    )

}


const lightStyles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 48,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    icon: {
        fontSize: 24
    }
});

const darkStyles = {
    ...lightStyles,
    icon: {
        fontSize: 24,
        color: darkTheme.textColor
    }
}
