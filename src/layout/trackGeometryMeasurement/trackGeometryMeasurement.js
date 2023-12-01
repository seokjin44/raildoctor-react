import "./trackGeometryMeasurement.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, 
  ScatterChart, Scatter, Label
} from 'recharts';
import { Checkbox, DatePicker, Input, Radio, Select } from "antd";
import { CHART_FORMAT_DAILY, CHART_FORMAT_MONTHLY, CHART_FORMAT_TODAY, EMPTY_MEASURE_OBJ, INSTRUMENTATIONPOINT, RANGEPICKERSTYLE, STRING_ACC_KEY, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_HD_KEY, STRING_LATERAL_LOAD_KEY, STRING_LONG_MEASURE, STRING_SHORT_MEASURE, STRING_SPEED_KEY, STRING_STRESS_KEY, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT, STRING_VD_KEY, STRING_WHEEL_LOAD_KEY, TRACK_GEO_LOADING_TEXT, colors } from "../../constant";
import PlacePosition from "../../component/PlacePosition/PlacePosition";
import axios from 'axios';
import qs from 'qs';
import { checkDateFormat, convertDates, convertObjectToArray, convertToCustomFormat, dateFormat, deleteNonObj, deleteObjData, findRange, formatTime, getFirstDateOfThreeMonthsAgo, getRailroadSection, getYearStartEnd, isEmpty, measureTypeText, numberToText, trackDataName, trackLeftRightToString, valueOneOrNone } from "../../util";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CloseIcon from "../../assets/icon/211650_close_circled_icon.svg";
import lodash from "lodash";
import EmptyImg from "../../assets/icon/empty/empty5.png";
import LoadingImg from "../../assets/icon/loading/loading.png";
import moment from "moment";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

