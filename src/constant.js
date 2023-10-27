export const ROUTE_INCHEON_1 = 1;
export const ROUTE_SEOUL_2 = 2;
export const ROUTE_OSONG_TEST = 3;
export const ROUTE_KTX_EXPRESS = 4;

export const STRING_ROUTE_INCHON = "인천 1호선";
export const STRING_ROUTE_SEOUL = "서울 2호선";
export const STRING_ROUTE_OSONG = "오송시험선";
export const STRING_ROUTE_GYEONGBU  = "KTX 경부고속선";

export const STRING_STATION = "STATION";
export const STRING_PATH = "PATH";

export const UP_TRACK = 1;
export const DOWN_TRACK = 2;
export const STRING_UP_TRACK = "T2";
export const STRING_UP_TRACK2 = "12";
export const STRING_UP_TRACK_LEFT = "T2L";
export const STRING_UP_TRACK_LEFT2 = "4";
export const STRING_UP_TRACK_RIGHT = "T2R";
export const STRING_UP_TRACK_RIGHT2 = "8";
export const STRING_DOWN_TRACK = "T1";
export const STRING_DOWN_TRACK2 = "3";
export const STRING_DOWN_TRACK_LEFT = "T1L";
export const STRING_DOWN_TRACK_LEFT2 = "1";
export const STRING_DOWN_TRACK_RIGHT = "T1R";
export const STRING_DOWN_TRACK_RIGHT2 = "2";

export const STRING_TRACK_DIR_LEFT = "LEFT";
export const STRING_TRACK_DIR_RIGHT = "RIGHT";

export const STRING_TRACK_SIDE_LEFT = "LEFT";
export const STRING_TRACK_SIDE_RIGHT = "RIGHT";

export const STRING_SHORT_MEASURE = "SHORT";
export const STRING_LONG_MEASURE = "LONG";

export const CHART_FORMAT_TODAY = 1;
export const CHART_FORMAT_DAILY = 2;
export const CHART_FORMAT_MONTHLY = 3;
export const CHART_FORMAT_RAW = 4;

export const STRING_RAIL_TEMPERATURE = "RAIL_TEMPERATURE";
export const STRING_TEMPERATURE = "TEMPERATURE";
export const STRING_HUMIDITY = "HUMIDITY";
export const STRING_KMA_TEMPERATURE = "KMA_TEMPERATURE";

export const STRING_WHEEL_LOAD_KEY = "WL_MAX"
export const STRING_LATERAL_LOAD_KEY = "LF"
export const STRING_STRESS_KEY = "STRESS"
export const STRING_HD_KEY = "HD"
export const STRING_VD_KEY = "VD"
export const STRING_ACC_KEY = "ACC"
export const STRING_SPEED_KEY = "SPEED"

export const STRING_HEIGHT = "HEIGHT";
export const STRING_DIRECTION = "DIRECTION";
export const STRING_CANT = "CANT";
export const STRING_RAIL_DISTANCE = "RAIL_DISTANCE";
export const STRING_DISTORTION = "DISTORTION";

export const STRING_SELECT_WEAR_CORRELATION_MGT = "mgt";
export const STRING_SELECT_WEAR_CORRELATION_RAILVAL = "railVal";

export const STRING_VERTICAL_WEAR = "VERTICAL";
export const STRING_CORNER_WEAR = "CORNER";

