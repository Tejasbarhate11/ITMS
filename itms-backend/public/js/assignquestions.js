const testId = sessionStorage.getItem("assign_test_id");
const closebtn = document.getElementById("closebtn");

const titleInput = document.getElementById("title");
const totalScoreInput = document.getElementById("totalScore");
const timeLimitInput = document.getElementById("timeLimit");
const departmentInput = document.getElementById("department");
const designationInput = document.getElementById("designation");

//Assigned Questions
const assignedQuestionsTable = document.getElementById("assignedQuestions");
const noAQData = document.getElementById("noAssignedQuestions")
const previousbtnAQ = document.getElementById("previousbtnAQ");
const nextbtnAQ = document.getElementById("nextbtnAQ");
const pagesIndicatorAQ = document.getElementById("pagesIndicatorAQ");

let currentPageAQ = 0;
let pageSizeAQ = 5;
let totalPagesAQ = 0;

//Questions
const questionsTable = document.getElementById("questions");
const noQuestions = document.getElementById("noQuestions")
const previousbtn = document.getElementById("previousbtn");
const nextbtn = document.getElementById("nextbtn");
const pagesIndicator = document.getElementById("pagesIndicator");

let currentPage = 0;
let pageSize = 10;
let totalPages = 0;


//Search Questions
const tagsInput = document.getElementById("tagsInput");
const tagContainer = document.querySelector('.tag-container');
const searchbtn = document.getElementById("searchbtn");
let tags = [];
let keywords = [];


//SelectedQuestions
let selectedQuestions = [];
const selectedQTable = document.getElementById("selectedQuestions");
const noSelectedQuestions = document.getElementById("noSelectedQuestions");

window.onbeforeunload = function(e) {
    return "Selected questions will be lost if you reload the page, are you sure?";
}

function createTag(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');
    const span = document.createElement('span');
    span.innerHTML = label;
    const closeIcon = document.createElement('i');
    closeIcon.innerHTML = 'close';
    closeIcon.setAttribute('class', 'material-icons');
    closeIcon.setAttribute('data-item', label);
    div.appendChild(span);
    div.appendChild(closeIcon);
    return div;
}

function clearTags() {
    document.querySelectorAll('.tag').forEach(tag => {
    tag.parentElement.removeChild(tag);
    });
}

function addTags() {
    clearTags();
    tags.slice().reverse().forEach(tag => {
        tagContainer.prepend(createTag(tag));
    });
}

tagsInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' & tags.length < 15 & tagsInput.value !== "") {
        e.target.value.split(',').forEach(tag => {
            tags.push(tag.split(' ').join('-').toLowerCase());  
        });
        addTags();
        tagsInput.value = '';
    }
});

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'I') {
        const tagLabel = e.target.getAttribute('data-item');
        const index = tags.indexOf(tagLabel);
        tags = [...tags.slice(0, index), ...tags.slice(index+1)];
        addTags();    
    }
})

function searchQuestions() {
    if(tags.length===0){
        alert("Please enter some keywords.")
        tagsInput.focus();
        return;
    }

    keywords = tags;
    currentPage = 0;
    let url = "/dashboard/questions/keywords?page="+currentPage+"&size="+pageSize;

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            keywords: keywords
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            totalPages = data.response.totalPages;
            loadData(data.response.questions);
            loadTableIndicators();
        }
    });
}

function loadQuestions(){
    let url = "/dashboard/questions/keywords?page="+currentPage+"&size="+pageSize;

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            keywords: keywords
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            totalPages = data.response.totalPages;
            loadData(data.response.questions);
            loadTableIndicators();
        }
    });
}

searchbtn.addEventListener('click', searchQuestions);

function close(){
    sessionStorage.clear();
    window.location.href = "/dashboard/tests";
}
closebtn.addEventListener("click", close);

function changeAQPageSize(){
    pageSizeAQ = document.getElementById("pageSizeAQ").value;
    loadInitialAQTableData();
}

function changePageSize(){
    pageSize = document.getElementById("pageSize").value;
    searchQuestions();
}


function loadTestData(){
    titleInput.value = sessionStorage.getItem("assign_test_title");
    departmentInput.value = sessionStorage.getItem("assign_test_department");
    designationInput.value = sessionStorage.getItem("assign_test_designation");
}

