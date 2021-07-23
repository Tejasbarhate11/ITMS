const addquestionbtn = document.getElementById("addquestionbtn");
const assignquestionsbtn = document.getElementById("assignquestionsbtn");

//Questions
const questionsTable = document.getElementById("questions");
const noQuestions = document.getElementById("noQuestions")
const previousbtn = document.getElementById("previousbtn");
const nextbtn = document.getElementById("nextbtn");
const pagesIndicator = document.getElementById("pagesIndicator");

let currentPage = 0;
let pageSize = 15;
let totalPages = 0;


//Search Questions
const tagsInput = document.getElementById("tagsInput");
const tagContainer = document.querySelector('.tag-container');
const searchbtn = document.getElementById("searchbtn");
const clearbtn = document.getElementById("clearbtn");
let tags = [];
let keywords = [];


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
    sessionStorage.setItem("keywords", JSON.stringify(keywords));
    currentPage = 0;
    searchbtn.style.display = "none";
    clearbtn.style.display = "block";
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

clearbtn.addEventListener('click', ()=>{
    sessionStorage.removeItem("keywords");
    clearTable();
    clearTags();
    keywords = [];
    tags = [];
    noQuestions.style.display = "block";
    searchbtn.style.display = "block";
    clearbtn.style.display = "none";
    currentPage = 0;
    totalPages = 0;
})

function loadQuestions(){
    searchbtn.style.display = "none";
    clearbtn.style.display = "block";
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


addquestionbtn.addEventListener("click", () => {
    window.location.href = "/dashboard/questions/add";
});

function loadStatistics(){
    let url = "/dashboard/questions/statistics"
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data.success){
                document.getElementById("mcqs_questions").innerHTML = data.mcqs_questions;
                document.getElementById("mcqm_questions").innerHTML = data.mcqm_questions;
                document.getElementById("tf_questions").innerHTML = data.tf_questions;
            }
        })
}

function changePageSize(){
    pageSize = document.getElementById("pageSize").value;
    searchQuestions();
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
            questionBody.innerHTML = question.question_body.replace(/<[^>]+>/g, '');
            row.insertCell(3).innerHTML = question.total_score;
            row.insertCell(4).innerHTML = question.time_limit;
            row.insertCell(5).innerHTML = question.keywords.replaceAll  ("|",", ");
            let action = row.insertCell(6);
            action.style.padding = "0px";
            action.style.verticalAlign = "middle";
            action.innerHTML = "<button class=\"btn btn-primary m-1 action-btn btn-sm\" onclick=\"editQuestion(this,"+question.id+")\"><span class=\"material-icons md-18 pb-1\">edit</span></button><button class=\"btn btn-danger m-1 action-btn btn-sm\" onclick=\"deleteQuestion(this,"+question.id+")\"><span class=\"material-icons md-18 pb-1\">delete</span></button";
        }
    }else{
        noQuestions.style.display = "block";
    }
}

function deleteQuestion(btn, questionID){
    if(!confirm("Are you sure you want to delete question with ID: "+questionID+"?")){
        return;
    }
    let url =  "/dashboard/questions/delete/"+questionID;

    fetch(url, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            questionsTable.deleteRow(btn.parentNode.parentNode.rowIndex-1);
        }else{
            alert(data.message);
        }
    })
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

function clearTable(){
    while (questionsTable.hasChildNodes()) {
        questionsTable.removeChild(questionsTable.lastChild);
    }
}

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

function loadAfterRefresh() {
    keywords = JSON.parse(sessionStorage.getItem("keywords"));
    if(keywords !== null){
        if(keywords.length > 0){
            tags = keywords;
            addTags();
            searchQuestions();
        }
    }
}


loadStatistics();
loadTableIndicators();
loadAfterRefresh();


