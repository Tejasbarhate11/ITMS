const togglePassword = document.querySelector('#toggleCurrPassword');
const password = document.querySelector('#inputCurrPass');

togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});

const toggleNewPassword = document.querySelector('#toggleNewPassword');
const inputNewPass = document.querySelector('#inputNewPass');

toggleNewPassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = inputNewPass.getAttribute('type') === 'password' ? 'text' : 'password';
    inputNewPass.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});

const toggleCNewPassword = document.querySelector('#toggleCNewPassword');
const inputCNewPass = document.querySelector('#inputCNewPass');

toggleCNewPassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = inputCNewPass.getAttribute('type') === 'password' ? 'text' : 'password';
    inputCNewPass.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});

const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


const form = document.getElementById("resetPassForm");
const error = document.getElementById("error");
const oldPassword = document.getElementById("inputCurrPass");
const newPassword = document.getElementById("inputNewPass");
const cNewPassword = document.getElementById("inputCNewPass");

form.addEventListener('submit', function (e) {
    error.style.display = "none";
    e.preventDefault();
    if(newPassword.value !== cNewPassword.value){
        error.style.display = "block";
        error.innerHTML = "The password in both the fields does not match";
        cNewPassword.value='';
        newPassword.focus();
    }else{
        form.submit();
    }
}); 


