<template>
    <Navbar/>
    <div
    v-if="isLoading"
     class="row justify-content-center">
        <div class="col-3 alert-info text-center mt-5">
            Espere un momento...
            <h3 class="mt-2">
                <i class="fa fa-spin fa-sync"></i>
            </h3>
        </div>
    </div>
    <div v-else
    class="d-flex">
        <div class="col-4">
            <EntryList/>
        </div>
        <div class="col">
            <router-view/>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
export default {
    components: {
        Navbar: defineAsyncComponent(() => import('../components/Nav-bar.vue')),
        EntryList: defineAsyncComponent(() => import('../components/Entry-list.vue'))

    },
    methods:{
        ...mapActions('journal', ['loadEntries'])
    },
    //Sirve para obtener información y mostrarla en mi template
    computed:{
        ...mapState('journal', ['isLoading'])
    },
    created() {
        this.loadEntries()
    }
    
}
</script>