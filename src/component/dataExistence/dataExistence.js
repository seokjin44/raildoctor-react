import React, { useEffect, useRef, useState } from "react";
import "./dataExistence.css"
import { Box, Modal, Tab } from "@mui/material";
import { BOXSTYLE, CHART_FORMAT_DAILY, CHART_FORMAT_MONTHLY, CHART_FORMAT_RAW, CHART_FORMAT_TODAY, DOWN_TRACK, STRING_ACC_KEY, STRING_CANT, STRING_DIRECTION, STRING_DISTORTION, STRING_HD_KEY, STRING_HEIGHT, STRING_HUMIDITY, STRING_LATERAL_LOAD_KEY, STRING_RAIL_DISTANCE, STRING_RAIL_TEMPERATURE, STRING_SPEED_KEY, STRING_STRESS_KEY, STRING_TEMPERATURE, STRING_UP_TRACK, STRING_VD_KEY, STRING_WHEEL_LOAD_KEY, UP_TRACK, colors } from "../../constant";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useNavigate } from "react-router-dom";
import ArrowIcon from "../../assets/icon/arrow.png";
import WearInfo from "../../component/WearInfo/WearInfo";
import { LineChart, Line, XAxis, 
  YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer,
  ScatterChart, Scatter, Bar, BarChart } from 'recharts';
import { convertObjectToArray, convertToCustomFormat, dateFormat, formatDateTime, formatTime, getRoute, getTrackText, intervalSample, numberWithCommas, tempDataName, trackDataName, trackToString, trackToString2, transposeObjectToArray } from "../../util";
import axios from 'axios';
import qs from 'qs';
import classNames from "classnames";
import Papa from 'papaparse';

