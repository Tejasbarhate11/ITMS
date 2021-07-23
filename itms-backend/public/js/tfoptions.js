const questionId = document.getElementById("questionId");
const nextbtn = document.getElementById("nextbtn");

const questionID = sessionStorage.getItem("questionID");

questionId.value = questionID;

const closebtn = document.getElementById("closebtn");
closebtn.addEventListener('click', () => {
    if(confirm("Go back? The question will not be saved")){
        window.location.href = "/dashboard/questions/delete/"+questionID;
    }else{
        return;
    }
})

function addOptions() {
    if(option1editor.getLength() === 1){
        alert("Please enter option 1")
        option1editor.focus();
        return;
    }else if(option2editor.getLength() === 1){
        alert("Please enter option 2")
        option2editor.focus();
        return;
    }else{
        if(confirm("Are you sure with all the options?")){
            nextbtn.innerText = "Loading..."
            let options = [];
            options.push({
                option_body: option1editor.root.innerHTML,
                QuestionId: questionID
            }); 
            options.push({
                option_body: option2editor.root.innerHTML,
                QuestionId: questionID
            });

            fetch("/dashboard/questions/options/"+questionID, {
                method: 'POST',
                body: JSON.stringify({
                    options: options
                }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    window.location.href = "/dashboard/questions/answers/"+questionID;
                }else{
                    alert(data.message);
                    nextbtn.innerText = "Next";
                }
            });
        }
    }
}