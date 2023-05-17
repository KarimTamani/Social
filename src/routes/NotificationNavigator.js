class NotificationNavigatorClass {

    navigator = null;

    setTopLevelNavigator(ref) {
        this.navigator = ref;
    }


    handleNotificationClick(notification) {


        console.log("handling");

        const type = notification.data.type;


        if (!this.navigator)
            return;

        switch (type) {
            case "follow":

                this.navigator.navigate("Notifications", {
                    screen: "FollowsList",
                    params: {
                        notificationData: notification.data
                    }
                });
                break;


            case "post-like":
                this.navigator.navigate("Notifications", {
                    screen: "LikesList",
                    params: {
                        notificationData: notification.data
                    }
                });
                break;

            case "message":

                this.navigator.navigate("Conversation", { members: [ {user : JSON.parse(notification.data.user)}  ] });

                break;
            default:
                if (type == "post-comment" || type == "story-comment" || type == "comment-replay") {
                    this.navigator.navigate("Notifications", {
                        screen: "CommentsList",
                        params: {
                            notificationData: notification.data
                        }
                    });
                }
                break;
        }
    }
}




const NotificationNavigator = new NotificationNavigatorClass();


export {
    NotificationNavigator
}