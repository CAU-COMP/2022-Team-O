import moment from "moment-timezone";

export function DayOrNight(){
    const krTimeHr = parseInt(moment().tz("Asia/Seoul").format('H'));
    if(krTimeHr < 9 || krTimeHr >= 22) return "Night";
    else return "Day";
}