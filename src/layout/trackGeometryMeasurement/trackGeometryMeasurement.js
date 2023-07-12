import "./trackGeometryMeasurement.css";
import { useEffect, useState } from "react";
import PositionTestImage from "../../assets/2023-07-09_21_48_42.png";
import RailStatus from "../../component/railStatus/railStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, 
  ScatterChart, Scatter
} from 'recharts';

import Box from '@mui/material/Box';
import Chart from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
/* import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';
import Faker from "faker";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
); */

/* const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
export const optionsBar1 = {
  responsive: true,
  plugins: {
    legend: false,
    title: {
      display: true,
      text: '일별 누적 윤중',
    },
  },
};
export const optionsBar2 = {
  responsive: true,
  plugins: {
    legend: false,
    title: {
      display: true,
      text: '월별 누적 윤중',
    },
  },
};
export const optionsScatter = {
  responsive: true,
  plugins: {
    legend: false,
    title: {
      display: true,
      text: '시간 누적 윤중',
    },
  },
};
export const dataBar = {
  labels,
  datasets: [
    {
      data: labels.map(() => Faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: '#0041DC',
    },
  ],
};

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
export const data = {
  datasets: [
    {
      data: Array.from({ length: 100 }, () => ({
        x: Faker.datatype.number({ min: 0, max: 500 }),
        y: Faker.datatype.number({ min: -100, max: 100 }),
      })),
      backgroundColor: '#0041DC',
    },
  ],
}; */

const data1 = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


const data2 = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const data3 = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

