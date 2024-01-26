import { CHART_FORMAT_DAILY, CHART_FORMAT_MONTHLY, CHART_FORMAT_RAW, CHART_FORMAT_TODAY, DOWN_TRACK, STRING_ACC_KEY, STRING_DOWN_TRACK, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_HD_KEY, STRING_HUMIDITY, STRING_KMA_TEMPERATURE, STRING_LATERAL_LOAD_KEY, STRING_LONG_MEASURE, STRING_PATH, STRING_RAIL_TEMPERATURE, STRING_ROUTE_GYEONGBU, STRING_ROUTE_INCHON, STRING_ROUTE_OSONG, STRING_ROUTE_SEOUL, STRING_SHORT_MEASURE, STRING_SPEED_KEY, STRING_STATION, STRING_STRESS_KEY, STRING_TEMPERATURE, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT, STRING_VD_KEY, STRING_VERTICAL_WEAR, STRING_WEAR_MODEL_CAT_BOOST, STRING_WEAR_MODEL_LGBM, STRING_WEAR_MODEL_LOGI_LASSO, STRING_WEAR_MODEL_LOGI_STEPWISE, STRING_WEAR_MODEL_LR_LASSO, STRING_WEAR_MODEL_LR_STEPWISE, STRING_WEAR_MODEL_RANDOM_FOREST, STRING_WEAR_MODEL_SVR, STRING_WEAR_MODEL_XGB, STRING_WHEEL_LOAD_KEY, TRACK_DEVIATION_CAUTION, TRACK_DEVIATION_REPAIR, TRACK_DEVIATION_TARGET, UPLOAD_STATE_APPLYING, UPLOAD_STATE_APPLY_FAIL, UPLOAD_STATE_APPLY_SUCCESS, UPLOAD_STATE_CONVERTING, UPLOAD_STATE_CONVERT_FAIL, UPLOAD_STATE_CONVERT_SUCCESS, UPLOAD_STATE_UPLOADED, UP_TRACK } from "./constant";
import axios from 'axios';
import qs from 'qs';
import Papa from 'papaparse';

export const dateFormat = ( date ) => {
    let yyyy = '';
    let mm = '';
    let dd = '';
    try{
        yyyy = date.getFullYear();
        mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하기 때문에 +1이 필요합니다.
        dd = String(date.getDate()).padStart(2, '0');
        if( isNaN(yyyy) || isNaN(mm) || isNaN(dd) ){
            return '-';
        }
    }catch(e){
        return '-';
    }
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
    if (typeof num !== 'number' ) {
        return 'Input should be a number greater than or equal to 1000';
    }

    let thousandPart = Math.floor(num / 1000);
    let remainderPart = num % 1000;
    
    let formattedRemainder = remainderPart.toString().padStart(3, '0'); // 0을 채워서 3자리 문자열로 만듭니다.
    
    return `${thousandPart}K${formattedRemainder}`;
}

