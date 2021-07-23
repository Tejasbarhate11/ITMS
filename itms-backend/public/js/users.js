let currentpage = 0;
let maxpage;
let pagesize = 15;
let orderby = "createdAt";

const table = document.getElementById("data");

const previousbtn = document.getElementById("previousbtn");
const nextbtn = document.getElementById("nextbtn");
const pageindicator = document.getElementById("pagesindicator");

const clearsearchbtn = document.getElementById("clearsearchbtn");
const nosearchresult = document.getElementById("nosearchresult");

//search 
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const mobInput = document.getElementById("mobInput");
const statusIn = document.getElementById("statusIn");
const deletedIn = document.getElementById("deletedIn");

let urltoload = "/dashboard/users/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;
let reqbody = {
    name: null,
    email: null,
    mobile_no: null,
    status: "all",
    deleted_at: null
};

function searchUsers(){
    clearsearchbtn.style.display = "block";
    nosearchresult.style.display = "none";
    if(nameInput.value.trim() !== ""){
        reqbody.name = nameInput.value.trim();
    }else{
        reqbody.name = null;
    }

    if(emailInput.value.trim() !== ""){
        reqbody.email = emailInput.value.trim();
    }else{
        reqbody.email = null;
    }

    if(mobInput.value.trim() !== ""){
        reqbody.mobile_no = mobInput.value.trim();
    }else{
        reqbody.mobile_no = null;
    }

    reqbody.status = statusIn.value;


    reqbody.deleted_at = deletedIn.value;

    
    loadInitialTableData();

}

function clearSearchResults(){
    clearsearchbtn.style.display = "none";
    

    nameInput.value = "";
    emailInput.value = "";
    mobInput.value = "";
    statusIn.value = "all";
    deletedIn.value = "not deleted";
    reqbody = {
        name: null,
        email: null,
        mobile_no: null,
        status: "all",
        deleted_at: null
    }
    loadInitialTableData();
}


const isNameValid = (name) => {
    const re = /^[ a-zA-Z\-\']+$/;
    return re.test(name);
};

const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const isMobileNoValid = (mobile_no) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile_no);
};


function changePageSize(){
    pagesize = document.getElementById("pagesize").value;
    loadInitialTableData();
}

function createUser(){
    fetch("/profile")
}

function orderBy(){
    orderby = document.getElementById("orderby").value;
    loadInitialTableData();
}


function loadData(users){
    nosearchresult.style.display = "none";
    clearTable();
    if(users.length>0){
        for(let index = 0; index < users.length; index++){
            let row = table.insertRow(index);
            let user = users[index];
            row.insertCell(0).innerHTML = user.id;
            row.insertCell(1).innerHTML = user.name;
            row.insertCell(2).innerHTML = user.email;
            row.insertCell(3).innerHTML = user.mobile_no;
            row.insertCell(4).innerHTML = user.status;
            row.insertCell(5).innerHTML = user.createdAt;
            let action = row.insertCell(6);
            action.style.padding = "0px";
            action.style.verticalAlign = "middle";
            let statusbtn;
            if(user.status === "active"){
                statusbtn = "<button class=\"btn btn-danger action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+user.id+")\"><span class=\"material-icons md-18\">cancel</span></button><button class=\"btn btn-info action-btn btn-sm m-1\" id=\"assignbtn"+user.id+"\" onclick=\"assignTest(this,"+user.id+",'"+user.name+"','"+user.email+"')\"><span class=\"material-icons md-18\">assignment</span></button>"
            }else{
                statusbtn = "<button class=\"btn btn-success action-btn btn-sm m-1\" onclick=\"changeStatus(this,"+user.id+")\"><span class=\"material-icons md-18\">check_circle</span></button><button class=\"btn btn-info action-btn btn-sm m-1\" id=\"assignbtn"+user.id+"\" disabled onclick=\"assignTest(this,"+user.id+",'"+user.name+"','"+user.email+"')\"><span class=\"material-icons md-18\">assignment</span></button>"
            }
            action.innerHTML = statusbtn + "<button class=\"btn btn-primary action-btn btn-sm m-1\" onclick=\"updateUser("+user.id+")\"><span class=\"material-icons md-18\">edit</span></button><button class=\"btn btn-danger m-1 action-btn btn-sm\" onclick=\"deleteUser(this,"+user.id+")\"><span class=\"material-icons md-18\">delete</span></button";
        }
    }else{
        nosearchresult.style.display = "block";
        nosearchresult.innerHTML = "No data found"
    }
}

function updateUser(userID){
    let url = "/dashboard/users/update/"+userID;
    window.location.href = url;
}

function assignTest(btn, id, name, email){
    btn.disabled = true;
    sessionStorage.setItem("examinee_id", id);
    sessionStorage.setItem("examinee_name", name);
    sessionStorage.setItem("examinee_email", email);
    window.location.href = "/dashboard/tests/assign/single";
}

function changeStatus(btn, userID){
    const url = "/dashboard/users/update/"+userID;

    let cell = table.rows[btn.parentNode.parentNode.rowIndex-1].cells[4];

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
                document.getElementById("assignbtn"+userID).disabled = true;
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
                document.getElementById("assignbtn"+userID).disabled = false;
            }
        });

        
    }else{
        alert("Please wait for some time before changing the status again.")
    }
}

function deleteUser(btn, userID){
    let deletemsg = "Are you sure you want to delete user with ID: "+userID+"?";
    if(confirm(deletemsg)){
        fetch("/dashboard/users/delete/"+userID,{method: "DELETE"})
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    table.deleteRow(btn.parentNode.parentNode.rowIndex-1);
                }
            })    
    }
    
}

function clearTable(){
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
}



function loadInitialTableData(){
    nosearchresult.style.display = "none";
    currentpage = 0;
    urltoload = "/dashboard/users/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;
    fetch(urltoload,{
        method: "POST",
        body: JSON.stringify(reqbody),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            nextbtn.style.display = "block";
            currentpage = data.currentPage;
            maxpage = data.totalPages-1;
            loadData(data.users);
            loadIndicators();
        });
}


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

function loadTableData(){
    urltoload = "/dashboard/users/all?page="+currentpage+"&size="+pagesize+"&orderby="+orderby;
    fetch(urltoload,{
        method: "POST",
        body: JSON.stringify(reqbody),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            loadData(data.users);
        });
}

function loadStatistics(){
    let url = "/dashboard/users/statistics"
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("active_users").innerHTML = data.active_examinees;
            document.getElementById("active_admins").innerHTML = data.total_admins;
            document.getElementById("inactive_users").innerHTML = data.inactive_examinees;
            document.getElementById("deleted_users").innerHTML = data.deleted_examinees;
        });
}




loadStatistics();
loadInitialTableData();