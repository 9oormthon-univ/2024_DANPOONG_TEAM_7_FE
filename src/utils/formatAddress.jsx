// utils/formatAddress.jsx
export const formatAddress = (address) => {
    if (!address) return '';
    
    const commaIndex = address.indexOf(',');
    return commaIndex !== -1 ? address.substring(0, commaIndex) : address;
 };