import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import SmallFollowButton from "../Buttons/SmallFollowButton";
import { textFonts } from "../../design-system/font";
import Skelton from "./loadings/Skelton";



const width = Dimensions.get("window").width
export default function HashTagHeader({ hashtagName }) {

    const client = useContext(ApolloContext);
    const [hashtag, setHashTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        client.query({
            query: gql`
            
            query GetHashTagPosts($name: String!) {
                getHashTagByName(name: $name) {
                  id name numPosts
                  isFollowed
                }
            }
            
            ` ,
            variables: {
                name: hashtagName
            }
        }).then(response => {
            setHashTag(response.data.getHashTagByName);
            setLoading(false);
            setFollowing(response.data.getHashTagByName.isFollowed);

        }).catch(error => {
            setLoading(false);

        })
    }, [hashtagName]);



    const toggleFollowHashTag = useCallback(() => {
        if (hashtag) {

            var previousValue = following; 
            setFollowLoading(true) ; 
            setFollowing(!previousValue) ;
            
            client.mutate({
                mutation: gql`
            mutation Mutation($hashtagId: ID!) {
                followHashTag(hashtagId: $hashtagId)
            }
            ` ,
                variables: {
                    hashtagId: hashtag.id
                }
            }).then(response => {
                if (!response) { 

                    setFollowing(previousValue) ; 
                } 
                setFollowLoading(false)
            }).catch(error => {
                setFollowLoading(false ) ; 
                setFollowing(previousValue) ; 
            })
             
        }
    }, [following, hashtag])
    return (
        <View style={styles.container}>
            <View style={styles.hashtagInfo}>
                <Text style={styles.hashtagName}>
                    {hashtagName}
                </Text>
                {
                    hashtag && !loading &&
                    <Text style={styles.numPosts}>
                        عدد المنشورات {hashtag.numPosts}
                    </Text>
                }
                {
                    loading &&
                    <Skelton
                        width={width / 3}
                        height={26}
                    />
                }
                {

                    !loading && !hashtag &&
                    <Text style={styles.numPosts}>
                        لم يتم العثور على هاذ الهاشتاغ
                    </Text>


                }
            </View>
            {
                hashtag && !loading &&
                <View style={styles.followSection}>
                    <SmallFollowButton

                        style={!following ? styles.follow : styles.unfollowButton}
                        textStyle={!following ? styles.buttonText : styles.unfollowText}
                        text={!following ? "متابعة" : "الغاء المتابعة"}
                        loading={followLoading}
                        onPress={toggleFollowHashTag}
                    />
                </View>
            }
            {
                loading &&
                <Skelton
                    width={width / 3}
                    height={38}
                    style={{
                        marginLeft: 16,
                        borderRadius: 12
                    }}
                />
            }

        </View>
    )

};

const styles = StyleSheet.create({
    container: {

        backgroundColor: "white",
        flexDirection: "row-reverse",
        alignItems: "center",
        padding: 16,
        paddingTop: 32,
    },
    hashtagInfo: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    followSection: {
        flex: 1,

    },
    hashtagName: {
        fontFamily: textFonts.bold,
        fontSize: 16,
        textAlign: "right"
    },
    follow: {
        padding: 8,
        borderRadius: 12
    },
    numPosts: {
        color: "#888",
        fontFamily: textFonts.regular,
        fontSize: 12
    },
    unfollowButton: {

        borderRadius: 12,
        padding: 8,
        justifyContent: "center",
        backgroundColor: "#ccc"

    },

    unfollowText: {

        color: "#212121"

    }
})