const showVideo=async(_id)=>{
    let response=await fetch("/video/"+_id);
    if(response.ok){
        let elem =document.createElement("div")
        elem.classList.add("fullScreenWr");
        elem.classList.add("flex");
        elem.classList.add("center");
        elem.innerHTML=await response.text();
        document.body.style.overflow="hidden";
        document.body.appendChild(elem)
        let btn=document.querySelector(".close")
        btn.addEventListener("click",()=>{
            document.body.removeChild(elem);
            document.body.style.overflow=null;
        })
    }
}
document.addEventListener( 'DOMContentLoaded', function() {
    var splide = new Splide( '.splide' );
    splide.mount();
} );

document.querySelectorAll(".menu a.menu-item").forEach(el=>{
    el.onclick=(e)=>{
        e.stopPropagation();
        e.preventDefault();
        el.scrollIntoView({
            behavior: 'smooth'
        });
        //console.log(e)
        return false;
    }
})
