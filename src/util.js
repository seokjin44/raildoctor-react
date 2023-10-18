import { CHART_FORMAT_DAILY, CHART_FORMAT_MONTHLY, CHART_FORMAT_TODAY, DOWN_TRACK, STRING_ACC_KEY, STRING_DOWN_TRACK, STRING_HD_KEY, STRING_HUMIDITY, STRING_LATERAL_LOAD_KEY, STRING_RAIL_TEMPERATURE, STRING_SPEED_KEY, STRING_STRESS_KEY, STRING_TEMPERATURE, STRING_UP_TRACK, STRING_VD_KEY, STRING_WHEEL_LOAD_KEY, UP_TRACK } from "./constant";

export const dateFormat = ( date ) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하기 때문에 +1이 필요합니다.
    const dd = String(date.getDate()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd}`;
}

export const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

export const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    return day;
}

export const formatYearMonth = (date) => {
    const year = String(date.getFullYear()).slice(-2); // 년도의 마지막 두 자리만 가져옵니다.
    const month = String(date.getMonth() + 1).padStart(2, '0'); // JavaScript에서 getMonth()는 0부터 11까지의 값을 반환하므로 1을 더해줍니다.
    return `${year}-${month}`;
}

//1000단위 KP를 1K000 으로 바꺼줌
export const convertToCustomFormat = (num) => {
    num = Math.floor(num);
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
        let rangeStart = (trackType === UP_TRACK) ? range.start_station_up_track_location : range.start_station_down_track_location;
        let rangeEnd = (trackType === DOWN_TRACK) ? range.end_station_down_track_location : range.end_station_up_track_location;

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

export const findAddedItems =(oldArray, newArray) => {
    const addedItems = newArray.filter(item => !oldArray.includes(item));
    return addedItems;
}

export const trackDataName = ( value ) => {
    if( STRING_WHEEL_LOAD_KEY === value ){
        return "윤중";
    }else if( STRING_LATERAL_LOAD_KEY === value ){
        return "횡압";
    }else if( STRING_STRESS_KEY === value ){
        return "레일저부응력";
    }else if( STRING_HD_KEY === value ){
        return "레일수평변위";
    }else if( STRING_VD_KEY === value ){
        return "레일수직변위";
    }else if( STRING_ACC_KEY === value ){
        return "레일수직가속도";
    }else if( STRING_SPEED_KEY === value ){
        return "열차속도";
    }else{
        return "";
    }
}

export const tempDataName = ( value ) => {
    if( STRING_RAIL_TEMPERATURE === value ){
        return "레일온도";
    }else if( STRING_TEMPERATURE === value ){
        return "대기온도";
    }else if( STRING_HUMIDITY === value ){
        return "대기습도";
    }else{
        return "";
    }
}

export const convertToNumber = (inputStr) => {
    // "K"를 "."로 바꾸고, 숫자로 파싱
    const convertedStr = inputStr.replace('K', '.');
    return parseFloat(convertedStr);
}

export const convertToNumber2 = (inputStr) => {
    // "K"를 "."로 바꾸고, 숫자로 파싱
    const convertedStr = inputStr.replace('K', '.');
    return parseFloat(convertedStr * 1000);
}

export const trackNumberToString = ( number ) => {
    if( UP_TRACK === number ){
        return STRING_UP_TRACK;
    }else if( DOWN_TRACK === number ){
        return STRING_DOWN_TRACK;
    }
}

export const convertObjectToArray = (obj, type) => {
    let format = ( key ) => {
      if( type === CHART_FORMAT_TODAY ){
        return formatTime(new Date(key));
      }else if( type === CHART_FORMAT_DAILY ){
        return formatDate(new Date(key));
      }else if( type === CHART_FORMAT_MONTHLY ){
        return formatYearMonth(new Date(key));
      }
      return key;
    }
    return Object.keys(obj).map(key => {
        return {
            time: format(key),
            ...obj[key]
        };
    });
  }
