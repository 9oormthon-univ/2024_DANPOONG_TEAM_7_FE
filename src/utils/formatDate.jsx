export const formatDateWithDots = (dateString) => {
    if (!dateString) return '';
    return dateString.replace(/-/g, '.');
};

export const formatDateWithShortDots = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const shortYear = year.slice(2);
    return `${shortYear}.${month}.${day}`;
};

export const formatDateToMMYY = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const shortYear = year.slice(2);
    return `${month}/${shortYear}`;
};