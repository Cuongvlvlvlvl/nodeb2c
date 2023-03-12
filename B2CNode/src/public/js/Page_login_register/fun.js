

function validator_login(){

  if(username.value.length <9){
    error_user.style.display="block";
    username.focus();
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
  if(username.value.length >=8){
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