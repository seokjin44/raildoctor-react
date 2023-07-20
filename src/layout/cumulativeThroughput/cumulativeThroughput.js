import { useLocation, useNavigate } from "react-router-dom";
import "./cumulativeThroughput.css";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
/* import Radio from '@mui/joy/Radio'; */
/* import RadioGroup from '@mui/joy/RadioGroup'; */
import CalendarImg from "../../assets/icon/calendar.svg";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
/* import { DatePicker } from '@mui/x-date-pickers/DatePicker'; */
import 'dayjs/locale/ko';
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useRef, useState } from "react";
import IncheonTrackImg from "../../assets/track/incheon_track2.png";
import CalendarIcon from "../../assets/icon/299092_calendar_icon.png";
import { DatePicker, Space, Input } from 'antd';
import { Radio } from 'antd';
import { RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE } from "../../constant";

const { RangePicker } = DatePicker;
const tableData = [{"topdown":"상선","leftRight":"좌&우","start":"117.306","end":"669.306","after":"552","change":"2007-3-16","regdate":"2021-12-31","value1":"280562738.375","value2":"41915.0739726026","expect":"2042-11-12"},
{"topdown":"상선","leftRight":"좌&우","start":"669.306","end":"1593.675","after":"924.369","change":"2007-3-16","regdate":"2021-12-31","value1":"280813832.995","value2":"42603.0044383561","expect":"2042-07-06"},
{"topdown":"상선","leftRight":"좌&우","start":"1593.675","end":"3149.885","after":"1556.21","change":"1999-10-6","regdate":"2021-12-31","value1":"414247761.4","value2":"42662.7625753424","expect":"2033-12-01"},
{"topdown":"상선","leftRight":"좌&우","start":"3149.885","end":"4223.693","after":"1073.808","change":"1999-10-6","regdate":"2021-12-31","value1":"414283307.54","value2":"42760.1492602739","expect":"2033-11-21"},
{"topdown":"상선","leftRight":"좌&우","start":"4223.693","end":"5334.044","after":"1110.351","change":"1999-10-6","regdate":"2021-12-31","value1":"414331612.86","value2":"42892.4926027396","expect":"2033-11-06"},
{"topdown":"상선","leftRight":"좌&우","start":"5334.044","end":"6225.616","after":"891.572","change":"1999-10-6","regdate":"2021-12-31","value1":"414437600.28","value2":"43182.8690958903","expect":"2033-10-06"},
{"topdown":"상선","leftRight":"좌&우","start":"6225.616","end":"7135.616","after":"910","change":"1999-10-6","regdate":"2021-12-31","value1":"414513394.25","value2":"43390.5238082191","expect":"2033-09-13"},
{"topdown":"상선","leftRight":"좌&우","start":"7135.616","end":"8576.31","after":"1440.694","change":"1999-10-6","regdate":"2021-12-31","value1":"414693044.91","value2":"43882.7173972602","expect":"2033-07-23"},
{"topdown":"상선","leftRight":"좌&우","start":"8576.31","end":"9546.311","after":"970.001","change":"1999-10-6","regdate":"2021-12-31","value1":"414795842.71","value2":"44164.3552054794","expect":"2033-06-24"},
{"topdown":"상선","leftRight":"좌&우","start":"9546.311","end":"10681.296","after":"1134.985","change":"1999-10-6","regdate":"2021-12-31","value1":"414737004.14","value2":"44003.1536438355","expect":"2033-07-11"},
{"topdown":"상선","leftRight":"좌&우","start":"10681.296","end":"11573.082","after":"891.786","change":"1999-10-6","regdate":"2021-12-31","value1":"414815071.5","value2":"44217.0368219177","expect":"2033-06-19"},
{"topdown":"상선","leftRight":"좌&우","start":"11573.082","end":"12431.845","after":"858.762999999999","change":"1999-10-6","regdate":"2021-12-31","value1":"414957109.06","value2":"44606.1808219177","expect":"2033-05-10"},
{"topdown":"상선","leftRight":"좌&우","start":"12431.845","end":"13554.793","after":"1122.948","change":"1999-10-6","regdate":"2021-12-31","value1":"414965630.86","value2":"44629.528219178","expect":"2033-05-08"},
{"topdown":"상선","leftRight":"좌&우","start":"13554.793","end":"14766.533","after":"1211.74","change":"1999-10-6","regdate":"2021-12-31","value1":"414953971.38","value2":"44597.5844383561","expect":"2033-05-11"},
{"topdown":"상선","leftRight":"좌&우","start":"14766.533","end":"16127.1145","after":"1360.5815","change":"1999-10-6","regdate":"2021-12-31","value1":"414949917.12","value2":"44586.4768767122","expect":"2033-05-12"},
{"topdown":"상선","leftRight":"좌&우","start":"16127.1145","end":"17112.9725","after":"985.858","change":"1999-10-6","regdate":"2021-12-31","value1":"415081547.29","value2":"44947.107479452","expect":"2033-04-06"},
{"topdown":"상선","leftRight":"좌&우","start":"17112.9725","end":"17923.053","after":"810.0805","change":"1999-10-6","regdate":"2021-12-31","value1":"415006588.63","value2":"44741.7412876711","expect":"2033-04-26"},
{"topdown":"상선","leftRight":"좌&우","start":"17923.053","end":"18732.4415","after":"809.388500000001","change":"1999-10-6","regdate":"2021-12-31","value1":"414917842.28","value2":"44498.6006027396","expect":"2033-05-21"},
{"topdown":"상선","leftRight":"좌&우","start":"18732.4415","end":"19570.7635","after":"838.322","change":"1999-10-6","regdate":"2021-12-31","value1":"414909636.6","value2":"44476.1192876711","expect":"2033-05-23"},
{"topdown":"상선","leftRight":"좌&우","start":"19570.7635","end":"20709.892","after":"1139.1285","change":"1999-10-6","regdate":"2021-12-31","value1":"414866286.79","value2":"44357.3526849314","expect":"2033-06-04"},
{"topdown":"상선","leftRight":"좌&우","start":"20709.892","end":"21580.7335","after":"870.841499999999","change":"1999-10-6","regdate":"2021-12-31","value1":"414814385.15","value2":"44215.1564109588","expect":"2033-06-19"},
{"topdown":"상선","leftRight":"좌&우","start":"21580.7335","end":"22630.636","after":"1049.9025","change":"1999-10-6","regdate":"2021-12-31","value1":"414753047.86","value2":"44047.1090410958","expect":"2033-07-06"},
{"topdown":"상선","leftRight":"좌&우","start":"22630.636","end":"23630.79","after":"1000.154","change":"1999-10-6","regdate":"2021-12-31","value1":"414607854.91","value2":"43649.3201369862","expect":"2033-08-17"},
{"topdown":"상선","leftRight":"좌&우","start":"23630.79","end":"24230.023","after":"599.233","change":"1999-10-6","regdate":"2021-12-31","value1":"414527551.12","value2":"43429.3097534246","expect":"2033-09-09"},
{"topdown":"상선","leftRight":"좌&우","start":"24230.023","end":"25170.016","after":"939.992999999999","change":"2009-6-1","regdate":"2021-12-31","value1":"243908021.225","value2":"43429.3097534246","expect":"2044-06-12"},
{"topdown":"상선","leftRight":"좌&우","start":"25170.016","end":"25989.807","after":"819.791000000001","change":"2009-6-1","regdate":"2021-12-31","value1":"243831524.245","value2":"43219.7289863013","expect":"2044-07-23"},
{"topdown":"상선","leftRight":"좌&우","start":"25989.807","end":"27410.884","after":"1421.077","change":"2009-6-1","regdate":"2021-12-31","value1":"243677018.495","value2":"42796.4255616437","expect":"2044-10-16"},
{"topdown":"상선","leftRight":"좌&우","start":"27410.884","end":"28401.186","after":"990.302000000003","change":"2009-6-1","regdate":"2021-12-31","value1":"243608815.045","value2":"42609.5667945205","expect":"2044-11-24"},
{"topdown":"상선","leftRight":"좌&우","start":"28401.186","end":"29290.964","after":"889.777999999998","change":"2009-6-1","regdate":"2021-12-31","value1":"243515012.035","value2":"42352.5722465752","expect":"2045-01-16"},
{"topdown":"상선","leftRight":"좌&우","start":"29290.964","end":"30111.031","after":"820.066999999999","change":"2009-6-1","regdate":"2021-12-31","value1":"243450711.365","value2":"42176.4060273972","expect":"2045-02-21"},
{"topdown":"상선","leftRight":"좌&우","start":"30111.031","end":"30775.031","after":"664","change":"2009-6-1","regdate":"2021-12-31","value1":"243429754.765","value2":"42118.9906849313","expect":"2045-03-05"},
{"topdown":"상선","leftRight":"좌&우","start":"30775.031","end":"31064","after":"288.969000000001","change":"2020-12-12","regdate":"2021-12-31","value1":"16052054.49","value2":"42118.9906849313","expect":"2059-12-16"},
{"topdown":"상선","leftRight":"좌&우","start":"31064","end":"31602.489","after":"538.489000000001","change":"2020-12-12","regdate":"2021-12-31","value1":"15975613.9999999","value2":"41915.0739726026","expect":"2060-02-23"},
{"topdown":"하선","leftRight":"좌&우","start":"172.199","end":"664.199","after":"492","change":"2007-3-16","regdate":"2021-12-31","value1":"280562738.375","value2":"41915.0739726026","expect":"2042-11-12"},
{"topdown":"하선","leftRight":"좌&우","start":"664.199","end":"1583.936","after":"919.737","change":"2007-3-16","regdate":"2021-12-31","value1":"280817775.955","value2":"42613.8070684931","expect":"2042-07-04"},
{"topdown":"하선","leftRight":"좌&우","start":"1583.936","end":"3113.341","after":"1529.405","change":"1999-10-6","regdate":"2021-12-31","value1":"414246813.04","value2":"42660.164328767","expect":"2033-12-02"},
{"topdown":"하선","leftRight":"좌&우","start":"3113.341","end":"4183.799","after":"1070.458","change":"1999-10-6","regdate":"2021-12-31","value1":"414290720.96","value2":"42780.4599999999","expect":"2033-11-18"},
{"topdown":"하선","leftRight":"좌&우","start":"4183.799","end":"5289.13","after":"1105.331","change":"1999-10-6","regdate":"2021-12-31","value1":"414340728.54","value2":"42917.4670684931","expect":"2033-11-03"},
{"topdown":"하선","leftRight":"좌&우","start":"5289.13","end":"6187.321","after":"898.191","change":"1999-10-6","regdate":"2021-12-31","value1":"414450122.16","value2":"43217.1756164383","expect":"2033-10-02"},
{"topdown":"하선","leftRight":"좌&우","start":"6187.321","end":"7097.322","after":"910.001","change":"1999-10-6","regdate":"2021-12-31","value1":"414527925.76","value2":"43430.3361643835","expect":"2033-09-09"},
{"topdown":"하선","leftRight":"좌&우","start":"7097.322","end":"8536.808","after":"1439.486","change":"1999-10-6","regdate":"2021-12-31","value1":"414717173.77","value2":"43948.8238630136","expect":"2033-07-16"},
{"topdown":"하선","leftRight":"좌&우","start":"8536.808","end":"9506.809","after":"970.000999999998","change":"1999-10-6","regdate":"2021-12-31","value1":"414823774.32","value2":"44240.8801643835","expect":"2033-06-16"},
{"topdown":"하선","leftRight":"좌&우","start":"9506.809","end":"10641.535","after":"1134.726","change":"1999-10-6","regdate":"2021-12-31","value1":"414753697.81","value2":"44048.8897260273","expect":"2033-07-06"},
{"topdown":"하선","leftRight":"좌&우","start":"10641.535","end":"11531.533","after":"889.998","change":"1999-10-6","regdate":"2021-12-31","value1":"414829929.98","value2":"44257.7449863013","expect":"2033-06-14"},
{"topdown":"하선","leftRight":"좌&우","start":"11531.533","end":"12386.915","after":"855.382000000001","change":"1999-10-6","regdate":"2021-12-31","value1":"414968035.57","value2":"44636.1164657533","expect":"2033-05-07"},
{"topdown":"하선","leftRight":"좌&우","start":"12386.915","end":"13512.966","after":"1126.051","change":"1999-10-6","regdate":"2021-12-31","value1":"414960370.92","value2":"44615.1174246574","expect":"2033-05-09"},
{"topdown":"하선","leftRight":"좌&우","start":"13512.966","end":"14563","after":"1050.034","change":"1999-10-6","regdate":"2021-12-31","value1":"414963050.24","value2":"44622.4580273972","expect":"2033-05-08"},
{"topdown":"하선","leftRight":"좌&우","start":"14563","end":"15143","after":"580","change":"2020-12-16","regdate":"2021-12-31","value1":"17207457.9651232","value2":"44660.58769863","expect":"2057-09-22"},
{"topdown":"하선","leftRight":"좌&우","start":"15143","end":"16086.378","after":"943.378000000001","change":"1999-10-6","regdate":"2021-12-31","value1":"414976967.57","value2":"44660.58769863","expect":"2033-05-04"},
{"topdown":"하선","leftRight":"좌&우","start":"16086.378","end":"17071.4805","after":"985.102500000001","change":"1999-10-6","regdate":"2021-12-31","value1":"415107579.94","value2":"45018.4298082191","expect":"2033-03-30"},
{"topdown":"하선","leftRight":"좌&우","start":"17071.4805","end":"17881.3875","after":"809.906999999999","change":"1999-10-6","regdate":"2021-12-31","value1":"415019991.04","value2":"44778.460219178","expect":"2033-04-23"},
{"topdown":"하선","leftRight":"좌&우","start":"17881.3875","end":"18691.475","after":"810.087499999998","change":"1999-10-6","regdate":"2021-12-31","value1":"414920161.24","value2":"44504.9539178081","expect":"2033-05-20"},
{"topdown":"하선","leftRight":"좌&우","start":"18691.475","end":"19530.145","after":"838.670000000002","change":"1999-10-6","regdate":"2021-12-31","value1":"414912487.84","value2":"44483.9309041094","expect":"2033-05-22"},
{"topdown":"하선","leftRight":"좌&우","start":"19530.145","end":"20668.023","after":"1137.878","change":"1999-10-6","regdate":"2021-12-31","value1":"414868317","value2":"44362.9149041095","expect":"2033-06-04"},
{"topdown":"하선","leftRight":"좌&우","start":"20668.023","end":"21538.0645","after":"870.041499999999","change":"1999-10-6","regdate":"2021-12-31","value1":"414822315.45","value2":"44236.8832602739","expect":"2033-06-17"},
{"topdown":"하선","leftRight":"좌&우","start":"21538.0645","end":"22588.2375","after":"1050.173","change":"1999-10-6","regdate":"2021-12-31","value1":"414763261.84","value2":"44075.0925479451","expect":"2033-07-03"},
{"topdown":"하선","leftRight":"좌&우","start":"22588.2375","end":"23588.0855","after":"999.848000000002","change":"1999-10-6","regdate":"2021-12-31","value1":"414608098.86","value2":"43649.9884931506","expect":"2033-08-17"},
{"topdown":"하선","leftRight":"좌&우","start":"23588.0855","end":"24197.685","after":"609.5995","change":"1999-10-6","regdate":"2021-12-31","value1":"414535662.86","value2":"43451.53369863","expect":"2033-09-07"},
{"topdown":"하선","leftRight":"좌&우","start":"24197.685","end":"25127.633","after":"929.948","change":"2009-6-1","regdate":"2021-12-31","value1":"243916132.965","value2":"43451.53369863","expect":"2044-06-07"},
{"topdown":"하선","leftRight":"좌&우","start":"25127.633","end":"25947.759","after":"820.125999999997","change":"2009-6-1","regdate":"2021-12-31","value1":"243837230.645","value2":"43235.362958904","expect":"2044-07-20"},
{"topdown":"하선","leftRight":"좌&우","start":"25947.759","end":"27360.108","after":"1412.349","change":"2009-6-1","regdate":"2021-12-31","value1":"243682983.335","value2":"42812.767589041","expect":"2044-10-13"},
{"topdown":"하선","leftRight":"좌&우","start":"27360.108","end":"28350.329","after":"990.221000000001","change":"2009-6-1","regdate":"2021-12-31","value1":"243611290.805","value2":"42616.34969863","expect":"2044-11-22"},
{"topdown":"하선","leftRight":"좌&우","start":"28350.329","end":"29240.026","after":"889.697","change":"2009-6-1","regdate":"2021-12-31","value1":"243515473.195","value2":"42353.83569863","expect":"2045-01-15"},
{"topdown":"하선","leftRight":"좌&우","start":"29240.026","end":"30059.961","after":"819.934999999998","change":"2009-6-1","regdate":"2021-12-31","value1":"243450409.735","value2":"42175.5796438355","expect":"2045-02-21"},
{"topdown":"하선","leftRight":"좌&우","start":"30059.961","end":"30723.948","after":"663.987000000001","change":"2009-6-1","regdate":"2021-12-31","value1":"243430238.885","value2":"42120.3170410958","expect":"2045-03-05"},
{"topdown":"하선","leftRight":"좌&우","start":"30723.948","end":"31017","after":"293.052","change":"20-12-12","regdate":"2021-12-31","value1":"16052538.61","value2":"42120.3170410958","expect":"2059-12-15"},
{"topdown":"하선","leftRight":"좌&우","start":"31017","end":"31554.287","after":"537.287","change":"20-12-12","regdate":"2021-12-31","value1":"15975613.9999999","value2":"41915.0739726026","expect":"2060-02-23"},

];

