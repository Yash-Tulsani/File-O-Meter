
let dropZone=document.getElementsByClassName('dropZone')[0];
let fileInp=document.getElementById('fileInp');
let browse=document.getElementById('browse');
let progressContainer=document.getElementById('progressContainer');
let progressBar1=document.getElementById('progressBar1');
let progressBar2=document.getElementById('progressBar2');
let progressPercent=document.getElementById('progressPercent');
let copyBtn=document.getElementById('copyBtn');
let link=document.getElementById('link');
let shareContainer=document.getElementById('shareContainer')
let emailForm=document.getElementById('emailForm');
let sendEmailBtn=document.getElementById('sendEmailBtn');
let emailInp=document.getElementsByClassName('emailInp');
let emailInvalidBox=document.getElementsByClassName('emailInvalidBox');
let alert=document.getElementById('alert');
let passwordText=document.getElementById('passwordText');
let floatingText=document.getElementById('floatingText')
let inputPassword=document.getElementById('inputPassword')
let showPasswordIcon=document.getElementById('showPasswordIcon');
let eyeClosedIcon=document.getElementById('eyeClosedIcon');
let eyeOpenIcon=document.getElementById('eyeOpenIcon');
let passwordBox=document.getElementById('passwordBox');
let passwordContainer=document.getElementById('passwordContainer');
let uploadContainer1=document.getElementsByClassName('uploadContainer')[0]
let cancelPassword=document.getElementById('cancelPassword')
let addPassword=document.getElementById('addPassword')
let linkVal;



let passwordVisible=false;

const fileURL=`/upload`
const emailURL=`/send-email`
const passwordURL=`/set-password`
const MAX_ALLOWED_SIZE= 100*1024*1024;

let online=false;
window.addEventListener('load',(e)=>{
    if(!navigator.onLine){
        online=false;
        showAlertPermanent('You are offline, Please check your internet connection','danger');
    }
    else{
        online=true;
        removeAlertPermanent('Connected','success2',1500);
    }
})

window.addEventListener('online',(e)=>{
    online=true;
    removeAlertPermanent('Connected','success2',1500);
    
})

window.addEventListener('offline',(e)=>{
    online=false;
    showAlertPermanent('You are offline, Please check your internet connection','danger');
  
})

function validateEmail(email){
    let regex=/^([a-z0-9]){6,30}@([a-z]*)\.([a-z]){2,3}/
    
    return regex.test(email);
}

function validatePassword(password){
    let regex=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    return regex.test(password);
}

window.addEventListener("dragover",function(e){
    e.preventDefault();
});   
  window.addEventListener("drop",function(e){

    e.preventDefault();   
  }); 


console.log(fileInp);
dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault()
    if(!dropZone.classList.contains('dragged')){
     dropZone.classList.add('dragged');
    }
})

dropZone.addEventListener('dragleave',(e)=>{
    
    dropZone.classList.remove('dragged');
})

dropZone.addEventListener('drop',(e)=>{
    console.log(e);
    e.preventDefault();
    // console.log(e.dataTransfer.files);
    const draggedFiles=e.dataTransfer.files;
    if(draggedFiles.length){
    fileInp.files=draggedFiles
    }
    if(fileInp.files.length>1){
        showAlert('Only one file is allowed at a time!','general',4000)
        fileInp.value=''
        return;
    }
    dropZone.classList.remove('dragged');
    const file=fileInp.files[0];
    uploadFile(file);
})

browse.addEventListener('click',(e)=>{
    fileInp.click();
})

fileInp.addEventListener('change',(e)=>{
    console.log("hi",e.target.files[0]);
    console.log(fileInp.files);
    uploadFile(e.target.files[0])
    
})


passwordText.addEventListener('click',(e)=>{
    dropZone.style.opacity='0.5'
    emailForm.style.opacity='0.5'
    shareContainer.style.opacity='0.5'
    
    passwordBox.style.display='flex';
})

cancelPassword.addEventListener('click',(e)=>{
    dropZone.style.opacity='1'
    emailForm.style.opacity='1'
    shareContainer.style.opacity='1'
    
    passwordBox.style.display='none';
})

addPassword.addEventListener('click',(e)=>{

    if(!validatePassword(inputPassword.value)){
        showAlert('Password should be between 8-10 characters long, should contain 1 letter, 1 digit adn 1 special character','danger',1500)
        return;
    }
    else{
        const uuid=link.value.split('/')[4];
        let formData={
            uuid: uuid,
            password: inputPassword.value
        }
        addPassword.classList.add('disabled');
        cancelPassword.classList.add('disabled');
        fetch(passwordURL,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            } ,
            body: JSON.stringify(formData)
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            if(data.success){
                showAlert('Password has been set successfully','success',1500);
                cancelPassword.click();
                return;
            }
            else{
                showAlert('Some error occured. Please try again! ','danger',2000);
                return;
            }
        }).catch((err)=>{
            showAlert('Some error occured. Please try again! ','danger',2000);
            return;
        }).finally(()=>{
            addPassword.classList.remove('disabled');
            cancelPassword.classList.remove('disabled');
        })
        
    }
})


