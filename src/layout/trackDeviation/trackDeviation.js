import "./trackDeviation.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";
import Box from '@mui/material/Box';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BOXSTYLE, RADIO_STYLE, RANGEPICKERSTYLE, STRING_CANT, STRING_DIRECTION, STRING_DISTORTION, STRING_DOWN_TRACK, STRING_HEIGHT, STRING_RAIL_DISTANCE, STRING_UP_TRACK } from "../../constant";
import { Checkbox, DatePicker, Input, Radio, Select } from "antd";
import { Modal } from "@mui/material";
import axios from 'axios';
import qs from 'qs';
import { convertQuarterFormat, convertToCustomFormat, dateFormat, findRange, getQuarterFromDate, getRailroadSection, getStartEndDatesFromQuarter, isEmpty, trackToString, transposeObjectToArray } from "../../util";
import EmptyImg from "../../assets/icon/empty/empty5.png";

function TrackDeviation( props ) {
  const [selectedPath, setSelectedPath] = useState({
    start_station_name : "",
    end_station_name : "",
    beginKp : 0,
    endKp : 0,
  });
  const [open, setOpen] = useState(false);
  const [selectRange, setSelectRange] = useState("");
  const [dataExits, setDataExits] = useState([]);
  const [selectTrack, setSelectTrack] = useState(STRING_UP_TRACK);
  const [selectMeasureDate, setSelectMeasureDate] = useState(null);
  const [selectCheckBox, setSelectCheckBox] = useState([]);
  
  const [searchChartView, setSearchChartView] = useState([]);
  
  const [heightChartData, setHeightChartData] = useState([]);
  const [directionChartData, setDirectionChartData] = useState([]);
  const [cantChartData, setCantChartData] = useState([]);
  const [raildistanceChartData, setRaildistanceChartData] = useState([]);
  const [distortionChartData, setDistortionChartData] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);

  const [viewMeasureDate, setViewMeasureDate] = useState(null);
  const [dataExitsDate, setDataExitsDate] = useState({});
  const [mode, setMode] = useState('month');

  const [reportSelectRange, setReportSelectRange] = useState("");
  const [reportSelectMeasureDate, setReportSelectMeasureDate] = useState(null);
  const [reportSelectPath, setReportSelectPath] = useState("");
  const [reportSelectTrack, setReportSelectTrack] = useState("");
  const [quarterOptions, setQuarterOptions] = useState([]);
  const [chartKPMoveIndex, setChartKPMoveIndex] = useState(0);

  const [reportData, setReportData] = useState({});

  const pathClick = (select) => {
    console.log(select);
    setSelectedPath(select);
    setViewMeasureDate(null);
    setSelectMeasureDate(null);
    getMeasureQuarter(select.beginKp, select.endKp);
  }

  const getMeasureQuarter = (beginKp, endKp) => {
    let start = beginKp;
    let end = endKp;
    start = (start>0) ? start/1000 : start;
    end = (end>0) ? end/1000 : end;
    console.log(start,end);
    let route = sessionStorage.getItem('route');
    let param = {
      begin_kp : [start],
      end_kp : [end],
      railroad_name : route
    }
    console.log(param);
    axios.get(`https://raildoctor.suredatalab.kr/api/railtwists/ts`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat' })
      },
      params : param
    })
    .then(response => {
      setSelectRange("");
      console.log(response.data);
      const quarters = new Map();
      response.data.listTs.forEach(dateString => {
        const { label, value } = getQuarterFromDate(dateString); // 각 날짜를 분기로 변환합니다.
        quarters.set(label, value); // Map에 'y' 값을 key로, 'o' 값을 value로 저장합니다.
      });
      setQuarterOptions(Array.from(quarters.entries())
      .sort()
      .map(([label, value]) => ({ value, label })));
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const getMeasureDatas = () => {
    if( !selectRange || selectRange === "" || selectRange === null || selectRange === undefined ){
      return;
    }
    let range = getStartEndDatesFromQuarter(selectRange);
    let start = selectedPath.beginKp;
    let end = selectedPath.endKp;
    start = (start>0) ? start/1000 : start;
    end = (end>0) ? end/1000 : end;
    console.log(start,end);
    let route = sessionStorage.getItem('route');
    let param = {
      begin_kp : [start],
      end_kp : [end],
      rail_track : selectTrack,
      begin_measure_ts : new Date(range.start).toISOString(),
      end_measure_ts : new Date(range.end).toISOString(),
      railroad_name : route
    }
    console.log(param);
    let dataExitsDate_ ={};
    axios.get(`https://raildoctor.suredatalab.kr/api/railtwists/ts`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat' })
      },
      params : param
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

  const checkboxChagne = (val) => {
    setSelectCheckBox(val);
  }

  const disabledDate = (current) => {
    return !dataExitsDate[dateFormat(current.$d)];
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleCalendarChange = (date) => {
    setViewMeasureDate(date);
    if( date === null ){
      return;
    }
    setMode('month');
    setSelectMeasureDate(dateFormat(date.$d));
  };

  const selectChange = (val) => {
    setSelectRange(val);
  }

  const handlePanelChange = (value, newMode) => {
    if (mode === 'month') {
      setMode('date');
    } else {
      setMode('month');
    }
  };

  const getChartData = ( alertBoolean, dataInit ) => {
    let searchChartView_ = [];
    let measureTs = new Date().toISOString();
    try{
      measureTs = dataExitsDate[selectMeasureDate][0];
    }catch(e){
      if(alertBoolean){alert("측정일자를 찾을 수 없습니다. 측정분기와 측정일자가 선택되어있는지 확인해주세요.")};
      return;
    }

    if( !selectTrack || selectTrack === "" || selectTrack === null || selectTrack === undefined ){
      return;
    }
    if( !selectedPath || selectedPath === "" || selectedPath === null || selectedPath === undefined ){
      return;
    }

    let route = sessionStorage.getItem('route');
    if( dataInit ){
      setHeightChartData([]);
      setDirectionChartData([]);
      setCantChartData([]);
      setRaildistanceChartData([]);
      setDistortionChartData([]);
    }
    for( let option of selectCheckBox ){
      let start = selectedPath.beginKp;
      let end = selectedPath.endKp;
      start = (start>0) ? start/1000 : start;
      end = (end>0) ? end/1000 : end;

      let add = (end-start) * chartKPMoveIndex;
      let param = {
        begin_kp : [start + add],
        end_kp : [end + add],
        measure_ts : measureTs,
        rail_track : selectTrack,
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
        console.log(response.data);
        let dataAry = [];
        try{
          dataAry = transposeObjectToArray(response.data);
        }catch(e){
          alert("데이터가 없습니다.");
          return;
        }

        setReportSelectRange(selectRange);
        setReportSelectMeasureDate(measureTs);
        setReportSelectPath(selectedPath);
        setReportSelectTrack(selectTrack);
        
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
        searchChartView_.push(option);
        setSearchChartView(searchChartView_);

        axios.get(`https://raildoctor.suredatalab.kr/api/railtwists/report`,{
          paramsSerializer: params => {
            return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
          },
          params : param
        })
        .then(response => {
          console.log(response.data);
          setReportData(response.data);
        })
        .catch(error => console.error('Error fetching data:', error));

      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }

  
  const dataOption = [
    { label: '고저틀림', value: STRING_HEIGHT },
    { label: '방향틀림', value: STRING_DIRECTION },
    { label: '캔트틀림', value: STRING_CANT },
    { label: '궤간틀림', value: STRING_RAIL_DISTANCE },
    { label: '비틀림', value: STRING_DISTORTION },
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
    getChartData(false, false);
  }, [chartKPMoveIndex]);

  useEffect( () => {
    if( !selectRange || selectRange === "" || selectRange === null || selectRange === undefined ){
      return;
    }
    if( !selectTrack || selectTrack === "" || selectTrack === null || selectTrack === undefined ){
      return;
    }
    if( !selectedPath || selectedPath === "" || selectedPath === null || selectedPath === undefined ){
      return;
    }
    getMeasureDatas();
  }, [selectedPath, selectTrack, selectRange]);

  useEffect( ()=> {
    if( railroadSection.length < 2 ){
      return;
    }
    let route = sessionStorage.getItem('route');
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    axios.get('https://raildoctor.suredatalab.kr/api/railtwists/kp',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroadName : route,
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

      /* setUpTrackMeasurePoint([...new Set(response.data.t2)]);
      setDownTrackMeasurePoint([...new Set(response.data.t1)]); */
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection])
  
  const getKPRangeText = ()=>{
    let start = selectedPath.beginKp;
    let end = selectedPath.endKp;
    start = (start>0) ? start/1000 : start;
    end = (end>0) ? end/1000 : end;
    let add = (end-start) * chartKPMoveIndex;
    return `${convertToCustomFormat((start + add) * 1000)} ~ ${convertToCustomFormat(((end + add) * 1000))}`;
  }

  return (
    <div className="trackDeviation" >
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
                <div className="title">측정분기 </div>
                <div className="date">
                  <Select
                    value={selectRange}
                    style={{...{ width : 170 },...RANGEPICKERSTYLE}}
                    onChange={selectChange}
                    options={quarterOptions}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">상하선 </div>
                <div className="track">
                <Radio.Group style={RADIO_STYLE} value={selectTrack} defaultValue={selectTrack} 
                  onChange={(e)=>{setSelectTrack(e.target.value)}}
                >
                  <Radio value={STRING_UP_TRACK} >상선</Radio>
                  <Radio value={STRING_DOWN_TRACK} >하선</Radio>
                </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                { (isEmpty(dataExitsDate)) ? <div className="alertText" >검색된 날짜가 없습니다</div> : null }
                  <DatePicker 
                    disabled={isEmpty(dataExitsDate)}
                    value={viewMeasureDate}
                    style={RANGEPICKERSTYLE} 
                    disabledDate={disabledDate}
                    onChange={handleCalendarChange}
                    mode={mode} 
                    onPanelChange={handlePanelChange}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">데이터 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                  <Checkbox.Group 
                    options={dataOption} 
                    onChange={checkboxChagne}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <button className="search" onClick={()=>{
                  getChartData(true, true);
                }}>조회</button>
              </div>
            </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 250px)", position:"relative"}}>
        {
            (heightChartData.length < 1 && directionChartData.length < 1 && cantChartData.length < 1 && raildistanceChartData.length < 1 && distortionChartData.length < 1 ) ? 
            null : <>
              <div className="searchKPRange">{getKPRangeText()}</div>
              <div className="chartMoveBtn left" onClick={()=>{setChartKPMoveIndex( prev => prev-1 )}} >&lt; Left</div>
              <div className="chartMoveBtn right" onClick={()=>{setChartKPMoveIndex( prev => prev+1 )}} >Right &gt;</div>
            </>
        }
        <div className="containerTitle">Chart
          <div className="flex">
            <div className="modalButton highlight orange" onClick={()=>{
              setOpen(true);
            }} >Report</div>
          </div>
        </div>
        <div className="componentBox chartBox">
        {
            (heightChartData.length < 1 && directionChartData.length < 1 && cantChartData.length < 1 && raildistanceChartData.length < 1 && distortionChartData.length < 1 ) ? 
            <div className="emptyBox">
              <img src={EmptyImg} />
              <h1>차트데이터가 없습니다</h1>
              <div>
                차트에 출력할 데이터가 없습니다. <br/>
                측정분기 선택 - 상하선 선택 - 구간 선택 - 측정일자 선택 - 측정일자 선택 - 조회버튼 클릭
              </div>
            </div> : 
              searchChartView.map( (type, i) => {
                let data = [];
                let series = [];
                if( type === STRING_HEIGHT ){
                  data = heightChartData;
                  series.push(<Line type="monotone" name="좌레일-고저틀림" dataKey="valueLeft" stroke="#4371C4" dot={false} />);
                  series.push(<Line type="monotone" name="우레일-고저틀림" dataKey="valueRight" stroke="#A349A4" dot={false} />);
                }else if( type === STRING_DIRECTION ){
                  data = directionChartData
                  series.push(<Line type="monotone" name="좌레일-방향틀림" dataKey="valueLeft" stroke="#4371C4" dot={false} />);
                  series.push(<Line type="monotone" name="우레일-방향틀림" dataKey="valueRight" stroke="#A349A4" dot={false} />);
                }else if( type === STRING_CANT ){
                  data = cantChartData
                  series.push(<Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} />);
                  series.push(<Line type="monotone" name="캔트틀림" dataKey="cantTwist" stroke="#A349A4" dot={false} />);
                }else if( type === STRING_RAIL_DISTANCE ){
                  data = raildistanceChartData
                  series.push(<Line type="monotone" name="궤간틀림" dataKey="value" stroke="#4371C4" dot={false} />);
                }else if( type === STRING_DISTORTION ){
                  data = distortionChartData
                  series.push(<Line type="monotone" name="비틀림" dataKey="value" stroke="#4371C4" dot={false} />);
                }

                return <ResponsiveContainer key={i} width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid />
                  <XAxis dataKey="kp" interval={150} tickFormatter={(value) => value.toFixed(2)} />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {series.map( obj => {
                    return obj;
                  })}
    
                  <Line type="monotone" name="목표기준(상)" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                  <Line type="monotone" name="목표기준(하)" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                  <Line type="monotone" name="보수기준(상)" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                  <Line type="monotone" name="보수기준(하)" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                  <Line type="monotone" name="주의기준(상)" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                  <Line type="monotone" name="주의기준(하)" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              })
        }
        </div>
      </div>

      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={BOXSTYLE} >
            <div className="trackReportPopupTitle">
              궤도틀림 Report
              <div className="closeBtn" onClick={()=>{setOpen(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="trackReportPopupContent">
              <div className="table" style={{marginTop:"10px", width:"400px"}}>
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td">측정분기</div>
                    <div className="td">측정일자</div>
                    <div className="td">구간</div>
                  </div>
                </div>
                <div className="tableBody">
                  <div className="tr">
                    <div className="td">{convertQuarterFormat(reportSelectRange)}</div>
                    <div className="td">{dateFormat(new Date(reportSelectMeasureDate))}</div>
                    <div className="td">{reportSelectPath.start_station_name+" - "+reportSelectPath.end_station_name}</div>
                  </div>
                </div>
              </div>
              <div className="table trackDeviationReportTable" style={{marginTop:"10px", alignItems: "baseline"}}>
                <div className="tableHeader" style={{width: "calc(100% - 20px)"}}>
                  <div className="tr">
                    <div className="td colspan2"><div className="colspan2">Rail</div></div>
                    <div className="td rowspan2"><div className="rowspan2">Position</div></div>
                    <div className="td rowspan2"></div>
                    {/* <div className="td colspan2"><div className="colspan2">Length</div></div> */}
                    <div className="td rowspan2"><div className="rowspan2">Worst Defect</div></div>
                    <div className="td rowspan2"></div>
                    <div className="td colspan2"><div className="colspan2">Threshold Value</div></div>
                    <div className="td colspan2"><div className="colspan2">Excess</div></div>
                    <div className="td colspan2"><div className="colspan2">Alarm</div></div>
                    <div className="td rowspan2"><div className="rowspan2">게이지 마모량</div></div>
                    <div className="td rowspan2"></div>
                  </div>
                  <div className="tr">
                    <div className="td colspan2"></div>
                    <div className="td">Begin</div>
                    <div className="td">End</div>
                    {/* <div className="td colspan2"></div> */}
                    <div className="td">Postion</div>
                    <div className="td">Value</div>
                    <div className="td colspan2"></div>
                    <div className="td colspan2"></div>
                    <div className="td colspan2"></div>
                    <div className="td">Max</div>
                    <div className="td">Min</div>
                  </div>
                </div>
                <div className="tableBody" style={{overflowY: "scroll", height: "500px", display: "block"}}>
                  {
                    reportData?.entity?.map( entitie => {
                      return <div className="tr">
                        <div className="td">{trackToString(reportSelectTrack)}</div>
                        <div className="td">{reportData.beginKp}</div>
                        <div className="td">{reportData.endKp}</div>
                        {/* <div className="td">1.25</div> */}
                        <div className="td">{entitie.position}</div>
                        <div className="td">{entitie.value}</div>
                        <div className="td">{entitie.thresholdValue}</div>
                        <div className="td">{entitie.excess.toFixed(2)}</div>
                        <div className="td">{entitie.alarm}</div>
                        <div className="td">{entitie.maxWear}</div>
                        <div className="td">{entitie.minWear}</div>
                      </div>
                    })
                  }
                  {/* <div className="tr">
                    <div className="td">Long</div>
                    <div className="td">15785.25</div>
                    <div className="td">18784</div>
                    <div className="td">1.25</div>
                    <div className="td">15785</div>
                    <div className="td">16.5</div>
                    <div className="td">15</div>
                    <div className="td">1.5</div>
                    <div className="td">T1</div>
                    <div className="td">5.3</div>
                    <div className="td">5.26</div>
                  </div> */}
                </div>
              </div>
            </div>
          </Box>
        </Modal>

    </div>
  );
}

export default TrackDeviation;
