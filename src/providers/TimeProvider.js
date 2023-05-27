
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ApolloContext } from "./ApolloContext";
import { gql } from "@apollo/client";

const TimeContext = createContext();


export const HOUR = 60;
export const DAY = HOUR * 24;
export const NOW = "الآن" ; 



export const  MONTHS = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
]; 
export const DAYS = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];
export default function TimeProvider({ children }) {

    const client = useContext(ApolloContext)
    const [serverTime, setServerTime] = useState(null);
    const [delta, setDelta] = useState(0);


    const timing = useMemo(() => ({
        getServerTime: async () => {
            return client.query({
                query: gql`
                query Query {
                    getCurrentTimeTamps
                }`
            }).then(response => {
                return response && response.data.getCurrentTimeTamps
            })
        },

        getLocalTime: () => {
            return new Date().getTime();
        },

        getTime: () => {
            return new Date().getTime() + delta;
        },

        getDeltaTime: (currentServerTime) => {
            if (!currentServerTime)
                return 0;
            else
                return currentServerTime - timing.getLocalTime();
        },


        isPeriodRequireCasting: (timetamps) => {
            // get current time relativily to the server
            // then subscract timestamps from the current time  .  
            const currentTime = timing.getTime();
            var periodTime = (currentTime - timetamps) / (1000 * 60);

            return (periodTime >= 3 * DAY)

        },


        getPeriod: (timetamps) => {

            // get current time relativily to the server
            // then subscract timestamps from the current time  .  
            const currentTime = timing.getTime();
            var periodTime = Math.trunc( (currentTime - timetamps) / (1000 * 60) );

            if (periodTime >= 3 * DAY) {
                return timing.castTime(timetamps)
            }
            if (periodTime >= 2 * DAY && periodTime < 3 * DAY) {
                return "يومين"
            }
            if (periodTime < 2 * DAY && periodTime >= DAY) {
                return "يوم"
            }

            var hourPeriod = Math.trunc(periodTime / HOUR);

            if (periodTime >= 11 * HOUR) {
                return `${hourPeriod} ساعة `
            }

            if (periodTime >= 3 * HOUR) {
                return `${hourPeriod} ساعات `
            }
            if (periodTime >= 2 * HOUR) {
                return "ساعتين"
            }

            if (periodTime >= HOUR) {
                return "ساعة"
            }

            if (periodTime >= 1) {
                return `${periodTime} د `
            }
            else {
                return NOW
            }

        },

        castTime: (timetamps) => {

            var currentTime = new Date(Number(timetamps));

            var dateString = DAYS[currentTime.getDay()] + ', ' + currentTime.getDate() + ' ' + MONTHS[currentTime.getMonth()] + ', ' + currentTime.getFullYear();

     
            return dateString;
        },



    }), []);


    useEffect(() => {
        (async () => {

            const time = await timing.getServerTime();

            if (time) {
                setServerTime(time);
                const detla = timing.getDeltaTime(time);
            }
        })();
    }
        , [])

    return (
        <TimeContext.Provider value={timing}>
            {children}
        </TimeContext.Provider>
    )
}




export const useTiming = () => {
    return useContext(TimeContext);
};