export const findRange = (ranges, x) => {
    let start = 0;
    let end = ranges.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        let range = ranges[mid];
        let rangeStart = range.beginKp * 1000;
        let rangeEnd = range.endKp * 1000;

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
    }else if( STRING_KMA_TEMPERATURE === value ){
        return "기상청온도";
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

const defaultData = { data: 0 };


const extractMonth = (isoString) => isoString.substring(0, 7); // YYYY-MM 형식
const extractDay = (isoString) => isoString.split('T')[0].split('-')[2];

// 일별 데이터를 그룹화하고 합치는 함수
const createDailyArray = (obj) => {
  const groupedData = {};

  Object.keys(obj).forEach(key => {
    const day = extractDay(key); // 일자만 추출
    if (!groupedData[day]) {
      groupedData[day] = { ...obj[key] }; // 새로운 일자면 데이터 초기화
    } else {
      // 이미 존재하는 일자면 데이터 합산 (단순 합산 예시)
      Object.keys(obj[key]).forEach(dataKey => {
        if (groupedData[day][dataKey]) {
          groupedData[day][dataKey] += obj[key][dataKey];
        } else {
          groupedData[day][dataKey] = obj[key][dataKey];
        }
      });
    }
  });

  // 그룹화된 데이터를 배열로 변환
  return Object.keys(groupedData).map(day => {
    return {
      time: day, // 일자만 포함
      ...groupedData[day]
    };
  }).sort((a, b) => a.time.localeCompare(b.time)); ;
};


// 월별 데이터 생성 함수 (여러 년도 데이터에서 동일 월 데이터 합산)
const createMonthlyArray = (obj) => {
    const dataByMonth = {};
  
    Object.keys(obj).forEach(key => {
      const monthOnly = extractMonth(key).substring(5); // MM 형식 (년도 무시)
  
      if (!dataByMonth[monthOnly]) {
        dataByMonth[monthOnly] = []; // 새로운 월이면 배열 초기화
      }
      dataByMonth[monthOnly].push(obj[key]);
    });
  
    // 월별로 데이터 집계 (여기서는 단순 합산 예시)
    const aggregatedData = Object.keys(dataByMonth).map(month => {
      const aggregated = dataByMonth[month].reduce((acc, curr) => {
        Object.keys(curr).forEach(key => {
          if (acc[key]) {
            acc[key] += curr[key];
          } else {
            acc[key] = curr[key];
          }
        });
        return acc;
      }, {});
  
      return {
        time: month, // 월만 표시
        ...aggregated
      };
    });
  
    return aggregatedData.sort((a, b) => a.time.localeCompare(b.time)); // 월별로 정렬
  };
  

export const convertObjectToArray = (obj, type) => {
    let format = ( key, type_ ) => {
      if( type_ === CHART_FORMAT_TODAY ){
        return formatTime(new Date(key));
      }else if( type_ === CHART_FORMAT_DAILY ){
        return formatDate(new Date(key));
      }else if( type_ === CHART_FORMAT_MONTHLY ){
        return formatYearMonth(new Date(key));
      }else if( type_ === CHART_FORMAT_RAW ){
        return formatDateTime(new Date(key));
      }
      return key;
    }

    if (type === CHART_FORMAT_DAILY) {
        return createDailyArray(obj, format);
    } else if (type === CHART_FORMAT_MONTHLY) {
        return createMonthlyArray(obj, format);
    }
    
    if( type === CHART_FORMAT_TODAY ){
        let sorting = Object.keys(obj).map(key => {
            return {
                datetime: format(key, CHART_FORMAT_RAW),
                time: format(key, CHART_FORMAT_TODAY),
                ...obj[key]
            };
        }).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        return sorting;
    }
    return Object.keys(obj).map(key => {
        return {
            time: format(key, type),
            ...obj[key]
        };
    }).sort((a, b) => new Date(a.time) - new Date(b.time));
}

export const convertObjectToArray_ = (obj, type, startDate, endDate) => {
    const format = (date) => {
        if (type === CHART_FORMAT_TODAY) {
            return formatTime(date);
        } else if (type === CHART_FORMAT_DAILY) {
            return formatDate(date);
        } else if (type === CHART_FORMAT_MONTHLY) {
            return formatYearMonth(date);
        } else if (type === CHART_FORMAT_RAW) {
            return formatDateTime(date);
        }
        return date.toISOString();
    };

    // 모든 키들을 추출하고 0으로 초기화된 객체를 생성
    const allKeys = Object.values(obj).reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});
    const defaultData = Object.keys(allKeys).reduce((acc, key) => {
        acc[key] = null;
        return acc;
    }, {});

    const resultObj = {};
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);

    // 이미 데이터가 있는 날짜들을 추출
    const existingDates = new Set(Object.keys(obj).map(key => key.slice(0, 10)));

    while (currentDate <= stopDate) {
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        const formattedDate = format(currentDate).slice(0, 10); // YYYY-MM-DD format

        if (!existingDates.has(formattedDate)) {
            /* resultObj[`${formattedDate}T00:00:00Z`] = { ...defaultData }; */
            let currentTime = dayStart;
            while (currentTime <= dayEnd) {
                const formattedTime = format(currentTime);
                resultObj[formattedTime] = { ...defaultData };
                currentTime.setMinutes(currentTime.getMinutes() + 5);
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const mergedData = {
        ...resultObj,
        ...obj
    };

    // Convert the merged object to the desired array format
    return Object.keys(mergedData).map(key => ({
        time: format(new Date(key)),
        ...mergedData[key]
    })).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};

  

export const intervalSample = (array, interval) => {
    const sampled = [];

    for (let i = 0; i < array.length; i += interval) {
        // 현재 구간의 최대값 및 최소값을 찾기 위한 슬라이스
        const slice = array.slice(i, i + interval);
        
        // 최대값을 가진 항목 찾기
        const maxItem = slice.reduce((max, curr) => {
            return curr['Roughness(mm)'] > max['Roughness(mm)'] ? curr : max;
        }, {'KP(m)': Number.MIN_SAFE_INTEGER, 'Roughness(mm)': Number.MIN_SAFE_INTEGER});
        
        // 최소값을 가진 항목 찾기
        const minItem = slice.reduce((min, curr) => {
            return curr['Roughness(mm)'] < min['Roughness(mm)'] ? curr : min;
        }, {'KP(m)': Number.MAX_SAFE_INTEGER, 'Roughness(mm)': Number.MAX_SAFE_INTEGER});

        sampled.push(maxItem);
        if (maxItem['KP(m)'] !== minItem['KP(m)'] || maxItem['Roughness(mm)'] !== minItem['Roughness(mm)']) {
            sampled.push(minItem);
        }
    }

    return sampled;
}
  
export const roundNumber = (num, decimalPlaces) => {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(num * multiplier) / multiplier;
}

export const transposeObjectToArray = (inputObj) => {
    let output = [];
    let keys = Object.keys(inputObj).filter(key => inputObj[key].length > 0);

    const length = inputObj[keys[0]].length;
    if (!keys.every(key => inputObj[key].length === length)) {
        throw new Error("All arrays inside the object must have the same length.");
    }

    for (let i = 0; i < inputObj[keys[0]].length; i++) {
        const obj = {};
        for (const key of keys) {
            obj[key] = inputObj[key][i];
        }
        output.push(obj);
    }

    return output;
}

export const getLastDateOfMonth = (month, year) => {
    // 다음 달의 첫 날짜를 구한 후 하루를 빼면 해당 월의 마지막 날짜를 얻을 수 있습니다.
    let date = new Date(year, month + 1, 0);
    return date;
}

export const getFirstDateOfThreeMonthsAgo = (month, year) => {
    // 3달 전을 계산합니다.
    month -= 3;
    if (month < 0) {
        month += 12;
        year -= 1;
    }
    // 계산된 3달 전의 월의 첫째 날을 반환합니다.
    let date = new Date(year, month, 1);
    return date;
}

export const trackToString = ( track, route ) => {
    if( track === STRING_UP_TRACK ||
     track === STRING_UP_TRACK_LEFT ||
     track === STRING_UP_TRACK_RIGHT ){
        return getTrackText("상선", route);
    }else if( track === STRING_DOWN_TRACK ||
        track === STRING_DOWN_TRACK_LEFT ||
        track === STRING_DOWN_TRACK_RIGHT ){
        return getTrackText("하선", route);
    }
    return "";
}

export const trackToString2 = ( track, route ) => {
    if( track === STRING_UP_TRACK ){
        return getTrackText("상선", route);
    }else if( track === STRING_UP_TRACK_LEFT ){
        return getTrackText("상선(좌)", route);
    }else if(track === STRING_UP_TRACK_RIGHT ){
        return getTrackText("상선(우)", route);
    }else if( track === STRING_DOWN_TRACK ){
        return getTrackText("하선", route);
    }else if( track === STRING_DOWN_TRACK_LEFT ){
        return getTrackText("하선(좌)", route);
    }else if( track === STRING_DOWN_TRACK_RIGHT ){
        return getTrackText("하선(우)", route);
    }
    return "";
}

export const trackLeftRightToString = ( track ) => {
    if( track === STRING_UP_TRACK_LEFT ||
        track === STRING_DOWN_TRACK_LEFT ){
        return "좌";
    }else if( track === STRING_UP_TRACK_RIGHT ||
              track === STRING_DOWN_TRACK_RIGHT ){
        return "우";
    }
    return "";
}

export const numberWithCommas = (x) => {
    try{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }catch(e){
        return "";
    }
}

export const mgtToM = (val) => {
    return Math.round(val / 1e6) + 'M'; // 3억을 300M로 변환 후 소수점 제거
}

export const filterArrays = (min, max, ...arrays) => {
    const reference = arrays[0];
    const filteredIndexes = [];
  
    // 첫 번째 배열에서 조건을 확인하여 해당 인덱스를 저장
    reference.forEach((value, index) => {
      if (value >= min && value <= max) { 
        filteredIndexes.push(index);
      }
    });
  
    // 필터링된 인덱스를 기반으로 각 배열을 필터링
    return arrays.map(array => filteredIndexes.map(index => array[index]));
}

export const textToNumber = (input) => {
    const units = {
        'K': 1000,
        'M': 1000000,
        'B': 1000000000
    };

    // 숫자일 경우 그대로 반환
    if (typeof input === 'number') {
        return input;
    }

    if (typeof input !== 'string') {
        throw new Error('Input is neither a string nor a number.');
    }

    // 예상하는 형식인지 확인하기 위한 정규 표현식
    const pattern = /^[0-9]+(\.[0-9]+)?[KMB]?$/i;
    if (!pattern.test(input)) {
        throw new Error('Invalid format.');
    }

    const unit = input.charAt(input.length - 1).toUpperCase();
    const number = unit in units ? parseFloat(input.slice(0, -1)) : parseFloat(input);

    return number * (units[unit] || 1);
}

export const numberToText = (value) => {
    if (value >= 1e9) return (value / 1e9) + 'B';
    if (value >= 1e6) return (value / 1e6) + 'M';
    if (value >= 1e3) return (value / 1e3) + 'K';
    return value.toString();
};

export const getRailroadSection = ( setRailroadSection ) =>{
    let route = getRoute();
    let param = {
        railroadName : route,
        structureType : STRING_STATION
    }
    if( route === STRING_ROUTE_SEOUL ){
        param['railTrack'] = STRING_UP_TRACK;
    }
    axios.get(`https://raildoctor.suredatalab.kr/api/railroads/structures`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : param
    })
    .then(response => {
      let pathList = [];
      console.log(response.data.entities);
      let filterList = response.data.entities.filter(obj => obj.type === STRING_STATION);
      let uniqueDisplayNames = new Set();
      filterList = filterList.filter(obj => {
        if (!uniqueDisplayNames.has(obj.displayName)) {
            uniqueDisplayNames.add(obj.displayName);
            return true;
        }
        return false;
      });
      filterList.sort(function(a, b) {
        return a.beginKp - b.beginKp;
      });
      
      console.log(filterList);
      for( let i = 0; i < filterList.length; i++ ){
        let section = filterList[i];
        if( i < filterList.length - 1 ){
            let nextSection = filterList[i+1];
            pathList.push({
                beginKp : section.endKp,
                endKp : nextSection.beginKp,
                start_station_name : section.displayName,
                end_station_name : nextSection.displayName,
                type : STRING_PATH,
                index : i
            });
        }
      }
      let sumAry = [...pathList, ...filterList];
      sumAry.sort((a, b) => a.beginKp - b.beginKp);
      let addIndexAry = sumAry.map((item, idx) => {
        return {
            ...item,
            index: idx
        };
    });
      setRailroadSection(addIndexAry);
    })
    .catch(error => console.error('Error fetching data:', error));   
}

export const getInchonSpeedData = ( setTrackSpeedData ) => {
    let speedData = [{trackType: 1, trackName : "상본선", data : []}, {trackType: -1, trackName : "하본선", data : []}];
    axios.all([
        axios.get("https://raildoctor.suredatalab.kr/resources/data/railroads/operatingspeed/incheon_1_t1.csv", { responseType: 'text' }),
        axios.get("https://raildoctor.suredatalab.kr/resources/data/railroads/operatingspeed/incheon_1_t2.csv", { responseType: 'text' })
      ])
      .then(axios.spread((response1, response2) => {
        // 두 요청이 모두 완료됐을 때 실행됩니다.
        /* console.log('Data 1:', response1.data);
        console.log('Data 2:', response2.data); */
        let csvData1 = response1.data;
        let csvData2 = response2.data;
        Papa.parse(csvData1, {
            header: true,  // 첫 번째 행을 헤더로 사용
            complete: function(result) {
                let modifiedData = result.data.map(row => {
                    if (row.hasOwnProperty('kp') && row.hasOwnProperty('speed')) {
                        let newRow = {
                            x: row['kp'],
                            y: row['speed'],
                            name: ''
                            /* name: "_" */
                        };
                        return newRow;
                    }
                    return row;
                });
                console.log(modifiedData);
                speedData[0].data  = modifiedData;
                /* setTrackSpeedData(speedData);
                console.log(speedData); */

                Papa.parse(csvData2, {
                    header: true,  // 첫 번째 행을 헤더로 사용
                    complete: function(result) {
                        let modifiedData = result.data.map(row => {
                            if (row.hasOwnProperty('kp') && row.hasOwnProperty('speed')) {
                                let newRow = {
                                    x: row['kp'],
                                    y: row['speed'],
                                    name: ''
                                };
                                return newRow;
                            }
                            return row;
                        });
                        console.log(modifiedData);
                        speedData[1].data  = modifiedData;
                        setTrackSpeedData(speedData);
                        console.log(speedData);
                    },
                  });

            },
        });
      }))
      .catch(error => {
        console.error('Error in one of the requests:', error);
    });
}

export const getSeoulSpeedData = ( setTrackSpeedData ) => {
    let speedData = [{trackType: 1, trackName : "내선순환", data : []}, {trackType: -1, trackName : "외선순환", data : []}];
    axios.all([
        axios.get("https://raildoctor.suredatalab.kr/resources/data/railroads/operatingspeed/seoul_2_t1.csv", { responseType: 'text' }),
        axios.get("https://raildoctor.suredatalab.kr/resources/data/railroads/operatingspeed/seoul_2_t2.csv", { responseType: 'text' })
      ])
      .then(axios.spread((response1, response2) => {
        // 두 요청이 모두 완료됐을 때 실행됩니다.
        /* console.log('Data 1:', response1.data);
        console.log('Data 2:', response2.data); */
        let csvData1 = response1.data;
        let csvData2 = response2.data;
        Papa.parse(csvData1, {
            header: true,  // 첫 번째 행을 헤더로 사용
            complete: function(result) {
                let modifiedData = result.data.map(row => {
                    if (row.hasOwnProperty('kp') && row.hasOwnProperty('speed')) {
                        let newRow = {
                            x: row['kp'],
                            y: row['speed'],
                            name: ''
                        };
                        return newRow;
                    }
                    if (row.hasOwnProperty('KP') && row.hasOwnProperty('speed')) {
                        let newRow = {
                            x: row['KP'],
                            y: row['speed'],
                            name: ''
                        };
                        return newRow;
                    }
                    return row;
                });
                console.log(modifiedData);
                speedData[0].data  = modifiedData;
                /* setTrackSpeedData(speedData);
                console.log(speedData); */

                Papa.parse(csvData2, {
                    header: true,  // 첫 번째 행을 헤더로 사용
                    complete: function(result) {
                        let modifiedData = result.data.map(row => {
                            if (row.hasOwnProperty('kp') && row.hasOwnProperty('speed')) {
                                let newRow = {
                                    x: row['kp'],
                                    y: row['speed'],
                                    name: ""
                                };
                                return newRow;
                            }
                            if (row.hasOwnProperty('KP') && row.hasOwnProperty('speed')) {
                                let newRow = {
                                    x: row['KP'],
                                    y: row['speed'],
                                    /* name: row['speed'] === '0' ? ' ' : '' */
                                    name: ""
                                };
                                return newRow;
                            }
                            return row;
                        });
                        console.log(modifiedData);
                        speedData[1].data  = modifiedData;
                        setTrackSpeedData(speedData);
                        console.log(speedData);
                    },
                  });

            },
        });
      }))
      .catch(error => {
        console.error('Error in one of the requests:', error);
    });
}

export const wearModelTableHeader1 = (model) => {
    if( model === STRING_WEAR_MODEL_LR_LASSO ||
        model === STRING_WEAR_MODEL_LR_STEPWISE ||
        model === STRING_WEAR_MODEL_XGB ||
        model === STRING_WEAR_MODEL_LGBM ||
        model === STRING_WEAR_MODEL_CAT_BOOST ){  
        return <>
            <div className="td value1 rowspan4"><div className="rowspan4">레일 예측마모량(mm)</div></div>
            <div className="td value1_1 rowspan4"></div>
            <div className="td value1_2 rowspan4"></div>
            <div className="td value1_3 rowspan4"></div>
        </>
    }else if( model === STRING_WEAR_MODEL_LOGI_LASSO ||
              model === STRING_WEAR_MODEL_LOGI_STEPWISE ){
        return <>
            <div className="td value1 rowspan5"><div className="rowspan5">레일 예측마모량(mm)</div></div>
            <div className="td value1_1 rowspan5"></div>
            <div className="td value1_2 rowspan5"></div>
            <div className="td value1_3 rowspan5"></div>
            <div className="td value1_4 rowspan5"></div>
        </>
    }else if( model === STRING_WEAR_MODEL_SVR ){
            return <>
                <div className="td value1 rowspan5"><div className="rowspan5">레일 예측마모량(mm)</div></div>
                <div className="td value1_1 rowspan5"></div>
                <div className="td value1_2 rowspan5"></div>
                <div className="td value1_3 rowspan5"></div>
                <div className="td value1_4 rowspan5"></div>
             </>
    }else if( model === STRING_WEAR_MODEL_RANDOM_FOREST ){
        return <>
            <div className="td value1 rowspan5"><div className="rowspan5">레일 예측마모량(mm)</div></div>
            <div className="td value1_1 rowspan5"></div>
            <div className="td value1_2 rowspan5"></div>
            <div className="td value1_3 rowspan5"></div>
            <div className="td value1_4 rowspan5"></div>
        </>
    }
}

export const wearModelTableHeader2 = (model) => {
    if( model === STRING_WEAR_MODEL_LR_LASSO ||
        model === STRING_WEAR_MODEL_LR_STEPWISE ||
        model === STRING_WEAR_MODEL_XGB ||
        model === STRING_WEAR_MODEL_LGBM ||
        model === STRING_WEAR_MODEL_CAT_BOOST ){  
        return <>
            <div className="td value1 ">선형회귀</div>
            <div className="td value1_1 ">XGBoost</div>
            <div className="td value1_2 ">LightGBM</div>
            <div className="td value1_3 ">CatBoost</div>
        </>
    }else if( model === STRING_WEAR_MODEL_LOGI_LASSO ||
              model === STRING_WEAR_MODEL_LOGI_STEPWISE ){
        return <>
            <div className="td value1 ">선형회귀</div>
            <div className="td value1_1 ">XGBoost</div>
            <div className="td value1_2 ">LightGBM</div>
            <div className="td value1_3 ">CatBoost</div>
            <div className="td value1_4 ">로지스틱</div>
        </>
    }else if( model === STRING_WEAR_MODEL_SVR ){
            return <>
                <div className="td value1 ">선형회귀</div>
                <div className="td value1_1 ">XGBoost</div>
                <div className="td value1_2 ">LightGBM</div>
                <div className="td value1_3 ">CatBoost</div>
                <div className="td value1_4 ">SVR</div>
            </>
    }else if( model === STRING_WEAR_MODEL_RANDOM_FOREST ){
        return <>
            <div className="td value1 ">선형회귀</div>
            <div className="td value1_1 ">XGBoost</div>
            <div className="td value1_2 ">LightGBM</div>
            <div className="td value1_3 ">CatBoost</div>
            <div className="td value1_4 ">랜덤포레스트</div>
        </>
    }
}


export const wearModelTableBody = (model, detail, mamo) => {
    if( model === STRING_WEAR_MODEL_LR_STEPWISE ){
        return <>
            <div className="td value1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLrStepwiseWear.toFixed(3) : detail.cornerLrStepwiseWear.toFixed(3) }</div>
            <div className="td value1_1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalXgbWear.toFixed(3) : detail.cornerXgbWear.toFixed(3) }</div>
            <div className="td value1_2 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLgbmWear.toFixed(3) : detail.cornerLgbmWear.toFixed(3) }</div>
            <div className="td value1_3 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalCatBoostWear.toFixed(3) : detail.cornerCatBoostWear.toFixed(3) }</div>
        </>
    }else if( model === STRING_WEAR_MODEL_LR_LASSO ||
        model === STRING_WEAR_MODEL_XGB ||
        model === STRING_WEAR_MODEL_LGBM ||
        model === STRING_WEAR_MODEL_CAT_BOOST ){  
        return <>
            <div className="td value1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLrLassoWear.toFixed(3) : detail.cornerLrLassoWear.toFixed(3) }</div>
            <div className="td value1_1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalXgbWear.toFixed(3) : detail.cornerXgbWear.toFixed(3) }</div>
            <div className="td value1_2 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLgbmWear.toFixed(3) : detail.cornerLgbmWear.toFixed(3) }</div>
            <div className="td value1_3 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalCatBoostWear.toFixed(3) : detail.cornerCatBoostWear.toFixed(3) }</div>
        </>
    }else if( model === STRING_WEAR_MODEL_LOGI_LASSO ){
        return <>
            <div className="td value1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLogiLassoWear.toFixed(3) : detail.cornerLogiLassoWear.toFixed(3) }</div>
            <div className="td value1_1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLrLassoWear.toFixed(3) : detail.cornerLrLassoWear.toFixed(3) }</div>
            <div className="td value1_2 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalXgbWear.toFixed(3) : detail.cornerXgbWear.toFixed(3) }</div>
            <div className="td value1_3 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLgbmWear.toFixed(3) : detail.cornerLgbmWear.toFixed(3) }</div>
            <div className="td value1_4 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalCatBoostWear.toFixed(3) : detail.cornerCatBoostWear.toFixed(3) }</div>
        </>
    }else if( model === STRING_WEAR_MODEL_LOGI_STEPWISE ){
        return <>
            <div className="td value1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLogiStepwiseWear.toFixed(3) : detail.cornerLogiStepwiseWear.toFixed(3) }</div>
            <div className="td value1_1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLrLassoWear.toFixed(3) : detail.cornerLrLassoWear.toFixed(3) }</div>
            <div className="td value1_2 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalXgbWear.toFixed(3) : detail.cornerXgbWear.toFixed(3) }</div>
            <div className="td value1_3 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLgbmWear.toFixed(3) : detail.cornerLgbmWear.toFixed(3) }</div>
            <div className="td value1_4 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalCatBoostWear.toFixed(3) : detail.cornerCatBoostWear.toFixed(3) }</div>
        </>
    }else if( model === STRING_WEAR_MODEL_SVR ){
            return <>
                <div className="td value1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalSvrWear.toFixed(3) : detail.cornerSvrWear.toFixed(3) }</div>
                <div className="td value1_1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLrLassoWear.toFixed(3) : detail.cornerLrLassoWear.toFixed(3) }</div>
                <div className="td value1_2 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalXgbWear.toFixed(3) : detail.cornerXgbWear.toFixed(3) }</div>
                <div className="td value1_3 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLgbmWear.toFixed(3) : detail.cornerLgbmWear.toFixed(3) }</div>
                <div className="td value1_4 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalCatBoostWear.toFixed(3) : detail.cornerCatBoostWear.toFixed(3) }</div>
            </>
    }else if( model === STRING_WEAR_MODEL_RANDOM_FOREST ){
        return <>
            <div className="td value1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalRandomForestWear.toFixed(3) : detail.cornerRandomForestWear.toFixed(3) }</div>
            <div className="td value1_1 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLrLassoWear.toFixed(3) : detail.cornerLrLassoWear.toFixed(3) }</div>
            <div className="td value1_2 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalXgbWear.toFixed(3) : detail.cornerXgbWear.toFixed(3) }</div>
            <div className="td value1_3 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalLgbmWear.toFixed(3) : detail.cornerLgbmWear.toFixed(3) }</div>
            <div className="td value1_4 ">{(mamo === STRING_VERTICAL_WEAR)? detail.verticalCatBoostWear.toFixed(3) : detail.cornerCatBoostWear.toFixed(3) }</div>
        </>
    }
}

export const valueOneOrNone = ( value )=>{
    if( !value || value === undefined || value === null || value === ""  ){
        return '-'
    }
    return '1'
}

export const getYear2Length = (date) => {
    try{
        const fullYear = date.getFullYear().toString();
        const lastTwoDigits = fullYear.slice(-2);
        return lastTwoDigits;
    }catch(e){
        return "";
    }
}

export const deleteObjData = ( data, sensorId ) => {
      for (let date in data) {
        for (let key in data[date]) {
          if (key.includes(sensorId)) {
            delete data[date][key];
          }
        }
      }
}

export const nonData = (value) => {
    if( value === "NaN" ){
        return "-";
    }
    return value;
}


export const deleteNonObj = (data) => {
    for (const key in data) {
        if (Object.keys(data[key]).length === 0 && data[key].constructor === Object) {
            delete data[key];
        }
    }
}

export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

export const getYearStartEnd = (year) => {
    const startDate = new Date(year, 0, 1);  // 0은 1월을 의미합니다. JavaScript의 월은 0부터 시작합니다.
    const endDate = new Date(year, 11, 31);  // 11은 12월을 의미합니다.
  
    return {
      start: startDate,
      end: endDate
    };
}

export const checkDateFormat = (str) => {
    const yearMonthPattern = /^\d{4}-\d{2}$/;
    const yearMonthDayPattern = /^\d{4}-\d{2}-\d{2}$/;

    if (yearMonthPattern.test(str)) {
        return 'yyyy-mm';
    } else if (yearMonthDayPattern.test(str)) {
        return 'yyyy-mm-dd';
    } else {
        return 'unknown format';
    }
}
export const convertQuarterFormat = (input) => {
    // 정규식을 사용하여 문자열을 검색합니다.
    const regex = /(\d{4})_(\d)/;
    // 정규식에 맞는 부분을 치환합니다.
    const replaced = input.replace(regex, (match, p1, p2) => `${p1}년 ${p2}분기`);
    return replaced;
  }

export const findClosestX = (arr, target) => {
    if( arr.length < 1 ){
        return arr;
    }
    return arr.reduce((prev, curr) => {
        return (Math.abs(curr.x - target) < Math.abs(prev.x - target) ? curr : prev);
    });
}

export const getQuarterFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth(); // 월은 0부터 시작하므로 1을 더해야 합니다.
    const quarter = Math.floor((month / 3)) + 1; // 월을 3으로 나누고 내림하여 분기를 구합니다.
    
    return {
        label: `${year}년 ${quarter}분기`,
        value: `${year}_${quarter}`
      };
}

