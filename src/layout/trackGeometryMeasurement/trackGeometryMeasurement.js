import "./trackGeometryMeasurement.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, 
  ScatterChart, Scatter
} from 'recharts';
import { Checkbox, DatePicker, Input, Radio, Select } from "antd";
import { CHART_FORMAT_DAILY, CHART_FORMAT_MONTHLY, CHART_FORMAT_TODAY, DOWN_TRACK, INSTRUMENTATIONPOINT, RAILROADSECTION, RANGEPICKERSTYLE, STRING_ACC_KEY, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_HD_KEY, STRING_LATERAL_LOAD_KEY, STRING_LONG_MEASURE, STRING_SHORT_MEASURE, STRING_SPEED_KEY, STRING_STRESS_KEY, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT, STRING_VD_KEY, STRING_WHEEL_LOAD_KEY, TRACKGEODATA1, TRACKGEODATA2, TRACKGEODATA3, UP_TRACK, colors } from "../../constant";
import PlacePosition from "../../component/PlacePosition/PlacePosition";
import axios from 'axios';
import qs from 'qs';
import { convertObjectToArray, dateFormat, findAddedItems, findRange, formatDate, formatTime, formatYearMonth, getFirstDateOfThreeMonthsAgo, getLastDateOfMonth, trackDataName } from "../../util";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CloseIcon from "../../assets/icon/211650_close_circled_icon.svg";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

