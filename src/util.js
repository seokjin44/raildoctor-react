export const dateFormat = ( date ) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하기 때문에 +1이 필요합니다.
    const dd = String(date.getDate()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd}`;
}