const railroadSection = [
  {
    "id": 2,
    "start_station_id": 2,
    "end_station_id": 3,
    "railroad_id": 0,
    "start_station_name": "계양",
    "end_station_name": "귤현",
    "start_station_up_track_location": 0,
    "start_station_down_track_location": 0,
    "end_station_up_track_location": 900,
    "end_station_down_track_location": 900,
    "start_station_longitude": "126.736411",
    "start_station_latitude": "37.5714532",
    "end_station_longitude": "126.7424923",
    "end_station_latitude": "37.5666362"
  },
  {
    "id": 4,
    "start_station_id": 3,
    "end_station_id": 4,
    "railroad_id": 0,
    "start_station_name": "귤현",
    "end_station_name": "박촌",
    "start_station_up_track_location": 900,
    "start_station_down_track_location": 900,
    "end_station_up_track_location": 2400,
    "end_station_down_track_location": 2400,
    "start_station_longitude": "126.7424923",
    "start_station_latitude": "37.5666362",
    "end_station_longitude": "126.7449949",
    "end_station_latitude": "37.553537"
  },
  {
    "id": 5,
    "start_station_id": 4,
    "end_station_id": 5,
    "railroad_id": 0,
    "start_station_name": "박촌",
    "end_station_name": "임학",
    "start_station_up_track_location": 2400,
    "start_station_down_track_location": 2400,
    "end_station_up_track_location": 3500,
    "end_station_down_track_location": 3500,
    "start_station_longitude": "126.7449949",
    "start_station_latitude": "37.553537",
    "end_station_longitude": "126.738672",
    "end_station_latitude": "37.5450986"
  },
  {
    "id": 6,
    "start_station_id": 5,
    "end_station_id": 6,
    "railroad_id": 0,
    "start_station_name": "임학",
    "end_station_name": "계산",
    "start_station_up_track_location": 3500,
    "start_station_down_track_location": 3500,
    "end_station_up_track_location": 4600,
    "end_station_down_track_location": 4600,
    "start_station_longitude": "126.738672",
    "start_station_latitude": "37.5450986",
    "end_station_longitude": "126.7281452",
    "end_station_latitude": "37.5433016"
  },
  {
    "id": 7,
    "start_station_id": 6,
    "end_station_id": 7,
    "railroad_id": 0,
    "start_station_name": "계산",
    "end_station_name": "경인교대입구",
    "start_station_up_track_location": 4600,
    "start_station_down_track_location": 4600,
    "end_station_up_track_location": 5500,
    "end_station_down_track_location": 5500,
    "start_station_longitude": "126.7281452",
    "start_station_latitude": "37.5433016",
    "end_station_longitude": "126.7226228",
    "end_station_latitude": "37.5381803"
  },
  {
    "id": 8,
    "start_station_id": 7,
    "end_station_id": 8,
    "railroad_id": 0,
    "start_station_name": "경인교대입구",
    "end_station_name": "작전",
    "start_station_up_track_location": 5500,
    "start_station_down_track_location": 5500,
    "end_station_up_track_location": 6400,
    "end_station_down_track_location": 6400,
    "start_station_longitude": "126.7226228",
    "start_station_latitude": "37.5381803",
    "end_station_longitude": "126.7225326",
    "end_station_latitude": "37.530291"
  },
  {
    "id": 9,
    "start_station_id": 8,
    "end_station_id": 9,
    "railroad_id": 0,
    "start_station_name": "작전",
    "end_station_name": "갈산",
    "start_station_up_track_location": 6400,
    "start_station_down_track_location": 6400,
    "end_station_up_track_location": 7800,
    "end_station_down_track_location": 7800,
    "start_station_longitude": "126.7225326",
    "start_station_latitude": "37.530291",
    "end_station_longitude": "126.7215587",
    "end_station_latitude": "37.5170688"
  },
  {
    "id": 10,
    "start_station_id": 9,
    "end_station_id": 10,
    "railroad_id": 0,
    "start_station_name": "갈산",
    "end_station_name": "부평구청",
    "start_station_up_track_location": 7800,
    "start_station_down_track_location": 7800,
    "end_station_up_track_location": 8800,
    "end_station_down_track_location": 8800,
    "start_station_longitude": "126.7215587",
    "start_station_latitude": "37.5170688",
    "end_station_longitude": "126.7205867",
    "end_station_latitude": "37.5084365"
  },
  {
    "id": 11,
    "start_station_id": 10,
    "end_station_id": 11,
    "railroad_id": 0,
    "start_station_name": "부평구청",
    "end_station_name": "부평시장",
    "start_station_up_track_location": 8800,
    "start_station_down_track_location": 8800,
    "end_station_up_track_location": 9900,
    "end_station_down_track_location": 9900,
    "start_station_longitude": "126.7205867",
    "start_station_latitude": "37.5084365",
    "end_station_longitude": "126.7222774",
    "end_station_latitude": "37.4984557"
  },
  {
    "id": 12,
    "start_station_id": 11,
    "end_station_id": 12,
    "railroad_id": 0,
    "start_station_name": "부평시장",
    "end_station_name": "부평",
    "start_station_up_track_location": 9900,
    "start_station_down_track_location": 9900,
    "end_station_up_track_location": 10800,
    "end_station_down_track_location": 10800,
    "start_station_longitude": "126.7222774",
    "start_station_latitude": "37.4984557",
    "end_station_longitude": "126.7234918",
    "end_station_latitude": "37.4904123"
  },
  {
    "id": 13,
    "start_station_id": 12,
    "end_station_id": 13,
    "railroad_id": 0,
    "start_station_name": "부평",
    "end_station_name": "동수",
    "start_station_up_track_location": 10800,
    "start_station_down_track_location": 10800,
    "end_station_up_track_location": 11700,
    "end_station_down_track_location": 11700,
    "start_station_longitude": "126.7234918",
    "start_station_latitude": "37.4904123",
    "end_station_longitude": "126.718399",
    "end_station_latitude": "37.4854209"
  },
  {
    "id": 14,
    "start_station_id": 13,
    "end_station_id": 14,
    "railroad_id": 0,
    "start_station_name": "동수",
    "end_station_name": "부평삼거리",
    "start_station_up_track_location": 11700,
    "start_station_down_track_location": 11700,
    "end_station_up_track_location": 12800,
    "end_station_down_track_location": 12800,
    "start_station_longitude": "126.718399",
    "start_station_latitude": "37.4854209",
    "end_station_longitude": "126.7104676",
    "end_station_latitude": "37.4782817"
  },
  {
    "id": 15,
    "start_station_id": 14,
    "end_station_id": 15,
    "railroad_id": 0,
    "start_station_name": "부평삼거리",
    "end_station_name": "간석오거리",
    "start_station_up_track_location": 12800,
    "start_station_down_track_location": 12800,
    "end_station_up_track_location": 14000,
    "end_station_down_track_location": 14000,
    "start_station_longitude": "126.7104676",
    "start_station_latitude": "37.4782817",
    "end_station_longitude": "126.7079019",
    "end_station_latitude": "37.4669093"
  },
  {
    "id": 16,
    "start_station_id": 15,
    "end_station_id": 16,
    "railroad_id": 0,
    "start_station_name": "간석오거리",
    "end_station_name": "인천시청",
    "start_station_up_track_location": 14000,
    "start_station_down_track_location": 14000,
    "end_station_up_track_location": 15400,
    "end_station_down_track_location": 15400,
    "start_station_longitude": "126.7079019",
    "start_station_latitude": "37.4669093",
    "end_station_longitude": "126.7022161",
    "end_station_latitude": "37.4576187"
  },
  {
    "id": 17,
    "start_station_id": 16,
    "end_station_id": 17,
    "railroad_id": 0,
    "start_station_name": "인천시청",
    "end_station_name": "예술회관",
    "start_station_up_track_location": 15400,
    "start_station_down_track_location": 15400,
    "end_station_up_track_location": 16400,
    "end_station_down_track_location": 16400,
    "start_station_longitude": "126.7022161",
    "start_station_latitude": "37.4576187",
    "end_station_longitude": "126.7010064",
    "end_station_latitude": "37.4492006"
  },
  {
    "id": 18,
    "start_station_id": 17,
    "end_station_id": 18,
    "railroad_id": 0,
    "start_station_name": "예술회관",
    "end_station_name": "인천터미널",
    "start_station_up_track_location": 16400,
    "start_station_down_track_location": 16400,
    "end_station_up_track_location": 17200,
    "end_station_down_track_location": 17200,
    "start_station_longitude": "126.7010064",
    "start_station_latitude": "37.4492006",
    "end_station_longitude": "126.699675",
    "end_station_latitude": "37.4419043"
  },
  {
    "id": 19,
    "start_station_id": 18,
    "end_station_id": 19,
    "railroad_id": 0,
    "start_station_name": "인천터미널",
    "end_station_name": "문학경기장",
    "start_station_up_track_location": 17200,
    "start_station_down_track_location": 17200,
    "end_station_up_track_location": 18000,
    "end_station_down_track_location": 18000,
    "start_station_longitude": "126.699675",
    "start_station_latitude": "37.4419043",
    "end_station_longitude": "126.6983415",
    "end_station_latitude": "37.4349599"
  },
  {
    "id": 20,
    "start_station_id": 19,
    "end_station_id": 20,
    "railroad_id": 0,
    "start_station_name": "문학경기장",
    "end_station_name": "선학",
    "start_station_up_track_location": 18000,
    "start_station_down_track_location": 18000,
    "end_station_up_track_location": 18800,
    "end_station_down_track_location": 18800,
    "start_station_longitude": "126.6983415",
    "start_station_latitude": "37.4349599",
    "end_station_longitude": "126.6989247",
    "end_station_latitude": "37.427001"
  },
  {
    "id": 21,
    "start_station_id": 20,
    "end_station_id": 21,
    "railroad_id": 0,
    "start_station_name": "선학",
    "end_station_name": "신연수",
    "start_station_up_track_location": 18800,
    "start_station_down_track_location": 18800,
    "end_station_up_track_location": 19900,
    "end_station_down_track_location": 19900,
    "start_station_longitude": "126.6989247",
    "start_station_latitude": "37.427001",
    "end_station_longitude": "126.6940278",
    "end_station_latitude": "37.4180588"
  },
  {
    "id": 22,
    "start_station_id": 21,
    "end_station_id": 22,
    "railroad_id": 0,
    "start_station_name": "신연수",
    "end_station_name": "원인재",
    "start_station_up_track_location": 19900,
    "start_station_down_track_location": 19900,
    "end_station_up_track_location": 20800,
    "end_station_down_track_location": 20800,
    "start_station_longitude": "126.6940278",
    "start_station_latitude": "37.4180588",
    "end_station_longitude": "126.6878251",
    "end_station_latitude": "37.4123326"
  },
  {
    "id": 23,
    "start_station_id": 22,
    "end_station_id": 23,
    "railroad_id": 0,
    "start_station_name": "원인재",
    "end_station_name": "동춘",
    "start_station_up_track_location": 20800,
    "start_station_down_track_location": 20800,
    "end_station_up_track_location": 21900,
    "end_station_down_track_location": 21900,
    "start_station_longitude": "126.6878251",
    "start_station_latitude": "37.4123326",
    "end_station_longitude": "126.680786",
    "end_station_latitude": "37.4047322"
  },
  {
    "id": 24,
    "start_station_id": 23,
    "end_station_id": 24,
    "railroad_id": 0,
    "start_station_name": "동춘",
    "end_station_name": "동막",
    "start_station_up_track_location": 21900,
    "start_station_down_track_location": 21900,
    "end_station_up_track_location": 22900,
    "end_station_down_track_location": 22900,
    "start_station_longitude": "126.680786",
    "start_station_latitude": "37.4047322",
    "end_station_longitude": "126.6736029",
    "end_station_latitude": "37.3981396"
  },
  {
    "id": 25,
    "start_station_id": 24,
    "end_station_id": 25,
    "railroad_id": 0,
    "start_station_name": "동막",
    "end_station_name": "캠퍼스타운",
    "start_station_up_track_location": 22900,
    "start_station_down_track_location": 22900,
    "end_station_up_track_location": 24500,
    "end_station_down_track_location": 24500,
    "start_station_longitude": "126.6736029",
    "start_station_latitude": "37.3981396",
    "end_station_longitude": "126.6620847",
    "end_station_latitude": "37.3882047"
  },
  {
    "id": 26,
    "start_station_id": 25,
    "end_station_id": 26,
    "railroad_id": 0,
    "start_station_name": "캠퍼스타운",
    "end_station_name": "테크노파크",
    "start_station_up_track_location": 24500,
    "start_station_down_track_location": 24500,
    "end_station_up_track_location": 25300,
    "end_station_down_track_location": 25300,
    "start_station_longitude": "126.6620847",
    "start_station_latitude": "37.3882047",
    "end_station_longitude": "126.6561887",
    "end_station_latitude": "37.3820787"
  },
  {
    "id": 27,
    "start_station_id": 26,
    "end_station_id": 27,
    "railroad_id": 0,
    "start_station_name": "테크노파크",
    "end_station_name": "지식정보단지",
    "start_station_up_track_location": 25300,
    "start_station_down_track_location": 25300,
    "end_station_up_track_location": 26700,
    "end_station_down_track_location": 26700,
    "start_station_longitude": "126.6561887",
    "start_station_latitude": "37.3820787",
    "end_station_longitude": "126.6454262",
    "end_station_latitude": "37.378017"
  },
  {
    "id": 28,
    "start_station_id": 27,
    "end_station_id": 28,
    "railroad_id": 0,
    "start_station_name": "지식정보단지",
    "end_station_name": "인천대입구",
    "start_station_up_track_location": 26700,
    "start_station_down_track_location": 26700,
    "end_station_up_track_location": 27700,
    "end_station_down_track_location": 27700,
    "start_station_longitude": "126.6454262",
    "start_station_latitude": "37.378017",
    "end_station_longitude": "126.6394183",
    "end_station_latitude": "37.386209"
  },
  {
    "id": 29,
    "start_station_id": 28,
    "end_station_id": 29,
    "railroad_id": 0,
    "start_station_name": "인천대입구",
    "end_station_name": "센트럴파크",
    "start_station_up_track_location": 27700,
    "start_station_down_track_location": 27700,
    "end_station_up_track_location": 28600,
    "end_station_down_track_location": 28600,
    "start_station_longitude": "126.6394183",
    "start_station_latitude": "37.386209",
    "end_station_longitude": "126.6349838",
    "end_station_latitude": "37.3928199"
  },
  {
    "id": 30,
    "start_station_id": 29,
    "end_station_id": 30,
    "railroad_id": 0,
    "start_station_name": "센트럴파크",
    "end_station_name": "국제업무지구",
    "start_station_up_track_location": 28600,
    "start_station_down_track_location": 28600,
    "end_station_up_track_location": 29400,
    "end_station_down_track_location": 29400,
    "start_station_longitude": "126.6349838",
    "start_station_latitude": "37.3928199",
    "end_station_longitude": "126.630119",
    "end_station_latitude": "37.4004344"
  },
  {
    "id": 31,
    "start_station_id": 30,
    "end_station_id": 31,
    "railroad_id": 0,
    "start_station_name": "국제업무지구",
    "end_station_name": "송도달빛축제공원",
    "start_station_up_track_location": 29400,
    "start_station_down_track_location": 29400,
    "end_station_up_track_location": 30300,
    "end_station_down_track_location": 30300,
    "start_station_longitude": "126.630119",
    "start_station_latitude": "37.4004344",
    "end_station_longitude": "126.6258733",
    "end_station_latitude": "37.4071408"
  }
]

