
let passwordInp=document.getElementById("passwordInp");
let floatingText=document.getElementById('floatingText');
let showPasswordIcon=document.getElementById("showPasswordIcon");
let eyeClosedIcon=document.getElementById("eyeClosedIcon");
let eyeOpenIcon=document.getElementById("eyeOpenIcon")
let enterPassword=document.getElementById("enterPassword")
let filePasswordForm=document.getElementById('filePasswordForm');
let alert=document.getElementById('alert');
console.log(filePasswordForm)
filePasswordForm.action=location.href

console.log(passwordInp);

passwordInp.addEventListener('blur',(e)=>{
    console.log(e.target)
    if(e.target.value.length==0){
        floatingText.classList.remove('floatingTextOnFocus');
    }
})

passwordInp.addEventListener('focus',(e)=>{
    console.log('focussed');
    floatingText.classList.add('floatingTextOnFocus');
})

showPasswordIcon.addEventListener('click',(e)=>{
    if(eyeOpenIcon.style.display=='none'){
        console.log("checking")
        eyeClosedIcon.style.display='none';
        eyeOpenIcon.style.display='block';
        passwordInp.type="text";
    }
    else{
        eyeClosedIcon.style.display='block';
        eyeOpenIcon.style.display='none';
        passwordInp.type="password";
    }
})



enterPassword.addEventListener("click",(e)=>{
    const userPassword=passwordInp.value;
   const url=location.href;
   const reqObj={
    password: userPassword
   }
   fetch(url,{
    method: "POST",
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify(reqObj)
   }).then((res)=>{
    return res.json();
   }).then((data)=>{
    if(!data.success){
        const msg="Wrong password entered. Please try again!";
        console.log(msg)
        showAlert(msg,"danger",1500);
    }
    return;
   })
})

function showAlert(msg,color,time){
    alert.innerText=msg;
    alert.style.transform='translateY(0vh)'
    alert.style.backgroundColor=`var(--alert-${color})`
    setTimeout((e)=>{
        console.log(e)
        alert.style.transform='translateY(-25vh)'
    },parseInt(time))
}