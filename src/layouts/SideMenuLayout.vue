<template>
  <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      style="margin-top: 50px;"
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Menus
        </q-item-label>
        <q-item
            clickable
            v-for="menu in menuData"
            :key="menu.title"
            v-bind="menu"
            @click="$emit('changeMainView', menu)"
        >
            <q-item-section
            v-if="menu.icon"
            avatar
            >
            <q-icon :name="menu.icon" />
            </q-item-section>

            <q-item-section>
            <q-item-label>{{ menu.title }}</q-item-label>
            </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  menuList: Object
});

const emit = defineEmits([
  'changeMainView'
]);

const leftDrawerOpen = ref(false);
const menuData = ref([]);

menuData.value = props.menuList;
</script>
