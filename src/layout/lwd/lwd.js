import "./lwd.css"
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, Line } from 'recharts';

import Papa from 'papaparse';
import { CHART_RENDERING_TEXT,  DATA_LOADING_TEXT, INSTRUMENTATIONPOINT, RANGEPICKERSTYLE } from "../../constant";
import { DatePicker, Input } from "antd";
import PlaceGauge from "../../component/PlaceGauge/PlaceGauge";
import axios from 'axios';
import { convertToCustomFormat, dateFormat, findRange, getRailroadSection, intervalSample, measureTypeText, trackDataName, trackLeftRightToString } from "../../util";
import LoadingImg from "../../assets/icon/loading/loading.png";
import CloseIcon from "../../assets/icon/211650_close_circled_icon.svg";
import { isEmpty } from "lodash";
import qs from 'qs';

let route = sessionStorage.getItem('route');
function LWD( props ) {
  const [selectedPath, setSelectedPath] = useState({
    start_station_name : "",
    end_station_name : "",
    beginKp : 0,
    endKp : 0,
  });
  const [open, setOpen] = useState(false);
  const [dataExits, setDataExits] = useState([]);
  const [gaugeData, setGaugeData] = useState([]);
  const [lwdChartData, setLWDChartData] = useState([]);
  const [selectedGauge, setSelectedGauge] = useState("");
  const [railroadSection, setRailroadSection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataloading, setDataloading] = useState(false);

  const [dataExitsDate, setDataExitsDate] = useState({});
  const [viewMeasureDate, setViewMeasureDate] = useState(null);
  const [selectMeasureDate, setSelectMeasureDate] = useState(new Date());
  const [mode, setMode] = useState('month');

  const [chartseries, setChartseries] = useState([]);

  const [avg, setAvg] = useState(0);
  const [std, setSTD] = useState(0);
  const [si, setSI] = useState(0);
  
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
    axios.get('https://raildoctor.suredatalab.kr/api/lwds/ts',{
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
    axios.get('https://raildoctor.suredatalab.kr/api/lwds/kp',{
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
    <div className="railRoughness trackDeviation railTrackAlignment" >
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
                  axios.get('https://raildoctor.suredatalab.kr/api/lwds',{
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
                    let combinedArray = response.data.kp.map((x, index) => {
                      return { kp: x, stiffness: response.data.stiffness[index] };
                    });
                    setLWDChartData(combinedArray);
                    setAvg(response.data.average);
                    setSTD(response.data.std);
                    setSI(response.data.si);
                  })
                  .catch(error => console.error('Error fetching data:', error));
                }} >
                  조회
                </button>
              </div>
            </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 240px)" }}>
        <div className="containerTitle">Chart
          <div className="selectPoints">
            {
              chartseries.map( (point, i) => {
                return <div key={i} className="point">
                  {`${convertToCustomFormat(point.kp*1000)}(${trackLeftRightToString(point.railTrack)})-${measureTypeText(point.measureType)}-${point.measureDate}`}
                  <img src={CloseIcon} alt="제거" 
                    onClick={()=>{
                      /* let selectPoints_ = [...selectPoints];
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
                      deleteNonObj(monthlyChartDataObj); */
                    }}
                  />
                </div>
              })
            }
          </div>
        </div>
        <div className="componentBox chartBox flex">
        { (loading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{CHART_RENDERING_TEXT}</div> : null }
        { (dataloading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{DATA_LOADING_TEXT}</div> : null }
          <div className="addData">
            <div className="dataLines">
                <div className="title">{`${selectMeasureDate}[${convertToCustomFormat(selectedPath.beginKp)}-${convertToCustomFormat(selectedPath.endKp)}]`}</div>
                <div className="line">
                  <div className="lineName">Average</div>
                  <div className="lineVal">{avg}</div>
                </div>
                <div className="line">
                  <div className="lineName">STD</div>
                  <div className="lineVal">{std}</div>
                </div>
                <div className="line">
                  <div className="lineName">SI</div>
                  <div className="lineVal">{si}</div>
                </div>
            </div>
            {/* <div className="dataLines">
                <div className="title">2023-01-01[15K000~16K000]</div>
                <div className="line">
                  <div className="lineName">Average</div>
                  <div className="lineVal">104.97</div>
                </div>
                <div className="line">
                  <div className="lineName">STD</div>
                  <div className="lineVal">57.20</div>
                </div>
                <div className="line">
                  <div className="lineName">SI</div>
                  <div className="lineVal">47.77</div>
                </div>
            </div>
            <div className="dataLines">
                <div className="title">2023-01-01[15K000~16K000]</div>
                <div className="line">
                  <div className="lineName">Average</div>
                  <div className="lineVal">104.97</div>
                </div>
                <div className="line">
                  <div className="lineName">STD</div>
                  <div className="lineVal">57.20</div>
                </div>
                <div className="line">
                  <div className="lineName">SI</div>
                  <div className="lineVal">47.77</div>
                </div>
            </div> */}
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
                <Tooltip />
                <Legend />
                <Line dataKey="stiffness" stroke="#82ca9d" dot={false} />
                {/* {
                  chartseries.map( (series, i) => {
                    console.log(series.datakey);
                    return <Line key={i}
                      name={`${convertToCustomFormat(series.kp*1000)}${series.trackSide}-${series.measureTypeText}_${trackDataName(series.item)}`} 
                      dataKey={series.datakey} fill={series.colorCode} />
                  })
                } */}
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
