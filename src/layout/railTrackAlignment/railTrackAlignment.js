import "./railTrackAlignment.css";
import { useEffect, useRef, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import Position from "../../assets/zodo2.png";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";
import AlertIcon from "../../assets/icon/decision/3876149_alert_emergency_light_protection_security_icon.png";

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import { Modal } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import { RAILROADSECTION, RAILTRACKALIGNMENTDUMMYDATA1, RANGEPICKERSTYLE } from "../../constant";
import { DatePicker, Input } from "antd";

const style = {
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

function RailTrackAlignment( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
  }, []);

  
  return (
    <div className="trackDeviation railTrackAlignment" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">측정분기 </div>
                <div className="date">
                  <Select
                    style={{...{ width : 120 },...RANGEPICKERSTYLE}}
                    options={[
                      { value: '2022 1분기', label: '2022 1분기' },
                      { value: '2022 2분기', label: '2022 2분기' },
                      { value: '2022 3분기', label: '2022 3분기' },
                      { value: '2022 4분기', label: '2022 4분기' },
                    ]}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">선택구간 </div>
                <div className="date">
                  <Input placeholder="KP" value={"간석오거리 - 인천시청"}
                    style={RANGEPICKERSTYLE}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
      </div>
      <div className="contentBox" >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section " style={{ height: "130px"}} >

          <div className="position optionBox borderColorGreen" style={{width: "935px"}} >
            <div className="optionTitle">위치</div>
            <div className="optionValue">
              <img src={Position} />
            </div>
          </div>
        </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "480px"}}>
        <div className="containerTitle">Chart
          <div className="modalButton highlight orange" onClick={()=>{
              console.log("예측데이터 상세보기");
              setOpen(true);
            }} >유지보수지침</div>
        </div>
        <div className="componentBox chartBox flex">
          {/* <div id="trackCanvas" className="trackBox">
            <div className="curLine"></div>
            <canvas id="trackDetailCanvas"
                  ref={trackDetailCanvasRef}
                  onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                  onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                  onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
                  //onWheel={trackDetailHandleWheel}
              />
          </div> */}
          <div className="chartBox">
            <div className="curLine"></div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={RAILTRACKALIGNMENTDUMMYDATA1}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="km" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mm" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <div className="decisionPopupTitle">
              <img src={AlertIcon} />유지보수 지침등록 
              <div className="closeBtn" onClick={()=>{setOpen(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="decisionPopupContent">
              <div className="chartConatiner">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={RAILTRACKALIGNMENTDUMMYDATA1}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="km" fontSize={12} />
                    <YAxis  fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mm" stroke="#82ca9d" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="comment" style={{ marginTop: "50px"}} >
                <div className="commentTitle">유지보수 지침</div>
                <div className="commentInput">
                  <TextArea rows={6} />
                </div>
              </div>
              <div className="comment" style={{ marginTop: "15px"}} >
                <div className="commentTitle">유지보수 의사결정</div>
                <div className="commentInput">
                  <TextArea rows={6} />
                </div>
              </div>

            </div>
            <div className="decisionButtonContainer">
              <div className="button">유지보수 의사결정 등록</div>
            </div>
          </Box>
        </Modal>


    </div>
  );
}

export default RailTrackAlignment;
