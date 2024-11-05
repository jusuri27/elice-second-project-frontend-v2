<template>
  <q-header elevated style="width: 100%; left: 0px;">
        <q-toolbar>
        <q-toolbar-title>
            <a :href="ENV.URL.HOME" style="color: inherit; text-decoration-line: none;">
            Shoux Kream
            </a>
        </q-toolbar-title>
        
        </q-toolbar>
    </q-header>
</template>
<script setup>
import ENV from '../utils/PagePath.js';
</script>
