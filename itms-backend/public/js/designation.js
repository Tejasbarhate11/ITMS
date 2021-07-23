let currentpage = 0;
let maxpage;
let pagesize = 15;

let orderby = "createdAt";

const table = document.getElementById("data");
const previousbtn = document.getElementById("previousbtn");
const nextbtn = document.getElementById("nextbtn");
const pageindicator = document.getElementById("pagesindicator");

previousbtn.addEventListener('click', () => {
    if(currentpage > 0){
        currentpage = currentpage - 1;
        loadTableData();
        loadIndicators();
    }
});

function createDesignation(){
    let designation = document.getElementById("designationName").value.trim();

    if(designation === ""){
        alert("Please enter the designation title.");
        document.getElementById("designationName").focus();
    }else if(designation.length > 100){
        alert("Designation title too long")
        document.getElementById("designationName").focus();
    }else{
        fetch("/dashboard/designations/create",{
            method: 'POST',
            body: JSON.stringify({
                designation: designation,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                alert("Designation created successfully!")
                document.getElementById("designationName").value = "";
            }
        });
    }
}

function orderBy(){
    orderby = document.getElementById("orderby").value;
    loadInitialTableData();
}


function deleteDesignation(btn, designationID){
    let deletemsg = "Are you sure you want to delete designation with ID: "+designationID+"?";
    if(confirm(deletemsg)){
        fetch("/dashboard/designations/delete/"+designationID,{method: "DELETE"})
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    alert("Designation deleted successfully.")
                    table.deleteRow(btn.parentNode.parentNode.rowIndex-1);
                }
            })    
    }  
}

nextbtn.addEventListener('click', () => {
    if(currentpage < maxpage){
        currentpage = currentpage + 1; 
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

function clearTable(){
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
}

function changePageSize(){
    pagesize = document.getElementById("pagesize").value;
    loadInitialTableData();
}

function loadData(designations){
    clearTable();
    for(let index = 0; index < designations.length; index++){
        let row = table.insertRow(index);
        let designation = designations[index];
        row.insertCell(0).innerHTML = designation.id;
        row.insertCell(1).innerHTML = designation.designation;
        row.insertCell(2).innerHTML = designation.status;
        row.insertCell(3).innerHTML = designation.createdAt;
        let action = row.insertCell(4);
        action.style.padding = "0px";
        action.style.verticalAlign = "middle";
        let statusAction;
        if(designation.status === "active"){
            statusAction = "<button class=\"btn btn-danger action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+designation.id+")\"><span class=\"material-icons md-18\">cancel</span></button>";
        }else{
            statusAction = "<button class=\"btn btn-primary action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+designation.id+")\"><span class=\"material-icons md-18\">check_circle</span></button>";
        }

        action.innerHTML = statusAction + "<button class=\"btn btn-danger action-btn btn-sm m-1\" onclick=\"deleteDesignation(this,"+designation.id+")\"><span class=\"material-icons md-18\">delete</span></button>"

    }
}

function changeStatus(btn, departmentID){
    const url = "/dashboard/designations/update/"+departmentID;

    let cell = table.rows[btn.parentNode.parentNode.rowIndex-1].cells[2];

    if(cell.innerHTML === "active"){
        cell.innerHTML = "updating...";
        fetch(url, {
            method: 'POST',
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
                btn.classList.replace("btn-danger", "btn-primary");
                btn.innerHTML = "<span class=\"material-icons md-18\">check_circle</span>"
            }
        });        
    }else if(cell.innerHTML === "inactive"){
        cell.innerHTML = "updating...";
        fetch(url, {
            method: 'POST',
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
                btn.classList.replace("btn-primary", "btn-danger");
                btn.innerHTML = "<span class=\"material-icons md-18\">cancel</span>"
            }
        });

        
    }else{
        alert("Please wait for some time before changing the status again.")
    }
}

function loadInitialTableData(){
    let url = "/dashboard/designations/all?page=0&size="+pagesize+"&orderby="+orderby;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            nextbtn.style.display = "block";
            currentpage = data.currentPage;
            maxpage = data.totalPages-1;
            loadData(data.designations);
            loadIndicators();
        });
}

function loadTableData(){
    let url = "/dashboard/designations/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            loadData(data.designations);
        });
}

function deleteDesignation(btn, designationID){
    let deletemsg = "Are you sure you want to delete designation with ID: "+designationID+"?";
    if(confirm(deletemsg)){
        fetch("/dashboard/designations/delete/"+designationID,{method: "DELETE"})
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    table.deleteRow(btn.parentNode.parentNode.rowIndex-1);
                }
            })    
    }   
}

function loadStatistics(){
    let url = "/dashboard/designations/statistics"
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("active_designations").innerHTML = data.active_designations;
            document.getElementById("inactive_designations").innerHTML = data.inactive_designations;
        })
}

loadStatistics();
loadInitialTableData();
