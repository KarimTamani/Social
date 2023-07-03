
const API = 'http://192.168.1.38:4000/graphql' 
const URL = "http://192.168.1.38:4000";

const getMediaUri = (path)=> { 
    return URL + "/" + path; 
}

export { 
    API , 
    URL ,
    getMediaUri 
}