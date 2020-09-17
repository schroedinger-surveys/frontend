export const setAllSurveyCounts = (privateSurveys, publicSurveys) => {
    const allSurveys = [...privateSurveys, ...publicSurveys];

    let active = 0;
    let pending = 0;
    let closed = 0;

    const today = Date.now();

    for (let i = 0; i < allSurveys.length; i++){
        const startDate = new Date(allSurveys[i].start_date).getTime();
        const endDate = new Date(allSurveys[i].end_date).getTime();
        if(startDate > today){
            pending++;
        } else if(endDate < today){
            closed++
        } else if (startDate <= today && endDate >= today){
            active++;
        }
    }
    return[active, pending, closed];
}
