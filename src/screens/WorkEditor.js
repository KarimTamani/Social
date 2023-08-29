import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Formik } from "formik";
import Header from "../components/Cards/Header"
import { textFonts } from "../design-system/font";

import { useCallback, useContext, useEffect, useState } from "react";
import FormInput from "../components/Inputs/FormInput";
import FormUploader from "../components/Inputs/FormUploader";
import FormDatePicker from "../components/Inputs/FormDatePicker";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "../components/Cards/post/loadingActivity";
import SelectDropdown from "react-native-select-dropdown";
import { errorStyle } from "../design-system/errorStyle";
import KeywordSubmitter from "../components/Cards/post/KeywordSubmitter";
import * as yup from "yup";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { createRNUploadableFile } from "../providers/MediaProvider";
import { useEvent } from "../providers/EventProvider";
import { AuthContext } from "../providers/AuthContext";
import BackgroundService from 'react-native-background-actions';
import { getMediaUri } from "../api";

const URL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
const WIDTH = Dimensions.get("screen").width;


const workSchema = yup.object({

    title: yup.string().required("الإسم الأول مطلوب").min(3, "3 أحرف على الأقل").max(255, "255 حرفًا كحد أقصى"),
    date: yup.date().required(),
    categoryId: yup.number().required(),
    media: yup.array().required().min(1),
    link: yup.string().notRequired().nullable().matches(URL, "هناك مشكلة في عنوان url"),

})

