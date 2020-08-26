const TimeConverter = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth()).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
}

export default TimeConverter;