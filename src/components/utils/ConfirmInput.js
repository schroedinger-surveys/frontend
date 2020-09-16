export const confirmDoubleInput = (identification, confirmIdentification) => {
    const firstInput = document.getElementById(identification);
    const confirmInput = document.getElementById(confirmIdentification);

    if (firstInput !== null && confirmInput !== null){
        if(firstInput.value === confirmInput.value){
            return {backgroundColor: "white", color:"black"};
        } else {
            return {backgroundColor: "darkred", color: "white"};
        }
    }
}