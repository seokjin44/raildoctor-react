import { atom } from 'recoil';

export const monitoringSelectDates = atom({
  key: 'monitoringSelectDates', // 고유한 키
  default: null, // 초기값
});

export const monitoringKP = atom({
    key: 'monitoringKP', // 고유한 키
    default: {kp : 0, changeEvent : "" }, // 초기값
});
  
export const monitoringInputKP = atom({
    key: 'monitoringInputKP', // 고유한 키
    default: 0, // 초기값
});
  