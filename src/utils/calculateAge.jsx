// utils/calculateAge.js

/**
* YYYY-MM-DD 형식의 생년월일을 나이로 변환
* @param {string} birthDate - YYYY-MM-DD 형식의 생년월일
* @returns {number} 현재 나이
*/
export const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
   const today = new Date();
   const birth = new Date(birthDate);
   return today.getFullYear() - birth.getFullYear() + 1;
 };