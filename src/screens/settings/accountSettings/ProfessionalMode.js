import { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView, Modal } from "react-native";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import Header from "../../../components/Cards/Header";
import Slider from "../../../components/Cards/Slider";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import WelcomProfessional from "./WelcomProfessional";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "../../../components/Cards/post/loadingActivity";
import CategoryPicker from "../../../components/Cards/CategoryPicket";
import { AuthContext } from "../../../providers/AuthContext";
import { AntDesign } from '@expo/vector-icons';
import { useEvent } from "../../../providers/EventProvider";
export default function ProfessionalMode({ navigation }) {
    const [showWelcom, setShowWelcom] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [fetching, setFetching] = useState(false);

    const toggleWelcom = useCallback(() => {
        setShowWelcom(!showWelcom);
    }, [showWelcom]);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [isProfessional, setIsProfessional] = useState(false);
    const event = useEvent()  ; 
    
    useEffect(() => {
        (
            async () => {
                setFetching(true);
                const userAuth = await auth.getUserAuth();
                if (userAuth) {
                    const user = userAuth.user;

                    client.query({
                        query: gql`
                        query GetUserById($userId: ID!) {
                            getUserById(userId: $userId) {
                              id
                              professional 
                            }
                          }   

                        ` ,
                        variables: {
                            userId: user.id
                        }
                    }).then(response => {
                        setFetching(false);
                        if (response && response.data) {
                            setIsProfessional(response.data.getUserById.professional)
                        }
                    }).catch(error => {
                        setFetching(false);
                    })
                }
            }
        )()


    }, [auth])

    const activateProfessional = useCallback(() => {

        setLoading(true);
        client.mutate({
            mutation: gql`
            mutation ActivateProfessional {
                activateProfessional {
                  id 
                }
            }`
        }).then(response => {

            if (response && response.data.activateProfessional) {
                setIsProfessional(true)
                setShowWelcom(true);
            }

            setLoading(false);
        }).catch(error => {
            setLoading(false);
        })

    }, []);


    const showProfile = useCallback(() => {
        event.emit("edit-profile") ; 
        setShowWelcom(false);
        navigation.navigate("AccountStack") ; 
     
    }, [showWelcom]);

    const toggleCategoryPicker = useCallback(() => {
        setShowWelcom(false);
        setShowCategoryPicker(!showCategoryPicker);

    }, [showWelcom, showCategoryPicker]);


    const onSelectCategory = useCallback((category) => {
        toggleCategoryPicker();
        setLoading(true);

        client.mutate({
            mutation: gql`
            mutation PickCategory($categoryId: ID!) {
                pickCategory(categoryId: $categoryId) {
                  name 
                  categoryId
                }
            } ` ,
            variables: {
                categoryId: category.id
            }
        }).then(response => {
            setLoading(false);
        }).catch(error => {
            setLoading(false);
        })
    }, [showCategoryPicker])

    return (
        <View style={styles.container}>
            <Header
                title={
                    <Text>
                        تفعيل الوضع الاحترافي
                    </Text>
                }
                navigation={navigation}
            />

            {
                fetching && <LoadingActivity />
            }
            {

                !fetching && !isProfessional &&

                <ScrollView>
                    <View style={styles.content}>

                        <View style={styles.header}>
                            <Text style={styles.title}>
                                تشغيل الوضع الاحترافي

                            </Text>

                            <Text style={[styles.text, styles.headerText]}>
                                يمكنك إضافة أدوات جديدة إلى ملفك الشخصي حتى تتمكن من تعزيز حضورك كمنشئ محتوى على

                            </Text>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.infoSection}>
                                <Text style={styles.title}>
                                    تحقيق أرباح من المحتوى الذي تقدمه

                                </Text>

                                <Text style={styles.text}>
                                    اذا كنت مؤهلاً، يمكنك الاستفادة من أدوات تحقيق الأرباح لجني الأموال عن طريق الهدايا والخدمات و إنشاء محتوى مدفوع
                                </Text>

                            </View>
                            <Image source={require("../../../assets/icons/dollar.png")} style={styles.icon} />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.infoSection}>
                                <Text style={styles.title}>
                                    ساعد المزيد من الأشخاص على متابعتك

                                </Text>

                                <Text style={styles.text}>
                                    سيتم تعيين إعداد متابعي ملفك الشخصي إلى "عام" حتى يتمكن أي شخص من رؤية المحتوى العام الذي تنشره في الموجز لديه. وسيظل بإمكانك المشاركة مع الأصدقاء بشكلٍ خاص

                                </Text>

                            </View>
                            <Image source={require("../../../assets/icons/followers.png")} style={styles.icon} />
                        </View>

                        <PrimaryButton
                            title={"تشغيل"}
                            style={styles.button}
                            onPress={activateProfessional}
                            loading={loading}
                            disabled={loading}
                        />
                        <Text style={styles.text}>


                            يمكنك ايقاف تشغيل الوضه الاحترافي بأي وقت , وبالضغط على تشغيل فانك موافق على يطبقة ...
                            <Text style={styles.blutClickable}>

                                من شروط المعاملات التجارية
                            </Text>
                        </Text>

                    </View>
                </ScrollView>



            }

            {
                !fetching && isProfessional &&
                <View style={styles.content}>
                      <AntDesign name="checkcircle" style={styles.checkIcon} />
                      <Text style={[styles.title , {textAlign  : "center" , marginTop : 56}]}>
                      الوضع الإحترافي مفعل
                      </Text> 
                      <PrimaryButton
                            title={"اختيار فئة الملف الشخصي"}
                            style={styles.button}
                            onPress={toggleCategoryPicker}
                            loading={loading}
                            disabled={loading}
                        />

                </View>

            }

            {

                showWelcom &&
                <Modal
                    transparent
                    onRequestClose={toggleWelcom}
                >
                    <Slider
                        onClose={toggleWelcom}
                        percentage={0.4}
                    >
                        <WelcomProfessional
                            onShowProfile={showProfile}
                            onPickCategory={toggleCategoryPicker}
                        />
                    </Slider>
                </Modal>
            }

            {

                showCategoryPicker &&
                <Modal
                    transparent
                    onRequestClose={toggleCategoryPicker}
                >
                    <Slider
                        onClose={toggleCategoryPicker}
                        percentage={0.1}
                    >
                        <CategoryPicker
                            onSelect={onSelectCategory}

                        />
                    </Slider>
                </Modal>
            }
        </View>
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
    title: {
        fontFamily: textFonts.bold,
        color: "#212121",

    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginTop: 8
    },
    header: {
        alignItems: "center"
    },
    headerText: {
        textAlign: "center",
        marginVertical: 16
    },
    row: {
        flexDirection: "row",
        marginTop: 16

    },
    infoSection: {
        paddingRight: 8,
        flex: 1
    },
    icon: {
        width: 48,
        resizeMode: "contain"
    },
    button: {
        marginVertical: 26
    },
    blutClickable: {
        color: "#1A6ED8"
    } , 
    checkIcon : {
        color : "green"  , 
        alignSelf : "center" , 
        fontSize : 32 
    } 
})



const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    title: {
        fontFamily: textFonts.bold,
        color: darkTheme.textColor,


    },
    text: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginTop: 8
    },
}