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

  useEffect(() => {
    getRailroadSection(setRailroadSection);
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
                    {/* <div className="td rail">Right</div> */}
                    {/* <div className="td station">15K242</div> */}
                    <div className="td weld">{report.welding}</div>
                    {/* <div className="td weld">431,235,694</div> */}
                    <div className="td viewBtn">
                      <div className="viewBtn" onClick={()=>{
                         /* setOpen(true)  */
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
                          /* setOpen(true);
                          let pdfData = []; */
                          for( let file of response.data.file ){
                            /* let url = `https://raildoctor.suredatalab.kr/resources${pdfFile.filePath}`; */
                            /* let url = `https://raildoctor.suredatalab.kr/resources/data/railstraights/bb6b47ac-d8ab-489b-8722-aefc76c06a14.pdf`;
                            console.log(url);
                            axios.get(url, {
                              responseType: 'arraybuffer', // 중요: PDF 데이터를 ArrayBuffer로 가져옵니다.
                            })
                            .then( response => {
                              pdfData.push( new Uint8Array(response.data) );
                              setPDFDataList(pdfData);
                            })
                            .catch(error => console.error('Error fetching data:', error));          */                 
                            window.open(`https://raildoctor.suredatalab.kr/resources${file.filePath}`);
                          }
                        })
                        .catch(error => console.error('Error fetching data:', error));
                        }}>
                        <img src={ReportIcon} />
                      </div>
                    </div>
                  </div>
                  })
                }
                {/* <div className="tr">
                  <div className="td no">1</div>
                  <div className="td regDate">23/5/31 2:10</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div>
                <div className="tr">
                  <div className="td no">1</div>
                  <div className="td regDate">23/5/31 4:20</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div>
                <div className="tr">
                  <div className="td no">2</div>
                  <div className="td regDate">23/6/1 3:51</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div>
                <div className="tr">
                  <div className="td no">3</div>
                  <div className="td regDate">23/6/12 1:15</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div>
                <div className="tr">
                  <div className="td no">4</div>
                  <div className="td regDate">23/6/15 5:26</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div>
                <div className="tr">
                  <div className="td no">5</div>
                  <div className="td regDate">23/6/17 5:17</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div>
                <div className="tr">
                  <div className="td no">6</div>
                  <div className="td regDate">23/7/1 4:17</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div>
                <div className="tr">
                  <div className="td no">7</div>
                  <div className="td regDate">23/7/10 4:28</div>
                  <div className="td track">Left</div>
                  <div className="td rail">Right</div>
                  <div className="td station">15K242</div>
                  <div className="td weld">TMW</div>
                  <div className="td weld">431,235,694</div>
                  <div className="td viewBtn">
                    <div className="viewBtn" onClick={()=>{ setOpen(true) }}>
                      <img src={ReportIcon} />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
        </div>
      </div>

      {/* <Modal
        open={open}
        onClose={(e)=>{console.log(e);handleClose()}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={RAIL_ROUGHNESS_BOXSTYLE} >
          {
            (pdfDataList.length > 0) ?
            <Document file={pdfDataList[0]}>
              <Page pageNumber={1} />
            </Document> : null
          }
          

        </Box>
      </Modal> */}

    </div>
  );
}

export default RailTrackAlignment;
