<template>
    <q-input
        filled
        v-model="data.value"
        :label="data.label"
        :disable="data.isDisable"
    />
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  item: Object
});

const data = ref(props.item);
</script>