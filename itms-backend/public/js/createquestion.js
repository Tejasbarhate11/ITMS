const tagcontainer = document.querySelector('.tag-container');
const taginput = document.querySelector('.tag-container input');

const totalmarksinput = document.getElementById("totalMarksInput");
const timelimitinput = document.getElementById("timeLimitInput");
const questypeinput = document.getElementById("questypeinput");


const questionInput = document.getElementById('questionInput');
const addbtn = document.getElementById("addbtn");

const persist = window.sessionStorage;

let tags = [];

const closebtn = document.getElementById("closebtn");
closebtn.addEventListener('click', () => {
    if(questionQuill.getLength() !== 1){
        if(confirm("Are you sure you want to go back?")){
            window.location.href = "/dashboard/questions";
        }else{
            return;
        }
    }else{
        window.location.href = "/dashboard/questions";
        return;
    }
})


addbtn.addEventListener("click", () => {
    if(questionQuill.getLength() === 1){
        alert("Please enter the question body")
        questionQuill.focus();
        return;
    }
    else if(totalmarksinput.value === ""){
        alert("Please enter the total marks for the question");
        totalmarksinput.focus();
        return;
    }
    else if(totalmarksinput.value<0 || totalmarksinput.value>100 || isNaN(totalmarksinput.value)){
        alert("Please check the total marks for the question");
        totalmarksinput.focus();
        return;
    }
    else if(timelimitinput.value === ""){
        alert("Please enter the time limit for the question");
        timelimitinput.focus();
        return;
    }
    else if(timelimitinput.value<0 || timelimitinput.value>600 || isNaN(timelimitinput.value)){
        alert("Please check the time limit for the question");
        timelimitinput.focus();
        return;
    }
    else if(tags.length === 0){ 
        alert("Please enter suitable keywords");
        taginput.focus();
        return;
    }
    else if(tags.length>5){
        alert("Too many keywords! Please keep 5 or less than 5 keywords.")
        taginput.focus();
        return;
    }
    else if(questypeinput.value === "none"){
        alert("Please select the question type");
        questypeinput.focus();
        return;
    }else{
        if(confirm("Are you sure with all the details of the question?")){
            fetch('/dashboard/questions/add',{
                method: 'POST',
                body: JSON.stringify({
                    type: questypeinput.value,
                    question_body: questionQuill.root.innerHTML,
                    total_score: totalmarksinput.value,
                    time_limit: timelimitinput.value,
                    keywords: tags.join(" | ")
                }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(data => {
                addbtn.innerHTML = "Loading..."
                if(data.success){
                    persist.setItem("questionID", data.questionID);
                    persist.setItem("questionType", data.questionType);
                    window.location.href = "/dashboard/questions/options/"+data.questionID;
                }else{
                    alert("Something went wrong!");
                    addbtn.innerText = "NEXT";
                }
            });
        }
    }
})

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
        tagcontainer.prepend(createTag(tag));
    });
}

taginput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' & tags.length < 15 & tagsInput.value !== "") {
        e.target.value.split(',').forEach(tag => {
            tags.push(tag.split(' ').join('-').toLowerCase());  
        });
        addTags();
        taginput.value = '';
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
