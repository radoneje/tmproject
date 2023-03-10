let app = new Vue({
    el: "#app",
    data: {
        section: 0,
        general: {mainImgUrl: null},
        videos: [],
        sections: [],
        services: {},
        commands: [],
        geografy: {},
        mainImages:[],
        projects:[],
        logins:[],
    },
    methods: {
        toggleMainImage:async function(item,sect){
            item[sect]=item[sect]?false:true;
            await this.saveMainImage(item)
            if(sect=="isDeleted")
                this.mainImages=this.mainImages.filter(i=>i.id!=item.id)
        },
        toggleLogin:async function(item,sect){
            item[sect]=item[sect]?false:true;
            await this.saveLogin(item)
            if(sect=="isDeleted")
                this.logins=this.logins.filter(i=>i.id!=item.id)
        },
        toggleProjectImage:async function(item,sect){
            item[sect]=item[sect]?false:true;
            await this.saveProject(item)
            if(sect=="isDeleted")
                this.projects=this.projects.filter(i=>i.id!=item.id)
        },
        saveMainImage:async function(item){
            await axios.post("/admin/mainImage", item)
        },
        saveLogin:async function(item){
            await axios.post("/admin/logins", item)
        },
        toggleRecord:async function (section, item, record, prm) {
            record[prm] = !record[prm];

            await this.saveService(section, item)
            if (prm == "isDeleted")
                item.items = item.items.filter(f => !f.isDeleted)
            this.$forceUpdate();
        },
        addGeoItem: async function (section, item) {
            item.items.unshift({
                id:(new Date()).toString(),
                title:"",
                isActive:false,
                isDeleted:false
            })
            this.$forceUpdate();
            await this.saveService(section, item)
        },
        toggleGeografy: async function (section, item, prm) {
            item[prm] = !item[prm];

            await this.saveService(section, item)
            if (prm == "isDeleted")
                this.geografy[section] = this.geografy[section].filter(f => !f.isDeleted)
            this.$forceUpdate();
        },
        toggleService: async function (section, item, prm) {
            item[prm] = !item[prm];
            await this.saveService(section, item)
            if (prm == "isDeleted")
                this.services[section] = this.services[section].filter(f => !f.isDeleted)
            this.$forceUpdate();
        },
        saveService: async function (section, item) {
            await axios.post("/admin/saveService", {section, item});
        },
        addGeografy: async function (section) {
            let r = await axios.post("/admin/addService", {section});
            if (!this.geografy[section])
                this.geografy[section] = [];
            this.geografy[section].unshift(r);
            this.$forceUpdate();
        },
        addService: async function (section) {

            let r = await axios.post("/admin/addService", {section});
            if (!this.services[section])
                this.services[section] = [];
            this.services[section].unshift(r);
            this.$forceUpdate();
        },
        addImageVideo: async function (item) {
            await this.uploadFile(async (r) => {
                item.imageLink = r;
                await this.saveVideo(item);
            })
        },
        projectAddImage:async function (item) {
            let image={ id:Math.floor((new Date()).getTime() / 1000), isActive:false, isDeleted:false, url:null}
            item.images.push(image);
            await this.saveProject(item);
            setTimeout(async ()=>{
                await this.uploadProjectImage(image, item)
            },0)
           /* await this.uploadFile(async (r) => {
                item.images.push({imageLink : r, id:Math.floor((new Date()).getTime() / 1000)});
                await this.saveProject(item)
            }, "image/png, image/jpeg")*/
        },
        uploadProjectImage:async function (image, item) {
            await this.uploadFile(async (r) => {
                image.url=r;
                await this.saveProject(item)
            },"image/png, image/jpeg")

        },
        deleteProjectImage:async function (image, item) {
            if(!confirm("???? ???????????????"))
                return;
            item.images.forEach(i=>{
                if(i.id==image.id)
                    i.isDeleted=true;
            })
            await this.saveProject(item)

        },


        deleteVideo: async function (item) {
            if (!confirm("???? ???????????????"))
                return
            item.isDeleted = new Date().toISOString();
            await this.saveVideo(item);
            this.videos = this.videos.filter(v => v.id != item.id);
        },
        changeVideoActive: async function (item) {
            item.isActive = !item.isActive;
            await this.saveVideo(item)
        },
        saveVideo: async function (item) {
            await axios.post("/admin/video", item)
        },
        saveProject: async function (item) {
            await axios.post("/admin/project", item)
        },
        videoAdd: async function () {
            let r = await axios.post("/admin/videoAdd")
            this.videos.unshift(r.data)
        },
        projectAdd: async function (item) {
            let r = await axios.post("/admin/projectsAdd")
            this.projects.unshift(r.data)
        },
        mainImageAdd: async function () {
            let r = await axios.post("/admin/mainImageAdd")
            this.mainImages.unshift(r.data)
        },
        loginAdd: async function () {
            let r = await axios.post("/admin/loginAdd")
            this.logins.unshift(r.data)
        },
        saveGeneral: async function () {
            await axios.post("/admin/general", this.general)
        },
        uploadPreza: async function () {

            await this.uploadFile(async (r) => {
                this.general.preza = r;
                await this.saveGeneral()
                this.$forceUpdate();
            })
        },
        uploadClientsLogo: async function () {

            await this.uploadFile(async (r) => {
                this.general.clientsLogoUrl = r;
                await this.saveGeneral()
                this.$forceUpdate();
            })
        },
        uploadOg_image: async function (item) {
            await this.uploadFile(async (r) => {
                this.general.og_image = r;
                await this.saveGeneral()
                this.$forceUpdate();
            }, "image/png, image/jpeg")


        },
        uploadMainImage: async function (item) {

            await this.uploadFile(async (r) => {
                item.url = r;
                await this.saveMainImage(item)
                this.$forceUpdate();
            }, "image/png, image/jpeg")
        },
        uploadFile: async function (callBack, accept) {
            let input = document.createElement("input")

            input.type = "file";
            if(accept)
                input.accept=accept
            input.onchange = async (e) => {
                let fd = new FormData();
                console.log("card", input.files[0]);
                fd.append("card", input.files[0])
                fd.append("ddd", "dd")
                console.log("fd");
                try {
                    let r = await axios.post("/admin/uploadFile", fd, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    });

                    callBack(r.data)
                } catch (e) {

                    console.warn(e)
                    alert("???????????? HTTP ");
                }
            }
            input.style.display = "none"
            input.click();
            document.body.appendChild(input)
        }
    },
    watch: {
        section: async function () {
            if (this.section == 0) {
                this.general = (await axios.get("/admin/general")).data;
            }
            if (this.section == 1) {
                this.videos = (await axios.get("/admin/videos")).data;
            }
            if (this.section == 2) {
                for (sect of this.sections) {
                    this.services[sect.id] = (await axios.get("/admin/service/" + sect.id)).data;
                }
                this.$forceUpdate();

            }
            if (this.section == 3) {
                for (sect of this.commands) {
                    this.geografy[sect.id] = (await axios.get("/admin/service/" + sect.id)).data;
                }
                this.$forceUpdate();
            }
            if (this.section == 4) {
                this.general = (await axios.get("/admin/general")).data;
            }
            if (this.section == 5) {
                this.projects = (await axios.get("/admin/projects")).data;
            }
            if (this.section == 6) {
                this.mainImages = (await axios.get("/admin/mainImages")).data;
            }
            if (this.section == 7) {
                this.logins = (await axios.get("/admin/logins")).data;
            }
        }
    },
    mounted: async function () {
        console.log("worked!")
        this.sections = (await axios.get("/sections")).data;
        this.commands = (await axios.get("/commands")).data;

        this.general = (await axios.get("/admin/general")).data;
        console.log(this.general)
    }
})
