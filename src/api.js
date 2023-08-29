
const remote = false     

const API = remote ? 'http://129.151.154.246:4000/graphql' : "http://192.168.1.103:4000/graphql"; 
const URL =  remote ? "http://129.151.154.246:4000" : "http://192.168.1.103:4000";

const getMediaUri = (path)=> { 
    return URL + "/" + path; 
}

export { 
    API , 
    URL ,
    getMediaUri 
}