function TrackGeometryMeasurement( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  useEffect(() => {
  }, []);
  
  return (
    <div className="trackDeviation trackGeometryMeasurement" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox" >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section ">
          <div className="position optionBox borderColorGreen">
            <div className="optionTitle">위치</div>
            <div className="optionValue">인천터미널 - 문학경기장</div>
          </div>
          <div className="position optionBox h75">
            <div className="optionTitle">측정일자</div>
            <div className="optionValue">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DatePicker label="측정일"  />
              </LocalizationProvider>
            </div>
          </div>
          <div className="position optionBox h75">
            <div className="optionTitle">데이터</div>
            <div className="optionValue">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">데이터</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  //value={age}
                  label="데이터 선택"
                  //onChange={handleChange}
                >
                  <MenuItem>윤중</MenuItem>
                  <MenuItem>횡압</MenuItem>
                  <MenuItem>레일저부응력</MenuItem>
                  <MenuItem>레일수평범위</MenuItem>
                  <MenuItem>레일수직범위</MenuItem>
                  <MenuItem>레일수직변위</MenuItem>
                  <MenuItem>레일수직가속도</MenuItem>
                  <MenuItem>열차속도</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="position optionBox h75">
            <div className="optionTitle">포인트</div>
            <div className="optionValue">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">포인트 선택</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  //value={age}
                  label="포인트 선택"
                  //onChange={handleChange}
                >
                  <MenuItem>Point 1</MenuItem>
                  <MenuItem>Point 2</MenuItem>
                  <MenuItem>Point 3</MenuItem>
                  <MenuItem>Point 4</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      <div className="contentBoxGroup" style={{width: "100%", height: "238px", marginTop:"10px"}}>
        <div className="contentBox" style={{marginRight: "10px", width: "calc(100% - 20px - 600px - 330px - 7px)", height: "100%"}}>
          <div className="containerTitle">측정위치</div>
          <div className="componentBox">
            <img src={PositionTestImage} style={{width:"100%", height:"100%"}} />
          </div>
        </div>
        <div className="contentBox" style={{width:"600px", height:"100%", marginRight:"10px"}}>
          <div className="containerTitle">단기계측</div>
          <div className="componentBox">
            <div className="table" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td detail colspan2"><div className="colspan2">세부항목</div></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k526</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k503</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k110</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)16k065</div></div>
                  <div className="td point"></div>
                </div>
                <div className="tr">
                  <div className="td detail"></div>
                  <div className="td point">point 8</div>
                  <div className="td point">point 7</div>
                  <div className="td point">point 6</div>
                  <div className="td point">point 5</div>
                  <div className="td point">point 4</div>
                  <div className="td point">point 3</div>
                  <div className="td point">point 2</div>
                  <div className="td point">point 1</div>
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td detail">윤중(V)</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail">횡압(L)</div>
                  <div className="td point">-</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail">레일응력</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>

                <div className="tr">
                  <div className="td detail">레일수평변위</div>
                  <div className="td point">1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail">레일수직변위</div>
                  <div className="td point">1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail">레일수직가속도</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contentBox" style={{width:"330px", height:"100%"}}>
          <div className="containerTitle">단기계측</div>
          <div className="componentBox">
          <div className="table table2" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td detail2 colspan2"><div className="colspan2">세부항목</div></div>
                  <div className="td point2 rowspan2"><div className="rowspan2">(하)15k526</div></div>
                  <div className="td point2"></div>
                  <div className="td point2 rowspan2"><div className="rowspan2">(하)15k503</div></div>
                  <div className="td point2"></div>
                </div>
                <div className="tr">
                  <div className="td detail2"></div>
                  <div className="td point2">좌</div>
                  <div className="td point2">point 3</div>
                  <div className="td point2">point 2</div>
                  <div className="td point2">point 1</div>
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td detail2">윤중(V)</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail2">레일응력</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail2">트리거용가속도</div>
                  <div className="td point2">-</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div>
                  <div className="td point2">-</div> 
                </div>

                <div className="tr">
                  <div className="td detail2">레일수평변위</div>
                  <div className="td point2">-</div>
                  <div className="td point2">-</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contentBox" style={{marginTop:"10px", height:"330px"}}>
        <div className="containerTitle">Chart</div>
        <div className="componentBox flex flexEnd">
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
              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="A school" data={data3} fill="#0041DC" />
            </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#0041DC" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
          <BarChart
              width={500}
              height={300}
              data={data2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#0041DC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default TrackGeometryMeasurement;
