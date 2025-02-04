export function convertToIsoString(hour:number,min:number,sec:number,period:'AM' | 'PM') {
    let hours = hour;
    if(period === 'PM' && hour < 12) {
        hours += 12;
    } else if(period === 'AM' && hours === 12) {
        hours = 0
    }

    const date = new Date()

    date.setHours(hours,min,sec,0)

    return date.toDateString();
}  