let colorIndex = 1;
let railMinValue = 99999;
let route = getRoute();
let setTimeoutID = -1;
function DataExistence( props ) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [railbehaviorOpen, setRailbehaviorOpen] = useState(false);
  const [railtwistOpen, setRailtwistOpen] = useState(false);
  const [railwearOpen, setRailwearOpen] = useState(false);
  const [temperatureOpen, setTemperatureOpen] = useState(false);
  const [pautOpen, setPautOpen] = useState(false);
  const [roughnessOpen, setRoughnessOpen] = useState(false);
  /* const [railMinValue, setRailMinValue] = useState(99999); */
  const [railMaxValue, setRailMaxValue] = useState(0);

  const scrollContainerRef = useRef(null);

  //paut
  const [pautData, setPautData] = useState({});
  const [pautImgIndex, setPautImgIndex] = useState(0);

  const [tabValue, setTabValue] = useState('1');
  const [kptoPixel, setKPtoPixel] = useState(15000);
  const LINE_TITLE_WIDTH = 120;
  const kpto1Pixcel = 1;
  const [kpList, setKPList] = useState([]);

  const [railbehaviorData, setRailbehaviorData] = useState({});
  const [railWearData, setRailWearData] = useState({});

  const [toDayChartData, setToDayChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [MonthlyChartData, setMonthlyChartData] = useState([]);

  const [todayChartseries, setTodayChartseries] = useState([]);
  const [dailyChartseries, setDailyChartseries] = useState([]);
  const [monthlyChartseries, setMonthlyChartseries] = useState([]);

  const [cornerWearGraphData, setCornerWearGraphData] = useState([]);
  const [verticalWearGraphData, setVerticalWearGraphData] = useState([]);
  const [selectKP, setSelectKP] = useState({ trackType : "" });

  const [remainingData, setRemainingData] = useState({});
  const [remainingCriteria, setRemainingCriteria] = useState({});
  const [leftRemaining, setLeftRemaining] = useState({});
  const [rightRemaining, setRightRemaining] = useState({});

  //궤도틀림
  const [railtwistData, setRailtwistData] = useState({});
  const [heightChartData, setHeightChartData] = useState([]);
  const [directionChartData, setDirectionChartData] = useState([]);
  const [cantChartData, setCantChartData] = useState([]);
  const [raildistanceChartData, setRaildistanceChartData] = useState([]);
  const [distortionChartData, setDistortionChartData] = useState([]);

  //궤도거동계측
  const [ wheelSeries, setWheelSeries] = useState([]);
  const [ lateralSeries, setLateralSeries] = useState([]);
  const [ stressSeries, setStressSeries] = useState([]);
  const [ hdSeries, setHDSeries] = useState([]);
  const [ vdSeries, setVDSeries] = useState([]);
  const [ accSeries, setAccSeries] = useState([]);
  const [ speedSeries, setspeedSeries] = useState([]);

  //온습도
  const [ tempMeasureData, setTempMeasureData] = useState({});
  const [ tempSeries, setTempSeries] = useState([]);
  const [ tempChartData, setTempChartData] = useState([]);

  //툴팁
  const [accumulateWeightsTooltipIndex, setAccumulateWeightsTooltipIndex ] = useState(-1);
  const [temperaturesTooltipIndex, setTemperaturesTooltipIndex ] = useState(-1);
  const [pautTooltipIndex, setPautTooltipIndex ] = useState(-1);
  const [railTwistTooltipIndex, setRailTwistTooltipIndex ] = useState(-1);
  const [railwearsTooltipIndex, setRailwearsTooltipIndex ] = useState(-1);
  const [railstraightsIndex, setRailstraightsIndex ] = useState(-1);
  const [railbehaviorsIndex, setRailbehaviorsIndex ] = useState(-1);
  

  //레일조도
  const [roughnessChartData, setRoughnessChartData] = useState([]);
  const [roughnessData, setRoughnessData] = useState({});

  const getColor = (index) => {
    return colors[index % 20];
  }
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleScroll = () => {
    if( setTimeoutID > 0 ){
      return;
    }
    const scrollContainer = scrollContainerRef.current;
    const scrollLeft = scrollContainer.scrollLeft;
    const containerWidth = scrollContainer.clientWidth;
    const centerPixel = scrollLeft + containerWidth / 2;
    const newCenterMeter = centerPixel * kpto1Pixcel + railMinValue;
    props.setKP(newCenterMeter);
  };

  useEffect(() => {
    //Pixcel 계산
    console.log(document.getElementById("dataExistenceContainer").clientWidth);
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);

      // 컴포넌트 언마운트 시 리스너 제거
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    console.log(props.railroadSection);
    let kpList_ = [];
    let start = props.railroadSection[0].beginKp * 1000;
    let end = props.railroadSection[props.railroadSection.length - 1].endKp * 1000;
    for( let i = start; i < end; i++ ){
      if( i % 1000 === 0 ){
        kpList_.push(i);
      }
    }
    setKPtoPixel(end * kpto1Pixcel);
    setKPList(kpList_);
    railMinValue = start;
    setRailMaxValue(end);
  },[ props.railroadSection ]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.removeEventListener('scroll', handleScroll);
    scrollMove(props.kp);
    clearTimeout(setTimeoutID);
    setTimeoutID = setTimeout( ()=>{
      scrollContainer.addEventListener('scroll', handleScroll);
      setTimeoutID = -1;
    }, 200 )
    console.log(setTimeoutID);
  },[ props.kp ]);

  const scrollMove = ( kp ) => {
    let left = (
      kp > document.getElementById('dataExistenceContainer').clientWidth/2
    ) ? parseFloat(kp) - document.getElementById('dataExistenceContainer').clientWidth/2 : 0;
    document.getElementById('dataExistenceContainer').scroll({
      top: 0,
      left: left,
      behavior: "auto",
    });
  }

  return (
    <div className="boxProto datafinder">
      <div className="dataList header">
        <div className="line" >
          <div className="dataName">KP</div>
        </div>
        <div className="line"  >
          <div className="dataName">통과톤수</div>
        </div>
        <div className="line"  >
          <div className="dataName">마모 유지관리</div>
        </div>
        <div className="line"  >
          <div className="dataName">궤도틀림</div>
        </div>
        <div className="line"  >
          <div className="dataName">궤도거동계측</div>
        </div>
        <div className="line"  >
          <div className="dataName">온/습도 측정</div>
        </div>
        <div className="line"  >
          <div className="dataName">레일직진도</div>
        </div>
        <div className="line"  >
          <div className="dataName">레일조도</div>
        </div>
        {/* <div className="line"  >
          <div className="dataName">DRL</div>
        </div> */}
        <div className="line"  >
          <div className="dataName">LWD</div>
        </div>
        <div className="line"  >
          <div className="dataName">PAUT 탐상</div>
        </div>
      </div>
      <div ref={scrollContainerRef} className="scroll" id="dataExistenceContainer">
      <div className="dataList">
        <div className="line" style={{width:railMaxValue - railMinValue}} >
          <div className="dataBar kp">
            {
              kpList.map( (kp, i) => {
                return <div key={`kp${i}`} className="kp" style={{left:kp - railMinValue}} >{convertToCustomFormat(kp)}</div>;
              })
            }
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          <div className="dataBar accumulateWeights">
            {/* 통과톤수 */}
            {props.accumulateWeights.map( (data, i) => {
              return <div key={`acc${i}`} className={classNames("detailBtn",{ onTooltip : accumulateWeightsTooltipIndex === i})} 
              style={{left:`${(data.beginKp*1000) - railMinValue}px`, width : `${(data.endKp - data.beginKp)*1000}px` }} 
              onMouseOver={()=>{setAccumulateWeightsTooltipIndex(i)}}
              onMouseOut={()=>{setAccumulateWeightsTooltipIndex(-1)}}
              onClick={()=>{
                setRemainingData(data);
                axios.get(`https://raildoctor.suredatalab.kr/api/accumulateweights/remaining`,{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  },
                  params : {
                    railroad_name : route,
                    rail_track  : data.railTrack,
                    kp : data.beginKp,
                    measure_ts : data.measureTs
                  }
                })
                .then(response => {
                  console.log(response.data);
                  setRemainingCriteria(response.data.criteria);
                  setLeftRemaining(response.data.leftRemaining);
                  setRightRemaining(response.data.rightRemaining);
                  setAccOpen(true);
                })
                .catch(error => console.error('Error fetching data:', error));
              }}>
                <div className="tooltip">
                  <div className="tooltipLine">
                    시작KP : {convertToCustomFormat(data.beginKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    종점KP : {convertToCustomFormat(data.endKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(data.measureTs))}
                  </div>
                  <div className="tooltipLine">
                    {getTrackText("상하선", route)} : {trackToString2(data.railTrack, route)}
                  </div>                  
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">마모 유지관리</div> */}
          <div className="dataBar railwears">
            {props.railwears.map( (data, i) => {
              return <div key={`railwear${i}`} style={{left:`${(data.kp*1000) - railMinValue}px`}} 
              className={classNames("detailBtn",{ onTooltip : railwearsTooltipIndex === i})}
              onMouseOver={()=>{setRailwearsTooltipIndex(i)}}
              onMouseOut={()=>{setRailwearsTooltipIndex(-1)}}
              onClick={()=>{
                setRailwearOpen(true)
                setRailWearData(data);
                /* 2D Data 상세조회 */
                let param = {
                  begin_kp : [data.kp],
                  end_kp : [data.kp],
                  beginMeasureTs : new Date(data.measureTs).toISOString(),
                  endMeasureTs : new Date(data.measureTs).toISOString(),
                  minAccumulateWeight : 1,
                  maxAccumulateWeight : 600000000,
                  railTrack : data.railTrack,
                  railroadName : route,
                  graphType : "TWO_DIMENTION"
                }
                console.log(param);
                setSelectKP({trackType : (data.railTrack===STRING_UP_TRACK) ? UP_TRACK : DOWN_TRACK });
                axios.get('https://raildoctor.suredatalab.kr/api/railwears/graph_data',{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
                  },
                  params : param
                })
                .then(response => {
                  console.log(response.data);
                  setCornerWearGraphData(response.data.cornerWearGraph);
                  setVerticalWearGraphData(response.data.verticalWearGraph);
                })
                .catch(error => console.error('Error fetching data:', error));
              }}>
                <div className="tooltip">
                  <div className="tooltipLine">
                    KP : {convertToCustomFormat(data.kp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(data.measureTs))}
                  </div>
                  <div className="tooltipLine">
                    누적통과톤수 : {numberWithCommas(data.accumulateWeight)}
                  </div>
                  <div className="tooltipLine">
                    {getTrackText("상하선", route)} : {trackToString2(data.railTrack, route)}
                  </div>
                </div>

              </div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">궤도틀림</div> */}
          <div className="dataBar railtwists">
            {props.railtwists.map( (data, i) => {
              return <div key={`railtwists${i}`} style={{left:`${(data.beginKp*1000) - railMinValue}px`, width:`${(data.endKp - data.beginKp)*1000}px`}} 
              className={classNames("detailBtn",{ onTooltip : railTwistTooltipIndex === i})}
              onMouseOver={()=>{setRailTwistTooltipIndex(i)}}
              onMouseOut={()=>{setRailTwistTooltipIndex(-1)}}
              onClick={()=>{
                setRailtwistData(data);
                setRailtwistOpen(true);
                let dataOption = [
                  STRING_HEIGHT, STRING_DIRECTION, STRING_CANT, STRING_RAIL_DISTANCE, STRING_DISTORTION ];
                for( let option of dataOption ){
                  let param = {
                    begin_kp : [data.beginKp],
                    end_kp : [data.endKp],
                    measure_ts : data.measureTs,
                    rail_track : data.railTrack,
                    data_type : option,
                    railroad_name : route,
                  };
                  console.log(param);
                  axios.get(`https://raildoctor.suredatalab.kr/api/railtwists/graph_data`,{
                    paramsSerializer: params => {
                      return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
                    },
                    params : param
                  })
                  .then(response => {
                    console.log(option);
                    console.log(response.data);
                    let dataAry = transposeObjectToArray(response.data);
                    console.log(dataAry);
                    if( option === STRING_HEIGHT ){
                      setHeightChartData(dataAry);
                    }else if( option === STRING_DIRECTION ){
                      setDirectionChartData(dataAry);
                    }else if( option === STRING_CANT ){
                      setCantChartData(dataAry);
                    }else if( option === STRING_RAIL_DISTANCE ){
                      setRaildistanceChartData(dataAry);
                    }else if( option === STRING_DISTORTION ){
                      setDistortionChartData(dataAry);
                    }
                  })
                  .catch(error => console.error('Error fetching data:', error));
                }
              }}>
                <div className="tooltip">
                  <div className="tooltipLine">
                    시작KP : {convertToCustomFormat(data.beginKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    종점KP : {convertToCustomFormat(data.endKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(data.measureTs))}
                  </div>
                  <div className="tooltipLine">
                    {getTrackText("상하선", route)} : {trackToString2(data.railTrack, route)}
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">궤도거동계측</div> */}
          <div className="dataBar railbehaviors">
            {props.railbehaviors.map( (railbehaviorsData, i) => {
              return <div key={`railbehavior${i}`} style={{left:`${(railbehaviorsData.beginKp*1000) - railMinValue}px`, width:`${(railbehaviorsData.endKp - railbehaviorsData.beginKp)*1000}px`}} 
              className={classNames("detailBtn",{ onTooltip : railbehaviorsIndex === i})} 
              onMouseOver={()=>{setRailbehaviorsIndex(i)}}
              onMouseOut={()=>{setRailbehaviorsIndex(-1)}}
              onClick={()=>{
                setRailbehaviorOpen(true);
                setRailbehaviorData(railbehaviorsData);
                axios.get(`https://raildoctor.suredatalab.kr/api/railbehaviors/measuresets/${railbehaviorsData.measureId}`,{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  }
                })
                .then(response => {
                  console.log(response.data);
                  let todayChartDataObj = {};
                  let dailyChartDataObj = {};
                  let monthlyChartDataObj = {};

                  let dataOption = [
                    STRING_WHEEL_LOAD_KEY,
                    STRING_LATERAL_LOAD_KEY,
                    STRING_STRESS_KEY,
                    STRING_HD_KEY,
                    STRING_VD_KEY,
                    STRING_ACC_KEY,
                    STRING_SPEED_KEY
                  ];

                  for(let sensor of response.data.entities){
                    let colorCode = getColor(colorIndex++);
                    for( let option of dataOption ){
                      axios.get(`https://raildoctor.suredatalab.kr/api/railbehaviors/data/${sensor.sensorId}`,{
                        paramsSerializer: params => {
                          return qs.stringify(params, { format: 'RFC3986' })
                        },
                        params : {
                          measureDate : railbehaviorsData.measureTs,
                          data : option
                        }
                      })
                      .then(response => {
                        console.log(response.data);
                        let chartseries_ = [];
                        let chartData = (response.data.data) ? response.data.data : response.data.range;
                          let dataKey = `${sensor.sensorId}_${STRING_WHEEL_LOAD_KEY}`;
                          for( let todayData of chartData.today ){
                            let addData = {};
                            addData[dataKey] = (todayData.data) ? todayData.data : todayData.maxValue;
                            todayChartDataObj[todayData.ts] = {...todayChartDataObj[todayData.ts], ...addData};
                          }
                          for( let dailydata of chartData.daily ){
                            let addData = {}
                            addData[dataKey] = (dailydata.data) ? dailydata.data : dailydata.maxValue;
                            dailyChartDataObj[dailydata.ts] = {...dailyChartDataObj[dailydata.ts], ...addData};
                          }
                          for( let monthlyData of chartData.monthly ){
                            let addData = {}
                            addData[dataKey] = (monthlyData.data) ? monthlyData.data : monthlyData.maxValue;
                            monthlyChartDataObj[monthlyData.ts] = {...monthlyChartDataObj[monthlyData.ts], ...addData};
                          }
                          setToDayChartData(convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY));
                          setDailyChartData(convertObjectToArray(dailyChartDataObj, CHART_FORMAT_DAILY));
                          setMonthlyChartData(convertObjectToArray(monthlyChartDataObj, CHART_FORMAT_MONTHLY));
                          console.log(convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY));
                          console.log(convertObjectToArray(dailyChartDataObj, CHART_FORMAT_DAILY));
                          console.log(convertObjectToArray(monthlyChartDataObj, CHART_FORMAT_MONTHLY));
                          
                          
                          chartseries_.push({ 
                            sensorId : sensor.sensorId, 
                            datakey : dataKey, 
                            displayName : sensor.displayName, 
                            item : option,
                            colorCode : colorCode
                          });

                          if( option === STRING_WHEEL_LOAD_KEY ){
                            setWheelSeries(chartseries_);
                          }else if( option === STRING_LATERAL_LOAD_KEY ){
                            setLateralSeries(chartseries_);
                          }else if( option === STRING_STRESS_KEY ){
                            setStressSeries(chartseries_);
                          }else if( option === STRING_HD_KEY ){
                            setHDSeries(chartseries_);
                          }else if( option === STRING_VD_KEY ){
                            setVDSeries(chartseries_);
                          }else if( option === STRING_ACC_KEY ){
                            setAccSeries(chartseries_);
                          }else if( option === STRING_SPEED_KEY ){
                            setspeedSeries(chartseries_);
                          }
                      })
                      .catch(error => console.error('Error fetching data:', error));
                    }
                  }
                })
                .catch(error => console.error('Error fetching data:', error));
            }}>
                <div className="tooltip">
                  <div className="tooltipLine">
                    시작KP : {convertToCustomFormat(railbehaviorsData.beginKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    종점KP : {convertToCustomFormat(railbehaviorsData.endKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(railbehaviorsData.measureTs))}
                  </div>
                  <div className="tooltipLine">
                    {getTrackText("상하선", route)} : {trackToString2(railbehaviorsData.railTrack, route)}
                  </div>
                </div>
            </div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">온/습도 측정</div> */}
          <div className="dataBar">
            {props.temperatures.map( (tempData, i) => {
              return <div key={`temp${i}`} style={{left:`${(tempData.kp*1000) - railMinValue}px`}} 
              className={classNames("detailBtn",{ onTooltip : temperaturesTooltipIndex === i})} 
              onMouseOver={()=>{setTemperaturesTooltipIndex(i)}}
              onMouseOut={()=>{setTemperaturesTooltipIndex(-1)}}
              onClick={()=>{
                setTemperatureOpen(true);
                setTempMeasureData(tempData);
                let chartseries_ = [];
                let chartDataObj = {};

                let begin = new Date(tempData.measureTs);
                let end = new Date(tempData.measureTs);
                begin.setDate(begin.getDate() - 3);
                end.setDate(end.getDate() + 3);

                axios.get(`https://raildoctor.suredatalab.kr/api/temperatures/period/${tempData.measureId}?begin=${begin.toISOString()}&end=${end.toISOString()}`,{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  }
                })
                .then(response => {
                  console.log(response.data);
                    let tsAry = response.data.measureTs;
                    let dataAry = response.data.railTemperature;
                    let dataKey = `${STRING_RAIL_TEMPERATURE}`;
                    for( let i in dataAry ){
                      let addData = {};
                      addData[dataKey] = dataAry[i];
                      chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
                    }
                    let colorCode = getColor(colorIndex++);
                    chartseries_.push({
                      dataKey : dataKey, item : tempDataName(STRING_RAIL_TEMPERATURE), color :colorCode
                    });

                    dataAry = response.data.temperature;
                    dataKey = `${STRING_TEMPERATURE}`;
                    for( let i in dataAry ){
                      let addData = {};
                      addData[dataKey] = dataAry[i];
                      chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
                    }
                    colorCode = getColor(colorIndex++);
                    chartseries_.push({
                      dataKey : dataKey, item : tempDataName(STRING_TEMPERATURE), color :colorCode
                    });

                    dataAry = response.data.humidity
                    dataKey = `${STRING_HUMIDITY}`;
                    for( let i in dataAry ){
                      let addData = {};
                      addData[dataKey] = dataAry[i];
                      chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
                    }
                    colorCode = getColor(colorIndex++);
                    chartseries_.push({
                      dataKey : dataKey, item : tempDataName(STRING_HUMIDITY), color :colorCode
                    });
                  setTempChartData(convertObjectToArray(chartDataObj, CHART_FORMAT_RAW));
                  setTempSeries(chartseries_);
                })
                .catch(error => console.error('Error fetching data:', error));
              }}>
                <div className="tooltip">
                  <div className="tooltipLine">
                    KP : {convertToCustomFormat(tempData.kp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(tempData.measureTs))}
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">레일직진도</div> */}
          <div className="dataBar railstraights">
            {props.railstraights.map( (straightsData, i) => {
              return <div key={`temp${i}`} style={{left:`${(straightsData.kp*1000) - railMinValue}px`}} 
              className={classNames("detailBtn",{ onTooltip : railstraightsIndex === i})} 
              onMouseOver={()=>{setRailstraightsIndex(i)}}
              onMouseOut={()=>{setRailstraightsIndex(-1)}}
              onClick={()=>{
                console.log(straightsData);
                axios.get('https://raildoctor.suredatalab.kr/api/railstraights/files',{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  },
                  params : {
                    measureId : straightsData.measureId,
                    fileType : 2
                  }
                })
                .then(response => {
                  console.log(response.data);
                  for( let file_ of response.data.file ){
                    /* if( file_.originName.indexOf(file.originName) > -1 ){ */
                      window.open(`https://raildoctor.suredatalab.kr/resources${file_.filePath}`);
                    /* } */
                  }
                })
                .catch(error => console.error('Error fetching data:', error));
              }}>
                <div className="tooltip">
                  <div className="tooltipLine">
                    KP : {convertToCustomFormat(straightsData.kp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(straightsData.measureTs))}
                  </div>
                  <div className="tooltipLine">
                    {getTrackText("상하선", route)} : {trackToString2(straightsData.railTrack, route)}
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">레일조도</div> */}
          <div className="dataBar railRoughnesses">
            {props.railroughnesses.map( (roughnessesData, i) => {
              return <div key={`temp${i}`} style={{left:`${(roughnessesData.beginKp*1000) - railMinValue}px`, width:`${(roughnessesData.endKp - roughnessesData.beginKp)*1000}px`}}
              className={classNames("detailBtn",{ onTooltip : temperaturesTooltipIndex === i})} 
              onMouseOver={()=>{setTemperaturesTooltipIndex(i)}}
              onMouseOut={()=>{setTemperaturesTooltipIndex(-1)}}
              onClick={()=>{
                console.log(roughnessesData);
                setRoughnessData(roughnessesData);
                axios.get("https://raildoctor.suredatalab.kr/resources/data/railroughness/"+roughnessesData.fileName, { responseType: 'text' })
                    .then(response => {
                      let roughnessChartData_ = [];
                      const csvData = response.data;
                      let results = [];
                      Papa.parse(csvData, {
                        header: true,  // 첫 번째 행을 헤더로 사용
                        step: (result) => {
                          /* results.push(result.data); */
                            // 각 데이터 항목을 반복하며 숫자 값에 대한 소수점을 제한
                            let roundedData = {};
                            for (const key in result.data) {
                              let value = result.data[key];
                              if (key === 'Roughness(mm)') {  // 값이 숫자인 경우
                                let round = value * 1000;
                                roundedData[key] = round;  // 소수점 두 자리까지만 반올림
                              } else {
                                roundedData[key] = value;
                              }
                            }
                            results.push(roundedData);
                        }
                      });
                      console.log(results);
                      results = intervalSample(results, 100);
                      roughnessChartData_.push(...results);
                      setRoughnessChartData(roughnessChartData_);
                      setRoughnessOpen(true);
                    })
                    .catch(error => console.error('Error fetching data:', error));  // responseType을 'text'로 설정
              }}>
                <div className="tooltip">
                  <div className="tooltipLine">
                    시작KP : {convertToCustomFormat(roughnessesData.beginKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    종점KP : {convertToCustomFormat(roughnessesData.endKp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(roughnessesData.measureTs))}
                  </div>
                  <div className="tooltipLine">
                    {getTrackText("상하선", route)} : {trackToString2(roughnessesData.railTrack, route)}
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">LWD</div> */}
          <div className="dataBar">
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">PAUT 탐상</div> */}
          <div className="dataBar paut">
          {props.paut.map( (data, i) => {
              return <div key={`paut${i}`} style={{left:`${(data.kp*1000) - railMinValue}px`}}               
              className={classNames("detailBtn",{ onTooltip : pautTooltipIndex === i})} 
              onMouseOver={()=>{setPautTooltipIndex(i)}}
              onMouseOut={()=>{setPautTooltipIndex(-1)}}
              
              onClick={()=>{
                console.log(data);
                setPautOpen(true);
                setPautImgIndex(0);
                axios.get(`https://raildoctor.suredatalab.kr/api/pauts/${data.measureId}`,{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  }
                })
                .then(response => {
                  setPautData(response.data);
                })
                .catch(error => console.error('Error fetching data:', error));
              }}><div className="tooltip">
                  <div className="tooltipLine">
                    KP : {convertToCustomFormat(data.kp*1000)}
                  </div>
                  <div className="tooltipLine">
                    TS : {formatDateTime(new Date(data.measureTs))}
                  </div>
                  <div className="tooltipLine">
                    {getTrackText("상하선", route)} : {trackToString2(data.railTrack, route)}
                  </div>
              </div></div>
            })}
          </div>
        </div>
      </div>
      </div>
      <Modal
          open={accOpen}
          onClose={(e)=>{setAccOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />통과톤수 데이터 상세요약</div>
            <div className="tabPanel throughput">
              <div className="contentBox" style={{height: "100px", marginBottom:"10px"}} >
                <div className="containerTitle">현재 누적통과톤수</div>
                <div className="componentBox flex section ">
                  <div className="curDate optionBox borderColorGreen" style={{width:"255px"}}>
                    <div className="optionTitle">현재날짜</div>
                    <div className="optionValue">{dateFormat(new Date(remainingData.measureTs))}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">기준</div>
                    <div className="optionValue">{numberWithCommas(remainingCriteria)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">{getTrackText("상하선", route)}</div>
                    <div className="optionValue">{trackToString(remainingData.railTrack, route)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">좌우</div>
                    <div className="optionValue">좌</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">KP</div>
                    <div className="optionValue">{convertToCustomFormat(remainingData.beginKp*1000)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">누적통과톤수</div>
                    <div className="optionValue">{numberWithCommas(leftRemaining.accumulateweight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">잔여통과톤수</div>
                    <div className="optionValue">{numberWithCommas(leftRemaining.remainingWeight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">갱환일</div>
                    <div className="optionValue">{dateFormat(new Date(leftRemaining.nextTimeToReplace))}</div>
                  </div>
                </div>
              </div>
              <div className="contentBox" style={{height: "100px", marginBottom:"10px"}} >
                <div className="containerTitle">현재 누적통과톤수</div>
                <div className="componentBox flex section ">
                  <div className="curDate optionBox borderColorGreen" style={{width:"255px"}}>
                    <div className="optionTitle">현재날짜</div>
                    <div className="optionValue">{dateFormat(new Date(remainingData.measureTs))}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">기준</div>
                    <div className="optionValue">{numberWithCommas(remainingCriteria)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">{getTrackText("상하선", route)}</div>
                    <div className="optionValue">{trackToString(remainingData.railTrack, route)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">좌우</div>
                    <div className="optionValue">우</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">KP</div>
                    <div className="optionValue">{convertToCustomFormat(remainingData.beginKp*1000)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">누적통과톤수</div>
                    <div className="optionValue">{numberWithCommas(rightRemaining.accumulateweight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">잔여통과톤수</div>
                    <div className="optionValue">{numberWithCommas(rightRemaining.remainingWeight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">갱환일</div>
                    <div className="optionValue">{dateFormat(new Date(rightRemaining.nextTimeToReplace))}</div>
                  </div>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/cumulativeThroughput");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
          
        </Box>
      </Modal>

      <Modal
          open={railwearOpen}
          onClose={(e)=>{setRailwearOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />마모유지관리 상세요약</div>
          <div className="tabPanel"  style={{width: "915px", height: "565px", padding: "10px 10px 50px 10px" }}>
            <div className="contentBox" style={{marginLeft : 0, height:"100%"}}>
              <div className="containerTitle bothEnds">
                <div>마모정보</div>
                <div className="dataOption" style={{right: "242px"}}>
                  <div className="value">
                    위치 : {convertToCustomFormat(railWearData.kp*1000)}
                  </div>
                </div>
                <div className="dataOption">
                  <div className="value">
                    측정기간 : {formatDateTime(new Date(railWearData.measureTs))}
                  </div>
                </div>
              </div>
              <div className="componentBox separationBox">
                <div className="componentBox" id="directWearInfo">
                  <WearInfo title="직마모" selectKP={selectKP} data={verticalWearGraphData} yTitle="직마모(mm)"></WearInfo>
                </div>
                <div className="componentBox" id="sideWearInfo">
                  <WearInfo title="편마모" selectKP={selectKP} data={cornerWearGraphData} yTitle="편마모(mm)"></WearInfo>
                </div>
              </div>
            </div>
            <div className="directBtn" onClick={()=>{navigate("/wearMaintenance");}}>데이터 상세보기<img src={ArrowIcon} /></div>
          </div>
        </Box>
      </Modal>

      <Modal
          open={temperatureOpen}
          onClose={(e)=>{setTemperatureOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />온습도 상세요약</div>
          <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
            <div className="contentBox" style={{height: "100%"}}>
              <div className="containerTitle">Chart
                <div className="dataOption" style={{right: "174px"}}>
                  <div className="value">
                      위치 : {convertToCustomFormat(tempMeasureData.kp*1000)}
                  </div>
                </div>
                <div className="dataOption">
                  <div className="value">
                    측정기간 : {formatDateTime(new Date(tempMeasureData.measureTs))}
                  </div>
                </div>
              </div>
              <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={tempChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={9} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* <Line dataKey="temp" stroke="#FF0000" dot={false} /> */}
                    {
                      tempSeries.map( (series, i) => {
                        return <Line key={`tempSeries${i}`} dataKey={series.dataKey} name={`${series.item}`} stroke={series.color} dot={false} />;
                      })
                    }
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="directBtn" onClick={()=>{navigate("/MeasuringTemperatureHumidity");}}>데이터 상세보기<img src={ArrowIcon} /></div>
          </div>
        </Box>
      </Modal>

      <Modal
          open={pautOpen}
          onClose={(e)=>{setPautOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />PAUT 상세요약</div>
          <div className="tabPanel" style={{width:"945px", height:"700px"}}>
            <div className="contentBox paut" style={{height: "100px", marginBottom:"10px"}} >
              <div className="containerTitle">탐상 데이터</div>
              <div className="componentBox flex section ">
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">DA</div>
                  <div className="optionValue">{pautData.da}</div>
                </div>
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">PA</div>
                  <div className="optionValue">{pautData.pa}</div>
                </div>
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">SA</div>
                  <div className="optionValue">{pautData.sa}</div>
                </div>
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">UMR</div>
                  <div className="optionValue">{pautData.umr}</div>
                </div>
              </div>
            </div>
            <div className="contentBox" style={{height: "calc(100% - 110px)"}}>
              <div className="containerTitle">사진
                <div className="dataOption" style={{right: "250px"}}>
                  <div className="value">
                      위치 : {convertToCustomFormat(pautData.kp*1000)}
                  </div>
                </div>
                <div className="dataOption">
                  <div className="value">
                    측정기간 : {formatDateTime(new Date(pautData.measureTs))}
                  </div>
                </div>
              </div>
              <div className="componentBox chartBox flex paut">
                {
                  (pautData.images && pautData.images.length > 0) ? 
                  <>
                    {(pautData.images.length > 1) ? <div className="leftBtn" onClick={()=>{
                      if(pautImgIndex>0){setPautImgIndex(pautImgIndex-1)}
                    }}></div> : null }
                    <img src={`https://raildoctor.suredatalab.kr${pautData.images[pautImgIndex].filePath}`}  />
                    {(pautData.images.length > 1) ? <div className="rightBtn" onClick={()=>{
                      if(pautImgIndex<pautData.images.length-1){
                        setPautImgIndex(pautImgIndex+1)
                      }
                    }}></div> : null}
                  </>
                  : null
                }
              </div>
            </div>
            {/* <div className="directBtn" onClick={()=>{navigate("/MeasuringTemperatureHumidity");}}>데이터 상세보기<img src={ArrowIcon} /></div> */}
          </div>
        </Box>
      </Modal>

      <Modal
          open={roughnessOpen}
          onClose={(e)=>{setRoughnessOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />레일조도 상세요약</div>
          <div className="tabPanel" style={{width:"945px", height:"600px", paddingBottom : 0}}>
            <div className="contentBox" style={{height: "calc(100%)"}}>
              <div className="containerTitle">그래프
                <div className="dataOptionBox">
                  <div className="dataOption" style={{right: "250px"}}>
                    <div className="value">
                        위치 : {convertToCustomFormat(roughnessData.beginKp*1000)} - {convertToCustomFormat(roughnessData.endKp*1000)}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {formatDateTime(new Date(roughnessData.measureTs))}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      {getTrackText("상하선", route)} : {trackToString2(roughnessData.railTrack, route)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="componentBox chartBox flex paut">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={roughnessChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis fontSize={12} dataKey="KP(m)" tickFormatter={(tick) => Math.floor(tick)}/>
                    <YAxis tickFormatter={(tick) => (tick / 1000).toFixed(2)} />
                    <Tooltip formatter={(value) => (value / 1000).toFixed(2)} />
                    <Legend />
                    <Line dataKey="Roughness(mm)" stroke="#82ca9d" dot={false} />
                  </LineChart>
              </ResponsiveContainer>
              </div>
            </div>
            {/* <div className="directBtn" onClick={()=>{navigate("/MeasuringTemperatureHumidity");}}>데이터 상세보기<img src={ArrowIcon} /></div> */}
          </div>
        </Box>
      </Modal>

      <Modal
          open={railtwistOpen}
          onClose={(e)=>{setRailtwistOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />궤도틀림 상세요약</div>
          <TabContext value={tabValue} > 
            <Box sx={{ borderBottom: 1, borderColor: 'divider'  }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" >
                <Tab style={{fontFamily : 'NEO_R'}} label="고저틀림" value="1" />
                <Tab style={{fontFamily : 'NEO_R'}} label="방향틀림" value="2" />
                <Tab style={{fontFamily : 'NEO_R'}} label="캔트틀림" value="3" />
                <Tab style={{fontFamily : 'NEO_R'}} label="궤간틀림" value="4" />
                <Tab style={{fontFamily : 'NEO_R'}} label="비틀림" value="5" />
              </TabList>
            </Box>
            <TabPanel value="1">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={heightChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="좌레일-고저틀림" dataKey="valueLeft" stroke="#4371C4" dot={false} />
                    <Line type="monotone" name="우레일-고저틀림" dataKey="valueRight" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준(상)" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준(하)" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준(상)" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준(하)" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준(상)" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준(하)" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="2">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={directionChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="좌레일-방향틀림" dataKey="valueLeft" stroke="#4371C4" dot={false} />
                    <Line type="monotone" name="우레일-방향틀림" dataKey="valueRight" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준(상)" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준(하)" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준(상)" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준(하)" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준(상)" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준(하)" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="3">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={cantChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} />
                    <Line type="monotone" name="캔트틀림" dataKey="cantTwist" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준(상)" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준(하)" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준(상)" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준(하)" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준(상)" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준(하)" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="4">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={raildistanceChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="궤간틀림" dataKey="value" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준(상)" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준(하)" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준(상)" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준(하)" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준(상)" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준(하)" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="5">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={distortionChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="비틀림" dataKey="value" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준(상)" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준(하)" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준(상)" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준(하)" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준(상)" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준(하)" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
          </TabContext>
        </Box>
      </Modal>

      <Modal
          open={railbehaviorOpen}
          onClose={(e)=>{setRailbehaviorOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
        <div className="popupTitle"><img src={PopupIcon} />궤도거동계측 상세요약</div>
        <TabContext value={tabValue} > 
            <Box sx={{ borderBottom: 1, borderColor: 'divider'  }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" >
                <Tab style={{fontFamily : 'NEO_R'}} label="윤중" value="1" />
                <Tab style={{fontFamily : 'NEO_R'}} label="횡압" value="2" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일저부응력" value="3" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일수평변위" value="4" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일수직변위" value="5" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일수직가속도" value="6" />
                <Tab style={{fontFamily : 'NEO_R'}} label="열차속도" value="7" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
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
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            wheelSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={`wheelSeriesTime${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            wheelSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={`wheelSeriesDay${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            wheelSeries.map( (series, i) => {
                              return <Bar key={`wheelSeriesMonth${i}`} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="2">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
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
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            lateralSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={`lateralSeriesTime${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            lateralSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={`lateralSeriesDay${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            lateralSeries.map( (series, i) => {
                              return <Bar key={`lateralSeriesMonth${i}`}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="3">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
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
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            stressSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={`stressSeriesTime${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            stressSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={`stressSeriesDay${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            stressSeries.map( (series, i) => {
                              return <Bar key={`stressSeriesMonth${i}`}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="4">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
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
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            hdSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={`hdSeriesTime${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            hdSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={`hdSeriesDay${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            hdSeries.map( (series, i) => {
                              return <Bar key={`hdSeriesMonth${i}`}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="5">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
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
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            vdSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={`vdSeriesTime${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            vdSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={`vdSeriesDay${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            vdSeries.map( (series, i) => {
                              return <Bar key={`vdSeriesMonth${i}`}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="6">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
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
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            accSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={`accSeriesTime${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            accSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={`accSeriesDay${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            accSeries.map( (series, i) => {
                              return <Bar key={`accSeriesMonth${i}`}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="7">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
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
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            speedSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={`speedSeriesTime${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            speedSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={`speedSeriesDay${i}`}
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
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            speedSeries.map( (series, i) => {
                              return <Bar key={`speedSeriesMonth${i}`}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
        </TabContext>            
        
        </Box>
      </Modal>
      
    </div>
  );
}

export default DataExistence;