let dataExitsDate = {};
let todayChartDataObj = {};
let dailyChartDataObj = {};
let monthlyChartDataObj = {};
let calendarDate = new Date();
let pointsInfo = {};
let colorIndex = 1;
function TrackGeometryMeasurement( props ) {
  const [selectedPath, setSelectedPath] = useState({
    start_station_name : "",
    end_station_name : "",
    start_station_up_track_location : 0,
    start_station_down_track_location : 0,
    end_station_up_track_location : 0,
    end_station_down_track_location : 0,
  });
  /* const [dataExits, setDataExits] = useState([]); */

  const [upLeftTrackPoint, setUpLeftTrackPoint] = useState([]); //상선좌포인트
  const [upRightTrackPoint, setUpRightTrackPoint] = useState([]); //상선우포인트
  const [downLeftTrackPoint, setDownLeftTrackPoint] = useState([]); //하선좌포인트
  const [downRightTrackPoint, setDownRightTrackPoint] = useState([]); //하선우포인트

  const [shortMeasureList, setShortMeasureList] = useState([]); //단기계측
  const [longMeasureList, setLongMeasureList] = useState([]); //장기계측

  const [tableViewShortMeasureList, setTableViewShortMeasureList] = useState([]); //테이블에 보여지는 단기계측
  const [tableViewLongMeasureList, setTableViewLongMeasureList] = useState([]); //테이블에 보여지는 장기계측

  const [searchRangeDate, setSearchRangeDate] = useState([]);
  const [selectPoints, setSelectPoints] = useState([]);
  const [selectMeasureDate, setSelectMeasureDate] = useState(new Date());
  const [findDatas, setFindDatas] = useState([]);

  const [poinsts, setPoints] = useState([]);
  const [selectPoint, setSelectPoint] = useState("");

  const [toDayChartData, setToDayChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [MonthlyChartData, setMonthlyChartData] = useState([]);

  const [todayChartseries, setTodayChartseries] = useState([]);
  const [dailyChartseries, setDailyChartseries] = useState([]);
  const [monthlyChartseries, setMonthlyChartseries] = useState([]);

  const disabledDate = (current) => {
    return !dataExitsDate[dateFormat(current.$d)];
  };

  const pathClick = (select) => {
    console.log("pathClick");
    console.log(select);
    setSelectedPath(select);
    let param = {
      params : {
        railroad : "인천 1호선",
        begin : "계양",
        end : "송도달빛축제공원"
      },
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/locations', param )
    .then(response => {
      let dataArr = [];
      RAILROADSECTION.forEach( data => {
        dataArr.push(0);
      })

      let measureSets = response.data.measureSets;
      let dataExits_ = [...dataArr];

      let upLeftTrackPoint_ = [...upLeftTrackPoint];
      let upRightTrackPoint_ = [...upRightTrackPoint];
      let downLeftTrackPoint_ = [...downLeftTrackPoint];
      let downRightTrackPoint_ = [...downRightTrackPoint];

      let shortMeasureList_ = [...shortMeasureList];
      let longMeasureList_ = [...longMeasureList];

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
          if( sensor.railTrack === STRING_UP_TRACK ||
            sensor.railTrack === STRING_UP_TRACK_LEFT ||
            sensor.railTrack === STRING_UP_TRACK_RIGHT ){
            index = findRange(RAILROADSECTION, sensor.kp * 1000, UP_TRACK);
          }else{
            index = findRange(RAILROADSECTION, sensor.kp * 1000, DOWN_TRACK);
          }
  
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
    let shortMeasureList_ = [...shortMeasureList];
    let longMeasureList_ = [...longMeasureList];
    let tableViewShortMeasureList_ = [];
    let tableViewLongMeasureList_ = [];
    let startKP = (selectedPath.start_station_up_track_location > selectedPath.start_station_down_track_location)? 
    selectedPath.start_station_down_track_location : selectedPath.start_station_up_track_location
    ;
    let endKP = (selectedPath.end_station_up_track_location > selectedPath.end_station_down_track_location)? 
    selectedPath.end_station_up_track_location : selectedPath.end_station_down_track_location
    ;
    for( let measure of shortMeasureList_ ){
      let add = true;
      for( let sensor of measure.sensors ){
        if( !(sensor.kp >= startKP && sensor.kp <= endKP) ){
          add = false;
        }
      }
      if(add){
        tableViewShortMeasureList_.push(measure);
        for( let sensor of measure.sensors ){
          if(sensor.kp >= startKP && sensor.kp <= endKP){
            poinsts_.push({
              value : sensor.sensorId,
              label : sensor.displayName
            });
            pointsInfo[sensor.sensorId] = sensor;
          }
        }
      };
    }
    for( let measure of longMeasureList_ ){
      let add = true;
      for( let sensor of measure.sensors ){
        if( !(sensor.kp >= startKP && sensor.kp <= endKP) ){
          add = false;
        }
      }
      if(add){
        tableViewLongMeasureList_.push(measure);
        for( let sensor of measure.sensors ){
          if(sensor.kp >= startKP && sensor.kp <= endKP){
            poinsts_.push({
              value : sensor.sensorId,
              label : sensor.displayName
            });
            pointsInfo[sensor.sensorId] = sensor;
          }
        }
      };
    }
    setTableViewShortMeasureList(tableViewShortMeasureList_);
    setTableViewLongMeasureList(tableViewLongMeasureList_);
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
    console.log(value, mode); // value는 현재 선택된 날짜, mode는 현재 패널 모드
    calendarDate = value.$d;
    let begin = getFirstDateOfThreeMonthsAgo( calendarDate.getMonth(), calendarDate.getFullYear() );
    /* let selectPoints_ = [...selectPoints]; */
    /* for( let point of selectPoints_ ){ */
    console.log(begin);
    let point = pointsInfo[selectPoint];
    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/dates',{
      params : {
        sensorId : selectPoint,
        beginTs : begin.toISOString()
      },
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    })
    .then(response => {
      console.log("summary! ::: ", response.data.summary);
      dataExitsDate = {};
      for( let summary of response.data.summary ){
        summary['sensorId'] = point.sensorId;
        summary['displayName'] = point.displayName;
        if( !dataExitsDate[ dateFormat(new Date(summary.measureTs)) ] ){
          dataExitsDate[ dateFormat(new Date(summary.measureTs)) ] = [];
          dataExitsDate[ dateFormat(new Date(summary.measureTs)) ].push(summary);
        }
        /* console.log(dataExitsDate); */
      }
    })
    .catch(error => console.error('Error fetching data:', error));
    /* } */
  }

  const getColor = (index) => {
    return colors[index % 20];
  }

  const onCheckboxChange = (e) => {
    console.log(e);
    setFindDatas(e.target.value);
  }

  const findPoints = (date) => {
    date[0].$d.setHours(0, 0, 0, 0);
    date[1].$d.setHours(23, 59, 59, 0);
    let param = {
      params : {
        railroad : "인천 1호선",
        begin : "계양",
        end : "송도달빛축제공원",
        beginTs : date[0].$d.toISOString(),
        endTs : date[1].$d.toISOString()
      },
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/locations', param )
    .then(response => {
      let dataArr = [];
      RAILROADSECTION.forEach( data => {
        dataArr.push(0);
      })

      let measureSets = response.data.measureSets;
      let dataExits_ = [...dataArr];

      let upLeftTrackPoint_ = [...upLeftTrackPoint];
      let upRightTrackPoint_ = [...upRightTrackPoint];
      let downLeftTrackPoint_ = [...downLeftTrackPoint];
      let downRightTrackPoint_ = [...downRightTrackPoint];

      let shortMeasureList_ = [...shortMeasureList];
      let longMeasureList_ = [...longMeasureList];

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
          if( sensor.railTrack === STRING_UP_TRACK ||
            sensor.railTrack === STRING_UP_TRACK_LEFT ||
            sensor.railTrack === STRING_UP_TRACK_RIGHT ){
            index = findRange(RAILROADSECTION, sensor.kp * 1000, UP_TRACK);
          }else{
            index = findRange(RAILROADSECTION, sensor.kp * 1000, DOWN_TRACK);
          }
  
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
      setSearchRangeDate(date);
    })
    .catch(error => console.error('Error fetching data:', error));
  };

  const handleCalendarChange = (date) => {
    setSelectMeasureDate(dateFormat(date.$d));
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

  useEffect(() => {

  }, []);
  
  useEffect( ()=>{
    console.log("selectedPath Change");
    pathMeasurefind();
  }, [selectedPath, searchRangeDate] )
  
  useEffect( ()=>{
    console.log("shortMeasureList longMeasureList Change");
    pathMeasurefind();
  }, [shortMeasureList, longMeasureList] )

  return (
    <div className="trackDeviation trackGeometryMeasurement" >
      <div className="railStatusContainer">
        <RailStatus 
          railroadSection={RAILROADSECTION} 
          pathClick={pathClick}
          /* dataExits={dataExits} */
        ></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
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
                    style={RANGEPICKERSTYLE}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">Point </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE} 
                    onChange={findPoints}
                    onPanelChange={handlePanelChange} 
                  /> */}
                  <Select
                    defaultValue={selectPoint}
                    style={{
                      width: 200,
                    }}
                    onChange={(e)=>{
                      console.log(e);
                      setSelectPoint(e);
                      let begin = getFirstDateOfThreeMonthsAgo( calendarDate.getMonth(), calendarDate.getFullYear() );
                      axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/dates',{
                        params : {
                          sensorId : e,
                          beginTs : begin.toISOString()
                        },
                        paramsSerializer: params => {
                          return qs.stringify(params, { format: 'RFC3986' })
                        }
                      })
                      .then(response => {
                        console.log("summary! ::: ", response.data.summary);
                        dataExitsDate = {};
                        for( let summary of response.data.summary ){
                          summary['sensorId'] = pointsInfo[e].sensorId;
                          summary['displayName'] = pointsInfo[e].displayName;
                          if( !dataExitsDate[ dateFormat(new Date(summary.measureTs)) ] ){
                            dataExitsDate[ dateFormat(new Date(summary.measureTs)) ] = [];
                            dataExitsDate[ dateFormat(new Date(summary.measureTs)) ].push(summary);
                          }
                          console.log(dataExitsDate);
                        }
                      })
                      .catch(error => console.error('Error fetching data:', error));
                      /* selectPointAdd(e); */
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
                  <DatePicker 
                    style={RANGEPICKERSTYLE} 
                    disabledDate={disabledDate}
                    onPanelChange={handlePanelChange} 
                    onChange={handleCalendarChange}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">데이터 </div>
                <div className="date">
                  <Radio.Group 
                    options={dataOption} 
                    onChange={onCheckboxChange}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <button onClick={()=>{
                  /* let findDatas_ = findDatas; */
                  /* let selectPoints_ = [...selectPoints]; */
                  let todayChartseries_ = [...todayChartseries];
                  let dailyChartseries_ = [...dailyChartseries];
                  let monthlyChartseries_ = [...monthlyChartseries];
                  
                  for( let summary of dataExitsDate[selectMeasureDate] ){
                    /* for( let item of findDatas_ ){ */
                      let colorCode = getColor(colorIndex++);
                      axios.get(`https://raildoctor.suredatalab.kr/api/railbehaviors/data/${selectPoint}?measureDate=${summary.measureTs}&data=${findDatas}`,{
                        paramsSerializer: params => {
                          return qs.stringify(params, { format: 'RFC3986' })
                        }
                      })
                      .then(response => {
                        console.log(response.data);
                        let chartData = (response.data.data) ? response.data.data : response.data.range;
                        let dataKey = `${summary.sensorId}_${findDatas}`;
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
                        
                        
                        todayChartseries_.push({ sensorId : summary.sensorId, 
                          datakey : dataKey, 
                          displayName : summary.displayName, 
                          data : convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY),
                          item : findDatas,
                          colorCode : colorCode
                        });
                        dailyChartseries_.push({ 
                          sensorId : summary.sensorId, 
                          datakey : dataKey, 
                          displayName : summary.displayName,
                          item : findDatas,
                          colorCode : colorCode
                        });
                        monthlyChartseries_.push({ 
                          sensorId : summary.sensorId, 
                          datakey : dataKey, 
                          displayName : summary.displayName,
                          item : findDatas,
                          colorCode : colorCode
                        });
                        setTodayChartseries(todayChartseries_);
                        setDailyChartseries(dailyChartseries_);
                        setMonthlyChartseries(monthlyChartseries_);
                        selectPointAdd(pointsInfo[selectPoint]);
                      })
                      .catch(error => console.error('Error fetching data:', error));
                    /* } */
                  }
                }}>조회</button>
              </div>
            </div>
      </div>
      <div className="contentBoxGroup" style={{width: "100%", height: "250px", marginTop:"10px"}}>
        <div className="contentBox" style={{marginRight: "10px", width: "calc((((100% - 20px) - 800px) - 330px) - -93px)", height: "100%"}}>
          <div className="containerTitle">
            측정위치
          </div>
          <div className="componentBox">
            <PlacePosition 
              path={selectedPath} 
              instrumentationPoint={INSTRUMENTATIONPOINT}
              upLeftTrackPoint={upLeftTrackPoint}
              upRightTrackPoint={upRightTrackPoint}
              downLeftTrackPoint={downLeftTrackPoint}
              downRightTrackPoint={downRightTrackPoint}
              pointClick={(e)=>{
                console.log(e);
                let begin = getFirstDateOfThreeMonthsAgo( calendarDate.getMonth(), calendarDate.getFullYear() );
                axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/dates',{
                  params : {
                    sensorId : e.sensorId,
                    beginTs : begin.toISOString()
                  },
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  }
                })
                .then(response => {
                  console.log("summary! ::: ", response.data.summary);
                  dataExitsDate = {};
                  for( let summary of response.data.summary ){
                    summary['sensorId'] = e.sensorId;
                    summary['displayName'] = e.displayName;
                    if( !dataExitsDate[ dateFormat(new Date(summary.measureTs)) ] ){
                      dataExitsDate[ dateFormat(new Date(summary.measureTs)) ] = [];
                      dataExitsDate[ dateFormat(new Date(summary.measureTs)) ].push(summary);
                    }
                    console.log(dataExitsDate);
                  }
                })
                .catch(error => console.error('Error fetching data:', error));
                /* selectPointAdd(e); */
                setSelectPoint(e.sensorId);
              }}
            ></PlacePosition>
          </div>
        </div>
        <div className="contentBox" style={{width:"700px", height:"100%", marginRight:"10px"}}>
          <div className="containerTitle">장기계측 항목</div>
          <div className="componentBox">
            <div className="table" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td detail colspan2"><div className="colspan2">세부항목</div></div>
                  {
                    tableViewLongMeasureList.map( measure => {
                      return <>
                        <div className="td point rowspan2">
                          <div className="rowspan2">{measure.displayName}</div>
                        </div>
                        <div className="td point "></div>
                      </>
                    })
                  }
                  {/* <div className="td point rowspan2"><div className="rowspan2">(하)15k526</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k503</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k065</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k110</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k230</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k290</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k400</div></div>
                  <div className="td point"></div> */}
                </div>
                <div className="tr">
                  <div className="td detail"></div>
                  {
                    tableViewLongMeasureList.map( measure => {
                      return <>
                        <div className="td point">좌 </div>
                        <div className="td point">우</div>
                      </>
                    })
                  }
                  {/* <div className="td point">좌 </div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div> */}
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td detail">윤중(V)</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.wlMax;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.wlMax;
                        }
                      }
                      return <>
                        <div className="td point">{leftVal}</div>
                        <div className="td point">{RightVal}</div>
                      </>
                    })
                  }
                  {/* <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div>  */}
                </div>
                <div className="tr">
                  <div className="td detail">횡압(L)</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.lf;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.lf;
                        }
                      }
                      return <>
                        <div className="td point">{leftVal}</div>
                        <div className="td point">{RightVal}</div>
                      </>
                    })
                  }
                  {/* <div className="td point">-</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div>  */}
                </div>
                <div className="tr">
                  <div className="td detail">레일응력</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.stress;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.stress;
                        }
                      }
                      return <>
                        <div className="td point">{leftVal}</div>
                        <div className="td point">{RightVal}</div>
                      </>
                    })
                  }
                  {/* <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div>  */}
                </div>

                <div className="tr">
                  <div className="td detail">레일수평변위</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.hd;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.hd;
                        }
                      }
                      return <>
                        <div className="td point">{leftVal}</div>
                        <div className="td point">{RightVal}</div>
                      </>
                    })
                  }
                  {/* <div className="td point" style={{ fontSize: "1px"}} >1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>   */}
                </div>
                <div className="tr">
                  <div className="td detail">레일수직변위</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.vd;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.vd;
                        }
                      }
                      return <>
                        <div className="td point">{leftVal}</div>
                        <div className="td point">{RightVal}</div>
                      </>
                    })
                  }
                  {/* <div className="td point" style={{ fontSize: "1px"}} >1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div>  */}
                </div>
                <div className="tr">
                  <div className="td detail" style={{fontSize: "12px"}}>레일수직가속도</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.accMax;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.accMax;
                        }
                      }
                      return <>
                        <div className="td point">{leftVal}</div>
                        <div className="td point">{RightVal}</div>
                      </>
                    })
                  }
                  {/* <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div>  */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contentBox" style={{width:"330px", height:"100%"}}>
          <div className="containerTitle">단기계측 항목</div>
          <div className="componentBox">
          <div className="table table2" style={{justifyContent: "flex-start"}} >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td detail2 colspan2"><div className="colspan2">세부항목</div></div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      return <>
                      <div className="td point2 rowspan2">
                        <div className="rowspan2">{measure.displayName}</div>
                      </div>
                      <div className="td point2"></div>
                      </>
                    })
                  }
                  {/* <div className="td point2 rowspan2"><div className="rowspan2">(하)15k526</div></div>
                  <div className="td point2"></div>
                  <div className="td point2 rowspan2"><div className="rowspan2">(하)15k503</div></div>
                  <div className="td point2"></div> */}
                </div>
                <div className="tr">
                  <div className="td detail2"></div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      return <>
                        <div className="td point2">좌</div>
                        <div className="td point2">우</div>
                      </>
                    })
                  }
                  {/* <div className="td point2">좌</div>
                  <div className="td point2">우</div>
                  <div className="td point2">좌</div>
                  <div className="td point2">우</div> */}
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td detail2">윤중(V)</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.wlMax;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.wlMax;
                        }
                      }
                      return <>
                        <div className="td point2">{leftVal}</div>
                        <div className="td point2">{RightVal}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail2">레일응력</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.stress;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.stress;
                        }
                      }
                      return <>
                        <div className="td point2">{leftVal}</div>
                        <div className="td point2">{RightVal}</div>
                      </>
                    })
                  }
                </div>
                <div className="tr">
                  <div className="td detail2">트리거용가속도</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.accMax;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.accMax;
                        }
                      }
                      return <>
                        <div className="td point2">{leftVal}</div>
                        <div className="td point2">{RightVal}</div>
                      </>
                    })
                  }
                </div>

                <div className="tr">
                  <div className="td detail2">레일수평변위</div>
                  {
                    tableViewShortMeasureList.map( measure => {
                      let leftVal = '-';
                      let RightVal = '-';
                      for( let sensor of measure.sensors ){
                        if( sensor.railTrack === STRING_UP_TRACK_LEFT ||
                            sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
                              leftVal = sensor.hd;
                        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ||
                                  sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
                              RightVal = sensor.hd;
                        }
                      }
                      return <>
                        <div className="td point2">{leftVal}</div>
                        <div className="td point2">{RightVal}</div>
                      </>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contentBox" style={{marginTop:"10px", height:"calc(100% - 510px)"}}>
        <div className="containerTitle">Chart
          <div className="selectPoints">
            {
              selectPoints.map( (point, i) => {
                return <div key={i} className="point">
                  {point.displayName}
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
                    }}
                  />
                </div>
              })
            }
          </div>
        </div>
        <div className="componentBox flex flexEnd">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
              data={toDayChartData}
            >
              <CartesianGrid />
              <Legend />
              <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
              <YAxis type="number" name="data" fontSize={12}/>
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {
                todayChartseries.map( (series, i) => {
                  console.log(series.datakey);
                  return <Scatter key={i}
                    name={`${series.displayName}_${trackDataName(series.item)}`} 
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
              <XAxis dataKey="time" fontSize={12}/>
              <YAxis fontSize={12}/>
              <Tooltip />
              <Legend />
              {/* <Bar dataKey="weight" name="윤중" fill="#0041DC" /> */}
              {
                dailyChartseries.map( (series, i) => {
                  console.log(series);
                  return <Bar key={i}
                    dataKey={series.datakey} 
                    name={`${series.displayName}_${trackDataName(series.item)}`}
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
              <XAxis dataKey="time" fontSize={12}/>
              <YAxis fontSize={12}/>
              <Tooltip />
              <Legend />
              {
                monthlyChartseries.map( (series, i) => {
                  return <Bar key={i} 
                    dataKey={series.datakey} 
                    name={`${series.displayName}_${trackDataName(series.item)}`} 
                    fill={series.colorCode} />
                })
              }
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default TrackGeometryMeasurement;