export const getStartEndDatesFromQuarter = (yearQuarter) => {
    const [year, quarter] = yearQuarter.split('_').map(Number); // 연도와 분기를 분리하고 숫자로 변환합니다.
  
    // 분기의 시작 월과 끝 월을 계산합니다.
    const startMonth = (quarter - 1) * 3; // 분기 시작 월 (0, 3, 6, 9)
    const endMonth = startMonth + 2; // 분기 끝 월 (2, 5, 8, 11)
  
    // Date 객체를 사용하여 날짜를 생성합니다.
    const startDate = new Date(year, startMonth, 1); // 분기 시작 날짜
    const endDate = new Date(year, endMonth + 1, 0); // 분기 끝 날짜
  
    // 날짜를 YYYY-MM-DD 형식의 문자열로 포맷합니다.
    const startDateFormat = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} 00:00:00`;
    const endDateFormat = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 23:59:59`;
  
    return { start: startDateFormat, end: endDateFormat };
}

export const measureTypeText = (val) => {
    if( val === STRING_SHORT_MEASURE ){
       return "단기"
    }else if( val === STRING_LONG_MEASURE ){
        return "장기"
    }
    return '';
}

export const zeroToNull = (val) => {
    if(val === 0){
        return null;
    }
    return val
}

export const findJustSmallerKey = (myMap, targetKey) => {
    // Map에서 키를 추출하고 정렬
    let keys = Array.from(myMap.keys()).sort();
    // 주어진 키보다 바로 작은 키를 찾습니다.
    let targetIndex = keys.indexOf(targetKey);
    
    // 찾은 키가 배열의 시작이 아니면 이전 키를 가져옵니다.
    if (targetIndex > 0) {
      let justSmallerKey = keys[targetIndex - 1];
      return myMap.get(justSmallerKey);
    }
    // 주어진 키가 가장 작은 키거나, 키가 없는 경우
    return undefined;
  }
  
