import "./lwd.css"
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, Line } from 'recharts';

import Papa from 'papaparse';
import { CHART_RENDERING_TEXT,  DATA_LOADING_TEXT, INSTRUMENTATIONPOINT, RANGEPICKERSTYLE, URL_ROOT, colors } from "../../constant";
import { DatePicker, Input } from "antd";
import PlaceGauge from "../../component/PlaceGauge/PlaceGauge";
import axios from 'axios';
import { convertToCustomFormat, dateFormat, deleteNonObj, deleteObjData, findRange, getRailroadSection, getRoute, intervalSample, measureTypeText, trackDataName, trackLeftRightToString } from "../../util";
import LoadingImg from "../../assets/icon/loading/loading.png";
import CloseIcon from "../../assets/icon/211650_close_circled_icon.svg";
import { isEmpty } from "lodash";
import qs from 'qs';

let route = getRoute();
let chartDataObj = {};
let colorIndex = 1;
function LWD( props ) {
  const [selectedPath, setSelectedPath] = useState({
    start_station_name : "",
    end_station_name : "",
    beginKp : 0,
    endKp : 0,
  });
  const [dataExits, setDataExits] = useState([]);
  const [lwdChartData, setLWDChartData] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataloading, setDataloading] = useState(false);

  const [dataExitsDate, setDataExitsDate] = useState({});
  const [viewMeasureDate, setViewMeasureDate] = useState(null);
  const [selectMeasureDate, setSelectMeasureDate] = useState(new Date());
  const [mode, setMode] = useState('month');

  const [chartseries, setChartseries] = useState([]);
  
  const getColor = (index) => {
    return colors[index % 20];
  }

  const disabledDate = (current) => {
    return !dataExitsDate[dateFormat(current.$d)];
  };
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
  };

  const pathClick = (select) => {
    setSelectedPath(select);
    let dataExitsDate_ ={};
    axios.get(URL_ROOT+'/api/lwds/ts',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad_name : route,
        begin_kp : select.beginKp / 1000,
        end_kp : select.endKp / 1000
      }
    })
    .then(response => {
      console.log(response.data);
      for( let ts of response.data.listTs ){
        if( !dataExitsDate_[ dateFormat(new Date(ts)) ] ){
          dataExitsDate_[ dateFormat(new Date(ts)) ] = [];
          dataExitsDate_[ dateFormat(new Date(ts)) ].push(ts);
        }
        console.log(dataExitsDate_);
      }
      setDataExitsDate(dataExitsDate_);
    })
    .catch(error => console.error('Error fetching data:', error));    
  }

  const [resizeOn, setResizeOn] = useState(0);
  const resizeChange = () => {
    console.log("resizeChange");
    setResizeOn(prevScales=>{
      return prevScales+1
    });
  }

  const moveLeftData = () => {
    let chartseries_ = [...chartseries];
    /* for( let series of chartseries_ ){ */
    for( let i = 0; i < chartseries_.length; i++ ){
      let series = chartseries_[i];
      axios.get(URL_ROOT+'/api/lwds/adj',{
        paramsSerializer: params => {
          return qs.stringify(params, { format: 'RFC3986' })
        },
        params : {
          railroad_name: route,
          begin_kp: series.beginKp,
          end_kp: series.endKp,
          measure_ts: series.measureTs,
          rail_track: "T1"
        }
      })
      .then(response => {
        console.log(response.data);
        if(response.data.leftData){
          deleteObjData(chartDataObj, series.seriesID);
          let transformedData = Object.keys(chartDataObj).map(key => {
            return { kp: key, ...chartDataObj[key] };
          });
          setLWDChartData(transformedData);
          deleteNonObj(chartDataObj);
          axios.get(URL_ROOT+'/api/lwds',{
            paramsSerializer: params => {
              return qs.stringify(params, { format: 'RFC3986' })
            },
            params : {
              railroad_name : route,
              begin_kp : response.data.leftData.beginKp,
              end_kp : response.data.leftData.endKp,
              measure_ts : response.data.leftData.measureTs,
              rail_track : "T1" // https://raildoctor.suredatalab.kr/api/lwds/ts 에는 rail_track이 없음
            }
          })
          .then(response => {
            console.log(response);
            let seriesID = `${response.data.beginKp}_${response.data.endKp}_${response.data.measureTs}`;
            response.data.kp.forEach((kp, index) => {
              let addData = {};
              addData[seriesID] = response.data.stiffness[index];
              chartDataObj[kp] = {...chartDataObj[kp], ...addData};
            });
            let transformedData = Object.keys(chartDataObj).map(key => {
              return { kp: key, ...chartDataObj[key] };
            });
            chartseries_[i] = {
              seriesID : seriesID,
              colorCode : series.colorCode,
              measureTs : response.data.measureTs,
              beginKp : response.data.beginKp,
              endKp : response.data.endKp,
              avg : response.data.average,
              std : response.data.std,
              si : response.data.si,
            };
            setChartseries(chartseries_);
            setLWDChartData(transformedData);
          })
          .catch(error => console.error('Error fetching data:', error));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }

  const moveRightData = () => {
    let chartseries_ = [...chartseries];
    for( let i = 0; i < chartseries_.length; i++ ){
      let series = chartseries_[i];
      axios.get(URL_ROOT+'/api/lwds/adj',{
        paramsSerializer: params => {
          return qs.stringify(params, { format: 'RFC3986' })
        },
        params : {
          railroad_name: route,
          begin_kp: series.beginKp,
          end_kp: series.endKp,
          measure_ts: series.measureTs,
          rail_track: "T1"
        }
      })
      .then(response => {
        console.log(response.data);
        if(response.data.rightData){
          deleteObjData(chartDataObj, series.seriesID);
          let transformedData = Object.keys(chartDataObj).map(key => {
            return { kp: key, ...chartDataObj[key] };
          });
          setLWDChartData(transformedData);
          deleteNonObj(chartDataObj);
          axios.get(URL_ROOT+'/api/lwds',{
            paramsSerializer: params => {
              return qs.stringify(params, { format: 'RFC3986' })
            },
            params : {
              railroad_name : route,
              begin_kp : response.data.rightData.beginKp,
              end_kp : response.data.rightData.endKp,
              measure_ts : response.data.rightData.measureTs,
              rail_track : "T1" // https://raildoctor.suredatalab.kr/api/lwds/ts 에는 rail_track이 없음
            }
          })
          .then(response => {
            console.log(response);
            let seriesID = `${response.data.beginKp}_${response.data.endKp}_${response.data.measureTs}`;
            response.data.kp.forEach((kp, index) => {
              let addData = {};
              addData[seriesID] = response.data.stiffness[index];
              chartDataObj[kp] = {...chartDataObj[kp], ...addData};
            });
            let transformedData = Object.keys(chartDataObj).map(key => {
              return { kp: key, ...chartDataObj[key] };
            });
            chartseries_[i] = {
              seriesID : seriesID,
              colorCode : series.colorCode,
              measureTs : response.data.measureTs,
              beginKp : response.data.beginKp,
              endKp : response.data.endKp,
              avg : response.data.average,
              std : response.data.std,
              si : response.data.si,
            };
            setChartseries(chartseries_);
            setLWDChartData(transformedData);
          })
          .catch(error => console.error('Error fetching data:', error));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }

  useEffect(() => {
    // 이벤트 리스너 추가
    window.addEventListener('resize', resizeChange);
    getRailroadSection(setRailroadSection);
    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {window.removeEventListener('resize', resizeChange )};
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [lwdChartData])

  useEffect( ()=> {
    if( railroadSection.length < 2 ){
      return;
    }
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    axios.get(URL_ROOT+'/api/lwds/kp',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad_name : route,
        begin : railroadSection[0].displayName,
        end : railroadSection[railroadSection.length-1].displayName
      }
    })
    .then(response => {
      let dataArr = [];
      railroadSection.forEach( data => {
        dataArr.push(0);
      });
      let dataExits_ = [...dataArr];

      console.log(response.data);
      for( let data of response.data.t1 ){
        let index = -1;
        index = findRange(railroadSection, data * 1000);
        dataExits_[index]++;        
      }
      for( let data of response.data.t2 ){
        let index = -1;
        index = findRange(railroadSection, data * 1000);
        dataExits_[index]++;
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection])
  
  return (
    <div className="lwd trackDeviation" >
      <div className="railStatusContainer">
        <RailStatus 
          resizeOn={resizeOn}
          railroadSection={railroadSection} 
          pathClick={pathClick}
          dataExits={dataExits}
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
                    style={{...RANGEPICKERSTYLE, ...{minWidth : "250px"}}}
                    readOnly={true}
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
                <button className="search" onClick={()=>{
                  console.log("Search");
                  let measureTs = new Date().toISOString();
                  try{
                    measureTs = dataExitsDate[selectMeasureDate][0];
                  }catch(e){
                    alert("측정일자를 찾을 수 없습니다. 측정분기와 측정일자가 선택되어있는지 확인해주세요.");
                    return;
                  }
                  axios.get(URL_ROOT+'/api/lwds',{
                    paramsSerializer: params => {
                      return qs.stringify(params, { format: 'RFC3986' })
                    },
                    params : {
                      railroad_name : route,
                      begin_kp : selectedPath.beginKp / 1000,
                      end_kp : selectedPath.endKp / 1000,
                      measure_ts : measureTs,
                      rail_track : "T1" // https://raildoctor.suredatalab.kr/api/lwds/ts 에는 rail_track이 없음
                    }
                  })
                  .then(response => {
                    console.log(response);
                    let colorCode = getColor(colorIndex++);
                    let chartseries_ = [...chartseries];
                    let seriesID = `${response.data.beginKp}_${response.data.endKp}_${measureTs}`;
                    response.data.kp.forEach((kp, index) => {
                      let addData = {};
                      addData[seriesID] = response.data.stiffness[index];
                      chartDataObj[kp] = {...chartDataObj[kp], ...addData};
                    });
                    let transformedData = Object.keys(chartDataObj).map(key => {
                      return { kp: key, ...chartDataObj[key] };
                    });
                    chartseries_.push({
                      seriesID : seriesID,
                      colorCode : colorCode,
                      measureTs : measureTs,
                      beginKp : response.data.beginKp,
                      endKp : response.data.endKp,
                      avg : response.data.average,
                      std : response.data.std,
                      si : response.data.si,
                    });
                    setChartseries(chartseries_);
                    setLWDChartData(transformedData);
                  })
                  .catch(error => console.error('Error fetching data:', error));
                }} >
                  조회
                </button>
              </div>
            </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 240px)", position: "relative" }}>
        <div className="containerTitle">Chart
          <div className="selectPoints">
            {
              chartseries.map( (point, i) => {
                return <div key={i} className="point">
                  {`${dateFormat(new Date(point.measureTs))}[${convertToCustomFormat(point.beginKp*1000)}-${convertToCustomFormat(point.endKp*1000)}]`}
                  <img src={CloseIcon} alt="제거" 
                    onClick={()=>{
                      let chartseries_ = [...chartseries];
                      chartseries_ = chartseries_.filter(item => point.seriesID !== item.seriesID );
                      setChartseries(chartseries_);
                      deleteObjData(chartDataObj, point.seriesID);
                      let transformedData = Object.keys(chartDataObj).map(key => {
                        return { kp: key, ...chartDataObj[key] };
                      });
                      setLWDChartData(transformedData);
                      deleteNonObj(chartDataObj);
                    }}
                  />
                </div>
              })
            }
          </div>
        </div>
        <div className="chartMoveBtn left" onClick={()=>{moveLeftData()}} >&lt; Left</div>
        <div className="chartMoveBtn right" onClick={()=>{moveRightData()}} >Right &gt;</div>
        <div className="componentBox chartBox flex">
        { (loading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{CHART_RENDERING_TEXT}</div> : null }
        { (dataloading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{DATA_LOADING_TEXT}</div> : null }
          <div className="addData">
            <div className="dataLines">
                {
                  chartseries.map( (series, i) => {
                    return <><div className="title">{`${dateFormat(new Date(series.measureTs))}[${convertToCustomFormat(series.beginKp*1000)}-${convertToCustomFormat(series.endKp*1000)}]`}</div>
                    <div className="line">
                      <div className="lineName">Average</div>
                      <div className="lineVal">{series.avg}</div>
                    </div>
                    <div className="line">
                      <div className="lineName">STD</div>
                      <div className="lineVal">{series.std}</div>
                    </div>
                    <div className="line">
                      <div className="lineName">SI</div>
                      <div className="lineVal">{series.si}</div>
                    </div></>
                  })
                }
            </div>
          </div>
          <div className="chartBox">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={lwdChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis fontSize={12} dataKey="kp" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => `KP : ${convertToCustomFormat(value*1000)}`}
                  formatter={(value, name) => [`${value}`, name]}
                />
                <Legend />
                {
                  chartseries.map( (series, i) => {
                    return <Line key={`Chart${i}`}
                      name={`${dateFormat(new Date(series.measureTs))}[${convertToCustomFormat(series.beginKp*1000)}-${convertToCustomFormat(series.endKp*1000)}]`} 
                      dataKey={series.seriesID} 
                      fill={series.colorCode}
                      stroke={series.colorCode} />
                  })
                }
                {/* <Brush dataKey="KP(m)" height={30} stroke="#8884d8" /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LWD;
