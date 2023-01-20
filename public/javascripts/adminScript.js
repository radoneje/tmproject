let app=new Vue({
    el:"#app",
    data:{
        section:0,
        general:{mainImgUrl:null},
        videos:[],
        services:[]
    },
    methods:{
        addService:async function(section){
            await axios.post("/admin/addService", section);
        },
        addImageVideo:async function(item){
            await this.uploadFile(async (r)=>{
                item.imageLink=r;
                await this.saveVideo(item);
            })
        },
        deleteVideo:async function(item){
            if(!confirm("Вы уверены?"))
                return
            item.isDeleted= new Date().toISOString();
            await this.saveVideo(item);
            this.videos=this.videos.filter(v=>v.id!=item.id);
        },
        changeVideoActive:async function(item){
            item.isActive=!item.isActive;
            await this.saveVideo(item)
        },
        saveVideo:async function(item){
            await axios.post("/admin/video", item)
        },
        videoAdd:async function(){
            let r=await axios.post("/admin/videoAdd")
            this.videos.unshift(r.data)
        },
        saveGeneral:async function(){
            await axios.post("/admin/general",this.general )
        },
        uploadPreza:async function(){

            await this.uploadFile(async (r)=>{
                this.general.preza=r;
                await this.saveGeneral()
            })
        },
        uploadMainImage:async function(){

            await this.uploadFile(async (r)=>{
                this.general.mainImgUrl=r;
                await this.saveGeneral()
            })
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

                   callBack(r.data)
               }
               catch (e){

                   console.warn(e)
                   alert("Ошибка HTTP ");
               }
           }
           input.style.display="none"
           input.click();
           document.body.appendChild(input)
        }
    },
    watch:{
        section:async function(){
            if(this.section==0){
                this.general=(await axios.get("/admin/general")).data;
            }
            if(this.section==1){
                this.videos=(await axios.get("/admin/videos")).data;
            }
        }
    },
    mounted:async function(){
        console.log("worked!")
        this.general=(await axios.get("/admin/general")).data;
        console.log(this.general)
    }
})
