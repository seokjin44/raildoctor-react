export const dateFormat = ( date ) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하기 때문에 +1이 필요합니다.
    const dd = String(date.getDate()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd}`;
}

export const convertToCustomFormat = (num) => {
    if (typeof num !== 'number' || num < 1000) {
        return 'Input should be a number greater than or equal to 1000';
    }

    let thousandPart = Math.floor(num / 1000);
    let remainderPart = num % 1000;
    
    let formattedRemainder = remainderPart.toString().padStart(3, '0'); // 0을 채워서 3자리 문자열로 만듭니다.
    
    return `${thousandPart}k${formattedRemainder}`;
}