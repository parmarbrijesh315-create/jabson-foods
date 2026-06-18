async function login(){

const response = await fetch(
"https://jabson-foods.onrender.com/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:document.getElementById("email").value,
password:document.getElementById("password").value
})
}
);

const data = await response.json();

if(data.success){

localStorage.setItem("userLoggedIn","true");
localStorage.setItem("userEmail",data.user.email);
localStorage.setItem("userName",data.user.name);

alert("Login Successful");

window.location.href="index.html";

}else{

alert("Invalid Email or Password");

}

}

function logout(){

localStorage.removeItem("userLoggedIn");
localStorage.removeItem("userName");
localStorage.removeItem("userEmail");

window.location.href = "login.html";

}