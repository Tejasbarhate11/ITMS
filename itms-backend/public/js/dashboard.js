
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

function testfn(){
  fetch('/profile/test')
    .then(response => {
      if (!response.ok) {
          throw new Error("Could not reach website.");
      }
      return response.json();
    })
    .then(json => console.log(json))
    .catch(err => console.error(err));
}