export const convertDates = (dataArray) => {
    // 배열에서 가장 날짜가 이른 데이터 포인트를 기준 날짜로 설정합니다.
    const baseDate = new Date(Math.min(...dataArray.map(item => new Date(item.ts).getTime() + (9 * 60 * 60 * 1000))));
    // '2000-01-01'을 새 기준 날짜로 설정합니다.
    const newBaseDate = new Date('2000-01-01T00:00:00+09:00');
  
    // 기준 날짜의 자정을 기준으로 합니다.
    const baseDateAtMidnight = new Date(baseDate);
    baseDateAtMidnight.setHours(0, 0, 0, 0);
  
    // 모든 날짜를 변환합니다.
    return dataArray.map(item => {
      const currentItemDate = new Date(item.ts);
      // UTC 타임스탬프를 한국 시간대로 변환합니다.
      const kstDate = new Date(currentItemDate.getTime() + (9 * 60 * 60 * 1000));
  
      // 기준 날짜의 자정과 현재 아이템 날짜의 자정 사이의 밀리초 차이를 계산합니다.
      const diff = kstDate - baseDateAtMidnight;
      // 차이를 일수로 변환합니다.
      const diffDays = Math.floor(diff / (24 * 3600 * 1000));
  
      // 새 기준 날짜로부터의 일수 차이를 계산합니다.
      const newDate = new Date(newBaseDate);
      newDate.setDate(newDate.getDate() + diffDays);
  
      // 현재 아이템의 시간을 유지합니다.
      newDate.setHours(kstDate.getHours(), kstDate.getMinutes(), kstDate.getSeconds(), kstDate.getMilliseconds());
  
      // 새로운 날짜와 기존 데이터를 결합하여 반환합니다.
      return {
        ...item,
        ts: newDate.toISOString()
      };
    });
  }
  
  
