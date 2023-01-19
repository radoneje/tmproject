let app=new Vue({
    el:"#app",
    data:{
        section:0,
        general:{}
    },
    methods:{
        saveGeneral:async function(){
            await axios.post("/admin/general",this.general )
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
