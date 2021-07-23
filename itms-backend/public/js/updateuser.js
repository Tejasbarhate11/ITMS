
const userID = document.getElementById("idInput").value;
const initial_name = document.getElementById("nameInput").value;
const email = document.getElementById("emailInput").value;
const initial_mobile_no = document.getElementById("mobileNoInput").value;

const isMobileNoValid = (mobile_no) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile_no);
};

const isNameValid = (name) => {
    const re = /^[ a-zA-Z\-\']+$/;
    return re.test(name);
};


function updateData(){
    const name = document.getElementById("nameInput").value;
    const user_email = document.getElementById("emailInput").value;
    const mobile_no = document.getElementById("mobileNoInput").value;

    if(!email === user_email){
        alert("The user email has been changed");
        
    }else if(name === initial_name && mobile_no === initial_mobile_no){
        alert("User data is not updated");
        
    }else if(name.trim() === ""){
        alert("User name should not be empty");
        
    }else if(!isNameValid(name)){  
        alert("User name is not valid");
        
    }else if(mobile_no.trim() === ""){
        alert("User name should not be empty");
        
    }else if(!isMobileNoValid(mobile_no)){
        alert("User mobile no. is not valid");
        
    }else{
        let url = "/dashboard/users/update/"+userID;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                name: name.trim(),
                mobile_no: mobile_no.trim()
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
        .then(data => {
            if(data.success){
                alert("User was updated successfilly")
            }else{
                alert("Some error occurred" || data.message)
            }
        })
    }
}