export const flattenTreeData = (data, parentId = null) => {
    let result = [];

    data.forEach(item => {
        let newItem = { ...item, ...{datumId: item.datumId, parentId: parentId} };
        result.push(newItem);

        if (item.convertedFiles && item.convertedFiles.length) {
            item.convertedFiles.forEach(childItem => {
                let childData = [{ datumId: childItem, convertedFiles: [], fileName : childItem.split('/').pop() }];
                // 재귀 호출
                result = result.concat(flattenTreeData(childData, item.datumId));
            });
        }
    });

    return result;
}

export const uploadState = ( val ) => {
    if( val === UPLOAD_STATE_UPLOADED ){
        return "업로드 완료"
    }else if( val === UPLOAD_STATE_CONVERTING ){
        return "변환 중"
    }else if( val === UPLOAD_STATE_CONVERT_FAIL ){
        return "변환 실패"
    }else if( val === UPLOAD_STATE_CONVERT_SUCCESS ){
        return "변환 성공"
    }else if( val === UPLOAD_STATE_APPLYING ){
        return "시스템에 반영 중"
    }else if( val === UPLOAD_STATE_APPLY_FAIL ){
        return "반영 실패"
    }else if( val === UPLOAD_STATE_APPLY_SUCCESS ){
        return "반영 성공";
    }
    return "";
}