function loadData(questions){
    noQuestions.style.display = "none";
    clearTable();
    if(questions.length>0){
        for(let index = 0; index < questions.length; index++){
            let row = questionsTable.insertRow(index);
            let question = questions[index];
            let questionID = row.insertCell(0);
            questionID.innerHTML = question.id;
            row.insertCell(1).innerHTML = question.type.replaceAll("_"," ");
            let questionBody = row.insertCell(2);
            questionBody.style.overflow = "auto";
            questionBody.innerHTML = question.question_body.replace(/<[^>]+>/g, '');
            row.insertCell(3).innerHTML = question.total_score;
            row.insertCell(4).innerHTML = question.time_limit;
            row.insertCell(5).innerHTML = question.keywords.replaceAll  ("|",", ");
            let disabled;
            if(selectedQuestions.includes(question.id)){
                disabled = "disabled"
            }else{
                disabled = "";
            }
            let action = row.insertCell(6);
            action.style.padding = "0px";
            action.style.verticalAlign = "middle";
            action.innerHTML = "<button id=\"addbtn"+question.id+"\" class=\"btn btn-success m-1 action-btn btn-sm\" "+disabled+" onclick=\"addQuestion(this,'"+question.id+"','"+question.type+"','"+question.total_score+"','"+question.time_limit+"','"+question.question_body+"')\"><span class=\"material-icons md-18 pb-1\">add</span> Add</button";
        }
    }else{
        noQuestions.style.display = "block";
    }
}

function addQuestion(btn, questionID, type, score, time, body){
    if(!selectedQuestions.includes(questionID)){
        selectedQuestions.push(questionID);
        if(selectedQuestions.length>0){
            noSelectedQuestions.style.display = "none";
        }else{
            noSelectedQuestions.style.display = "block";
        } 
        let row = selectedQTable.insertRow(selectedQTable.rows.length);
        row.insertCell(0).innerHTML = questionID;
        row.insertCell(1).innerHTML = type.replaceAll("_", " ");
        let qbody = row.insertCell(2);
        qbody.classList.add("question-body");
        qbody.innerHTML = body.replace(/<[^>]+>/g, '');
        row.insertCell(3).innerHTML = score;
        row.insertCell(4).innerHTML = time;
        row.insertCell(5).innerHTML = "<button class=\"btn btn-danger m-1 action-btn btn-sm\" onclick=\"removeQuestion(this,"+questionID+")\"><span class=\"material-icons md-18 pb-1\">clear</span></button";
        btn.disabled = true;
    }
}

function removeQuestion(btn, questionId){
    for( var i = 0; i < selectedQuestions.length; i++){ 
        if ( selectedQuestions[i] == questionId) { 
            selectedQuestions.splice(i, 1);
            selectedQTable.deleteRow(btn.parentNode.parentNode.rowIndex-1);
            document.getElementById("addbtn"+questionId).disabled = false;
            if(selectedQuestions.length === 0){
                noSelectedQuestions.style.display = "block";
            }
            break;
        }
    }
}

function loadAQData(questions){
    noAQData.style.display = "none";
    clearAQTable();
    if(questions.length>0){
        for(let index = 0; index < questions.length; index++){
            let row = assignedQuestionsTable.insertRow(index);
            let question = questions[index];
            let questionID = row.insertCell(0);
            questionID.innerHTML = question.id;
            row.insertCell(1).innerHTML = question.type.replaceAll("_"," ");
            let questionBody = row.insertCell(2);
            questionBody.style.overflow = "auto";
            questionBody.innerHTML = question.question_body.replace(/<[^>]+>/g, '');
            row.insertCell(3).innerHTML = question.total_score;
            row.insertCell(4).innerHTML = question.time_limit;
            row.insertCell(5).innerHTML = question.keywords.replaceAll  ("|",", ");
            let action = row.insertCell(6);
            action.style.padding = "0px";
            action.style.verticalAlign = "middle";
            action.innerHTML = "<button class=\"btn btn-danger m-1 action-btn btn-sm\" onclick=\"removeAssignedQuestion(this,"+question.id+")\"><span class=\"material-icons md-18 pb-1\">remove_circle_outline</span> Remove</button";
        }
    }else{
        noAQData.style.display = "block";
        if(currentPageAQ>0){
            noAQData.innerHTML = "No Question found"
        }else{
            noAQData.innerHTML = "No Assigned Questions Yet!"
        } 
    }
}

function removeAssignedQuestion(btn, questionID){
    if(confirm("Are you sure you want to unassigned question with ID: "+questionID+"?")){
        let url = "/dashboard/tests/"+testId+"/unassign/"+questionID;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                alert("Question unassigned successfully.")
                assignedQuestionsTable.deleteRow(btn.parentNode.parentNode.rowIndex-1);
            }
        })
    }
     
}

