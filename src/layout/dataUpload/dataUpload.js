import "./dataUpload.css";
import ListIcon from "../../assets/icon/list.png";
import UploadIcon from "../../assets/icon/216485_upload_icon_w.png";
import DownloadIcon from "../../assets/icon/download_w.png";
import { useState } from "react";
import classNames from "classnames";

const data ={
  1 : [
    {"upload" : "2020-03-15 10:15:20", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
    {"upload" : "2020-04-22 13:42:37", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
    {"upload" : "2020-06-30 09:25:53", "member" : "Admin", "file" : "동막토목파트_선로현황도.png"},
    {"upload" : "2020-08-14 16:34:08", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
    {"upload" : "2020-11-02 20:21:44", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
    {"upload" : "2021-01-20 14:55:32", "member" : "Admin", "file" : "동막토목파트_선로현황도.png"},
    {"upload" : "2021-03-03 18:03:21", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
    {"upload" : "2021-05-17 11:11:11", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
    {"upload" : "2021-07-04 22:47:56", "member" : "Admin", "file" : "동막토목파트_선로현황도.png"},
    {"upload" : "2021-09-13 15:30:30", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
    {"upload" : "2022-02-25 08:20:45", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
    {"upload" : "2022-04-16 17:55:12", "member" : "Admin", "file" : "동막토목파트_선로현황도.png"},
    {"upload" : "2022-06-07 13:42:18", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
    {"upload" : "2022-08-23 19:11:34", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
    {"upload" : "2022-10-10 21:58:46", "member" : "Admin", "file" : "동막토목파트_선로현황도.png"},
    {"upload" : "2023-01-01 12:00:01", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
    {"upload" : "2023-02-28 14:29:36", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"},
    {"upload" : "2023-03-22 09:45:50", "member" : "Admin", "file" : "동막토목파트_선로현황도.png"},
    {"upload" : "2023-04-15 18:37:29", "member" : "Admin", "file" : "귤현토목파트_선로현황도.png"},
    {"upload" : "2023-04-30 23:59:59", "member" : "Admin", "file" : "작전토목파트_선로현황도.png"}
  ],
  2 : [
    {"upload" : "2020-03-15 10:27:57", "member" : "Admin", "file" : "20200315092757_통과톤수_데이터.xlsx"},
    {"upload" : "2020-06-20 11:54:26", "member" : "Admin", "file" : "20200620105426_통과톤수_데이터.xlsx"},
    {"upload" : "2020-09-25 12:24:47", "member" : "Admin", "file" : "20200925112447_통과톤수_데이터.xlsx"},
    {"upload" : "2020-12-17 13:36:12", "member" : "Admin", "file" : "20201217083612_통과톤수_데이터.xlsx"},
    {"upload" : "2021-02-19 14:15:36", "member" : "Admin", "file" : "20210219151536_통과톤수_데이터.xlsx"},
    {"upload" : "2021-04-23 15:02:53", "member" : "Admin", "file" : "20210423170253_통과톤수_데이터.xlsx"},
    {"upload" : "2021-07-14 16:47:12", "member" : "Admin", "file" : "20210714124712_통과톤수_데이터.xlsx"},
    {"upload" : "2021-10-16 17:52:30", "member" : "Admin", "file" : "20211016145230_통과톤수_데이터.xlsx"},
    {"upload" : "2022-01-18 18:31:45", "member" : "Admin", "file" : "20220118163145_통과톤수_데이터.xlsx"},
    {"upload" : "2022-03-20 19:46:19", "member" : "Admin", "file" : "20220320184619_통과톤수_데이터.xlsx"},
    {"upload" : "2022-05-22 20:55:56", "member" : "Admin", "file" : "20220522195556_통과톤수_데이터.xlsx"},
    {"upload" : "2022-08-24 21:35:10", "member" : "Admin", "file" : "20220824203510_통과톤수_데이터.xlsx"},
    {"upload" : "2022-11-26 22:24:37", "member" : "Admin", "file" : "20221126212437_통과톤수_데이터.xlsx"},
    {"upload" : "2023-01-27 09:43:21", "member" : "Admin", "file" : "20230127094321_통과톤수_데이터.xlsx"},
    {"upload" : "2023-03-30 10:59:59", "member" : "Admin", "file" : "20230330105959_통과톤수_데이터.xlsx"},
    {"upload" : "2023-05-28 08:17:31", "member" : "Admin", "file" : "20230528081731_통과톤수_데이터.xlsx"},
    {"upload" : "2023-06-29 07:32:28", "member" : "Admin", "file" : "20230629073228_통과톤수_데이터.xlsx"},
    {"upload" : "2023-08-24 06:47:14", "member" : "Admin", "file" : "20230824064714_통과톤수_데이터.xlsx"},
    {"upload" : "2023-09-27 05:51:47", "member" : "Admin", "file" : "20230927055147_통과톤수_데이터.xlsx"},
    {"upload" : "2023-10-25 04:59:08", "member" : "Admin", "file" : "20231125045908_통과톤수_데이터.xlsx"}
  ]
  ,
  3 : [
    {"upload" : "2020-01-12 09:15:25", "member" : "Admin", "file" : "20200112091525_궤도측정_데이터.xlsx"},
    {"upload" : "2020-04-08 11:30:45", "member" : "Admin", "file" : "20200408113045_궤도측정_데이터.xlsx"},
    {"upload" : "2020-07-16 12:48:10", "member" : "Admin", "file" : "20200716124810_궤도측정_데이터.xlsx"},
    {"upload" : "2020-10-24 14:05:55", "member" : "Admin", "file" : "20201024140555_궤도측정_데이터.xlsx"},
    {"upload" : "2021-01-19 15:15:30", "member" : "Admin", "file" : "20210119151530_궤도측정_데이터.xlsx"},
    {"upload" : "2021-03-22 16:22:22", "member" : "Admin", "file" : "20210322162222_궤도측정_데이터.xlsx"},
    {"upload" : "2021-06-18 17:38:38", "member" : "Admin", "file" : "20210618173838_궤도측정_데이터.xlsx"},
    {"upload" : "2021-09-21 18:44:44", "member" : "Admin", "file" : "20210921184444_궤도측정_데이터.xlsx"},
    {"upload" : "2021-12-27 19:56:56", "member" : "Admin", "file" : "20211227195656_궤도측정_데이터.xlsx"},
    {"upload" : "2022-02-25 20:24:24", "member" : "Admin", "file" : "20220225202424_궤도측정_데이터.xlsx"},
    {"upload" : "2022-05-20 21:35:35", "member" : "Admin", "file" : "20220520213535_궤도측정_데이터.xlsx"},
    {"upload" : "2022-08-15 22:45:50", "member" : "Admin", "file" : "20220815224550_궤도측정_데이터.xlsx"},
    {"upload" : "2022-11-10 23:55:00", "member" : "Admin", "file" : "20221110235500_궤도측정_데이터.xlsx"},
    {"upload" : "2023-01-05 08:16:16", "member" : "Admin", "file" : "20230105081616_궤도측정_데이터.xlsx"},
    {"upload" : "2023-04-07 10:27:27", "member" : "Admin", "file" : "20230407102727_궤도측정_데이터.xlsx"},
    {"upload" : "2023-06-09 11:37:37", "member" : "Admin", "file" : "20230609113737_궤도측정_데이터.xlsx"},
    {"upload" : "2023-07-13 13:47:47", "member" : "Admin", "file" : "20230713134747_궤도측정_데이터.xlsx"},
    {"upload" : "2023-09-17 14:58:58", "member" : "Admin", "file" : "20230917145858_궤도측정_데이터.xlsx"},
    {"upload" : "2023-10-22 16:09:09", "member" : "Admin", "file" : "20231022160909_궤도측정_데이터.xlsx"}
  ]
  ,
  4 : [
    {"upload" : "2020-01-28 09:45:10", "member" : "Admin", "file" : "20200128094510_궤도계측_데이터.png"},
    {"upload" : "2020-02-26 11:35:20", "member" : "Admin", "file" : "20200226113520_궤도계측_데이터.png"},
    {"upload" : "2020-04-02 12:47:30", "member" : "Admin", "file" : "20200402124730_궤도계측_데이터.png"},
    {"upload" : "2020-05-19 13:58:40", "member" : "Admin", "file" : "20200519135840_궤도계측_데이터.png"},
    {"upload" : "2020-07-07 15:09:50", "member" : "Admin", "file" : "20200707150950_궤도계측_데이터.png"},
    {"upload" : "2020-08-15 16:21:00", "member" : "Admin", "file" : "20200815162100_궤도계측_데이터.png"},
    {"upload" : "2020-09-21 17:32:10", "member" : "Admin", "file" : "20200921173210_궤도계측_데이터.png"},
    {"upload" : "2020-11-12 18:43:20", "member" : "Admin", "file" : "20201112184320_궤도계측_데이터.png"},
    {"upload" : "2021-01-14 19:54:30", "member" : "Admin", "file" : "20210114195430_궤도계측_데이터.png"},
    {"upload" : "2021-03-17 20:05:40", "member" : "Admin", "file" : "20210317200540_궤도계측_데이터.png"},
    {"upload" : "2021-04-23 21:16:50", "member" : "Admin", "file" : "20210423211650_궤도계측_데이터.png"},
    {"upload" : "2021-06-29 22:27:00", "member" : "Admin", "file" : "20210629222700_궤도계측_데이터.png"},
    {"upload" : "2021-08-18 23:38:10", "member" : "Admin", "file" : "20210818233810_궤도계측_데이터.png"},
    {"upload" : "2021-10-25 08:49:20", "member" : "Admin", "file" : "20211025084920_궤도계측_데이터.png"},
    {"upload" : "2022-01-20 07:50:30", "member" : "Admin", "file" : "20220120075030_궤도계측_데이터.png"},
    {"upload" : "2022-03-27 06:51:40", "member" : "Admin", "file" : "20220327065140_궤도계측_데이터.png"},
    {"upload" : "2022-05-18 05:52:50", "member" : "Admin", "file" : "20220518055250_궤도계측_데이터.png"},
    {"upload" : "2022-07-22 04:53:00", "member" : "Admin", "file" : "20220722045300_궤도계측_데이터.png"},
    {"upload" : "2022-09-30 03:54:10", "member" : "Admin", "file" : "20220930035410_궤도계측_데이터.png"},
    {"upload" : "2023-02-05 02:55:20", "member" : "Admin", "file" : "20230205025520_궤도계측_데이터.png"}
  ],
  5 : [
    {"upload" : "2020-01-25 10:20:30", "member" : "Admin", "file" : "20200125102030_프로파일_데이터.xlsx"},
    {"upload" : "2020-02-22 11:30:40", "member" : "Admin", "file" : "20200222113040_프로파일_데이터.xlsx"},
    {"upload" : "2020-03-20 12:40:50", "member" : "Admin", "file" : "20200320124050_프로파일_데이터.xlsx"},
    {"upload" : "2020-04-12 13:50:01", "member" : "Admin", "file" : "20200412135001_프로파일_데이터.xlsx"},
    {"upload" : "2020-05-15 14:10:20", "member" : "Admin", "file" : "20200515141020_프로파일_데이터.xlsx"},
    {"upload" : "2020-06-18 15:20:30", "member" : "Admin", "file" : "20200618152030_프로파일_데이터.xlsx"},
    {"upload" : "2020-07-21 16:30:40", "member" : "Admin", "file" : "20200721163040_프로파일_데이터.xlsx"},
    {"upload" : "2020-08-23 17:40:50", "member" : "Admin", "file" : "20200823174050_프로파일_데이터.xlsx"},
    {"upload" : "2020-09-26 18:50:10", "member" : "Admin", "file" : "20200926185010_프로파일_데이터.xlsx"},
    {"upload" : "2020-10-28 19:05:20", "member" : "Admin", "file" : "20201028190520_프로파일_데이터.xlsx"},
    {"upload" : "2020-11-24 20:15:30", "member" : "Admin", "file" : "20201124201530_프로파일_데이터.xlsx"},
    {"upload" : "2020-12-27 21:25:40", "member" : "Admin", "file" : "20201227212540_프로파일_데이터.xlsx"},
    {"upload" : "2021-01-29 22:35:50", "member" : "Admin", "file" : "20210129223550_프로파일_데이터.xlsx"},
    {"upload" : "2021-02-13 08:45:01", "member" : "Admin", "file" : "20210213084501_프로파일_데이터.xlsx"},
    {"upload" : "2021-03-16 09:55:12", "member" : "Admin", "file" : "20210316095512_프로파일_데이터.xlsx"},
    {"upload" : "2021-04-19 10:05:23", "member" : "Admin", "file" : "20210419100523_프로파일_데이터.xlsx"},
    {"upload" : "2021-05-22 11:15:34", "member" : "Admin", "file" : "20210522111534_프로파일_데이터.xlsx"},
    {"upload" : "2021-06-25 12:25:45", "member" : "Admin", "file" : "20210625122545_프로파일_데이터.xlsx"},
    {"upload" : "2021-07-28 13:35:56", "member" : "Admin", "file" : "20210728133556_프로파일_데이터.xlsx"},
    {"upload" : "2021-08-31 14:45:07", "member" : "Admin", "file" : "20210831144507_프로파일_데이터.xlsx"},
    {"upload" : "2022-01-02 15:55:18", "member" : "Admin", "file" : "20220102155518_프로파일_데이터.xlsx"},
    {"upload" : "2022-03-05 16:05:29", "member" : "Admin", "file" : "20220305160529_프로파일_데이터.xlsx"},
    {"upload" : "2022-05-07 17:15:30", "member" : "Admin", "file" : "20220507171530_프로파일_데이터.xlsx"},
    {"upload" : "2022-07-10 18:25:41", "member" : "Admin", "file" : "20220710182541_프로파일_데이터.xlsx"},
    {"upload" : "2022-09-12 19:35:52", "member" : "Admin", "file" : "20220912193552_프로파일_데이터.xlsx"},
    {"upload" : "2022-11-14 20:45:03", "member" : "Admin", "file" : "20221114204503_프로파일_데이터.xlsx"},
    {"upload" : "2022-12-17 21:55:14", "member" : "Admin", "file" : "20221217215514_프로파일_데이터.xlsx"},
    {"upload" : "2023-02-19 22:05:25", "member" : "Admin", "file" : "20230219220525_프로파일_데이터.xlsx"},
    {"upload" : "2023-03-24 23:15:36", "member" : "Admin", "file" : "20230324231536_프로파일_데이터.xlsx"},
    {"upload" : "2023-04-26 07:25:47", "member" : "Admin", "file" : "20230426072547_프로파일_데이터.xlsx"}
]

  ,
  6 : [
    {"upload" : "2020-01-16 10:25:40", "member" : "Admin", "file" : "20200116102540_직진도_데이터.xlsx"},
    {"upload" : "2020-02-20 12:35:30", "member" : "Admin", "file" : "20200220123530_직진도_데이터.xlsx"},
    {"upload" : "2020-03-22 13:45:20", "member" : "Admin", "file" : "20200322134520_직진도_데이터.xlsx"},
    {"upload" : "2020-04-25 14:55:10", "member" : "Admin", "file" : "20200425145510_직진도_데이터.xlsx"},
    {"upload" : "2020-05-28 15:05:00", "member" : "Admin", "file" : "20200528150500_직진도_데이터.xlsx"},
    {"upload" : "2020-06-16 16:15:50", "member" : "Admin", "file" : "20200616161550_직진도_데이터.xlsx"},
    {"upload" : "2020-07-19 17:25:40", "member" : "Admin", "file" : "20200719172540_직진도_데이터.xlsx"},
    {"upload" : "2020-08-21 18:35:30", "member" : "Admin", "file" : "20200821183530_직진도_데이터.xlsx"},
    {"upload" : "2020-09-23 19:45:20", "member" : "Admin", "file" : "20200923194520_직진도_데이터.xlsx"},
    {"upload" : "2020-10-27 20:55:10", "member" : "Admin", "file" : "20201027205510_직진도_데이터.xlsx"},
    {"upload" : "2020-11-29 21:05:00", "member" : "Admin", "file" : "20201129210500_직진도_데이터.xlsx"},
    {"upload" : "2020-12-24 22:15:50", "member" : "Admin", "file" : "20201224221550_직진도_데이터.xlsx"},
    {"upload" : "2021-01-26 23:25:40", "member" : "Admin", "file" : "20210126232540_직진도_데이터.xlsx"},
    {"upload" : "2021-02-18 08:35:30", "member" : "Admin", "file" : "20210218083530_직진도_데이터.xlsx"},
    {"upload" : "2021-03-24 09:45:20", "member" : "Admin", "file" : "20210324094520_직진도_데이터.xlsx"},
    {"upload" : "2021-04-22 10:55:10", "member" : "Admin", "file" : "20210422105510_직진도_데이터.xlsx"},
    {"upload" : "2021-05-20 11:05:00", "member" : "Admin", "file" : "20210520110500_직진도_데이터.xlsx"},
    {"upload" : "2021-06-18 12:15:50", "member" : "Admin", "file" : "20210618121550_직진도_데이터.xlsx"},
    {"upload" : "2021-07-22 13:25:40", "member" : "Admin", "file" : "20210722132540_직진도_데이터.xlsx"},
    {"upload" : "2021-08-26 14:35:30", "member" : "Admin", "file" : "20210826143530_직진도_데이터.xlsx"},
    {"upload" : "2022-01-15 15:45:20", "member" : "Admin", "file" : "20220115154520_직진도_데이터.xlsx"},
    {"upload" : "2022-03-20 16:55:10", "member" : "Admin", "file" : "20220320165510_직진도_데이터.xlsx"},
    {"upload" : "2022-05-25 17:05:00", "member" : "Admin", "file" : "20220525170500_직진도_데이터.xlsx"},
    {"upload" : "2022-07-27 18:15:50", "member" : "Admin", "file" : "20220727181550_직진도_데이터.xlsx"},
    {"upload" : "2022-09-29 19:25:40", "member" : "Admin", "file" : "20220929192540_직진도_데이터.xlsx"},
    {"upload" : "2022-11-30 20:35:30", "member" : "Admin", "file" : "20221130203530_직진도_데이터.xlsx"},
    {"upload" : "2022-12-28 21:45:20", "member" : "Admin", "file" : "20221228214520_직진도_데이터.xlsx"},
    {"upload" : "2023-02-22 22:55:10", "member" : "Admin", "file" : "20230222225510_직진도_데이터.xlsx"},
    {"upload" : "2023-03-23 23:05:00", "member" : "Admin", "file" : "20230323230500_직진도_데이터.xlsx"},
    {"upload" : "2023-04-27 07:15:50", "member" : "Admin", "file" : "20230427071550_직진도_데이터.xlsx"}
  ]
  ,
  7 : [
    {"upload" : "2020-01-30 10:30:30", "member" : "Admin", "file" : "20200130103030_레일조도_데이터.xlsx"},
    {"upload" : "2020-02-28 11:40:40", "member" : "Admin", "file" : "20200228114040_레일조도_데이터.xlsx"},
    {"upload" : "2020-03-29 12:50:50", "member" : "Admin", "file" : "20200329125050_레일조도_데이터.xlsx"},
    {"upload" : "2020-04-26 13:01:01", "member" : "Admin", "file" : "20200426130101_레일조도_데이터.xlsx"},
    {"upload" : "2020-05-27 14:11:11", "member" : "Admin", "file" : "20200527141111_레일조도_데이터.xlsx"},
    {"upload" : "2020-06-30 15:22:22", "member" : "Admin", "file" : "20200630152222_레일조도_데이터.xlsx"},
    {"upload" : "2020-07-28 16:33:33", "member" : "Admin", "file" : "20200728163333_레일조도_데이터.xlsx"},
    {"upload" : "2020-08-25 17:44:44", "member" : "Admin", "file" : "20200825174444_레일조도_데이터.xlsx"},
    {"upload" : "2020-09-29 18:55:55", "member" : "Admin", "file" : "20200929185555_레일조도_데이터.xlsx"},
    {"upload" : "2020-10-31 19:06:06", "member" : "Admin", "file" : "20201031190606_레일조도_데이터.xlsx"},
    {"upload" : "2020-11-26 20:16:16", "member" : "Admin", "file" : "20201126201616_레일조도_데이터.xlsx"},
    {"upload" : "2020-12-24 21:26:26", "member" : "Admin", "file" : "20201224212626_레일조도_데이터.xlsx"},
    {"upload" : "2021-01-22 22:36:36", "member" : "Admin", "file" : "20210122223636_레일조도_데이터.xlsx"},
    {"upload" : "2021-02-20 23:46:46", "member" : "Admin", "file" : "20210220234646_레일조도_데이터.xlsx"},
    {"upload" : "2021-03-23 08:56:56", "member" : "Admin", "file" : "20210323085656_레일조도_데이터.xlsx"},
    {"upload" : "2021-04-27 09:07:07", "member" : "Admin", "file" : "20210427090707_레일조도_데이터.xlsx"},
    {"upload" : "2021-05-25 10:17:17", "member" : "Admin", "file" : "20210525101717_레일조도_데이터.xlsx"},
    {"upload" : "2021-06-29 11:27:27", "member" : "Admin", "file" : "20210629112727_레일조도_데이터.xlsx"},
    {"upload" : "2021-07-31 12:37:37", "member" : "Admin", "file" : "20210731123737_레일조도_데이터.xlsx"},
    {"upload" : "2021-08-30 13:47:47", "member" : "Admin", "file" : "20210830134747_레일조도_데이터.xlsx"},
    {"upload" : "2022-01-02 14:57:57", "member" : "Admin", "file" : "20220102145757_레일조도_데이터.xlsx"},
    {"upload" : "2022-03-05 16:08:08", "member" : "Admin", "file" : "20220305160808_레일조도_데이터.xlsx"},
    {"upload" : "2022-05-07 17:18:18", "member" : "Admin", "file" : "20220507171818_레일조도_데이터.xlsx"},
    {"upload" : "2022-07-10 18:28:28", "member" : "Admin", "file" : "20220710182828_레일조도_데이터.xlsx"},
    {"upload" : "2022-09-12 19:38:38", "member" : "Admin", "file" : "20220912193838_레일조도_데이터.xlsx"},
    {"upload" : "2022-11-15 20:48:48", "member" : "Admin", "file" : "20221115204848_레일조도_데이터.xlsx"},
    {"upload" : "2022-12-20 21:58:58", "member" : "Admin", "file" : "20221220215858_레일조도_데이터.xlsx"},
    {"upload" : "2023-02-18 23:09:09", "member" : "Admin", "file" : "20230218230909_레일조도_데이터.xlsx"},
    {"upload" : "2023-03-22 07:19:19", "member" : "Admin", "file" : "20230322071919_레일조도_데이터.xlsx"},
    {"upload" : "2023-04-25 06:29:29", "member" : "Admin", "file" : "20230425062929_레일조도_데이터.xlsx"}
]

  ,
}

function DataUpload( props ) {
  const [ trList, setTrList ] = useState(data[1]);
  const [ active, setActive ] = useState(1);
  const activeChange = ( number ) => {
    setActive(number);
    let data_ = [...data[number]]
    // upload를 기준으로 내림차순 정렬
    data_.sort((a, b) => {
      // 날짜를 비교하기 위해 Date 객체로 변환
      let dateA = new Date(a.upload), dateB = new Date(b.upload);
      return dateB - dateA; // b가 a보다 클 때 양수를 반환하여 내림차순 정렬
    });
    setTrList(data_);
  }

  return (
      <div className="dataUpload">
        <div className="uploadMenu">
          <div className="title"><img src={ListIcon} />데이터 관리 목록</div>
          <div className="line"></div>
          <div className={ classNames("menu", { "active" : active === 1 })} onClick={()=>activeChange(1)} >선로열람도</div>
          <div className={ classNames("menu", { "active" : active === 2 })} onClick={()=>activeChange(2)} >통과톤수</div>
          <div className={ classNames("menu", { "active" : active === 3 })} onClick={()=>activeChange(3)} >궤도측정</div>
          <div className={ classNames("menu", { "active" : active === 4 })} onClick={()=>activeChange(4)} >궤도계측</div>
          <div className={ classNames("menu", { "active" : active === 5 })} onClick={()=>activeChange(5)} >프로파일</div>
          <div className={ classNames("menu", { "active" : active === 6 })} onClick={()=>activeChange(6)} >직진도</div>
          <div className={ classNames("menu", { "active" : active === 7 })} onClick={()=>activeChange(7)} >레일조도</div>
        </div>
        <div className="uploadHistory">
          <div className="title">선로열람도</div>
          <div className="info">
            <div className="infoBox">
              <div className="infoTitle">총 등록 데이터 수</div>
              <div className="infoValue">6 건</div>
            </div>
            <div className="infoBox">
              <div className="infoTitle">총 등록 데이터 용량</div>
              <div className="infoValue">523 MB</div>
            </div>
            <div className="infoBox">
              <div className="infoTitle">최근 1주일 간 데이터 등록 건수</div>
              <div className="infoValue">0 건</div>
            </div>
            <div className="infoBox">
              <div className="infoTitle">1주일간 데이터 등록 용량</div>
              <div className="infoValue">0 MB</div>
            </div>
          </div>
          <div className="uploadBtn"><img src={UploadIcon}/>Upload</div>
          <div className="table3">
            <div className="tableHeader">
              <div className="tr">
                <div className="td no">No.</div>
                <div className="td upload">업로드 날짜</div>
                <div className="td member">회원명</div>
                <div className="td file">파일명</div>
                <div className="td download"></div>
              </div>
            </div>
            <div className="tableBody" style={{overflow: "auto", height: "calc( 100% - 35px)"}}>
              {
                trList.map( (tr, i) => {
                  return <div className="tr" key={i}>
                  <div className="td no">{i+1}</div>
                  <div className="td upload">{tr.upload}</div>
                  <div className="td member">{tr.member}</div>
                  <div className="td file">{tr.file}</div>
                  <div className="td download"><div className="donwloadBtn"><img src={DownloadIcon} />다운로드</div></div>
                </div>

                } )
              }
            </div>
          </div>
        </div>
      </div>
  );
}

export default DataUpload;
