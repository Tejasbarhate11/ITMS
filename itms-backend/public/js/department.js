let currentpage=0;
let maxpage;
let pagesize=15;
let orderby="createdAt"

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

function loadData(departments){
    clearTable();
    for(let index = 0; index < departments.length; index++){
        let row = table.insertRow(index);
        let department = departments[index];
        row.insertCell(0).innerHTML = department.id;
        row.insertCell(1).innerHTML = department.name;
        row.insertCell(2).innerHTML = department.status;
        row.insertCell(3).innerHTML = department.createdAt;
        let action = row.insertCell(4);
        action.style.padding = "0px";
        action.style.verticalAlign = "middle";
        let statusAction;
        if(department.status === "active"){
            statusAction = "<button class=\"btn btn-danger action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+department.id+")\"><span class=\"material-icons md-18\">cancel</span></button>";
        }else{
            statusAction = "<button class=\"btn btn-primary action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+department.id+")\"><span class=\"material-icons md-18\">check_circle</span></button>";
        }
        action.innerHTML = statusAction + "<button class=\"btn btn-danger action-btn btn-sm m-1\" onclick=\"deleteDepartment(this,"+department.id+")\"><span class=\"material-icons md-18\">delete</span></button>";        
    }
}

function changeStatus(btn, departmentID){
    const url = "/dashboard/departments/update/"+departmentID;

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

// function deactivateDepartment(btn, departmentId){
//     cell = table.rows[btn.parentNode.parentNode.rowIndex-1].cells[2];
//     cell.innerHTML = "inactive";
//     btn.innerHTML="<button class=\"btn btn-primary action-btn pb-2 m-1\" onclick=\"activateDepartment(this,"+department.id+")\"><span class=\"material-icons md-18\">check_circle</span></button>"
// }

// function activateDepartment(btn, departmentId){
//     cell = table.rows[btn.parentNode.parentNode.rowIndex-1].cells[2];
//     cell.innerHTML = "active";
//     btn.innerHTML="<button class=\"btn btn-primary action-btn pb-2 m-1\" onclick=\"deactivateDepartment(this,"+department.id+")\"><span class=\"material-icons md-18\">cancel</span></button>"
// }

function orderBy(){
    orderby = document.getElementById("orderby").value;
    loadInitialTableData();
}

function deleteDepartment(btn, departmentID){
    let deletemsg = "Are you sure you want to delete department with ID: "+departmentID+"?";
    if(confirm(deletemsg)){
        fetch("/dashboard/departments/delete/"+departmentID,{method: "DELETE"})
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    table.deleteRow(btn.parentNode.parentNode.rowIndex-1);
                }else{
                    alert(data.message)
                }
            })    
    }
    
}

function createDepartment(){
    let name = document.getElementById("deptname").value.trim();

    if(name === ""){
        alert("Please enter department name");
        document.getElementById("deptname").focus();
    }else if(name.length >100){
        alert("Department name too long")
        document.getElementById("deptname").focus();
    }else{
        fetch("/dashboard/departments/create",{
            method: 'POST',
            body: JSON.stringify({
                name: name,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                alert("Department created successfully!")
                document.getElementById("deptname").value = "";
            }
        })
    }
}

function loadInitialTableData(){
    let url = "/dashboard/departments/all?page=0&size="+pagesize+"&orderby="+orderby;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            nextbtn.style.display = "block";
            currentpage = data.currentPage;
            maxpage = data.totalPages-1;
            loadData(data.departments);
            loadIndicators();
        });
}

function loadTableData(){
    let url = "/dashboard/departments/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            loadData(data.departments);
        });
}

function loadStatistics(){
    let url = "/dashboard/departments/statistics"
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("active_departments").innerHTML = data.active_departments;
            document.getElementById("inactive_departments").innerHTML = data.inactive_departments;
        })
}

loadStatistics();
loadInitialTableData();
