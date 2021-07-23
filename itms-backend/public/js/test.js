let currentpage = 0;
let maxpage;
let pagesize = 15;
let orderby = "createdAt";

const table = document.getElementById("data");

const previousbtn = document.getElementById("previousbtn");
const nextbtn = document.getElementById("nextbtn");
const pageindicator = document.getElementById("pagesindicator");

const assignTestBatchbtn = document.getElementById("assignTestBatchbtn");


let urltoload = "/dashboard/tests/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;

function changePageSize(){
    pagesize = document.getElementById("pagesize").value;
    loadInitialTableData();
}
    
function orderBy(){
    orderby = document.getElementById("orderby").value;
    loadInitialTableData();
}

function loadData(tests){
    nosearchresult.style.display = "none";
    clearTable();
    if(tests.length>0){
        for(let index = 0; index < tests.length; index++){
            let row = table.insertRow(index);
            let test = tests[index];
            row.insertCell(0).innerHTML = test.id;
            row.insertCell(1).innerHTML = test.title;
            row.insertCell(2).innerHTML = test.status;
            row.insertCell(3).innerHTML = test["User.name"];
            row.insertCell(4).innerHTML = test["Designation.designation"];
            row.insertCell(5).innerHTML = test["Department.name"];
            let action = row.insertCell(6);
            action.style.padding = "0px";
            action.style.verticalAlign = "middle";
            let statusbtn;
            let department = test["Department.name"];
            let designation = test["Designation.designation"];
            if(test.status === "active"){
                statusbtn = "<button class=\"btn btn-danger action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+test.id+")\"><span class=\"material-icons md-18\">cancel</span></button>"
            }else{
                statusbtn = "<button class=\"btn btn-success action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+test.id+")\"><span class=\"material-icons md-18\">check_circle</span></button>"
            }
            action.innerHTML = statusbtn + "<button class=\"btn btn-success action-btn btn-sm m-1\" onclick=\"assignQuestions('"+designation.trim()+"','"+test.title+"','"+department+"',"+test.id+" )\"><span class=\"material-icons md-18\">assignment</span></button><button class=\"btn btn-primary action-btn btn-sm m-1\" onclick=\"updateTest("+test.id+")\"><span class=\"material-icons md-18\">edit</span></button><button class=\"btn btn-danger m-1 action-btn btn-sm\" onclick=\"deleteTest(this,"+test.id+")\"><span class=\"material-icons md-18\">delete</span></button";
        }
    }else{
        nosearchresult.style.display = "block";
        nosearchresult.innerHTML = "No data found"
    }
}

function updateUser(testId){
    let url = "/dashboard/tests/update/"+testID;
    window.location.href = url;
}

function changeStatus(btn, testId){
    const url = "/dashboard/tests/update/"+testId;

    let cell = table.rows[btn.parentNode.parentNode.rowIndex-1].cells[2];

    if(cell.innerHTML === "active"){
        cell.innerHTML = "updating...";
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                status: 'inactive'
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                cell.innerHTML = "inactive";
                btn.classList.replace("btn-danger", "btn-success");
                btn.innerHTML = "<span class=\"material-icons md-18\">check_circle</span>"
            }
        });        
    }else if(cell.innerHTML === "inactive"){
        cell.innerHTML = "updating...";
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                status: 'active'
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                cell.innerHTML = "active";
                btn.classList.replace("btn-success", "btn-danger");
                btn.innerHTML = "<span class=\"material-icons md-18\">cancel</span>"
            }
        });

        
    }else{
        alert("Please wait for some time before changing the status again.")
    }
}

function assignQuestions(designation, title, name, id){
    const url = "/dashboard/tests/"+id+"/assign";
    sessionStorage.setItem("assign_test_id", id);
    sessionStorage.setItem("assign_test_title", title);
    sessionStorage.setItem("assign_test_department", name);
    sessionStorage.setItem("assign_test_designation", designation);
    window.location.href = url;
}

function deleteTest(btn, testID){
    let deletemsg = "Are you sure you want to delete test with ID: "+testID+"?";
    if(confirm(deletemsg)){
        fetch("/dashboard/tests/delete/"+testID,{method: "DELETE"})
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    table.deleteRow(btn.parentNode.parentNode.rowIndex-1);
                }
            })    
    }
    
}

function loadInitialTableData(){
    nosearchresult.style.display = "none";
    currentpage = 0;
    urltoload = "/dashboard/tests/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;
    console.log(urltoload);
    fetch(urltoload,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            nextbtn.style.display = "block";
            currentpage = data.currentPage;
            maxpage = data.totalPages-1;
            loadData(data.tests);
            loadIndicators();
        });
}

function clearTable(){
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
}

previousbtn.addEventListener('click', () => {
    if(currentpage > 0){
        currentpage = currentpage - 1;
        loadTableData();
        loadIndicators();
    }
})


function loadIndicators(){
    previousbtn.style.display = "none";
    nextbtn.style.display = "none";
    if(maxpage === 0){
        previousbtn.style.display = "none";
        nextbtn.style.display = "none";
    }else if(currentpage === 0){
        previousbtn.style.display = "none";
        nextbtn.style.display = "block";
    }else if(currentpage > 0 && currentpage < maxpage){
        previousbtn.style.display = "block";
        nextbtn.style.display = "block";
    }else{
        previousbtn.style.display = "block";
        nextbtn.style.display = "none";
    }
    let indicator = "Showing page "+(currentpage+1)+" out of " + (maxpage+1) + " pages";
    pageindicator.innerText = indicator;
}

function loadTableData(){
    urltoload = "/dashboard/tests/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;
    fetch(urltoload,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            loadData(data.tests);
        });
}



nextbtn.addEventListener('click', () => {
    if(currentpage < maxpage){
        currentpage = currentpage + 1; 
        loadTableData();
        loadIndicators();
    }
})

function loadStatistics(){
    let url = "/dashboard/tests/statistics"
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("active_tests").innerHTML = data.active_tests;
            document.getElementById("inactive_tests").innerHTML = data.inactive_tests;
            document.getElementById("deleted_tests").innerHTML = data.deleted_tests;
        })
}

loadStatistics();
loadInitialTableData();