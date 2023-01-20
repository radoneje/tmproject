const showVideo=async(_id)=>{
    let response=await fetch("/video/"+_id);
    if(response.ok){
        let elem =document.createElement("div")
        elem.classList.add("fullScreenWr");
        elem.innerHTML=await response.text();
        document.body.style.overflow="hidden";

    }
}
