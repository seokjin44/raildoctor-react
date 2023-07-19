import "./trackGeometryMeasurement.css";
import { useEffect, useState } from "react";
import PositionTestImage from "../../assets/2023-07-13_16_45_35.png";
import RailStatus from "../../component/railStatus/railStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, 
  ScatterChart, Scatter
} from 'recharts';

import Box from '@mui/material/Box';
import Chart from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
//import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, DatePicker, Input, Select } from "antd";
import { RANGEPICKERSTYLE } from "../../constant";
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

const data1 = [{"time":"2023-01-23","weight":14313476},
{"time":"2023-02-23","weight":14976334},
{"time":"2023-03-23","weight":12924761},
{"time":"2023-04-23","weight":13234418},
{"time":"2023-05-23","weight":13802476},
{"time":"2023-06-23","weight":14706380},
{"time":"2023-07-23","weight":12279565},
{"time":"2023-08-23","weight":14411458},
{"time":"2023-09-23","weight":14283092},
{"time":"2023-10-23","weight":14289014},
{"time":"2023-11-23","weight":12414999},
{"time":"2023-12-23","weight":13469740},
];


const data2 = [{"time":"1","weight":405435},
{"time":"2","weight":470408},
{"time":"3","weight":411472},
{"time":"4","weight":440439},
{"time":"5","weight":459418},
{"time":"6","weight":405441},
{"time":"7","weight":403410},
{"time":"8","weight":469498},
{"time":"9","weight":473426},
{"time":"10","weight":444470},
{"time":"11","weight":427467},
{"time":"12","weight":449448},
{"time":"13","weight":434470},
{"time":"14","weight":439496},
{"time":"15","weight":498411},
{"time":"16","weight":431459},
{"time":"17","weight":417447},
{"time":"18","weight":497420},
{"time":"19","weight":478425},
{"time":"20","weight":423459},
{"time":"21","weight":482498},
{"time":"22","weight":496403},
{"time":"23","weight":496490},
{"time":"24","weight":459454},
{"time":"25","weight":440489},
{"time":"26","weight":449464},
{"time":"27","weight":414466},
{"time":"28","weight":488458},
{"time":"29","weight":453492},
{"time":"30","weight":437459},
{"time":"31","weight":496485},
];

