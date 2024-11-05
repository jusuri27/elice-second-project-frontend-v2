<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 750px">
        <q-card-section>
          <div class="text-h6">{{modalData}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-for="item in formList" :key="item">
          <CustomInput v-if="item.type == 'input'" :item="item"></CustomInput>
          <CustomSelect v-if="item.type == 'select'" :item ="item"></CustomSelect>
          <CustomFile v-if="item.type == 'file'" :item ="item"></CustomFile>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="$emit('closeModal')" v-close-popup />
          <q-btn flat label="Save" @click="$emit('saveModal')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import CustomInput from 'src/components/form/CustomInput.vue'
import CustomSelect from 'src/components/form/CustomSelect.vue'
import CustomFile from 'src/components/form/CustomFile.vue'

const props = defineProps({
  formData: Object,
  modalTitle: String
});

const emit = defineEmits([
  'closeModal',
  'saveModal'
]);

const prompt = ref(true);
const formList = ref([]);
const modalData = ref('');

formList.value = props.formData;
modalData.value = props.modalTitle;
</script>