export default function WorkEditor({ navigation, route }) {


    const [categories, setCategories] = useState([]);
    const client = useContext(ApolloContext);
    const event = useEvent()
    const [user, setUser] = useState(null);
    const auth = useContext(AuthContext);
    const [post, setPost] = useState(null);

    const [fetching, setFetching] = useState(true);


    const [values, setValues] = useState({
        title: "",
        description: "",
        date: "",
        categoryId: "",
        media: [],
        link: "",
        keywords: []
    })
    const postId = route?.params?.postId;


    useEffect(() => {


        var fetchQuery = gql`
        
        query fetchQuery {
            getCategories {
              id
              name
            } 
            ${postId ? `
                getPostById(postId: ${postId}) {
                    id 
                    title 
                    type 
                    media { 
                        id path
                    }

                    keywords {
                        id name 
                    }
                    createdAt 
                    numComments 
                    liked
                    likes  
                    isFavorite 
                    userId
                    work {
                        id
                        date
                        description
                        link
                        categoryId
                        category {
                            id
                            name
                        }
                        views
                    }
                    user { 
                        id
                        name 
                        lastname 
                        profilePicture { 
                            id path 
                        } 
                        validated 
                    }
                }  
                ` : ``
            }
        }`

        client.query({
            query: fetchQuery
        }).then(response => {

            if (response && response.data) {
                setCategories(response.data.getCategories);
                if (response.data.getPostById) {
                    const post = response.data.getPostById;

                    post.media.forEach(m => m.uri = getMediaUri(m.path));

                    setPost(post);



                    setValues({
                        title: post.title,
                        description: post.work.description,
                        date: new Date(parseInt(post.work.date)).toISOString().slice(0, 10),
                        categoryId: post.work?.category?.id,
                        media: post.media,
                        link: post.work.link,
                        keywords: post.keywords?.map(keyword => keyword.name)
                    });
                }
            }


            setFetching(false);
        }).catch(error => {
            setFetching(false);
        });
        (async () => {
            const userAuth = await auth.getUserAuth();
            setUser(userAuth.user);
        })();

    }, [])



    const createPost = async (params) => {
        console.log("creating");
        var { client, event, values } = params;

        var media = [];
        var type = "work";

        // if the images where selected 
        // then loop over them and resize and compress them into one media array 
        if (values.media.length > 0) {

            for (let index = 0; index < values.media.length; index++) {
                media.splice(0, 0, await createRNUploadableFile(values.media[index].uri));
            }
        }

        try {
            var response = await client.mutate({
                mutation: gql`
            mutation CREATE_POST($postInput : PostInput!) {
                createPost(postInput: $postInput) { 
                    id 
                    title 
                    type 
                    media {
                        id path 
                    }
                    keywords {
                        id name 
                      }
                      work {
                        id 
                        description 
                        date
                        link
                        categoryId
                        category {
                          id
                          name
                        }
                        views
                      }
                    createdAt 
                    updatedAt 
                }
            }` ,
                variables: {
                    postInput: {
                        title: values.title,
                        media: media,
                        type: type,

                        workInput: {
                            date: values.date,
                            description: values.description,
                            link: values.link,
                            categoryId: values.categoryId,
                            keywords: values.keywords
                        }
                    }
                }
            });
            if (response) {
                var newPost = response.data.createPost;

                newPost.user = user;
                newPost.likes = 0;
                newPost.liked = false;
                newPost.isFavorite = false;
                newPost.numComments = 0;
                event.emit("new-post", newPost);
            }
        } catch (error) {

            await BackgroundService.stop();
        }
        setTimeout(async () => {
            await BackgroundService.stop();
        }, 10000)

    }






    const editPost = async (params) => {

        var { client, event, values , id  } = params;


        var media = [];
        const type = "work";



        // if the images where selected 
        // then loop over them and resize and compress them into one media array 
        if (values.media.length > 0) {

            for (let index = 0; index < values.media.length; index++) {
                if (values.media[index].id) {
                    media.splice(0, 0, {
                        id: values.media[index].id
                    });

                } else {
                    media.splice(0, 0, {
                        id: null,
                        path: null,
                        file: await createRNUploadableFile(values.media[index].uri)
                    });

                }

            }
        }

        // in case the video was selected then we need to estabilish a compression and keep the user informed 
        // in case the compress failed we continue with uncompressed video 

        try {
 
            var response = await client.mutate({
                mutation: gql`
                mutation Mutation($postInput: EditPostInput!) {
                    editPost(postInput: $postInput) {
                        id 
                        title 
                        type 
                        media {
                            id path 
                        }

                        keywords {
                            id name 
                          }
                          work {
                            id 
                            description 
                            date
                            link
                            categoryId
                            category {
                                id name 
                            }    
                            views
                          }
                        createdAt 
                        updatedAt 
                    }
                }
                ` ,
                variables: {
                    postInput: {
                        id : id  , 
                        title: values.title,
                        media: media,
            
                        workInput: {
                            date: values.date,
                            description: values.description,
                            link: values.link,
                            categoryId: values.categoryId,
                            keywords: values.keywords
                        }
                    }
                }
            });

 
           
            if (response) {
                var editPost = response.data.editPost;

                console.log (editPost) ; 
                editPost.user = user;
                editPost.likes = post.likes;
                editPost.liked = post.liked;
                editPost.isFavorite = post.isFavorite;
                editPost.numComments = post.numComments;

                event.emit("edit-post", editPost);

            }
        } catch (error) {
            console.log(error);
            await BackgroundService.stop();
        }
        setTimeout(async () => {
            await BackgroundService.stop();
        }, 10000)
    }


    const submit = useCallback((values) => {
        (async () => {
            try {
                const options = {
                    taskName: 'UPLOAD_CONTENT',
                    taskTitle: 'رفع المحتوى',
                    taskDesc: '.. تحميل المحتوى الخاص بك الرجاء الانتظار',
                    taskIcon: {
                        name: 'ic_launcher',
                        type: 'mipmap',
                    },
                    color: '#ff00ff',
                    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
                    parameters: {
                        client: client,
                        event: event,
                        values: values
                    },
                };

                await BackgroundService.start(!post ? createPost : editPost, options);
                navigation.goBack();
                // iOS will also run everything here in the background until .stop() is called
            } catch (error) {



                (post && post.id) ?
                    editPost({
                        client: client,
                        event: event,
                        values: values , 
                        id : post.id 
                    }) :
                    createPost({
                        client: client,
                        event: event,
                        values: values
                    })  ; 

                //  navigation.goBack();
            }
        })();
    }, [post]);



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
                title={"اعمالك"}
            />
            {
                (fetching) &&
                <LoadingActivity />
            }
            {
                (!fetching) &&
                <ScrollView style={styles.content}>
                    <Formik
                        initialValues={values}
                        onSubmit={submit}
                        validationSchema={workSchema}
                    >
                        {
                            ({ handleChange, handleBlur, handleSubmit, setFieldTouched, validateField, setFieldValue, values, touched, errors, isValid }) => (
                                <View style={{ marginBottom: 16 }}>
                                    <FormInput
                                        value={values.title}
                                        handleBlur={handleBlur("title")}
                                        handleChange={handleChange("title")}
                                        label={"عنوان العمل"}
                                        placeholder={"عنوان"}
                                        error={touched.title && errors.title}
                                    />
                                    <Text style={errorStyle.error}> {touched.title && errors.title}</Text>


                                    <FormDatePicker
                                        inputStyle={touched.date && errors.date && errorStyle.errorInput}
                                        label="تاريخ انشاء العمل"
                                        onBlur={() => {
                                            setFieldTouched("date", true);
                                            validateField("date").then();

                                        }}
                                        onChange={(date) => {
                                            setFieldValue("date", date);
                                        }}
                                        value={values.date}

                                    />

                                    <Text style={[errorStyle.error, { marginTop: -8 }]}> {touched.date && errors.date && "تاريخ الميلاد مطلوب"}</Text>

                                    <FormInput
                                        value={values.description}
                                        handleBlur={handleBlur("description")}
                                        handleChange={handleChange("description")}
                                        label={"وصف"}
                                        placeholder={"وصف"}
                                        multiline={true}
                                        numberOfLines={4}
                                    />

                                    <SelectDropdown
                                        data={categories}
                                        defaultValue={post?.work?.category}
                                        defaultButtonText={"اختر فئة"}
                                        buttonStyle={{ ...styles.dropdown, ...(touched.categoryId && errors.categoryId && errorStyle.errorInput) }}
                                        onSelect={(selectedItem, index) => {
                                            setFieldValue("categoryId", selectedItem.id);
                                        }}
                                        onBlur={() => {
                                            setFieldTouched("categoryId", true);
                                            validateField("categoryId").then();
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return <Text style={styles.dropdownText}>{selectedItem.name}</Text>
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return <Text style={styles.dropdownText}>{item.name}</Text>
                                        }}
                                        buttonTextStyle={styles.dropDownButtonText}
                                    />
                                    <Text style={[errorStyle.error, { marginTop: 8 }]}> {touched.categoryId && errors.categoryId && "الدولة مطلوبة"}</Text>

                                    <KeywordSubmitter
                                        onChange={(keywords) => {
                                            setFieldValue("keywords", keywords);
                                        }}
                                        defaultKeywords={values.keywords}
                                    />
                                    <FormInput
                                        value={values.link}
                                        handleBlur={handleBlur("link")}
                                        handleChange={handleChange("link")}
                                        label={"الرابط"}
                                        placeholder={"الرابط"}
                                        autoCapitalize={false}
                                        error={touched.link && errors.link}
                                    />
                                    <Text style={errorStyle.error}> {touched.link && errors.link}</Text>
                                    <FormUploader
                                        placeholder='الصور'
                                        defaultImages={post ? post.media : []}

                                        onChanges={(media) => {
                                            setFieldValue("media", media);
                                        }}
                                    />
                                    <PrimaryButton
                                        title={post ? "تعديل" : "حفظ"} style={styles.button}
                                        onPress={handleSubmit}
                                        disabled={!isValid}
                                    />

                                </View>
                            )
                        }
                    </Formik>
                </ScrollView>
            }
        </View>

    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",


    },
    content: {
        padding: 16,
    },
    button: {
        padding: 8,
        alignSelf: "center",
        width: 128,
        backgroundColor: "#1A6ED8",
        alignItems: "center",
        borderRadius: 26,
        marginVertical: 56
    },
    buttonText: {
        color: "white",
        fontFamily: textFonts.bold
    },
    dropdown: {
        borderColor: "#ccc",
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: "top",
        maxWidth: "100%",
        textAlign: "right",
        backgroundColor: "rgba(0,0,0,0.02)",
        width: WIDTH,
        marginVertical: 16
    },




    dropdownText: {
        fontFamily: textFonts.regular
    },
    dropDownButtonText: {
        color: "#212121",
        fontFamily: textFonts.regular,
        lineHeight: 28
    }

});


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor

    },
    dropdown: {
        borderColor: darkTheme.borderColor,
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: "top",
        maxWidth: "100%",
        textAlign: "right",
        backgroundColor: darkTheme.secondaryBackgroundColor,
        width: WIDTH,
        marginVertical: 16

    },
    dropDownButtonText: {
        color: darkTheme.textColor,
        fontFamily: textFonts.regular,
        lineHeight: 28
    },
} 