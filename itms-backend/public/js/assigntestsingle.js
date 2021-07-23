const closebtn = document.getElementById("closebtn");
const examineeID = sessionStorage.getItem("examinee_id");
const examineeName = sessionStorage.getItem("examinee_name");
const examineeEmail = sessionStorage.getItem("examinee_email");

const examineeIdInput = document.getElementById("examineeIdInput");

//Search examinee
// const examineeEmailInput = document.getElementById("examineeEmailInput");
// const searchExamineebtn = document.getElementById("searchExamineebtn");

//Search test
const testIDInput = document.getElementById("testIDInput");
const testSeachBtn = document.getElementById("testSearchBtn");
const selectTestDetails = document.getElementById("selectTestDetails");
const noTestFound = document.getElementById("noTestFound");

const removeSelectedTestBtn = document.getElementById("removeSelectedTestBtn");

const testTitleInput = document.getElementById("testTitleInput");
const departmentInput = document.getElementById("departmentInput");
const designationInput = document.getElementById("designationInput");


//Start end time
const startTimeInput = document.getElementById("startTimeInput");
const endTimeInput = document.getElementById("endTimeInput");

//assign
const assignbtn = document.getElementById("assignbtn");

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

removeSelectedTestBtn.addEventListener("click", ()=>{
    sessionStorage.removeItem("selected_test_id");
    selectTestDetails.style.display = "none";
    noTestFound.style.display = "none";
})

assignbtn.addEventListener('click', () => {
    if(sessionStorage.getItem("selected_test_id") !== null){
        if(validateTimes()){
            console.log({
                examineeID: examineeID,
                testID: sessionStorage.getItem("selected_test_id"),
                starts_at: startTimeInput.value,
                ends_at: endTimeInput.value
            });
            fetch("/dashboard/assignments/assign", {
                method: "POST",
                body: JSON.stringify({
                    examineeID: examineeID,
                    testID: sessionStorage.getItem("selected_test_id"),
                    starts_at: startTimeInput.value,
                    ends_at: endTimeInput.value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    alert(data.message);
                    clearSelectedTest();
                    startTimeInput.value = "";
                    endTimeInput.value = "";
                }else{
                    console.log(data);
                    alert(data.err_msg);
                    clearSelectedTest();
                }
            })
        }
    }else{
        alert("Please select a test to assign");
        testIDInput.focus();
    }
})

testSeachBtn.addEventListener('click', ()=>{
    selectTestDetails.style.display = "none";
    noTestFound.style.display = "none";
    if(testIDInput.value === "" || testIDInput.value < 0){
        alert("Invalid Test ID");
        return;
    }else{
        fetch("/dashboard/tests/test/"+testIDInput.value)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                sessionStorage.setItem("selected_test_id", data.test.id);
                testTitleInput.value = data.test.title;
                departmentInput.value = data.test["Department.name"];
                designationInput.value = data.test["Designation.designation"];
                selectTestDetails.style.display = "block";
                noTestFound.style.display = "none";
            }else{
                testIDInput.focus();
                selectTestDetails.style.display = "none";
                noTestFound.style.display = "block";
            }
        })
    }


})

// searchExamineebtn.addEventListener('click', ()=>{
//     examineeEmail = examineeEmailInput.value.trim();

//     if(examineeEmail === ""){
//         alert("Please enter valid Examinee email");
//         examineeEmailInput.focus();
//         return;
//     }else{
//         fetch("/dashboard/users/examinee/email", {
//             method: "POST",
//             body: JSON.stringify({
//                 email: examineeEmail
//             }),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//         })
//     }
// })

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

function clearSelectedTest(){
    sessionStorage.removeItem("selected_test_id");
    testTitleInput.value = "";
    departmentInput.value = "";
    designationInput.value = "";
    selectTestDetails.style.display = "none";
    noTestFound.style.display = "none";
}

function loadDetails(){
    examineeIdInput.value = examineeID;
    document.getElementById("examineeNameInput").value = examineeName;
    document.getElementById("examineeEmailInput").value = examineeEmail;

    selectTestDetails.style.display = "none";
    noTestFound.style.display = "none";
}

if(examineeID === null){
    history.back()
}

function afterReload(){
    let selectedTestId = sessionStorage.getItem("selected_test_id");
    if(selectedTestId !== null){
        testIDInput.value = selectedTestId;
        testSeachBtn.click();
    }
}

loadDetails();
afterReload();


