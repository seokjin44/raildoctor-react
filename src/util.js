import { DOWN_TRACK, UP_TRACK } from "./constant";

export const dateFormat = ( date ) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하기 때문에 +1이 필요합니다.
    const dd = String(date.getDate()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd}`;
}

export const convertToCustomFormat = (num) => {
    if (typeof num !== 'number' || num < 1000) {
        return 'Input should be a number greater than or equal to 1000';
    }

    let thousandPart = Math.floor(num / 1000);
    let remainderPart = num % 1000;
    
    let formattedRemainder = remainderPart.toString().padStart(3, '0'); // 0을 채워서 3자리 문자열로 만듭니다.
    
    return `${thousandPart}k${formattedRemainder}`;
}

export const findRange = (ranges, x, trackType) => {
    let start = 0;
    let end = ranges.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        let range = ranges[mid];
        let rangeStart = (trackType === UP_TRACK) ? range.start_station_up_track_location : range.end_station_up_track_location;
        let rangeEnd = (trackType === DOWN_TRACK) ? range.start_station_down_track_location : range.end_station_down_track_location;

        if (x >= rangeStart && x < rangeEnd) {
            return mid; // 범위를 찾았다면 해당 범위를 반환
        } else if (x < rangeStart) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }

    return null; // 범위를 찾지 못했을 경우 null 반환
}
