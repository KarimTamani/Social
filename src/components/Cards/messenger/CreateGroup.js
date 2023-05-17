import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView  } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Feather, AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import Header from "../Header";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
var FOLLOWERS = [
    {
        id: 1,
        user: {
            name: "خير الله غازي",
            image: require("../../../assets/illustrations/mainUser.jpeg")
        },
        lastMessage: "صباح الخير",
        newMessages: 0
    },
    {
        id: 2,
        user: {
            name: "تماني كريم",
            image: require("../../../assets/illustrations/user.png")
        },
        lastMessage: "هذا رائع ، شكرا لك",
        newMessages: 1
    },
    {
        id: 3,
        user: {
            name: "خير الله غازي",
            image: require("../../../assets/illustrations/uknown.png")
        },
        lastMessage: "السلام عليكم",
        newMessages: 0
    },
]

export default function CreateGroup({ navigation }) {

    const [users, setUsers] = useState(FOLLOWERS);
    const [members, setMembers] = useState([]);

    const renderItem = useCallback(({ item }) => {
 
        return (
            <TouchableOpacity style={styles.user} onPress={() => selectUser(item.id)}>
                <Image source={item.user.image} style={styles.userImage} />
                <Text style={styles.username}>
                    {item.user.name}
                </Text>
                {
                    !item.selected &&
                    <Feather name="circle" style={styles.icon} />
                }
                {
                    item.selected &&
                    <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                }
            </TouchableOpacity>
        )

    }, [users]);

    const keyExtractor = useCallback((item, index) => {
        return index;
    }, [users])

    const selectUser = useCallback((userId) => {
        setUsers((array) => {
            const index = array.findIndex((user) => user.id == userId);
            array[index].selected = !array[index].selected;
            return [...array];

        })
    }, [users]);


    useEffect(() => {
        setMembers(users.filter(user => user.selected));
    }, [users]);


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={"إنشاء مجموعة"}
                navigation = { navigation }
            />
            <View style={styles.group}>
                <View style={styles.members}>
                    {
                        members.map((user, index) => (
                            <Image source={user.user.image} style={[styles.member, index == 1 && styles.floatOne , index == 2 && styles.floatTwo ]} />
                        ))
                    }
                </View>
                <TouchableOpacity style={styles.createButton}>
                    <Ionicons name="add-outline" size={32} color="#1A6ED8" />
                    <Text style={styles.createText}>
                        إنشاء
                    </Text>
                </TouchableOpacity>

            </View>
            <View style={styles.usersList}>
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>
        </SafeAreaView>
    )

};



const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        padding: 16
    },

    icon: {
        fontSize: 24,
        color: "#666"
    },
    blueIcon: {
        color: "#1A6ED8"
    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 48
    },
    user: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16

    },
    username: {
        fontFamily: textFonts.regular,
        flex: 1,
        textAlign: "right",
        paddingRight: 16
    },
    usersList: {
        padding: 16
    },
    group: {
        paddingHorizontal: 16,
        flexDirection: "row",
        height: 86
    },
    members: {
        flex: 1,
        flexDirection: "row"
    },
    createButton: {
        width: 64,

        alignItems: "center",
        justifyContent: "center"
    },
    createText: {
        fontFamily: textFonts.regular,
        color: "#1A6ED8"
    },
    member: {
        borderRadius: 64,
        width: 72,
        height: 72,
        borderWidth: 6,
        borderColor: "white",

    },
    floatOne: {
        
        transform: [{
            translateX: -36
        }]
    }
    ,
    floatTwo: {
        
        transform: [{
            translateX: -72
        }]
    }
})


const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor 
    }
    ,
    username: {
        fontFamily: textFonts.regular,
        flex: 1,
        textAlign: "right",
        paddingRight: 16 , 
        color : darkTheme.textColor 
    },
 
    member: {
        borderRadius: 64,
        width: 72,
        height: 72,
        borderWidth: 6,
        borderColor: darkTheme.backgroudColor,

    },
}