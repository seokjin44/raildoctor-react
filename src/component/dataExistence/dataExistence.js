import React, { useEffect, useState } from "react";
import "./dataExistence.css"
import { Box, Modal, Tab } from "@mui/material";
import { BOXSTYLE, DIRECTWEARINFODUMMY, IncheonKP, SIDEWEARINFODUMMY, TEMPDATA1DUMMY, TRACKDEVIATIONDUMMY, TRACKGMDUMMYDATA1, TRACKGMDUMMYDATA2, TRACKGMDUMMYDATA3 } from "../../constant";
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
import { convertToCustomFormat } from "../../util";

function DataExistence( props ) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState('1');
  const [kptoPixel, setKPtoPixel] = useState(3000);
  const LINE_TITLE_WIDTH = 120;
  const kpto1Pixcel = 1;
  const [kpList, setKPList] = useState([]);
  const handleClose = () => {
    setOpen(false);
  }
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    console.log(document.getElementById("dataExistenceContainer").clientWidth);
    setKPtoPixel(IncheonKP.end * kpto1Pixcel);
    let kpList_ = [];
    for( let i = IncheonKP.start; i < IncheonKP.end; i++ ){
      if( i % 1000 === 0 ){
        kpList_.push(i);
      }
    }
    setKPList(kpList_);
  }, []);

  useEffect(() => {
    console.log(props.kp);
    let left = (
      props.kp > document.getElementById('dataExistenceContainer').clientWidth/2
    ) ? parseFloat(props.kp) - document.getElementById('dataExistenceContainer').clientWidth/2 : 0;
    console.log(left);
    document.getElementById('dataExistenceContainer').scroll({
      top: 0,
      left: left,
      behavior: "smooth",
    });
  },[ props.kp ]);

  return (
    <div className="boxProto datafinder" id="dataExistenceContainer">
      <div className="dataList">
        <div className="line" style={{width:kptoPixel}} >
          <div className="dataName">KP</div>
          <div className="dataBar kp">
            {
              kpList.map( kp => {
                return <div className="kp" style={{left:kp}} >{convertToCustomFormat(kp)}</div>;
              })
            }
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          <div className="dataName">통과톤수</div>
          <div className="dataBar">
            <div className="detailBtn" style={{left:"0.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"9.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"12.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"81.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"78.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"65.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          <div className="dataName">마모 유지관리</div>
          <div className="dataBar">
            <div className="detailBtn" style={{left:"3%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"35%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"12%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"28%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"59%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"91%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          <div className="dataName">궤도틀림</div>
          <div className="dataBar">
            <div className="detailBtn" style={{left:"4.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"97%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"65%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"71%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"50%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"41%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          <div className="dataName">궤도거동계측</div>
          <div className="dataBar">
            <div className="detailBtn" style={{left:"77%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"6%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"51%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"31%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"39%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"81"}} onClick={()=>{setOpen(true)}}>상세보기</div>
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          <div className="dataName">온/습도 측정</div>
          <div className="dataBar">
            <div className="detailBtn" style={{left:"8%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"88%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"77%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"66%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"55%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"44%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
          </div>
        </div>
      </div>

      
      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={BOXSTYLE} >
            <div className="popupTitle"><img src={PopupIcon} />데이터 상세요약</div>
          <TabContext value={tabValue} > 
            <Box sx={{ borderBottom: 1, borderColor: 'divider'  }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" >
                <Tab style={{fontFamily : 'NEO_R'}} label="통과톤수" value="1" />
                <Tab style={{fontFamily : 'NEO_R'}} label="마모유지관리" value="2" />
                <Tab style={{fontFamily : 'NEO_R'}} label="궤도틀림" value="3" />
                <Tab style={{fontFamily : 'NEO_R'}} label="궤도거동계측" value="4" />
                <Tab style={{fontFamily : 'NEO_R'}} label="온/습도" value="5" />
                {/* <Tab style={{fontFamily : 'NEO_R'}} label="레일프로파일" value="6" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일직진도" value="7" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일조도" value="8" /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="tabPanel throughput">
                <div className="contentBox" style={{height: "100px", marginBottom:"10px"}} >
                  <div className="containerTitle">하선 - 현재 누적통과톤수</div>
                  <div className="componentBox flex section ">
                    <div className="curDate optionBox borderColorGreen">
                      <div className="optionTitle">현재날짜</div>
                      <div className="optionValue">2023/07/03</div>
                    </div>
                    <div className="curDate optionBox borderColorGreen">
                      <div className="optionTitle">KP</div>
                      <div className="optionValue">15k520</div>
                    </div>
                    <div className="curDate optionBox borderColorGreen">
                      <div className="optionTitle">좌레일</div>
                      <div className="optionValue">414,953,971</div>
                    </div>
                    <div className="curDate optionBox borderColorGreen" >
                      <div className="optionTitle">우레일</div>
                      <div className="optionValue">414,953,971</div>
                    </div>
                  </div>
                </div>
                <div className="contentBox" style={{height: "100px"}} >
                  <div className="containerTitle">상선 - 현재 누적통과톤수</div>
                  <div className="componentBox flex section ">
                    <div className="curDate optionBox borderColorGreen">
                      <div className="optionTitle">현재날짜</div>
                      <div className="optionValue">2023/07/03</div>
                    </div>
                    <div className="curDate optionBox borderColorGreen">
                      <div className="optionTitle">KP</div>
                      <div className="optionValue">15k520</div>
                    </div>
                    <div className="curDate optionBox borderColorGreen">
                      <div className="optionTitle">좌레일</div>
                      <div className="optionValue">414,953,971</div>
                    </div>
                    <div className="curDate optionBox borderColorGreen" >
                      <div className="optionTitle">우레일</div>
                      <div className="optionValue">414,953,971</div>
                    </div>
                  </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/cumulativeThroughput");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className="tabPanel"  style={{width: "915px", height: "565px" }}>
                <div className="contentBox" style={{marginLeft : 0, height:"100%"}}>
                  <div className="containerTitle bothEnds">
                    <div>마모정보</div>
                    <div className="dataOption" style={{right: "162px"}}>
                      <div className="value">
                        위치 : 15k520
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : 22년 2분기
                      </div>
                    </div>
                  </div>
                  <div className="componentBox separationBox">
                    <div className="componentBox" id="directWearInfo">
                      <WearInfo title="직마모" data={DIRECTWEARINFODUMMY} yTitle="직마모(mm)"></WearInfo>
                    </div>
                    <div className="componentBox" id="sideWearInfo">
                      <WearInfo title="편마모" data={SIDEWEARINFODUMMY} yTitle="편마모(mm)"></WearInfo>
                    </div>
                  </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/wearMaintenance");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="tabPanel" style={{width:"763px", height:"336px"}}>
                <div className="contentBox" style={{width:"100%", height: "100%"}}>
                  <div className="containerTitle">
                    Chart
                    <div className="dataOption" style={{right: "162px"}}>
                      <div className="value">
                        측정구간 : 간석오거리~인천시청 
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : 22년 2분기
                      </div>
                    </div>
                  </div>
                  <div className="componentBox chartBox flex">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        width={500}
                        height={300}
                        data={TRACKDEVIATIONDUMMY}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis dataKey="kp" interval={15} tickFormatter={(value) => value.toFixed(4)} fontSize={6} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" name="좌레일" dataKey="left" stroke="#4371C4" dot={false} />
                        <Line type="monotone" name="우레일" dataKey="right" stroke="#4371C4" dot={false} />
                        <Line type="monotone" name="목표기준" dataKey="target1" stroke="#4BC784" dot={false} />
                        <Line type="monotone" name="목표기준" dataKey="target2" stroke="#4BC784" dot={false} />
                        <Line type="monotone" name="보수기준" dataKey="repair1" stroke="#FF0606" dot={false} />
                        <Line type="monotone" name="보수기준" dataKey="repair2" stroke="#FF0606" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="4">
              <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
              <div className="contentBox" style={{height:"100%"}}>
                  <div className="containerTitle">Chart
                  <div className="dataOption" style={{right: "162px"}}>
                    <div className="value">
                        위치 : 15k520
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : 22년 2분기
                    </div>
                  </div>
                  </div>
                  <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                    {/* <Scatter options={optionsScatter} data={data} />
                    <Bar options={optionsBar1} data={dataBar} />
                    <Bar options={optionsBar2} data={dataBar} /> */}
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                        <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="A school" data={TRACKGMDUMMYDATA3} fill="#0041DC" />
                      </ScatterChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={TRACKGMDUMMYDATA2}
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
                        <Bar dataKey="weight" name="윤중" fill="#0041DC" />
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={TRACKGMDUMMYDATA1}
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
                        <Bar dataKey="weight" name="윤중" fill="#0041DC" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="5">
              <div className="tabPanel" style={{width:"763px", height:"336px"}}>
                <div className="contentBox" style={{height: "100%"}}>
                  <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "277px"}}>
                      <div className="value">
                        측정구간 : 간석오거리~인천시청
                      </div>
                    </div>
                    <div className="dataOption" style={{right: "174px"}}>
                      <div className="value">
                          위치 : 15k515
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : 2023.06.01
                      </div>
                    </div>
                  </div>
                  <div className="componentBox chartBox flex">
                    {/* <Chart type='bar' data={data} /> */}
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        width={500}
                        height={300}
                        data={TEMPDATA1DUMMY}
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
                        <Line dataKey="temp" stroke="#FF0000" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/MeasuringTemperatureHumidity");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="6">
              <div className="tabPanel">
                <div className="directBtn" onClick={()=>{navigate("/railProfile");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="7">
              <div className="tabPanel">
                <div className="directBtn" onClick={()=>{navigate("/railRoughness");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="8">
              <div className="tabPanel">
                <div className="directBtn" onClick={()=>{navigate("/railTrackAlignment");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
          </TabContext>
          </Box>
        </Modal>
    </div>
  );
}

export default DataExistence;