export const curPagingCheck = (val, total) => {
    if( val > total ){
        return total;
    }
    return val
}

/* export const trackDeviationText = () => {
    export const STRING_HEIGHT = "HEIGHT";
    export const STRING_DIRECTION = "DIRECTION";
    export const STRING_CANT = "CANT";
    export const STRING_RAIL_DISTANCE = "RAIL_DISTANCE";
    export const STRING_DISTORTION = "DISTORTION";
} */

export const getTrackText = (val, route) => {
    let replaceText = val;
    if( route === STRING_ROUTE_SEOUL ){
        replaceText = replaceText.replace('상선', '내선');
        replaceText = replaceText.replace('하선', '외선');
        replaceText = replaceText.replace('상하선', '내외선');
    }
    return replaceText;
}

export const getTrackColor = (route) => {
    if( route === STRING_ROUTE_INCHON ){
        return '#0052A4';
    }else if( route === STRING_ROUTE_SEOUL ){
        return '#00A84D';
    }else if( route === STRING_ROUTE_OSONG ){
        return 'linear-gradient(0deg, rgba(56,119,176,1) 0%, rgba(113,168,218,1) 35%, rgba(142,186,226,1) 100%)';
    }else if( route === STRING_ROUTE_GYEONGBU ){
        return 'linear-gradient(0deg, rgba(56,119,176,1) 0%, rgba(113,168,218,1) 35%, rgba(142,186,226,1) 100%)';
    }
    return '';
}

