import { Text, StyleSheet, View, TouchableOpacity, Image, Modal } from "react-native";
import { Entypo, AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import { FontAwesome } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from "react";
import ConversationOptions from "./ConversationOptions";
import Slider from "../../../components/Cards/Slider";
import SimaPicker from "./SimaPicker";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { getMediaUri } from "../../../api";

export default function ConversationHeader({ navigation , user, allowPhone = false, onPickSima, lightContent = false, members , conversation , isArchived = false }) {

    const [showOptions, setShowOptions] = useState(false);
    const [showSimas, setShowSimas] = useState(false);

 

    const toggleOptions = useCallback(() => {
        setShowOptions(!showOptions);
    }, [showOptions]);


    const toggleSimas = useCallback(() => {

        setShowSimas(!showSimas);
    }, [showSimas]);


    const pickSima = useCallback((sima) => {
        toggleSimas();

        onPickSima(sima);

    }, [showSimas]);



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    if (user)
        return (
            <View style={styles.container}>
                <View style={[styles.section, { flex: 1 }]}>
                    {
                        !allowPhone && conversation && 
                        <TouchableOpacity onPress={toggleOptions}>
                            <Entypo name="dots-three-vertical" style={[styles.headerIcon, lightContent && { color: "white" }]} />
                        </TouchableOpacity>
                    }
                    {
                        allowPhone &&
                        <TouchableOpacity>
                            <FontAwesome name="phone" style={styles.headerIcon} />
                        </TouchableOpacity>
                    }
                </View>
                <View style={[styles.section, { alignItems: "center", justifyContent: "flex-end"  , flex : 1 }]}>

                    <View style={styles.userInfo}>
                        <Text style={[styles.username, lightContent && { color: "white" }]}>
                            {user.name} {user.lastname} {user.validated && <AntDesign name="checkcircle" style={styles.blueIcon} />}
                        </Text>
                        <Text style={[styles.status, lightContent && { color: "white" }]}>
                            {
                                user.isActive ? "نشط الان" : "قبل ساعة"
                            }
                        </Text>
                    </View>
                    <View style={styles.userImageContainer}>
                        {
                            user.profilePicture &&
                            <Image source={{ uri: getMediaUri(user.profilePicture.path) }} style={styles.userImage} />
                        }
                        {
                            !user.profilePicture &&
                            <Image source={require("../../../assets/illustrations/gravater-icon.png")} style={styles.userImage} />
                        }
                        {
                            user.isActive &&
                            <View style={styles.active}>
                            </View>
                        }
                    </View>
                </View>

                {
                    showOptions &&
                    <Modal
                        transparent
                        onRequestClose={toggleOptions}
                    >
                        <ConversationOptions
                            onClose={toggleOptions}
                            toggleSimas={toggleSimas}
                            conversation = { conversation }  
                            isArchived = { isArchived }
                            navigation = { navigation }
                        />

                    </Modal>
                }

                {
                    showSimas &&
                    <Modal
                        transparent
                        onRequestClose={toggleSimas}
                    >
                        <Slider
                            onClose={toggleSimas}
                            percentage={0.1}

                        >
                            <SimaPicker
                                onSelect={pickSima}
                            />
                        </Slider>
                    </Modal>

                }

            </View>
        )
    else if (members) {

        var firstThree = members.slice(0, 3);
        var groupName = members.map(member => member.user.name + " " + member.user.lastname).join(",");

        var isActive = members.findIndex(member => member.user.isActive) >= 0;


        return (
            <View style={styles.container}>
                <View style={styles.section}>
                    {
                        !allowPhone &&
                        <TouchableOpacity onPress={toggleOptions}>
                            <Entypo name="dots-three-vertical" style={[styles.headerIcon, lightContent && { color: "white" }]} />
                        </TouchableOpacity>
                    }
                    {
                        allowPhone &&
                        <TouchableOpacity>
                            <FontAwesome name="phone" style={styles.headerIcon} />
                        </TouchableOpacity>
                    }
                </View>


                <View style={[styles.section, { alignItems: "center", justifyContent: "flex-end", flex: 1 }]}>

                    <View style={styles.userInfo}>
                        <Text style={[styles.username, lightContent && { color: "white" }]} numberOfLines={1}>
                            {groupName}
                        </Text>
                        <Text style={[styles.status, lightContent && { color: "white" }]}>
                            {
                                isActive ? "نشط الان" : "قبل ساعة"
                            }
                        </Text>
                    </View>
                    <View style={[styles.groupImages]}>
                        {

                            firstThree.map((member, index) => {
                                return (
                                    !member.user.profilePicture ?
                                        <Image style={[styles.userImage, index == 1 && styles.floatOne, index == 2 && styles.floatTwo]} source={require("../../../assets/illustrations/gravater-icon.png")} />
                                        :
                                        <Image style={[styles.userImage, index == 1 && styles.floatOne, index == 2 && styles.floatTwo]} source={{ uri: getMediaUri(member.user.profilePicture.path) }} />
                                )
                            })


                        }
                        {


                            isActive &&
                            <View style={styles.active}>
                            </View>

                        }
                    </View>
                </View>
                {
                    showOptions &&
                    <Modal
                        transparent
                        onRequestClose={toggleOptions}
                    >
                        <ConversationOptions
                            onClose={toggleOptions}
                            toggleSimas={toggleSimas}
                            conversation = { conversation }  
                            isArchived = { isArchived }
                            navigation = { navigation }
                        />

                    </Modal>
                }

                {
                    showSimas &&
                    <Modal
                        transparent
                        onRequestClose={toggleSimas}
                    >
                        <Slider
                            onClose={toggleSimas}
                            percentage={0.1}

                        >
                            <SimaPicker
                                onSelect={pickSima}
                            />
                        </Slider>
                    </Modal>

                }
            </View>
        )

    }
}

const lightStyles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 38,
        flexDirection: "row",



    },
    section: {

        flexDirection: "row",
        alignItems: "center",


    },
    userImage: {
        width: 42,
        height: 42,
        borderRadius: 48
    },
    userImageContainer: {
        position: "relative"
    },
    active: {
        backgroundColor: "#00FF00",
        width: 16,
        height: 16,
        position: "absolute",
        borderRadius: 16,
        bottom: 0
    },
    userInfo: {
        paddingRight: 16,

        flex: 1
    },
    blueIcon: {
        color: "#00D0CD",
        fontSize: 14,


    },
    username: {

        color: "#212121",
        fontSize: 12,

    },
    status: {
        color: "#666",
        fontFamily: textFonts.regular,
        fontSize: 10
    },
    headerIcon: {
        fontSize: 22
    },
    groupImages: {

        flexDirection: "row",
        justifyContent: "flex-start",
        width: 72,
        overflow: "hidden",


    },
    floatOne: {

        transform: [{
            translateX: -32
        }]
    }
    ,
    floatTwo: {

        transform: [{
            translateX: -56
        }]
    },

})


const darkStyles = {
    ...lightStyles,

    username: {
        fontFamily: textFonts.bold,
        color: darkTheme.textColor,
        fontSize: 13
    },
    status: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        fontSize: 10
    },
    headerIcon: {
        fontSize: 22,
        color: darkTheme.textColor
    }
}