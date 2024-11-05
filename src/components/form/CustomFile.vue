<template>
    <q-file 
        filled
        v-model="data.value"
        :label="data.label"
        :disable="data.isDisable"
    >
        <template v-slot:prepend>
            <q-icon name="attach_file" />
        </template>
    </q-file>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  item: Object
});

const data = ref(props.item);

const model = ref(null);
</script>