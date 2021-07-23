const questionID = sessionStorage.getItem("questionID");
const questionType = sessionStorage.getItem("questionType");

const donebtn = document.getElementById("donebtn");

const options = document.getElementsByName("option");

const correctAnswers = [];

const validateAnswers = (length, type) => {
    if(length === 0){
        alert("Please select atleast one correct answer")
        return false;
    }else if((type === "true_false" || type === "single_ans_mcq") && length !== 1){
        alert("Please select only one correct answer");
        return false;
    }else if(type === "multiple_ans_mcq" && length < 1){
        alert("Please select alteast one correct answer");
        return false;
    }else{
        return true;
    }
}

function addAnswers(){
    correctAnswers.length = 0;
    if(confirm("Are you sure with the answers marked?")){
        options.forEach(option => {
            if(option.checked){
                correctAnswers.push(option.value);
            }
        })
        if(validateAnswers(correctAnswers.length, questionType)){
            donebtn.innerText = "loading...";
            fetch('/dashboard/questions/answers/' + questionID,{
                method: 'POST',
                body: JSON.stringify({
                    QuestionId: questionID,
                    correct: correctAnswers
                }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    alert("Question added successfully");
                    sessionStorage.clear();
                    window.location.href = "/dashboard/questions";
                }else{
                    donebtn.innerText = "DONE"
                    alert(data.err_msg);
                }
            })
        }
        
    }
}