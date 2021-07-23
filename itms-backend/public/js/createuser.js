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


function validateData() {
    let name = document.forms["user"]["name"].value;
    let email = document.forms["user"]["email"].value;
    let mobile_no = document.forms["user"]["mobile_no"].value;
    if(name.trim() === ''){
        alert("Please enter user name");
        return false;
    }else if(!isNameValid(name.trim())){
        alert("Invalid name");
        return false;
    }else if(email.trim() === ''){
        alert("Please enter user email id");
        return false;
    }else if(!isEmailValid(email.trim())){
        alert("Invalid email id");
        return false;
    }else if(mobile_no.trim() === ''){
        alert("Please enter user mobile no.");
        return false;
    }else if(!isMobileNoValid(mobile_no.trim())){
        alert("Invalid mobile no.");
        return false;
    }

    return true;
}