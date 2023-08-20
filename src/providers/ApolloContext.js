
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "apollo-link-context";

import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../api";
import { AuthContext } from "./AuthContext";
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloClient, execute, from, gql, HttpLink, InMemoryCache, split } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "apollo-link-error";
import { useEvent } from "./EventProvider";

const ApolloContext = createContext();

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

export const ApolloProvider = ({ children, userAuth }) => {
    const [client, setClient] = useState(null);
    const [socket, setSocket] = useState(null);
    const event = useEvent();

    // define authLink 
    const authLink = setContext(async (req, { headers }) => {

        var user = await AsyncStorage.getItem("user");
        var token = null;

    
        if (user) {
            user = JSON.parse(user);
            token = user.token;
        }

        if (headers?.Authorization) {
            return {
                headers: {
                    ...headers,
                }
            }
        }
        return {

            headers: {
                ...headers,
                Authorization: (token) ? (token) : (null)
            }
        }
    });

    useEffect(() => {


        (async () => {

            // get the user auth 
            // if the user is auth get the token 
            // else leave the token as null 

            var token = userAuth ? userAuth.token : null;

            const httpLink = new HttpLink({ uri: API });
            const uploadLink = createUploadLink({ uri: API });


            const wsLink = new WebSocketLink({
                uri: API,
                options: {
                    reconnect: true,
                    connectionParams: {
                        Authorization: token,
                    }
                }
            });

            setSocket(wsLink);


            const errorLink = onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    graphQLErrors.forEach(({ extensions, message, locations, path }) => {
                

                        if (extensions.code == 403) {
                            // setError("Token expired loging out in 3 seconds");
                            event.emit("token-expired");
                          
                        }
                    });
                }
            })
            const concatedLink = from([
                errorLink,
                authLink,
                uploadLink,
                httpLink,

            ])

            const splitLink = split(
                ({ query }) => {
                    const definition = getMainDefinition(query);


                    return (
                        definition.kind === "OperationDefinition" &&
                        definition.operation === "subscription"
                    );
                },
                wsLink,
                concatedLink
            )

            setClient(new ApolloClient({
                link: splitLink,
                cache: new InMemoryCache({
                    addTypename: false
                }),
                defaultOptions
            }));



        })()

    }, [userAuth])



    if (!client)
        return;


    return (
        <ApolloContext.Provider value={client} >
            {children}
        </ApolloContext.Provider >

    )

}

export {
    ApolloContext
}



/*

(async () => {



            // create auth link that's take token from local torage and add it to the header 
           


            var user = await AsyncStorage.getItem("user");
            setIsAuth(Boolean(user));
      
            var token = null;
      
            if (user) {
              user = JSON.parse(user);
              token = user.token;
            }
      
      
            const httpLink = new WebSocketLink({
              uri: API,
              options: {
                reconnect: true,
                connectionParams: {
      
                  Authorization: (token) ? (token) : (null),
      
                }
              }
            });
      



        })();


*/


/*
 

setClient(new ApolloClient({
  link: authLink.concat(httpLink).concat(uploadLink).concat(errorLink),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions
}))
*/