export const STRING_WEAR_MODEL_KP = "KP"; //누적통과톤수만 고려한 KP 별 선형회귀 예측
export const STRING_WEAR_MODEL_LOGI_LASSO = "LOGI_LASSO"; //레일특성변수사용, 로지스틱 LASSO
export const STRING_WEAR_MODEL_LOGI_STEPWISE = "LOGI_STEPWISE"; //레일특성변수사용, 로지스틱 Stepwise
export const STRING_WEAR_MODEL_LR_LASSO = "LR_LASSO"; //레일특성변수사용, 선형회귀 LASSO
export const STRING_WEAR_MODEL_LR_STEPWISE = "LR_STEPWISE"; //레일특성변수사용, 선형회귀 Stepwise
export const STRING_WEAR_MODEL_SVR = "SVR"; //레일특성변수사용, 머신러닝 SVM
export const STRING_WEAR_MODEL_RANDOM_FOREST = "RANDOM_FOREST"; //레일특성변수사용, 머신러닝 Random Forest
export const STRING_WEAR_MODEL_XGB = "XGB"; //레일특성변수사용, 머신러닝 XGBoost
export const STRING_WEAR_MODEL_LGBM = "LGBM"; //레일특성변수사용, 머신러닝 LightGBM
export const STRING_WEAR_MODEL_CAT_BOOST = "CAT_BOOST";//레일특성변수사용, 머신러닝 CatBoost

export const colors = [
  "#FF5733", "#33FF57", "#5733FF", "#FF33A6", 
  "#33FFC1", "#FFC133", "#3314FF", "#FF3370", 
  "#709C3B", "#703B9C", "#9C3B70", "#3B709C", 
  "#9C703B", "#3B9C70", "#8C703B", "#3B8C70", 
  "#7C703B", "#3B7C70", "#6C703B", "#3B6C70"
];

export const RANGEPICKERSTYLE = {
  height:"35px",
  fontFamily : 'NEO_R'
}
export const RADIO_STYLE = {
  fontFamily : 'NEO_R'
}
  
export const INSTRUMENTATIONPOINT = [];

export const BOXSTYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: "5px",
  //p: 4,
  padding : "5px",
  fontFamily : 'NEO_R'
};

export const RAIL_ROUGHNESS_BOXSTYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  //p: 4,
}

export const IncheonKP = {
  start : 589,
  end : 30814
}

export const seoulKP = {
  start : 0,
  end : 48961
}

export const DUMMY_RANGE = {
  '2021_1' : { start : "2021-01-01 00:00:00", end : "2021-03-31 23:59:59" },
  '2021_2' : { start : "2021-04-01 00:00:00", end : "2021-06-30 23:59:59" },
  '2021_3' : { start : "2021-07-01 00:00:00", end : "2021-09-30 23:59:59" },
  '2021_4' : { start : "2021-10-01 00:00:00", end : "2021-12-31 23:59:59" },
  '2022_1' : { start : "2022-01-01 00:00:00", end : "2022-03-31 23:59:59" },
  '2022_2' : { start : "2022-04-01 00:00:00", end : "2022-06-30 23:59:59" },
  '2022_3' : { start : "2022-07-01 00:00:00", end : "2022-09-30 23:59:59" },
  '2022_4' : { start : "2022-10-01 00:00:00", end : "2022-12-31 23:59:59" },
  '2023_1' : { start : "2023-01-01 00:00:00", end : "2023-03-31 23:59:59" },
  '2023_2' : { start : "2023-04-01 00:00:00", end : "2023-06-30 23:59:59" },
  '2023_3' : { start : "2023-07-01 00:00:00", end : "2023-09-30 23:59:59" },
  '2023_4' : { start : "2023-10-01 00:00:00", end : "2023-12-31 23:59:59" },  // 필요한 경우 2023년 4분기도 추가
};

export const EMPTY_MEASURE_OBJ = {
  left : {accMax : "",
    accMin : "",
    displayName : "",
    hd : "",
    kp : 0,
    lf : "", 
    measureSetId : "",
    railTrack : "",
    sensorId: "",
    speed : "",
    stress : "",
    stressMin : "",
    vd: "",
    wlMax: ""},
  right : {accMax : "",
    accMin : "",
    displayName : "",
    hd : "",
    kp : 0,
    lf : "", 
    measureSetId : "",
    railTrack : "",
    sensorId: "",
    speed : "",
    stress : "",
    stressMin : "",
    vd: "",
    wlMax: ""}
};