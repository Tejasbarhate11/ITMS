const inputName = document.getElementById("inputName");
const inputMobileNo = document.getElementById("inputMobileNo");


function updateBtn(btn){
  if(btn.innerHTML === 'Update'){
    btn.innerHTML = 'Save';
    inputName.disabled = false;
    inputName.focus();
    inputMobileNo.disabled = false;
  }else{
    btn.innerHTML = 'Update';
    inputName.disabled = true;
    inputMobileNo.disabled = true;
  }
}


function showTab(event, tabId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(tabId).style.display = "block";
    event.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