export const getTrackDeviationAlarmText = (thresholdType, thresholdValue, value) => {
    /* console.log(thresholdType, thresholdValue, value);
    if (thresholdValue > 0 && value > thresholdValue) {
        if( thresholdType === TRACK_DEVIATION_TARGET ) { //목표
            return "목표 초과";
        }else if( thresholdType === TRACK_DEVIATION_CAUTION ) { //주의
            return "주의 초과";
        }else if( thresholdType === TRACK_DEVIATION_REPAIR ) { //보수
            return "보수 초과";
        }
    } else if (thresholdValue < 0 && value < thresholdValue) { */
        if( thresholdType === TRACK_DEVIATION_TARGET ) { //목표
            return "목표 초과";
        }else if( thresholdType === TRACK_DEVIATION_CAUTION ) { //주의
            return "주의 초과";
        }else if( thresholdType === TRACK_DEVIATION_REPAIR ) { //보수
            return "보수 초과";
        }
    /* } */
}

export const getTrackDeviationAlarmClass = (thresholdType, thresholdValue, value) => {
    /* if (thresholdValue > 0 && value > thresholdValue) {
        if( thresholdType === TRACK_DEVIATION_TARGET ) { //목표
            return "target";
        }else if( thresholdType === TRACK_DEVIATION_CAUTION ) { //주의
            return "caution";
        }else if( thresholdType === TRACK_DEVIATION_REPAIR ) { //보수
            return "repair";
        }
    } else if (thresholdValue < 0 && value < thresholdValue) { */
        if( thresholdType === TRACK_DEVIATION_TARGET ) { //목표
            return "target";
        }else if( thresholdType === TRACK_DEVIATION_CAUTION ) { //주의
            return "caution";
        }else if( thresholdType === TRACK_DEVIATION_REPAIR ) { //보수
            return "repair";
        }
    /* } */
}

