import reels from "./reels";


var explore = [
    {
        id: 3,
        user: {
            name: "تماني كريم",
            image: require("../assets/illustrations/uknown.png")
        },
        type: "video",
        views: 2548,
        content: {
            video: "https://joy1.videvo.net/videvo_files/video/free/2016-12/large_watermarked/Code_flythough_loop_01_Videvo_preview.mp4",
            thumbnail: "https://joy1.videvo.net/videvo_files/video/free/2016-12/thumbnails/Code_flythough_loop_01_Videvo_small.jpg",
            title: "البرنامج التعليمي react native من الصفر",
            views: 256
        },

    },
    {
        id: 5,

        views: 365,
        user: {
            name: "تماني كريم",
            image: require("../assets/illustrations/uknown.png")
        },
        type: "video",
        content: {
            video: "https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4",
            thumbnail: "https://joy1.videvo.net/videvo_files/video/free/video0474/thumbnails/_import_61e8f017b3b2c5.29118448_small.jpg",
            title: "البرنامج التعليمي react native من الصفر",
            views: 256


        },

    }

    , {
        id: 4,
        user: {
            name: "تماني كريم",
            image: require("../assets/illustrations/uknown.png")
        },
        type: "video",
        views: 3108,
        content: {
            video: "https://joy1.videvo.net/videvo_files/video/free/video0485/large_watermarked/_import_624e701eba64a0.34411893_preview.mp4",
            thumbnail: "https://joy1.videvo.net/videvo_files/video/free/video0485/thumbnails/_import_624e701eba64a0.34411893_small.jpg"
            ,
            title: "موسيقى جميلة",
            views: 256

        }
    }
    , {
        id: 7,
        user: {
            name: "تماني كريم",
            image: require("../assets/illustrations/uknown.png")
        },
        type: "video",
        views: 578,
        content: {
            video: "https://cdn.videvo.net/videvo_files/video/premium/2020-07/large_watermarked/200727_02_Videvo_Stock_Market_2_Growth_Color_2_preview.mp4",
            thumbnail: "https://cdn.videvo.net/videvo_files/video/premium/2020-07/thumbnails/200727_02_Videvo_Stock_Market_2_Growth_Color_2_small.jpg"
            ,
            title: "latest news about stock market",
            views: 256

        }
    } , 
    {


        id: 2,
        user: {
            name: "خير الله غ",

            image: require("./illustrations/uknown.png")
        },
        type: "note",
        content: {
            text: "👍👍 لا تطيل النظر إلينا فنحن لا تشبه أحد"
        },
    } 
    , {
        id: 8,
        user: {
            name: "تماني كريم",
            image: require("../assets/illustrations/uknown.png")
        },
        type: "video",
        views: 1024,
        content: {
            video: "https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_1_25_11_preview.mp4",
            thumbnail: "https://joy1.videvo.net/videvo_files/video/free/2019-11/thumbnails/190301_1_25_11_small.jpg"
            ,
            title: "فيلم وثائقي عن حياة الأسود",
            views: 256

        }
    },
    {
        id: 3,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "image",
        content: {
            images: ["https://images.unsplash.com/photo-1605278613967-e098563bc55a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwbGlnaHR8ZW58MHx8MHx8&w=1000&q=80"]
        }
    },
    {
        id: 1,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "note",
        content: {
            text:
                `لمّا كان الاعتراف بالكرامة المتأصلة في جميع`
        },
    },
    {
        id: 3,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "image",
        content: {
            images: ["https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"]
        }
    },
   
    
    {
        id: 3,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "image",
        content: {
            images: ["https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-674010.jpg&fm=jpg"]
        }
    },
   
    {
        id: 3,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "image",
        content: {
            images: ["https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"]
        }
    },
   
    {

        id: 2,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "image",
        content: {
            images: [
                "https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg",
                "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
                "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-674010.jpg&fm=jpg",
                "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
            ]
        }
    },
    {
        id: 12,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "image",
        content: {
            images: ["https://images.unsplash.com/photo-1627240157575-b814f59c7f99?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHw%3D&w=1000&q=80"]
        }
    },




    {
        id: 13,
        user: {
            name: "تماني كريم",
            image: require("./illustrations/uknown.png")
        },
        type: "image",
        content: {
            images: ["https://images.unsplash.com/photo-1609919238287-d5af43b4a745?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHw%3D&w=1000&q=80"]
        }
    },









]

export default explore; 