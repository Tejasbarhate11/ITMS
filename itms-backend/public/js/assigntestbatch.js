const closebtn = document.getElementById("closebtn")
const assignbtn = document.getElementById("assignbtn")

//dates
const startTimeInput = document.getElementById("startTimeInput")
const endTimeInput = document.getElementById("endTimeInput")


closebtn.addEventListener("click", () => {
    if(sessionStorage.getItem("selected_test_id")){
        if(!confirm("Are you sure you want to go back? Changes won't be saved")){
            return;    
        }else{
            sessionStorage.clear();
            history.back();
        }
    }else{
        sessionStorage.clear();
        history.back();
    }
})

function validateTimes(){
    if(startTimeInput.value === ""){
        alert("Please enter test start time")
        startTimeInput.focus();
        return false;
    }else if(new Date(startTimeInput.value).getTime() <= new Date().getTime()+3600000){
        alert("Invalid start time");
        startTimeInput.focus();
        return false;
    }else if(endTimeInput.value === ""){
        alert("Please enter test end time")
        endTimeInput.focus();
        return false;        
    }else if(startTimeInput.value>=endTimeInput.value){
        alert("Invalid start and end times")
        startTimeInput.focus();
        return false;
    }else{
        return true;
    }
}


endTimeInput.addEventListener('change', validateTimes)