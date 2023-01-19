let app=new Vue({
    el:"#app",
    data:{
        section:0,
        general:{}
    },
    methods:{
        saveGeneral:async function(){
            await axios.post("/admin/general",this.general )
        },
        uploadMainImage:async function(callBack){
            await uploadFile(()=>{alert(123)})
        },
        uploadFile:async function(callBack){
           let input=document.createElement("input")

            input.type="file";
           input.onchange=async  (e)=>{
               let fd = new FormData();
               console.log("card", input.files[0]);
               fd.append("card", input.files[0])
               fd.append("ddd", "dd")
               console.log("fd");
               try {
                   let r=await axios.post("/admin/uploadFile", fd, {headers: {
                           "Content-Type": "multipart/form-data",
                       }});
                   console.log("change", r);
                   callBack(r.data)
               }
               catch (e){
                   console.log(callBack)
                   console.warn(e)
                   alert("Ошибка HTTP ");
               }
              /* const response = await fetch('/admin/uploadFile', {
                   method: 'POST',
                   body: fd
               })
               if (response.ok) { // если HTTP-статус в диапазоне 200-299
                                  // получаем тело ответа (см. про этот метод ниже)
                   let json = await response.json();
                   console.log(json)
               } else {

               }*/
           }
           input.style.display="none"
           input.click();
           document.body.appendChild(input)
        }
    },
    watch:{
        section:async function(){
            if(section==0){
                this.general=(await axios.get("/admin/general")).data;
            }
        }
    },
    mounted:async function(){
        console.log("worked!")
        this.general=(await axios.get("/admin/general")).data;
        console.log(this.general)
    }
})