const datePickerStyle = {
  height:"22px",
  fontFamily : 'NEO_R'
}

function CumulativeThroughput( props ) {
  console.log(tableData);
  const location = useLocation();
  const canvasRef = useRef(null);
  const trackDetailCanvasRef = useRef(null);
  const [position, setPosition] = useState({x: 38, y: 5});
  const [dragging, setDragging] = useState(false);
  const [relPos, setRelPos] = useState({x: 0, y: 0});

  const [scale, setScale] = useState(1);
  const [trackDetailPosition, setTrackDetailPosition] = useState({x: 0, y: 0});
  const [trackDetailDragging, setTrackDetailDragging] = useState(false);
  const [lastPos, setLastPos] = useState(null);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= position.x && x <= position.x + 100 && y >= position.y && y <= position.y + 70) {
      setDragging(true);
      setRelPos({x: x - position.x, y: y - position.y});
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      let positionX = e.clientX - rect.left - relPos.x;
      if(positionX < 38){
        positionX = 38;
      }else if( positionX > 1425 ){
        positionX = 1425;
      }
      setPosition({
        x: positionX,
        //y: e.clientY - rect.top - relPos.y
        y: 5
      });
    }
  };

  const trackDetailHandleMouseDown = (e) => {
    setTrackDetailDragging(true);
    setLastPos({x: e.clientX, y: e.clientY});
  };

  const trackDetailHandleMouseUp = () => {
    setTrackDetailDragging(false);
    setLastPos(null);
  };

  const trackDetailHandleMouseMove = (e) => {
    if (trackDetailDragging) {
      const newPos = {x: e.clientX, y: e.clientY};
      const canvas = trackDetailCanvasRef.current;
      const img = new Image();
      img.src = IncheonTrackImg; // replace with your image url
  
      img.onload = function() {
        const newPosX = trackDetailPosition.x + newPos.x - lastPos.x;
        const newWidth = img.width * scale;
        
        // Check if the new position is outside the canvas
        if (newPosX <= 0 && newPosX + newWidth >= canvas.width) {
          setTrackDetailPosition({
            x: newPosX,
            y: trackDetailPosition.y
          });
        }
        setLastPos(newPos);
      };
    }
  };

  const trackDetailDrawImage = () => {
    const canvas = trackDetailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src= IncheonTrackImg;
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.save(); // Save the current state of the context
      ctx.translate(trackDetailPosition.x, trackDetailPosition.y); // Apply translation
      ctx.scale(scale, 0.28); // Apply scaling 
      ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image
      ctx.restore(); // Restore the context to its saved state
    };
  }

  const minimapDrawing = () => {
    const canvas = document.getElementById("minimapCanvas");
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src= IncheonTrackImg;
    img.onload = function() {
      let scale = canvas.width / img.width;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.save(); // Save the current state of the context
      ctx.translate(0, 0); // Apply translation
      ctx.scale(scale, 0.1); // Apply scaling 
      ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image
      ctx.restore(); // Restore the context to its saved state
      drawRect(position.x, position.y);
    };
  }

  const drawRect = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.rect(x, y-3, 100, 57);  // Draw rectangle
    ctx.stroke();
    ctx.closePath();
  }


  useEffect(() => {
    /* let minimapContainer = document.getElementById("minimapContainer");
    let canvas = canvasRef.current;
    canvas.width = minimapContainer.clientWidth;
    canvas.height = minimapContainer.clientHeight; */

    let trackDetailContainer = document.getElementById("trackDetailContainer");
    let trackDetailCanvas = trackDetailCanvasRef.current;
    trackDetailCanvas.width = trackDetailContainer.clientWidth;
    trackDetailCanvas.height = trackDetailContainer.clientHeight;

    /* drawRect(position.x, position.y);
    minimapDrawing();  */
  }, []);

  useEffect(() => {
    trackDetailDrawImage();
  }, [trackDetailPosition, scale]);

  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  return (
    <div className="cumulativeThroughput" >
      {/* <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
      </div> */}
      <div className="railStatusContainer">
        <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>Search Navigate</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">조회일자 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">검토일자 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">상하선 </div>
                <div className="date">
                  <Radio.Group style={RADIO_STYLE} >
                    <Radio value={1}>상선</Radio>
                    <Radio value={2}>하선</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  <Input placeholder="KP"
                    style={RANGEPICKERSTYLE}
                  />
                </div>
              </div>
              <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div>
              {/* <div className="line"></div> */}
            </div>
      </div>
      <div className="contentBox" style={{height:"calc(100% - 245px)", position:"relative"}} >
        <div className="containerTitle">
          <div>검토구간</div>
          <div className="dataOption">
            <div className="option date" >
              <img src={CalendarIcon} />
              2023.01.01
            </div>
          </div>
        </div>
        <div className="componentBox">
          {/* <div className="boxProto minimap searchOption">
            <div className="minimapContainer" id="minimapContainer">
              <canvas id="minimapCanvas"
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
              ></canvas>
            </div>
          </div> */}
          <div className="boxProto track" id="trackDetailContainer">
            <canvas id="trackDetailCanvas"
                ref={trackDetailCanvasRef}
                onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
            />
          </div>
          <div className="guideLine">
            <div className="dataContainer">
              <div className="dataLine">
                <div className="table">
                  <div className="tableHeader">
                    <div className="tr">
                      <div className="td">조회일자</div>
                      <div className="td">좌레일</div>
                      <div className="td">우레일</div>
                    </div>
                  </div>
                  <div className="tableBody">
                    <div className="tr">
                      <div className="td">2023.01.01</div>
                      <div className="td">414,939,971</div>
                      <div className="td">414,939,971</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dataLine">
                <div className="table">
                  <div className="tableHeader">
                    <div className="tr">
                      <div className="td">검토일자</div>
                      <div className="td">좌레일</div>
                      <div className="td">우레일</div>
                    </div>
                  </div>
                  <div className="tableBody">
                    <div className="tr">
                      <div className="td">2023.01.01</div>
                      <div className="td">414,939,971</div>
                      <div className="td">414,939,971</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dataLine">
                <div className="table">
                  <div className="tableHeader">
                    <div className="tr">
                      <div className="td">좌우</div>
                      <div className="td">시점</div>
                      <div className="td">종점</div>
                      <div className="td">연장</div>
                      <div className="td">교체</div>
                      <div className="td">계측</div>
                      <div className="td">누적</div>
                      <div className="td">일평균</div>
                      <div className="td">잔여톤수</div>
                      <div className="td">갱환예상</div>
                    </div>
                  </div>
                  <div className="tableBody">
                    <div className="tr">
                      <div className="td">우</div>
                      <div className="td">117</div>
                      <div className="td">669</div>
                      <div className="td">552</div>
                      <div className="td">2007-03-16</div>
                      <div className="td">2021-12-31</div>
                      <div className="td">280,562,738</div>
                      <div className="td">41,915</div>
                      <div className="td">-</div>
                      <div className="td">2042-11-12</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dataLine">
                <div className="table">
                  <div className="tableHeader">
                    <div className="tr">
                      <div className="td">좌우</div>
                      <div className="td">시점</div>
                      <div className="td">종점</div>
                      <div className="td">연장</div>
                      <div className="td">교체</div>
                      <div className="td">계측</div>
                      <div className="td">누적</div>
                      <div className="td">일평균</div>
                      <div className="td">잔여톤수</div>
                      <div className="td">갱환예상</div>
                    </div>
                  </div>
                  <div className="tableBody">
                    <div className="tr">
                      <div className="td">좌</div>
                      <div className="td">117</div>
                      <div className="td">669</div>
                      <div className="td">552</div>
                      <div className="td">2007-03-16</div>
                      <div className="td">2021-12-31</div>
                      <div className="td">280,562,738</div>
                      <div className="td">41,915</div>
                      <div className="td">-</div>
                      <div className="td">2042-11-12</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CumulativeThroughput;
