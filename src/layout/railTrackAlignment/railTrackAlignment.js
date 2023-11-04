import "./railTrackAlignment.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import ReportIcon from "../../assets/icon/1291748_magnify_magnifying glass_marketing_report_financial_icon.svg";

import faker from 'faker';
import { DatePicker, Input, Radio, Select } from "antd";
import { RADIO_STYLE, RANGEPICKERSTYLE, STRING_DOWN_TRACK, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_TRACK_DIR_LEFT, STRING_TRACK_DIR_RIGHT, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT } from "../../constant";
import axios from 'axios';
import qs from 'qs';
import { convertToCustomFormat, findRange, formatDateTime, getRailroadSection, nonData } from "../../util";

const { RangePicker } = DatePicker;

let dataExistKPs = {t1 : [], t2 : []};
function RailTrackAlignment( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataExits, setDataExits] = useState([]);
  const [selectTrack, setSelectTrack] = useState(STRING_UP_TRACK);
  const [selectDir, setSelectDir] = useState(STRING_TRACK_DIR_LEFT);
  const [kpOptions, setKpOptions] = useState([]);
  const [selectKP, setSelectKP] = useState("");
  const [reports, setReports] = useState([]);
  const [selectDateRange, setSelectDateRange] = useState([{$d:new Date()}, {$d:new Date()}]);
  const [pdfDataList , setPDFDataList] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);
  
  const [trackGeo, setTrackGeo] = useState({});
  
  const pathClick = (select) => {
    console.log(select);
    setSelectedPath(select);
  }

  const getKPOptions = () => {
    let startKP = selectedPath.beginKp;
    let endKP = selectedPath.endKp;
    let kpOptions_ = [];
    if( selectTrack === STRING_UP_TRACK ){
      for( let kp of dataExistKPs.t2 ){
        if( (kp * 1000) >= startKP &&
            (kp * 1000) <= endKP
        ){
          let options = {
            'label' : convertToCustomFormat(kp * 1000),
            'value' : kp
          }
          kpOptions_.push(
            options
          );
        }
      }
    }else if( selectTrack === STRING_DOWN_TRACK ){
      for( let kp of dataExistKPs.t1 ){
        if( (kp * 1000) >= startKP &&
            (kp * 1000) <= endKP
        ){
          let options = {
            'label' : convertToCustomFormat(kp * 1000),
            'value' : kp
          }
          kpOptions_.push(
            options
          );
        }
      }
    }
    setKpOptions(kpOptions_);
  }

  const handleClose = () => {
    setOpen(false);
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
  
  useEffect( ()=> {
    if( railroadSection.length < 2 ){
      return;
    }
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    let route = sessionStorage.getItem('route');
    axios.get('https://raildoctor.suredatalab.kr/api/railstraights/locations',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        begin : railroadSection[0].displayName,
        end : railroadSection[railroadSection.length-1].displayName
      }
    })
    .then(response => {
      console.log(response.data);
      let dataArr = [];
      let index = -1;
      railroadSection.forEach( data => {
        dataArr.push(0);
      });
      let dataExits_ = [...dataArr];
      
      console.log(response.data);
      dataExistKPs = response.data;
      for( let kp of response.data.t1 ){
        index = findRange(railroadSection, kp * 1000);
        dataExits_[index]++;
      }
      for( let kp of response.data.t2 ){
        index = findRange(railroadSection, kp * 1000);
        dataExits_[index]++;
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection])

  useEffect(()=>{
    let route = sessionStorage.getItem('route');
    axios.get('https://raildoctor.suredatalab.kr/api/railroads/rails',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        kp :  selectKP
      }
    })
    .then(response => {
      console.log(response.data);
      setTrackGeo(response.data);
    })
    .catch(error => console.error('Error fetching data:', error));    
  }, [selectKP])

  useEffect( () => {
    getKPOptions();
  }, [selectedPath, selectTrack]);
  
  return (
    <div className="trackDeviation railRoughness" >
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
                <div className="title">상하선 </div>
                <div className="track">
                <Radio.Group style={RADIO_STYLE} defaultValue={selectTrack} value={selectTrack} 
                  onChange={(e)=>{setSelectTrack(e.target.value)}}
                >
                  <Radio value={STRING_UP_TRACK}>상선</Radio>
                  <Radio value={STRING_DOWN_TRACK}>하선</Radio>
                </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">좌우 </div>
                <div className="track">
                <Radio.Group style={RADIO_STYLE} defaultValue={selectDir} value={selectDir} 
                  onChange={(e)=>{setSelectDir(e.target.value)}}
                >
                  <Radio value={STRING_TRACK_DIR_LEFT}>좌</Radio>
                  <Radio value={STRING_TRACK_DIR_RIGHT}>우</Radio>
                </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  {/* <Input placeholder="KP"
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <Select
                    defaultValue={selectKP}
                    value={selectKP}
                    style={{
                      width: 200,
                    }}
                    onChange={(val)=>{setSelectKP(val)}}
                    options={kpOptions}
                  />
                </div>
              </div>
              <div className="dataOption" style={{marginLeft:"10px"}}>
              {nonData(trackGeo.shapeDisplay)} /
                R={nonData(trackGeo.direction)} {nonData(trackGeo.radius)} (C={nonData(trackGeo.cant)}, S={nonData(trackGeo.slack)})
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  <RangePicker 
                    style={RANGEPICKERSTYLE}
                    onChange={(date)=>{setSelectDateRange(date)}}
                  />
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <button className="search" onClick={()=>{
                  let track_ = "";
                  if( selectTrack === STRING_UP_TRACK && selectDir === STRING_TRACK_DIR_LEFT ){
                    track_ = STRING_UP_TRACK_LEFT;
                  }else if( selectTrack === STRING_UP_TRACK && selectDir === STRING_TRACK_DIR_RIGHT ){
                    track_ = STRING_UP_TRACK_RIGHT;
                  }else if( selectTrack === STRING_DOWN_TRACK && selectDir === STRING_TRACK_DIR_LEFT ){
                    track_ = STRING_DOWN_TRACK_LEFT;
                  }else if( selectTrack === STRING_DOWN_TRACK && selectDir === STRING_TRACK_DIR_RIGHT ){
                    track_ = STRING_DOWN_TRACK_RIGHT;
                  }
                  let route = sessionStorage.getItem('route');
                  axios.get('https://raildoctor.suredatalab.kr/api/railstraights/straights',{
                    paramsSerializer: params => {
                      return qs.stringify(params, { format: 'RFC3986' })
                    },
                    params : {
                      railroad : route,
                      railTrack : track_,
                      kp : selectKP,
                      beginTs : selectDateRange[0].$d.toISOString(),
                      endTs : selectDateRange[1].$d.toISOString()
                    }
                  })
                  .then(response => {
                    console.log(response.data);
                    setReports(response.data.entities);
                  })
                  .catch(error => console.error('Error fetching data:', error));
                }} >조회</button>
              </div>
            </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 245px)"}}>
        <div className="containerTitle">보고서 목록</div>
        <div className="componentBox chartBox flex">
          <div className="table" style={{ justifyContent: "flex-start" }} >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td no">No.</div>
                  <div className="td regDate">측정일자</div>
                  <div className="td track">Track</div>
{/*                   <div className="td rail">Rail</div>
                  <div className="td station">Station/tag</div> */}
                  <div className="td weld">Type of weld</div>
{/*                   <div className="td weld">누적통과톤수</div> */}
                  <div className="td viewBtn"></div>
                </div>
              </div>
              <div className="tableBody">
                {
                  reports.map( (report, i) => {
                    return <div key={i+1} className="tr">
                    <div className="td no">{i+1}</div>
                    <div className="td regDate">{formatDateTime(new Date(report.measureTs))}</div>
                    <div className="td track">{report.railTrack}</div>
                    <div className="td weld">{report.welding}</div>
                    <div className="td viewBtn">
                      {
                        report.file.map( file => {
                          if(file.originName.indexOf("QI") > -1){
                            return <div className="viewBtn" onClick={()=>{
                              axios.get('https://raildoctor.suredatalab.kr/api/railstraights/files',{
                                paramsSerializer: params => {
                                  return qs.stringify(params, { format: 'RFC3986' })
                                },
                                params : {
                                  measureId : report.measureId,
                                  fileType : 2
                                }
                              })
                              .then(response => {
                                console.log(response.data);
                                for( let file_ of response.data.file ){
                                  if( file_.originName.indexOf(file.originName) > -1 ){
                                    window.open(`https://raildoctor.suredatalab.kr/resources${file_.filePath}`);
                                  }
                                }
                              })
                              .catch(error => console.error('Error fetching data:', error));
                            }} >QI</div>
                          }else{
                            return <div className="viewBtn" onClick={()=>{
                              axios.get('https://raildoctor.suredatalab.kr/api/railstraights/files',{
                                paramsSerializer: params => {
                                  return qs.stringify(params, { format: 'RFC3986' })
                                },
                                params : {
                                  measureId : report.measureId,
                                  fileType : 2
                                }
                              })
                              .then(response => {
                                console.log(response.data);
                                for( let file_ of response.data.file ){
                                  if( file_.originName.indexOf(file.originName) > -1 ){
                                    window.open(`https://raildoctor.suredatalab.kr/resources${file_.filePath}`);
                                  }
                                }
                              })
                              .catch(error => console.error('Error fetching data:', error));
                            }}>Abs.</div>
                          }
                        })
                      }
                    </div>
                  </div>
                  })
                }
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default RailTrackAlignment;