const data3 = [
  {"time":"05:38:39","weight":72.636002},
  {"time":"05:51:41","weight":65.306999},
  {"time":"05:57:40","weight":65.505997},
  {"time":"06:03:33","weight":64.779999},
  {"time":"06:09:40","weight":69.367996},
  {"time":"06:15:06","weight":64.271004},
  {"time":"06:21:28","weight":69.106003},
  {"time":"06:29:23","weight":61.812},
  {"time":"06:34:35","weight":64.154999},
  {"time":"06:40:39","weight":72.275002},
  {"time":"06:45:01","weight":68.721001},
  {"time":"06:49:48","weight":62.682999},
  {"time":"06:54:26","weight":70.669998},
  {"time":"06:59:28","weight":95.453003},
  {"time":"07:05:06","weight":73.668999},
  {"time":"07:09:35","weight":68.496002},
  {"time":"07:14:54","weight":71.974998},
  {"time":"07:18:30","weight":75.582001},
  {"time":"07:24:39","weight":74.992996},
  {"time":"07:28:08","weight":71.991997},
  {"time":"07:31:37","weight":76.713997},
  {"time":"07:34:14","weight":74.383003},
  {"time":"07:37:19","weight":75.599998},
  {"time":"07:40:25","weight":78.388},
  {"time":"07:44:24","weight":82.208},
  {"time":"07:46:43","weight":80.001999},
  {"time":"07:49:53","weight":77.084},
  {"time":"07:53:02","weight":76.138},
  {"time":"07:56:46","weight":81.737},
  {"time":"08:01:14","weight":82.421997},
  {"time":"08:04:01","weight":77.874001},
  {"time":"08:07:18","weight":76.411003},
  {"time":"08:09:22","weight":85.533997},
  {"time":"08:12:42","weight":79.938004},
  {"time":"08:15:27","weight":77.249001},
  {"time":"08:18:35","weight":91.158997},
  {"time":"08:22:23","weight":86.938004},
  {"time":"08:25:34","weight":88.640999},
  {"time":"08:29:17","weight":83.532997},
  {"time":"08:33:23","weight":87.388},
  {"time":"08:37:06","weight":85.515999},
  {"time":"08:40:22","weight":91.329002},
  {"time":"08:45:35","weight":82.188004},
  {"time":"08:48:14","weight":132.985001},
  {"time":"08:51:59","weight":80.439003},
  {"time":"08:54:31","weight":77.018997},
  {"time":"08:57:31","weight":75.776001},
  {"time":"09:00:27","weight":76.339996},
  {"time":"09:10:57","weight":77.907997},
  {"time":"09:14:09","weight":76.886002},
  {"time":"09:17:29","weight":80.727997},
  {"time":"09:20:17","weight":83.053001},
  {"time":"09:23:44","weight":77.880997},
  {"time":"09:26:18","weight":79.542},
  {"time":"09:29:24","weight":81.959999},
  {"time":"09:32:07","weight":83.070999},
  {"time":"09:35:12","weight":74.055},
  {"time":"09:38:12","weight":90.621002},
  {"time":"09:41:13","weight":75.761002},
  {"time":"09:43:52","weight":70.539001},
  {"time":"09:47:20","weight":74.765999},
  {"time":"09:49:38","weight":69.837997},
  {"time":"09:53:37","weight":62.388},
  {"time":"09:55:23","weight":76.616997},
  {"time":"09:59:51","weight":72.149002},
  {"time":"10:02:47","weight":70.052002},
  {"time":"10:06:41","weight":63.212002},
  {"time":"10:09:12","weight":68.444},
  {"time":"10:13:35","weight":64.005997},
  {"time":"10:17:09","weight":67.015999},
  {"time":"10:21:50","weight":63.203999},
  {"time":"10:24:30","weight":63.737999},
  {"time":"10:27:18","weight":67.138},
  {"time":"10:31:14","weight":68.096001},
  {"time":"10:35:22","weight":68.605003},
  {"time":"10:38:28","weight":65.202003},
  {"time":"10:43:36","weight":65.726997},
  {"time":"10:49:41","weight":65.741997},
  {"time":"10:54:39","weight":70.220001},
  {"time":"11:00:18","weight":69.961998},
  {"time":"11:05:05","weight":78.804001},
  {"time":"11:08:17","weight":68.717003},
  {"time":"11:12:19","weight":58.312},
  {"time":"11:16:28","weight":66.277},
  {"time":"11:20:45","weight":61.257},
  {"time":"11:23:37","weight":61.083},
  {"time":"11:27:35","weight":70.203003},
  {"time":"11:31:29","weight":62.529999},
  {"time":"11:36:41","weight":69.596001},
  {"time":"11:47:08","weight":58.786999},
  {"time":"11:51:26","weight":61.785999},
  {"time":"11:53:41","weight":67.403},
  {"time":"11:58:24","weight":61.167},
  {"time":"12:03:53","weight":62.448002},
  {"time":"12:08:26","weight":63.073002},
  {"time":"12:17:28","weight":70.083},
  {"time":"12:25:30","weight":64.143997},
  {"time":"12:28:16","weight":68.539001},
  {"time":"12:33:08","weight":56.505001},
  {"time":"12:37:11","weight":64.142998},
  {"time":"12:41:27","weight":58.766998},
  {"time":"12:47:52","weight":66.102997},
  {"time":"12:52:18","weight":61.519001},
  {"time":"12:56:10","weight":67.684998},
  {"time":"13:01:55","weight":62.605},
  {"time":"13:06:21","weight":69.699997},
  {"time":"13:14:25","weight":63.493999},
  {"time":"13:21:54","weight":63.326},
  {"time":"13:27:36","weight":65.147003},
  {"time":"13:34:29","weight":80.500999},
  {"time":"13:40:20","weight":65.498001},
  {"time":"13:48:29","weight":64.147003},
  {"time":"13:53:25","weight":65.237},
  {"time":"13:59:37","weight":65.567001},
  {"time":"14:04:25","weight":57.148998},
  {"time":"14:10:00","weight":62.439999},
  {"time":"14:14:35","weight":58.764},
  {"time":"14:19:28","weight":64.776001},
  {"time":"14:32:36","weight":66.744003},
  {"time":"14:38:05","weight":66.114998},
  {"time":"14:43:20","weight":61.464001},
  {"time":"14:49:38","weight":64.183998},
  {"time":"14:57:46","weight":60.584},
  {"time":"15:04:00","weight":66.421997},
  {"time":"15:09:59","weight":60.869999},
  {"time":"15:17:27","weight":64.214996},
  {"time":"15:21:33","weight":62.945},
  {"time":"15:27:03","weight":70.151001},
  {"time":"15:32:53","weight":57.785999},
  {"time":"15:39:19","weight":67.987},
  {"time":"15:43:24","weight":58.757},
  {"time":"15:49:16","weight":64.266998},
  {"time":"15:53:09","weight":63.173},
  {"time":"16:03:07","weight":68.829002},
  {"time":"16:09:03","weight":61.757999},
  {"time":"16:16:26","weight":59.839001},
  {"time":"16:20:20","weight":61.705002},
  {"time":"16:24:30","weight":72.974998},
  {"time":"16:28:23","weight":62.201},
  {"time":"16:33:16","weight":60.345001},
  {"time":"16:38:06","weight":65.003998},
  {"time":"16:44:52","weight":60.424999},
  {"time":"16:50:21","weight":61.847},
  {"time":"16:52:55","weight":63.694},
  {"time":"16:57:34","weight":65.906998},
  {"time":"17:02:20","weight":95.342003},
  {"time":"17:06:21","weight":71.601997},
  {"time":"17:10:10","weight":66.400002},
  {"time":"17:13:47","weight":58.009998},
  {"time":"17:17:48","weight":64.579002},
  {"time":"17:22:52","weight":58.839001},
  {"time":"17:27:09","weight":69.848},
  {"time":"17:33:13","weight":69.924004},
  {"time":"17:37:55","weight":60.876999},
  {"time":"17:41:34","weight":61.019001},
  {"time":"17:44:48","weight":63.669998},
  {"time":"17:50:19","weight":76.646004},
  {"time":"17:53:36","weight":63.048},
  {"time":"17:57:04","weight":57.59},
  {"time":"17:59:11","weight":62.951},
  {"time":"18:02:56","weight":64.945999},
  {"time":"18:08:03","weight":73.535004},
  {"time":"18:11:40","weight":65.929001},
  {"time":"18:15:15","weight":66.471001},
  {"time":"18:20:28","weight":66.813004},
  {"time":"18:24:19","weight":67.126999},
  {"time":"18:28:16","weight":64.720001},
  {"time":"18:31:12","weight":67.588997},
  {"time":"18:34:50","weight":100.625},
  {"time":"18:39:28","weight":67.723999},
  {"time":"18:42:28","weight":77.639},
  {"time":"18:45:36","weight":68.651001},
  {"time":"18:49:55","weight":57.847},
  {"time":"18:59:10","weight":67.825996},
  {"time":"19:05:42","weight":72.821999},
  {"time":"19:12:09","weight":66.321999},
  {"time":"19:14:15","weight":58.873001},
  {"time":"19:16:59","weight":59.639999},
  {"time":"19:21:24","weight":61.448002},
  {"time":"19:25:54","weight":60.431},
  {"time":"19:29:02","weight":61.671001},
  {"time":"19:31:23","weight":57.889999},
  {"time":"19:34:43","weight":59.339001},
  {"time":"19:36:58","weight":60.465},
  {"time":"19:42:17","weight":68.508003},
  {"time":"19:47:06","weight":61.627998},
  {"time":"19:53:23","weight":61.618},
  {"time":"19:56:01","weight":62.778},
  {"time":"19:58:44","weight":62.777},
  {"time":"20:02:47","weight":63.917},
  {"time":"20:06:25","weight":69.223},
  {"time":"20:09:29","weight":61.159},
  {"time":"20:16:42","weight":57.976002},
  {"time":"20:23:55","weight":64.431999},
  {"time":"20:29:22","weight":58.639},
  {"time":"20:36:41","weight":66.93},
  {"time":"20:41:15","weight":59.418999},
  {"time":"20:45:18","weight":58.695},
  {"time":"20:51:32","weight":56.868},
  {"time":"20:55:55","weight":62.728001},
  {"time":"21:00:19","weight":57.216999},
  {"time":"21:03:50","weight":59.511002},
  {"time":"21:09:38","weight":66.535004},
  {"time":"21:14:08","weight":59.237},
  {"time":"21:22:14","weight":64.315002},
  {"time":"21:28:59","weight":62.710999},
  {"time":"21:35:45","weight":62.644001},
  {"time":"21:41:51","weight":56.202},
  {"time":"21:49:31","weight":64.559998},
  {"time":"21:58:00","weight":61.875999},
  {"time":"22:26:30","weight":56.272999},
  {"time":"22:29:11","weight":59.397999},
  {"time":"22:35:08","weight":63.924},
  {"time":"22:40:45","weight":60.167999},
  {"time":"22:52:53","weight":61.445999},
  {"time":"22:56:20","weight":62.436001},
  {"time":"23:03:12","weight":80.577003},
  {"time":"23:07:52","weight":56.594002},
  {"time":"23:17:54","weight":63.715},
  {"time":"23:27:14","weight":65.983002},
  {"time":"23:38:12","weight":57.617001},
  {"time":"23:48:24","weight":56.584999},
  {"time":"23:52:41","weight":55.171001},
  {"time":"23:55:59","weight":69.427002},
  {"time":"00:05:15","weight":62.574001},
  {"time":"00:25:48","weight":68.908997},
  {"time":"00:34:54","weight":61.042},
  {"time":"00:53:00","weight":63.598},  
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

  const dataOption = [
    { label: '윤중', value: '윤중' },
    { label: '횡압', value: '횡압' },
    { label: '레일저부응력', value: '레일저부응력' },
    { label: '레일수평변위', value: '레일수평변위' },
    { label: '레일수직변위', value: '레일수직변위' },
    { label: '레일수직가속도', value: '레일수직가속도' },
    { label: '열차속도', value: '열차속도' },
  ];

  useEffect(() => {
  }, []);
  
  return (
    <div className="trackDeviation trackGeometryMeasurement" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={railroadSection} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>Search Navigate</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">선택구간 </div>
                <div className="date">
                  <Input placeholder="KP" value={"간석오거리 - 인천시청"}
                    style={RANGEPICKERSTYLE}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <DatePicker style={RANGEPICKERSTYLE} />
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
                  <Checkbox.Group options={dataOption} />
                </div>
              </div>
              {/* <div className="dataOption">
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
              </div> */}

              {/* <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div> */}
              {/* <div className="line"></div> */}
            </div>
      </div>
      {/* <div className="contentBox" >
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
                  <MenuItem>레일수평변위</MenuItem>
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
      </div> */}
      <div className="contentBoxGroup" style={{width: "100%", height: "250px", marginTop:"10px"}}>
        <div className="contentBox" style={{marginRight: "10px", width: "calc((((100% - 20px) - 800px) - 330px) - -93px)", height: "100%"}}>
          <div className="containerTitle">측정위치</div>
          <div className="componentBox">
            <img src={PositionTestImage} style={{width:"100%", height:"100%"}} />
          </div>
        </div>
        <div className="contentBox" style={{width:"700px", height:"100%", marginRight:"10px"}}>
          <div className="containerTitle">장기계측 항목</div>
          <div className="componentBox">
            <div className="table" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td detail colspan2"><div className="colspan2">세부항목</div></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k526</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k503</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k065</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k110</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k230</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k290</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k400</div></div>
                  <div className="td point"></div>
                </div>
                <div className="tr">
                  <div className="td detail"></div>
                  <div className="td point">좌 </div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
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
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>

                <div className="tr">
                  <div className="td detail">레일수평변위</div>
                  <div className="td point" style={{ fontSize: "1px"}} >1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
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
                  <div className="td detail">레일수직변위</div>
                  <div className="td point" style={{ fontSize: "1px"}} >1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
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
                  <div className="td detail" style={{fontSize: "12px"}}>레일수직가속도</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
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
          <div className="containerTitle">단기계측 항목</div>
          <div className="componentBox">
          <div className="table table2" style={{justifyContent: "flex-start"}} >
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
                  <div className="td point2">우</div>
                  <div className="td point2">좌</div>
                  <div className="td point2">우</div>
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
      <div className="contentBox" style={{marginTop:"10px", height:"calc(100% - 510px)"}}>
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
              <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
              <YAxis type="number" dataKey="weight" name="weight" fontSize={12}/>
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
              <XAxis dataKey="time" fontSize={12}/>
              <YAxis fontSize={12}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" name="윤중" fill="#0041DC" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
          <BarChart
              width={500}
              height={300}
              data={data1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12}/>
              <YAxis fontSize={12}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" name="윤중" fill="#0041DC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default TrackGeometryMeasurement;