function assignQuestions(){
    if(selectedQuestions.length === 0){
        alert("Please select some questions to assign");
        return;
    }

    let url = "/dashboard/tests/"+testId+"/assign";

    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            questions: selectedQuestions
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            selectedQuestions = [];
            while (selectedQTable.hasChildNodes()) {
                selectedQTable.removeChild(selectedQTable.lastChild);
            }
            currentPageAQ = 0;
            totalPagesAQ = 0;
            loadInitialAQTableData();
        }else{
            alert("Error assigning questions. Please check if ny selected question is already assigned to the test, If so, remove it and try again.")
        }
    })

}

function loadAQTableIndicators(){
    previousbtnAQ.style.display = "none";
    nextbtnAQ.style.display = "none";
    if(totalPagesAQ === 0){
        previousbtnAQ.style.display = "none";
        nextbtnAQ.style.display = "none";
    }else if(currentPageAQ === 0){
        if(totalPagesAQ !== 1){
            nextbtnAQ.style.display = "block";
        }else{
            nextbtnAQ.style.display = "none";
        }
        previousbtnAQ.style.display = "none";
    }else if(currentPageAQ > 0 && currentPageAQ < totalPagesAQ-1){
        previousbtnAQ.style.display = "block";
        nextbtnAQ.style.display = "block";
    }else{
        previousbtnAQ.style.display = "block";
        nextbtnAQ.style.display = "none";
    }
    let indicator = "Showing page "+(currentPageAQ+1)+" out of " + (totalPagesAQ) + " pages";
    pagesIndicatorAQ.innerText = indicator;
}

function loadTableIndicators(){
    previousbtn.style.display = "none";
    nextbtn.style.display = "none";
    if(totalPages === 0){
        previousbtn.style.display = "none";
        nextbtn.style.display = "none";
    }else if(currentPage === 0){
        if(totalPages !== 1){
            nextbtn.style.display = "block";
        }else{
            nextbtn.style.display = "none";
        }
        previousbtn.style.display = "none";
        
    }else if(currentPage > 0 && currentPage < totalPages-1){
        previousbtn.style.display = "block";
        nextbtn.style.display = "block";
    }else{
        previousbtn.style.display = "block";
        nextbtn.style.display = "none";
    }
    let indicator = "Showing page "+(currentPage+1)+" out of " + (totalPages) + " pages";
    pagesIndicator.innerText = indicator;
}

function clearAQTable(){
    while (assignedQuestionsTable.hasChildNodes()) {
        assignedQuestionsTable.removeChild(assignedQuestionsTable.lastChild);
    }
}

function clearTable(){
    while (questionsTable.hasChildNodes()) {
        questionsTable.removeChild(questionsTable.lastChild);
    }
}

nextbtnAQ.addEventListener('click', () => {
    if(currentPageAQ < totalPagesAQ){
        currentPageAQ = currentPageAQ + 1; 
        loadAQTableData();
        loadAQTableIndicators();
    }
})

previousbtnAQ.addEventListener('click', () => {
    if(currentPageAQ > 0){
        currentPageAQ = currentPageAQ - 1;
        loadAQTableData();
        loadAQTableIndicators();
    }
})

nextbtn.addEventListener('click', () => {
    if(currentPage < totalPages){
        currentPage = currentPage + 1; 
        loadQuestions();
        loadTableIndicators();
    }
})

previousbtn.addEventListener('click', () => {
    if(currentPage > 0){
        currentPage = currentPage - 1;
        loadQuestions();
        loadTableIndicators();
    }
})


function loadInitialAQTableData(){
    const url = "/dashboard/tests/test/"+testId+"/questions?page="+currentPageAQ+"&size="+pageSizeAQ;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.success){   
            totalScoreInput.value = data.test.total_score === null? 0 : data.test.total_score;
            timeLimitInput.value = data.test.time_limit === null? 0: data.test.time_limit;
            currentPageAQ = data.currentPage;
            totalPagesAQ = data.totalPages;
            loadAQData(data.questions);
            loadAQTableIndicators();
        }else{
            console.log(data.err_msg);
        }
    })
}

function loadAQTableData(){
    const url = "/dashboard/tests/test/"+testId+"/questions?page="+currentPageAQ+"&size="+pageSizeAQ;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            loadAQData(data.questions);
        });
}

function loadTableData(){
    const url = "/dashboard/tests/test/"+testId+"/questions?page="+currentPageAQ+"&size="+pageSizeAQ;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            loadData(data.questions);
        });
}


loadTestData();
loadInitialAQTableData();
loadAQTableIndicators();
loadTableIndicators();