inputPassword.addEventListener('focus',(e)=>{
    floatingText.classList.add('floatingTextOnFocus')
})

inputPassword.addEventListener('blur',(e)=>{
    if(inputPassword.value.length==0){
    floatingText.classList.remove('floatingTextOnFocus')
    }
})

showPasswordIcon.addEventListener('click',(e)=>{
    if(!passwordVisible){
        inputPassword.type='text';
        eyeClosedIcon.style.display='none';
        eyeOpenIcon.style.display='block';
        passwordVisible=true;
    }
    else{
        inputPassword.type='password';
        eyeClosedIcon.style.display='block';
        eyeOpenIcon.style.display='none';
        passwordVisible=false; 
    }
})

copyBtn.addEventListener('click',(e)=>{
    let copiedBox1=document.querySelector('#copiedBox1');
    let copiedBox2=document.querySelector('#copiedBox2');
    console.log(copiedBox1);
    console.log(copiedBox2);
    link.select();
    link.setSelectionRange(0,99999); 

    navigator.clipboard.writeText(link.value).then(()=>{
        copiedBox1.style.opacity='1';
        copiedBox2.style.opacity='1';
        
        setTimeout(()=>{
        copiedBox1.style.opacity='0';
        copiedBox2.style.opacity='0';
        window.getSelection().removeAllRanges();
        },1500)
    })
})



// to validate email after the email input box loses focus
Array.from(emailInp).forEach((e,idx)=>{
    e.addEventListener('blur',(eventObj)=>{
       let email=e.value;
       if(!(validateEmail(email))){
       eventObj.target.classList.add('wrongInp')
       emailInvalidBox[idx].style.display='flex';
       sendEmailBtn.classList.add('disabled')
       }
       else{
        eventObj.target.classList.remove('wrongInp')
        emailInvalidBox[idx].style.display='none'
        sendEmailBtn.classList.remove('disabled')
       }
    })
})


sendEmailBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const uuid=link.value.split('/')[4];
   
    const senderEmail=emailForm.elements['senderEmail'].value;
    const receiverEmail=emailForm.elements['receiverEmail'].value;
    const formData={
        "uuid": uuid,
        "senderEmail": senderEmail,
        "receiverEmail": receiverEmail
    }
    console.log(formData)

    if(senderEmail!='' && receiverEmail!=''){
    sendEmailBtn.classList.add('disabled');
    fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showAlert('Email sent successfully!','success',1500)
        // hide the box
        shareContainer.style.display = "none"; 
        
      }
      if(data.alreadySent){
        showAlert('Email already sent!','general',1500)
      }
    }).catch((err)=>{
        showAlert('Some error occured. Please try again','danger',2000);
    }).finally(()=>{
        sendEmailBtn.classList.remove('disabled');
    });
    // sendEmailBtn.setAttribute('disabled','true')
}

    else{
        showAlert('Enter email before sending','danger',1500)
    }

})


function uploadFile(file){
    console.log(file);
    if(file.size> MAX_ALLOWED_SIZE){
        showAlert('Max allowed size is 100MB','danger',2000);
        fileInp.value=''
        return;
    }
    progressContainer.style.display="block";
    
    try{
    const formData=new FormData();
    formData.append('myFile',file);
    const xhr=new XMLHttpRequest();

    xhr.onreadystatechange=()=>{
        if(xhr.readyState==XMLHttpRequest.DONE){
            console.log(`file posted to ${fileURL}`);
            progressContainer.style.display='none';
            progressBar1.style.width=`0%`;
            progressBar2.style.width="0%";
            shareContainer.style.display='flex';
            passwordContainer.style.display='flex';
            let res=xhr.responseText;
             linkVal=JSON.parse(res).fileLink
            link.value=linkVal;
            fileInp.value=''
        }
    }

    xhr.upload.onprogress=updateProgress;

    xhr.open('POST',fileURL);
    xhr.send(formData);
}
 catch(error){
    console.log(error);
    showAlert(error,'danger',2000)
 }
 
}

function updateProgress(e){
    console.log(e);
    let totalData=e.total;
    let loadedData=e.loaded;

    let percent=Math.round((loadedData/totalData))*100;
    progressPercent.innerHTML=`${percent}%`;
    progressBar1.style.width=`${percent}%`;
    progressBar2.style.width=(percent*85)/100+"%";
}

function showAlert(msg,color,time){
    alert.innerText=msg;
    alert.style.transform='translateY(0vh)'
    alert.style.backgroundColor=`var(--alert-${color})`
    setTimeout((e)=>{
        console.log(e)
        alert.style.transform='translateY(-25vh)'
    },parseInt(time))
}

function showAlertPermanent(msg,color){
    alert.innerText=msg;
    alert.style.transform='translateY(0vh)'
    alert.style.backgroundColor=`var(--alert-${color})`
    
}

function removeAlertPermanent(msg,color,time){
    alert.innerText=msg;
    alert.style.transform='translateY(0vh)'
    alert.style.backgroundColor=`var(--alert-${color})`
    setTimeout((e)=>{
        console.log(e)
        alert.style.transform='translateY(-25vh)'
    },parseInt(time))
}