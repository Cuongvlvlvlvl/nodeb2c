// popup verification
var mypopup_verification = document.getElementById("mypopup_verification");
var myBtn_verification = document.getElementById("myBtn_verification");
var close_verification = document.getElementsByClassName("close_verification")[0];

myBtn_verification.onclick = function() {
  mypopup_verification.style.display = "block";
}
close_verification.onclick = function() {
  mypopup_verification.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == mypopup_verification) {
    mypopup_verification.style.display = "none";
  }
 
}

const toggle = document.getElementsByClassName("toggle"),

      input = document.getElementsByClassName("imput-conect");
  toggle[0].addEventListener("click", () =>{
  if(input[0].type === "password") {
    input[0].type = "text";
    toggle[0].classList.replace("fa-eye-slash", "fa-eye");
  }else {
    input[0].type = "password";
    toggle[0].classList.replace("fa-eye", "fa-eye-slash");
  }
  })
  toggle[1].addEventListener("click", () =>{
    if(input[1].type === "password") {
      input[1].type = "text";
      toggle[1].classList.replace("fa-eye-slash", "fa-eye");
    }else {
      input[1].type = "password";
      toggle[1].classList.replace("fa-eye", "fa-eye-slash");
    }
    })
    toggle[2].addEventListener("click", () =>{
      if(input[2].type === "password") {
        input[2].type = "text";
        toggle[2].classList.replace("fa-eye-slash", "fa-eye");
      }else {
        input[2].type = "password";
        toggle[2].classList.replace("fa-eye", "fa-eye-slash");
      }
      })


var user= document.forms['form']['user'];
var password= document.forms['form']['password'];
var email= document.forms['form']['email'];
var confirmpassword= document.forms['form']['confirm'];
var currentpassword= document.forms['form']['currentpassword'];

var error_user= document.getElementById('error_user');
var error_password= document.getElementById('error_password');
var error_email= document.getElementById('error_email');
var error_confirmpassword= document.getElementById('error_confirmpassword');
var error_currentpassword= document.getElementById('error_currentpassword');

user.addEventListener('textInput',user_veryfy);
password.addEventListener('textInput',pass_veryfy);
email.addEventListener('textInput',email_veryfy);
confirmpassword.addEventListener('textInput',confirm_veryfy);
currentpassword.addEventListener('textInput',current_veryfy);

function validator_register(){

    if(email.value.length <9){
      error_email.style.display="block";
      email.focus();
      return false;      
    }
    if(user.value.length <9){
      error_user.style.display="block";
      user.focus();
      return false;      
    }
    if(password.value.length <6){
      error_password.style.display="block";
      password.focus();
      return false; 
    }
    
    if(confirmpassword.value.length <6){
      error_confirmpassword.style.display="block";
      confirmpassword.focus();
      return false; 
    }
}
function validator_login(){

  if(user.value.length <9){
    error_user.style.display="block";
    user.focus();
    return false;      
  }
  if(password.value.length <6){
    error_password.style.display="block";
    password.focus();
    return false; 
  }
  
  if(confirmpassword.value.length <6){
    error_confirmpassword.style.display="block";
    confirmpassword.focus();
    return false; 
  }

}
function validator_change(){

  if(currentpassword.value.length <6){
    error_currentpassword.style.display="block";
    currentpassword.focus();
    return false; 
  }
  if(password.value.length <6){
    error_password.style.display="block";
    password.focus();
    return false; 
  }
  if(confirmpassword.value.length <6){
    error_confirmpassword.style.display="block";
    confirmpassword.focus();
    return false; 
  }
  
}

function user_veryfy(){
  if(user.value.length >=8){
    error_user.style.display="none";   
    return true;
  }
}

function email_veryfy(){
  if(email.value.length >=8){
    error_email.style.display="none";   
    return true;
  }
}
function current_veryfy(){
  if(currentpassword.value.length >=5){
    error_currentpassword.style.display="none";   
    return true;
  }
}
function pass_veryfy(){
  if(password.value.length >=5){
    error_password.style.display="none";   
    return true;
  }
}

function confirm_veryfy(){
  if(confirmpassword.value.length >=5){
    error_confirmpassword.style.display="none";   
    return true;
  }
}
