import { CHART_FORMAT_DAILY, CHART_FORMAT_MONTHLY, CHART_FORMAT_RAW, CHART_FORMAT_TODAY, DOWN_TRACK, STRING_ACC_KEY, STRING_DOWN_TRACK, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_HD_KEY, STRING_HUMIDITY, STRING_KMA_TEMPERATURE, STRING_LATERAL_LOAD_KEY, STRING_PATH, STRING_RAIL_TEMPERATURE, STRING_SPEED_KEY, STRING_STATION, STRING_STRESS_KEY, STRING_TEMPERATURE, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT, STRING_VD_KEY, STRING_VERTICAL_WEAR, STRING_WEAR_MODEL_CAT_BOOST, STRING_WEAR_MODEL_LGBM, STRING_WEAR_MODEL_LOGI_LASSO, STRING_WEAR_MODEL_LOGI_STEPWISE, STRING_WEAR_MODEL_LR_LASSO, STRING_WEAR_MODEL_LR_STEPWISE, STRING_WEAR_MODEL_RANDOM_FOREST, STRING_WEAR_MODEL_SVR, STRING_WEAR_MODEL_XGB, STRING_WHEEL_LOAD_KEY, UP_TRACK } from "./constant";
import axios from 'axios';
import qs from 'qs';
import Papa from 'papaparse';

export const dateFormat = ( date ) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하기 때문에 +1이 필요합니다.
    const dd = String(date.getDate()).padStart(2, '0');
    if( isNaN(yyyy) || isNaN(mm) || isNaN(dd) ){
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

export const convertObjectToArray = (obj, type) => {
    let format = ( key ) => {
      if( type === CHART_FORMAT_TODAY ){
        return formatTime(new Date(key));
      }else if( type === CHART_FORMAT_DAILY ){
        return formatDate(new Date(key));
      }else if( type === CHART_FORMAT_MONTHLY ){
        return formatYearMonth(new Date(key));
      }else if( type === CHART_FORMAT_RAW ){
        return formatDateTime(new Date(key));
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

export const trackToString = ( track ) => {
    if( track === STRING_UP_TRACK ||
     track === STRING_UP_TRACK_LEFT ||
     track === STRING_UP_TRACK_RIGHT ){
        return "상선";
    }else if( track === STRING_DOWN_TRACK ||
        track === STRING_DOWN_TRACK_LEFT ||
        track === STRING_DOWN_TRACK_RIGHT ){
        return "하선";
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
    let route = sessionStorage.getItem('route');
    axios.get(`https://raildoctor.suredatalab.kr/api/railroads/structures`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroadName : route,
        structureType : STRING_STATION
      }
    })
    .then(response => {
      let pathList = [];
      console.log(response.data.entities);
      let filterList = response.data.entities.filter(obj => obj.type === STRING_STATION);
      console.log(filterList);
      for( let i = 0; i < response.data.entities.length; i++ ){
        let section = response.data.entities[i];
        if( i < response.data.entities.length - 1 ){
            let nextSection = response.data.entities[i+1];
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
      let sumAry = [...pathList, ...response.data.entities];
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
                                    name: row['speed'] === '0' ? ' ' : ''
                                    /* name: "_" */
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