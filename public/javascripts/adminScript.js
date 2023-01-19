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
        uploadFile:async function(){
           let input=document.createElement("input")
            input.type="file";
           input.onchange=async  (e)=>{
               let fd=new FormData();
               fd.append("file", e.file)
               alert("change", e)
           }
           input.click();
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
