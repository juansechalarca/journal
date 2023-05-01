<template>
    <template v-if = "entry">
        <div 
        
        class="entry-title d-flex justify-content-between p-2">
            <input type="file" @change = "onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg">
            <div>
                <span class="text-success fs-3 fw-bold">{{dateEntry[2]}}</span>
                <span class="mx-1 fs-3">{{dateEntry[1]}}</span>
                <span class="mx-2 fs-4 fw-light">{{`${dateEntry[3]}, ${dateEntry[0]}`}}</span>
            </div>

            <div>
                <button v-if="entry.id" @click="onDeleteEntry" class="btn btn-danger mx-2">Borrar
                <i class="fa fa-trash-alt"></i>
                </button>
                <button class="btn btn-primary mx-2" @click = "onSelectImage">subir foto
                <i class="fa fa-upload"></i>
                </button>
            </div>
        </div>

        <hr>
        <div 
        class="d-flex flex-column px-3 h-75">
            <textarea v-model = "entry.text" placeholder="Que sucedio hoy?"></textarea>
        </div>
        <Fab icon="fa fa-2x fa-save" 
            @on:click="saveEntry"
        />

        <!-- <img src="https://img.redbull.com/images/c_crop,x_1624,y_0,h_2560,w_2048/c_fill,w_790,h_878/q_auto:low,f_auto/redbullcom/tv/FO-1YSE763FN5N11/fo-1yse763fn5n11-featuremedia" alt="entry-picture" class="img-thumbnail"> -->
        <img v-if="entry.picture && !localImage" :src="entry.picture">
        <img v-if="localImage" :src="localImage">
        
    </template>
   
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex';
import Swal from 'sweetalert2'
import uploadImage from '../helpers/uploadImage'
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data(){
        return {
            entry: null,
            dateEntry: [],
            localImage: null,
            file: null
        }
    },
    components: {
        Fab: defineAsyncComponent(() => import('../components/Fab.vue'))
    },
    computed: {
        ...mapGetters('journal',['getEntryById']),
    },
    methods: {
        ...mapActions('journal',['updateEntry','createEntry','deleteEntry']),
      loadEntry(){
        let entry;
        if (this.id === 'new'){
            entry = {
                text:'',
                date: new Date().toDateString()
            }
        }else{
             entry = this.getEntryById(this.id)
            if( !entry ) return this.$router.push({name: 'no-entry'})
        }
           
            this.entry = entry;
            this.dateEntry = this.entry.date.split(' ');
        },
         async saveEntry() {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const picture = await uploadImage(this.file)
            this.entry.picture = picture;
            if(this.entry.id){
                await this.updateEntry(this.entry)
            }else{
              const id =  await this.createEntry(this.entry)
              console.log('guardoooo', id)
              this.$router.push({name: 'entry', params: {id}})
            }

            this.file = null
            Swal.fire('Guardado','Entrada registrada con éxito', 'success')
        },
        async onDeleteEntry(){
            const {isConfirmed} = await Swal.fire({
                title: 'Borrar',
                text: '¿Está seguro que desea borrar la entrada?',
                showDenyButton: true,
                confirmButtonText: 'Si, estoy seguro'
            })
            if(isConfirmed){
                new Swal({
                    title: 'Espere por favor',
                    allowOutsideClick: false
                })
                Swal.showLoading()
                await this.deleteEntry(this.entry.id)
                this.$router.push({name: 'no-entry'})
                Swal.fire('Eliminado','','success')
            }
           
        },
        onSelectedImage(e){
           const file = e.target.files[0];
            if( !file ){
                this.localImage = null 
                this.file = null
                return
            } 
            this.file = file
            const fileReader = new FileReader();
            fileReader.onloadend = () => this.localImage = fileReader.result
            fileReader.readAsDataURL(file)




        },
        onSelectImage(){
            this.$refs.imageSelector.click()
        }


    },
    created() {
      this.loadEntry()
    },
    watch:{
        id(){
            this.loadEntry();
        }
    }
}
</script>

<style lang="scss" scoped>
    
    textarea {
        font-size: 20px;
        border: none;
        height: 100%;

        &:focus {
            outline: none;
        }
    }

    img {
        width: 200px;
        position: fixed;
        bottom: 150px;
        right: 20px;
        box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
        

    }
</style>