/* let dataExitsDate = {}; */
let todayChartDataObj = {};
let dailyChartDataObj = {};
let monthlyChartDataObj = {};
let calendarDate = new Date();
let pointsInfo = {};
let longMeasureSneosrInfo = {};
let shortMeasureSneosrInfo = {};
let colorIndex = 1;
function TrackGeometryMeasurement( props ) {
  const [selectedPath, setSelectedPath] = useState({
    start_station_name : "",
    end_station_name : "",
    beginKp : 0,
    endKp : 0,
  });
  const [dataExits, setDataExits] = useState([]);
  const [upLeftTrackPoint, setUpLeftTrackPoint] = useState([]); //상선좌포인트
  const [upRightTrackPoint, setUpRightTrackPoint] = useState([]); //상선우포인트
  const [downLeftTrackPoint, setDownLeftTrackPoint] = useState([]); //하선좌포인트
  const [downRightTrackPoint, setDownRightTrackPoint] = useState([]); //하선우포인트

  const [shortMeasureList, setShortMeasureList] = useState([]); //단기계측
  const [longMeasureList, setLongMeasureList] = useState([]); //장기계측

  const [tableViewShortSensorList, setTableViewShortSensorList] = useState([]); //테이블에 보여지는 단기계측
  const [tableViewLongSensorList, setTableViewLongSensorList] = useState([]); //테이블에 보여지는 장기계측

  const [searchRangeDate, setSearchRangeDate] = useState([]);
  const [selectPoints, setSelectPoints] = useState([]);
  const [viewMeasureDate, setViewMeasureDate] = useState(null);
  const [selectMeasureDate, setSelectMeasureDate] = useState(new Date());
  /* const [selectMeasureTime, setSelectMeasureTime] = useState(""); */
  const [findDatas, setFindDatas] = useState("");

  const [poinsts, setPoints] = useState([]);
  const [selectPoint, setSelectPoint] = useState("");

  const [toDayChartData, setToDayChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [MonthlyChartData, setMonthlyChartData] = useState([]);

  const [todayChartseries, setTodayChartseries] = useState([]);
  const [dailyChartseries, setDailyChartseries] = useState([]);
  const [monthlyChartseries, setMonthlyChartseries] = useState([]);

  const [dataExitsDate, setDataExitsDate] = useState({});

  const [railroadSection, setRailroadSection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('month');

  const [selectViewMeasure, setSelectViewMeasure] = useState([STRING_SHORT_MEASURE, STRING_LONG_MEASURE]);

  const disabledDate = (current) => {
    return !dataExitsDate[dateFormat(current.$d)];
  };

  const pathClick = (select) => {
    console.log("pathClick");
    console.log(select);
    setSelectedPath(select);
    let route = sessionStorage.getItem('route');
    let param = {
      params : {
        railroad : route,
        begin : select.start_station_name,
        end : select.end_station_name
      },
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/locations', param )
    .then(response => {
      console.log(response.data);
      let dataArr = [];
      railroadSection.forEach( data => {
        dataArr.push(0);
      })

      let measureSets = response.data.measureSets;
      let dataExits_ = [...dataArr];

      let upLeftTrackPoint_ = [];
      let upRightTrackPoint_ = [];
      let downLeftTrackPoint_ = [];
      let downRightTrackPoint_ = [];

      let shortMeasureList_ = [];
      let longMeasureList_ = [];

      for( let measureSet of measureSets ){

        if( measureSet.measureType === STRING_SHORT_MEASURE ){
          shortMeasureList_.push(measureSet);
        }else if( measureSet.measureType === STRING_LONG_MEASURE ){
          longMeasureList_.push(measureSet);
        }

        /*
        !sensor Obj!
        accMax : "string"
        accMin : "string"
        displayName : "Point 1"
        hd : "string"
        kp : 0
        lf : "string"
        measureSetId : "0825960e-0755-4e17-99b8-6f78651c35f4"
        railTrack : "T1R"
        sensorId : "9397149e-ba93-4573-b08f-18a417e2c172"
        speed : "string"
        stress : "string"
        stressMin : "string"
        vd : "string"
        wlMax : "string"
        */
        console.log(measureSet.sensors);
        for( let sensor of measureSet.sensors ){
          let index = -1;
          sensor['measureType'] = measureSet.measureType;
          index = findRange(railroadSection, sensor.kp * 1000);
  
          if( sensor.railTrack === STRING_UP_TRACK_LEFT ){
            upLeftTrackPoint_.push(sensor);
          }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ){
            upRightTrackPoint_.push(sensor);
          }else if( sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
            downLeftTrackPoint_.push(sensor);
          }else if( sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
            downRightTrackPoint_.push(sensor);
          }
  
          dataExits_[index]++;
        }
      }
      /* setDataExits(dataExits_); */
      setUpLeftTrackPoint(upLeftTrackPoint_); 
      setUpRightTrackPoint(upRightTrackPoint_); 
      setDownLeftTrackPoint(downLeftTrackPoint_); 
      setDownRightTrackPoint(downRightTrackPoint_); 
      setShortMeasureList(shortMeasureList_);
      setLongMeasureList(longMeasureList_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const pathMeasurefind = () => {
    let poinsts_ = [];
    pointsInfo = {};
    let shortMeasureList_ = [...shortMeasureList];
    let longMeasureList_ = [...longMeasureList];
    let tableViewShortMeasureObj = {};
    let tableViewLongMeasureObj = {};
    let startKP = selectedPath.beginKp;
    let endKP = selectedPath.endKp;

    for( let measure of shortMeasureList_ ){
      for( let sensor of measure.sensors ){
        let kp = sensor.kp * 1000;
        if( kp >= startKP && kp <= endKP ){
          //sensor select box
          poinsts_.push({
            label : `${convertToCustomFormat(kp)}(${trackLeftRightToString(sensor.railTrack)})-${measureTypeText(sensor.measureType)}`,
            value : sensor.sensorId
          });
          if( !tableViewShortMeasureObj[convertToCustomFormat(kp)] ){
            tableViewShortMeasureObj[convertToCustomFormat(kp)] = lodash.cloneDeep(EMPTY_MEASURE_OBJ);
          }

          //table
          if(sensor.railTrack === STRING_UP_TRACK_LEFT || 
             sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
              tableViewShortMeasureObj[convertToCustomFormat(kp)].left = sensor;
          }else if(sensor.railTrack === STRING_UP_TRACK_RIGHT || 
                   sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
              tableViewShortMeasureObj[convertToCustomFormat(kp)].right = sensor;
          }

          //sensor
          if( !pointsInfo[sensor.sensorId] ){
            console.log();
            pointsInfo[sensor.sensorId] = sensor;
            pointsInfo[sensor.sensorId].measureDate = {};
          }

          /* if( !pointsInfo[sensor.sensorId].measureDate[dateFormat(new Date(measure.measureTs))] ){
            pointsInfo[sensor.sensorId].measureDate[dateFormat(new Date(measure.measureTs))] = [];
          }
          pointsInfo[sensor.sensorId].measureDate[dateFormat(new Date(measure.measureTs))].push(measure.measureTs); */
        }
      };
    }
    for( let measure of longMeasureList_ ){
      for( let sensor of measure.sensors ){
        let kp = sensor.kp * 1000;
        if( kp >= startKP && kp <= endKP ){
          poinsts_.push({
            label : `${convertToCustomFormat(kp)}(${trackLeftRightToString(sensor.railTrack)})-${measureTypeText(sensor.measureType)}`,
            value : sensor.sensorId
          });
          if( !tableViewLongMeasureObj[convertToCustomFormat(kp)] ){
            tableViewLongMeasureObj[convertToCustomFormat(kp)] = lodash.cloneDeep(EMPTY_MEASURE_OBJ);
          }

          if(sensor.railTrack === STRING_UP_TRACK_LEFT || 
            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
              tableViewLongMeasureObj[convertToCustomFormat(kp)].left = sensor;
          }else if(sensor.railTrack === STRING_UP_TRACK_RIGHT || 
                   sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
              tableViewLongMeasureObj[convertToCustomFormat(kp)].right = sensor;
          }
        }
        //sensor
        if( !pointsInfo[sensor.sensorId] ){
          console.log();
          pointsInfo[sensor.sensorId] = sensor;
          pointsInfo[sensor.sensorId].measureDate = {};
        }

        /* if( !pointsInfo[sensor.sensorId].measureDate[dateFormat(new Date(measure.measureTs))] ){
          pointsInfo[sensor.sensorId].measureDate[dateFormat(new Date(measure.measureTs))] = [];
        }
        pointsInfo[sensor.sensorId].measureDate[dateFormat(new Date(measure.measureTs))].push(measure.measureTs); */
      };
    }
    shortMeasureSneosrInfo = tableViewShortMeasureObj;
    longMeasureSneosrInfo  = tableViewLongMeasureObj;
    setTableViewShortSensorList(Object.keys(tableViewShortMeasureObj));
    setTableViewLongSensorList(Object.keys(tableViewLongMeasureObj));
    setPoints(poinsts_);
  }
  
  const selectPointAdd = ( addPoint ) => {
    let selectPoints_ = [...selectPoints];
    for( let point of selectPoints_ ){
      if( point.sensorId === addPoint.sensorId ){
        return;
      }
    }
    selectPoints_.push(addPoint);
    setSelectPoints(selectPoints_);
  }

  const handlePanelChange = (value, mode) => {
    /* console.log(value, mode); */ // value는 현재 선택된 날짜, mode는 현재 패널 모드
    /* calendarDate = value.$d; */
    setViewMeasureDate(value);
    console.log(value, mode);
    let yyyymmdd = dateFormat(value.$d);
    setSelectMeasureDate(yyyymmdd);
    if (mode === 'date') {
      setMode('date');
    }
  }

  const getColor = (index) => {
    return colors[index % 20];
  }

  const onCheckboxChange = (e) => {
    console.log(e);
    setFindDatas(e.target.value);
  }

  const handleCalendarChange = (date, stringDate) => {
    setViewMeasureDate(date);
    if( date === null ){
      return;
    }
    console.log("handleCalendarChange");
    console.log(date, stringDate);
    setMode('month');
    let yyyymmdd = dateFormat(date.$d);
    setSelectMeasureDate(yyyymmdd);
    
    /* let timeOptions_ = [];
    for( let time of dataExitsDate[yyyymmdd] ){
      let option = {
        label : time,
        value : time
      }
      timeOptions_.push(option);
    }
    timeOptions_.sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });
    setTimeOptions(timeOptions_); */
  };

  const dataOption = [
    { label: '윤중', value: STRING_WHEEL_LOAD_KEY },
    { label: '횡압', value: STRING_LATERAL_LOAD_KEY },
    { label: '레일저부응력', value: STRING_STRESS_KEY },
    { label: '레일수평변위', value: STRING_HD_KEY },
    { label: '레일수직변위', value: STRING_VD_KEY },
    { label: '레일수직가속도', value: STRING_ACC_KEY },
    { label: '열차속도', value: STRING_SPEED_KEY },
  ];

  const [resizeOn, setResizeOn] = useState(0);
  const resizeChange = () => {
    console.log("resizeChange");
    setResizeOn(prevScales=>{
      return prevScales+1
    });
  }

  useEffect(() => {
    // 이벤트 리스너 추가
    window.addEventListener('resize', resizeChange);
    getRailroadSection(setRailroadSection);
    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {window.removeEventListener('resize', resizeChange )};
  }, []);

  useEffect(() => {
    console.log("selectPoint Change");
    setSelectMeasureDate(null);
    setViewMeasureDate(null);
    /* setSelectMeasureTime(""); */
  }, [selectPoint]);
  
  useEffect( ()=> {
    let route = sessionStorage.getItem('route');
    let param = {
      params : {
        railroad : route,
      },
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    }
    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/locations', param )
    .then(response => {
      let dataArr = [];
      railroadSection.forEach( data => {
        dataArr.push(0);
      })

      let measureSets = response.data.measureSets;
      let dataExits_ = [...dataArr];

      for( let measureSet of measureSets ){

        /*
        !sensor Obj!
        accMax : "string"
        accMin : "string"
        displayName : "Point 1"
        hd : "string"
        kp : 0
        lf : "string"
        measureSetId : "0825960e-0755-4e17-99b8-6f78651c35f4"
        railTrack : "T1R"
        sensorId : "9397149e-ba93-4573-b08f-18a417e2c172"
        speed : "string"
        stress : "string"
        stressMin : "string"
        vd : "string"
        wlMax : "string"
        */
        console.log(measureSet.sensors);
        for( let sensor of measureSet.sensors ){
          let index = -1;
          index = findRange(railroadSection, sensor.kp * 1000);
          dataExits_[index]++;
        }
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection]);

  useEffect( ()=>{
    console.log("selectedPath Change");
    pathMeasurefind();
  }, [selectedPath, searchRangeDate] );
  
  useEffect( ()=>{
    console.log("shortMeasureList longMeasureList Change");
    pathMeasurefind();
  }, [shortMeasureList, longMeasureList] )

  const getMeasureDates = (sensorId) => {
    setLoading(true);
    let dates = getYearStartEnd( calendarDate.getFullYear() );
    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/dates',{
      params : {
        sensorId : sensorId,
        beginTs : new Date("2000-01-01").toISOString(),
        endTs : dates.end.toISOString()
      },
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    })
    .then(response => {
      console.log("summary! ::: ", response.data.summary);
      let dataExitsDate_ = {};
      for( let summary of response.data.summary ){
        summary['sensorId'] = pointsInfo[sensorId].sensorId;
        summary['displayName'] = pointsInfo[sensorId].displayName;
        if( !dataExitsDate_[ dateFormat(new Date(summary.measureTs)) ] ){
          dataExitsDate_[ dateFormat(new Date(summary.measureTs)) ] = [];
        }
        dataExitsDate_[ dateFormat(new Date(summary.measureTs)) ].push(formatTime(new Date(summary.measureTs)));
      }
      setDataExitsDate(dataExitsDate_);
      setLoading(false);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  return (
    <div className="trackDeviation trackGeometryMeasurement" >
      <div className="railStatusContainer">
        <RailStatus 
          resizeOn={resizeOn}
          railroadSection={railroadSection} 
          pathClick={pathClick}
          dataExits={dataExits}
        ></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            { (loading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{TRACK_GEO_LOADING_TEXT}</div> : null }
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">선택구간 </div>
                <div className="date">
                  <Input placeholder="KP" value={
                    selectedPath.start_station_name+
                    " - "+
                    selectedPath.end_station_name}
                    style={{...RANGEPICKERSTYLE, ...{minWidth : "250px"}}}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">Point </div>
                <div className="date">
                  <Select
                    defaultValue={selectPoint}
                    style={{
                      width: 170,
                    }}
                    onChange={(e)=>{
                      console.log(e);
                      getMeasureDates(e);
                      setSelectPoint(e);
                    }}
                    value={selectPoint}
                    options={poinsts}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  { (isEmpty(dataExitsDate)) ? <div className="alertText" >검색된 날짜가 없습니다</div> : null }
                  <DatePicker 
                    value={viewMeasureDate}
                    disabled={isEmpty(dataExitsDate)}
                    style={RANGEPICKERSTYLE} 
                    disabledDate={disabledDate}
                    onPanelChange={handlePanelChange} 
                    onChange={handleCalendarChange}
                    /* picker={mode} */
                    mode={mode}
                    /* open={calendarOpen} */
                    /* onClick={(e)=>{
                      setCalendarOpen(true);
                    }} */
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">데이터 </div>
                <div className="date" style={{textAlign : "left"}}>
                  <Radio.Group 
                    options={dataOption} 
                    onChange={onCheckboxChange}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <button className="search" onClick={() => {
                  console.log("조회");
                  /* let findDatas_ = findDatas; */
                  /* let selectPoints_ = [...selectPoints]; */
                  let todayChartseries_ = [...todayChartseries];
                  let dailyChartseries_ = [...dailyChartseries];
                  let monthlyChartseries_ = [...monthlyChartseries];
                  
                  /* for( let summary of dataExitsDate[selectMeasureDate] ){ */
                    /* for( let item of findDatas_ ){ */
                      console.log(selectPoint);
                      if( selectPoints.length > 1 ){
                        alert("Point는 2개이상 추가할 수 없습니다.");
                        return;
                      }
                      if( !selectPoint || selectPoint === "" || selectPoint === undefined || selectPoint === null ){
                        alert("Point를 선택해주세요.");
                        return;
                      }
                      if( !selectMeasureDate || selectMeasureDate === "" || selectMeasureDate === undefined || selectMeasureDate === null 
                          /* !selectMeasureTime || selectMeasureTime === "" || selectMeasureTime === undefined || selectMeasureTime === null */ 
                       ){
                        alert("측정일자에서 날짜를 선택해주세요.");
                        return;
                      }
                      if( !findDatas || findDatas === "" || findDatas === undefined || findDatas === null 
                       ){
                        alert("조회할 데이터를 선택해주세요.");
                        return;
                      }
                      let point = pointsInfo[selectPoint];
                      console.log(point);
                      let measureDate = new Date(`${selectMeasureDate}`).toISOString();
                      let colorCode = getColor(colorIndex++);
                      for( let sensor of selectPoints ){
                        if( sensor.sensorId === point.sensorId ){
                          alert("Point 마다 한가지 종류의 데이터만 추가할 수 있습니다. Point는 최대 2개까지 추가가 가능합니다.");
                          return ;
                        }
                      }
                      axios.get(`https://raildoctor.suredatalab.kr/api/railbehaviors/data/${selectPoint}?measureDate=${measureDate}&data=${findDatas}`,{
                        paramsSerializer: params => {
                          return qs.stringify(params, { format: 'RFC3986' })
                        }
                      })
                      .then(response => {
                        console.log(response.data);

                        let chartData = (response.data.data) ? response.data.data : response.data.range;
                        let dataKey = `${point.sensorId}_${findDatas}`;
                        chartData.today = convertDates(chartData.today, '2000-01-01T00:00:00Z');
                        for( let data of chartData.today ){
                          let addData = {};
                          addData[dataKey] = (data.data) ? data.data : data.maxValue;
                          todayChartDataObj[data.ts] = {...todayChartDataObj[data.ts], ...addData};
                        }
                        for( let data of chartData.daily ){
                          let addData = {}
                          addData[dataKey] = (data.data) ? data.data : data.maxValue;
                          dailyChartDataObj[data.ts] = {...dailyChartDataObj[data.ts], ...addData};
                        }
                        for( let data of chartData.monthly ){
                          let addData = {}
                          addData[dataKey] = (data.data) ? data.data : data.maxValue;
                          monthlyChartDataObj[data.ts] = {...monthlyChartDataObj[data.ts], ...addData};
                        }
                        setToDayChartData(convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY));
                        setDailyChartData(convertObjectToArray(dailyChartDataObj, CHART_FORMAT_DAILY));
                        setMonthlyChartData(convertObjectToArray(monthlyChartDataObj, CHART_FORMAT_MONTHLY));
                        console.log(convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY));
                        console.log(convertObjectToArray(dailyChartDataObj, CHART_FORMAT_DAILY));
                        console.log(convertObjectToArray(monthlyChartDataObj, CHART_FORMAT_MONTHLY));
                        
                        todayChartseries_.push({ sensorId : point.sensorId, 
                          datakey : dataKey, 
                          displayName : point.displayName, 
                          data : convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY),
                          item : findDatas,
                          colorCode : colorCode,
                          kp : point.kp,
                          trackSide : `(${trackLeftRightToString(point.railTrack)})`,
                          measureTypeText : measureTypeText(point.measureType)
                        });
                        dailyChartseries_.push({ 
                          sensorId : point.sensorId, 
                          datakey : dataKey, 
                          displayName : point.displayName,
                          item : findDatas,
                          colorCode : colorCode,
                          kp : point.kp,
                          trackSide : `(${trackLeftRightToString(point.railTrack)})`,
                          measureTypeText : measureTypeText(point.measureType)
                        });
                        monthlyChartseries_.push({ 
                          sensorId : point.sensorId, 
                          datakey : dataKey, 
                          displayName : point.displayName,
                          item : findDatas,
                          colorCode : colorCode,
                          kp : point.kp,
                          trackSide : `(${trackLeftRightToString(point.railTrack)})`,
                          measureTypeText : measureTypeText(point.measureType)
                        });
                        setTodayChartseries(todayChartseries_);
                        setDailyChartseries(dailyChartseries_);
                        setMonthlyChartseries(monthlyChartseries_);
                        selectPointAdd({...pointsInfo[selectPoint], ...{ measureDate : `${selectMeasureDate}` }});
                      })
                      .catch(error => console.error('Error fetching data:', error));
                    /* } */
                  /* } */
                }}>조회</button>
              </div>
            </div>
      </div>
      <div className="contentBoxGroup" style={{width: "100%", height: "250px", marginTop:"10px"}}>
        <div className="contentBox" style={{position : "relative", marginRight: "10px", width: "calc((((100% - 20px) - 800px) - 330px) - -93px)", height: "100%"}}>
          { (loading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{TRACK_GEO_LOADING_TEXT}</div> : null }
          <div className="containerTitle">
            측정위치 
            <Checkbox.Group className="legend" value={selectViewMeasure} defaultValue={selectViewMeasure} onChange={(e)=>{
              setSelectViewMeasure(e);
            }} >
              <Checkbox className="blue" value={STRING_SHORT_MEASURE}><div className="option">{/* <div className="circle blue "></div> */}단기계측</div></Checkbox>
              <Checkbox className="yellow" value={STRING_LONG_MEASURE}><div className="option">{/* <div className="circle yellow "></div> */}장기계측</div></Checkbox>

            </Checkbox.Group>
          </div>
          <div className="componentBox">
            <PlacePosition 
              path={selectedPath} 
              instrumentationPoint={INSTRUMENTATIONPOINT}
              upLeftTrackPoint={upLeftTrackPoint}
              upRightTrackPoint={upRightTrackPoint}
              downLeftTrackPoint={downLeftTrackPoint}
              downRightTrackPoint={downRightTrackPoint}
              selectViewMeasure={selectViewMeasure}
              pointClick={(e)=>{
                console.log(e);
                getMeasureDates(e.sensorId);
                setSelectPoint(e.sensorId);
              }}
            ></PlacePosition>
          </div>
        </div>
        <div className="contentBox" style={{width:"515px", height:"100%", marginRight:"10px"}}>
          <div className="containerTitle">장기계측 항목</div>
          <div className="componentBox">
            <div className="table table4" style={{ justifyContent: 'flex-start', alignItems: 'baseline', overflowX: 'scroll'}} >
              <div className="tableHeader" style={{ width: 'auto', height : "60px"}}>
                <div className="tr">
                  <div className="td detail colspan2"><div className="colspan2">세부항목</div></div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point rowspan2">
                          <div className="rowspan2">{key}</div>
                        </div>
                        <div className="td point "></div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail"></div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point">좌 </div>
                        <div className="td point">우</div>
                      </>
                    })
                  }
                </div>
              </div>
              <div className="tableBody" style={{ width: 'auto', height: 'calc(100% - 60px)'}}>
                <div className="tr">
                  <div className="td detail">윤중(V)</div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].left.wlMax)}</div>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].right.wlMax)}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail">횡압(L)</div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].left.lf)}</div>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].right.lf)}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail">레일응력</div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].left.stress)}</div>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].right.stress)}</div>
                      </>
                    })
                  }
                </div>

                <div className="tr">
                  <div className="td detail">레일수평변위</div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].left.hd)}</div>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].right.hd)}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail">레일수직변위</div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].left.vd)}</div>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].right.vd)}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail" style={{fontSize: "12px"}}>레일수직가속도</div>
                  {
                    tableViewLongSensorList.map( key => {
                      return <>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].left.accMax)}</div>
                        <div className="td point">{valueOneOrNone(longMeasureSneosrInfo[key].right.accMax)}</div>
                      </>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contentBox" style={{width:"515px", height:"100%"}}>
          <div className="containerTitle">단기계측 항목</div>
          <div className="componentBox">
          <div className="table table2" style={{ justifyContent: 'flex-start', alignItems: 'baseline', overflowX: 'scroll'}} >
              <div className="tableHeader" style={{ width: 'auto', height: '60px' }}>
                <div className="tr">
                  <div className="td detail2 colspan2"><div className="colspan2">세부항목</div></div>
                  {
                    tableViewShortSensorList.map( key => {
                      return <>
                      <div className="td point2 rowspan2">
                        <div className="rowspan2">{key}</div>
                      </div>
                      <div className="td point2"></div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail2"></div>
                  {
                    tableViewShortSensorList.map( key => {
                      return <>
                        <div className="td point2">좌</div>
                        <div className="td point2">우</div>
                      </>
                    })
                  }
                </div>
              </div>
              <div className="tableBody" style={{ width: 'auto', height: 'calc(100% - 60px)'}}>
                <div className="tr">
                  <div className="td detail2">윤중(V)</div>
                  {
                    tableViewShortSensorList.map( key => {
                      return <>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].left.wlMax)}</div>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].right.wlMax)}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail2">레일응력</div>
                  {
                    tableViewShortSensorList.map( key => {
                      return <>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].left.wlMax)}</div>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].right.wlMax)}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail2">트리거용가속도</div>
                  {
                    tableViewShortSensorList.map( key => {
                      return <>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].left.accMax)}</div>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].right.accMax)}</div>
                      </>
                    })
                  }
                </div>

                <div className="tr">
                  <div className="td detail2">레일수평변위</div>
                  {
                    tableViewShortSensorList.map( key => {
                      return <>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].left.hd)}</div>
                        <div className="td point2">{valueOneOrNone(shortMeasureSneosrInfo[key].right.hd)}</div>
                      </>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contentBox" style={{marginTop:"10px", height:"calc(100% - 503px)"}}>
        <div className="containerTitle">Chart
          <div className="selectPoints">
            {
              selectPoints.map( (point, i) => {
                return <div key={i} className="point">
                  {`${convertToCustomFormat(point.kp*1000)}(${trackLeftRightToString(point.railTrack)})-${measureTypeText(point.measureType)}-${point.measureDate}`}
                  <img src={CloseIcon} alt="제거" 
                    onClick={()=>{
                      let selectPoints_ = [...selectPoints];
                      setSelectPoints(selectPoints_.filter(item => point.sensorId !== item.sensorId ));
                      let todayChartseries_ = [...todayChartseries];
                      let dailyChartseries_ = [...dailyChartseries];
                      let monthlyChartseries_ = [...monthlyChartseries];
                      todayChartseries_ = todayChartseries_.filter(item => point.sensorId !== item.sensorId );
                      dailyChartseries_= dailyChartseries_.filter(item => point.sensorId !== item.sensorId );
                      monthlyChartseries_= monthlyChartseries_.filter(item => point.sensorId !== item.sensorId );
                      setTodayChartseries(todayChartseries_);
                      setDailyChartseries(dailyChartseries_);
                      setMonthlyChartseries(monthlyChartseries_);

                      deleteObjData(todayChartDataObj, point.sensorId);
                      deleteObjData(dailyChartDataObj, point.sensorId);
                      deleteObjData(monthlyChartDataObj, point.sensorId);
                      setToDayChartData(convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY));
                      setDailyChartData(convertObjectToArray(dailyChartDataObj, CHART_FORMAT_DAILY));
                      setMonthlyChartData(convertObjectToArray(monthlyChartDataObj, CHART_FORMAT_MONTHLY));

                      deleteNonObj(todayChartDataObj);
                      deleteNonObj(dailyChartDataObj);
                      deleteNonObj(monthlyChartDataObj);
                    }}
                  />
                </div>
              })
            }
          </div>
        </div>
        <div className="componentBox flex flexEnd">
          {
            (toDayChartData.length < 1 && toDayChartData.length < 1 && toDayChartData.length < 1 ) ? 
            <div className="emptyBox">
              <img src={EmptyImg} />
              <h1>차트데이터가 없습니다</h1>
              <div>
                차트에 출력할 데이터가 없습니다. <br/>
                구간선택 - Point 선택 - 측정일자 선택 - 조회할 데이터 선택 - 조회버튼 클릭
              </div>
            </div> :
            <>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                width={500}
                height={300}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                data={toDayChartData}
              >
                <CartesianGrid />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                <XAxis type="category" dataKey="time" name="time" fontSize={9} height={40} tickFormatter={
                  (val)=>{return val.slice(0, 5);}
                }>
                  <Label value="Time" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis type="number" name="data" fontSize={12} >
                  <Label value="kN" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                {
                  todayChartseries.map( (series, i) => {
                    console.log(series.datakey);
                    return <Scatter key={i}
                      name={`${convertToCustomFormat(series.kp*1000)}${series.trackSide}-${series.measureTypeText}_${trackDataName(series.item)}`} 
                      dataKey={series.datakey} fill={series.colorCode} />
                  })
                }
              </ScatterChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={dailyChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={12} height={40} >
                  <Label value="1Month accumulation(Day)" offset={0} position="insideBottom" fontSize={12} />
                </XAxis>
                <YAxis fontSize={12} tickFormatter={numberToText} >
                  <Label value="kN" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                {/* <Bar dataKey="weight" name="윤중" fill="#0041DC" /> */}
                {
                  dailyChartseries.map( (series, i) => {
                    console.log(series);
                    return <Bar key={i}
                      dataKey={series.datakey} 
                      name={`${convertToCustomFormat(series.kp*1000)}${series.trackSide}-${series.measureTypeText}_${trackDataName(series.item)}`}
                      fill={series.colorCode} />
                  })
                }
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={MonthlyChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={12} height={40} >
                  <Label value="Month" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis fontSize={12} tickFormatter={numberToText}>
                  <Label value="kN" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                {
                  monthlyChartseries.map( (series, i) => {
                    return <Bar key={i} 
                      dataKey={series.datakey} 
                      name={`${convertToCustomFormat(series.kp*1000)}${series.trackSide}-${series.measureTypeText}_${trackDataName(series.item)}`} 
                      fill={series.colorCode} />
                  })
                }
              </BarChart>
            </ResponsiveContainer>
            </>
          }
        </div>
      </div>

    </div>
  );
}

export default TrackGeometryMeasurement;