export const transformData = (data) => {
    const transformed = {};
    const baseDate = new Date(Date.UTC(2000, 0, 1)); // 기준 날짜를 UTC 기준으로 설정
    let additionalHours = 0;
    const sortedData = Object.entries(data).sort(([dateTimeA], [dateTimeB]) => dateTimeA.localeCompare(dateTimeB));
    sortedData.forEach(([dateTime, values]) => {
        const [dateStr, timeStr] = dateTime.split('T');
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);

        // UTC 기준으로 날짜 객체 생성
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
        let time = date.getUTCHours() * 100 + date.getUTCMinutes();

        // 다음 날짜로 넘어갈 때마다 24시간을 더함
        if (date.getUTCDate() !== baseDate.getUTCDate()) {
            baseDate.setUTCDate(date.getUTCDate());
            baseDate.setUTCMonth(date.getUTCMonth());
            baseDate.setUTCFullYear(date.getUTCFullYear());
            additionalHours += 2400;
        }
        time += additionalHours;

        // 동일한 시간대의 값들을 하나의 객체로 합침
        if (!transformed[time]) {
            transformed[time] = { ...values };
        } else {
            Object.keys(values).forEach(key => {
                transformed[time][key] = (transformed[time][key] || 0) + values[key];
            });
        }
    });

    // 시간 순으로 정렬하여 배열로 변환
    return Object.entries(transformed).map(([time, value]) => ({ time: parseInt(time), ...value }))
        .sort((a, b) => a.time - b.time);
}

export const convertToCSV = data => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row).join(',')
    ).join('\n');
  
    return [headers].concat(rows).join('\n');
};

export const downloadCSV = (csvData, filename) => {
    const blob = new Blob(["\uFEFF" + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
  
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const transformDataKeys = (data, keyMapping) => {
    return data.map(item => {
      const newItem = {};
      Object.keys(item).forEach(key => {
        const newKey = keyMapping[key] || key; // 매핑된 키가 없으면 원래 키를 사용
        newItem[newKey] = item[key];
      });
      return newItem;
    });
  };

  
export const convertBytesToMB = (bytes) => {
    return parseFloat((bytes / 1024 / 1024).toFixed(2));
} 
  
export const getRoute = () => {
    let route = sessionStorage.getItem('route');
    if( !route ){
        return STRING_ROUTE_INCHON;
    }else {
        return route;
    }
}

export const getFileExtension = (filename) => {
    // 마지막 점을 기준으로 문자열을 나누고 마지막 부분을 반환
    return filename.split('.').pop();
}

export const getQuarterStartAndEndDate = (date) => {
    // 연도와 월을 추출합니다.
    const year = date.getFullYear();
    const month = date.getMonth();

    let startMonth;
    let endMonth;

    // 해당 월을 기반으로 분기의 시작 월과 끝 월을 결정합니다.
    if (month < 3) {
        startMonth = 0; // 1월
        endMonth = 2; // 3월
    } else if (month < 6) {
        startMonth = 3; // 4월
        endMonth = 5; // 6월
    } else if (month < 9) {
        startMonth = 6; // 7월
        endMonth = 8; // 9월
    } else {
        startMonth = 9; // 10월
        endMonth = 11; // 12월
    }

    // 분기의 시작 날짜와 끝 날짜를 구합니다.
    const startDate = new Date(year, startMonth, 1, 0, 0, 0);
    const endDate = new Date(year, endMonth + 1, 0, 23, 59, 59);

    console.log(`분기 시작 날짜: ${startDate}, 분기 끝 날짜: ${endDate}`);
    return { startDate, endDate };
}
