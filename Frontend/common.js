/* function login(){
    var id=document.querySelector('#id');
    var pw=document.querySelector('#pw');
  
    if(id.value==""|| pw.value==""){
        alert("로그인을 할 수 없습니다.")
    }
    else{
        location.href='index.html';
    }

}

function back(){
    history.go(-1);
}

function create_id(){
    var id=document.querySelector('#id');
    var pw=document.querySelector('#pw');
    var r_pw=document.querySelector('#r_pw');

    if(id.value==""|| pw.value==""){
        alert("로그인을 할 수 없습니다.")
    }
    else {
        if(pw.value !== r_pw.value){
            alert("비밀번호 확인 해주세요")
        }
        else{
            location.href='index.html';
        }
    }
}

function memory(){
    const userName=document.getElementById('name');
    const userMail=document.getElementById('eMail');
    const softWareStat=document.getElementsByName("section")[0].checked;
    const industSecStat=document.getElementById("section")[1].checked;
    const CAUnoticeStat=document.getElementById("section")[2].checked;

}
*/

document.getElementById('signUpButton').addEventListener('click', (event) => {
    event.preventDefault()
    const inputName = document.getElementById('name').value;
    const email= document.getElementById('eMail').value;
    const res_software=document.getElementById('cbSoft').checked.toString();
    const res_industSec=document.getElementById('cbIndust').checked.toString();
    const res_CAUnotice=document.getElementById('cbCAUnotice').checked.toString();
    const res_integEngineering=document.getElementById('cbinteger').checked.toString();
    const res_korean=document.getElementById('cbKorean').checked.toString();
    const res_mechnicalEngineering=document.getElementById('cbMechnical').checked.toString();

    console.log(inputName, email, res_CAUnotice, res_mechnicalEngineering, res_korean, res_industSec, res_software, res_integEngineering);
    // console.log(typeof(inputName))
    // console.log(typeof(res_software))
    // alert(res_software);

    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "caunotify.me/posttest", true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify({
    //     "name": inputName,
    //     "industSec": res_industSec,
    //     "software": res_software,
    //     "CAUnotice": res_CAUnotice,
    //     "integrEngineering": res_integEngineering,
    //     "korean":res_korean,
    //     "mechnicalEngineering":res_mechnicalEngineering
    // }));
})

