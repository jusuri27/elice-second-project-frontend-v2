<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-3">
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <q-img 
            style="min-width: 200px; max-width: 540px; max-height: 360px;"
            :style="{ backgroundColor: selectedRow?.themeClass || '#f4f4f4' }"
            :src="selectedRow?.imageUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'"
             />
            <div class="text-overline text-orange-9">Overline</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
            <div class="text-caption text-grey">
              <q-item-label caption lines="2">{{ selectedRow?.title || 'Secondary line text.' }}</q-item-label>
            </div>
          </q-card-section>

          <q-card-actions>
            <q-space />

            <q-btn
              color="grey"
              round
              flat
              dense
              :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expanded = !expanded"
            />
          </q-card-actions>

          <q-slide-transition>
            <div v-show="expanded">
              <q-separator />
              <q-card-section class="text-subtitle2">
                <q-item-label caption lines="2">{{ selectedRow?.description || 'Secondary line text.' }}</q-item-label>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
      <div class="col-9">
        <q-table
          flat bordered
          title="카테고리 관리"
          :rows="rows"
          :columns="columns.filter(col => col.visible !== false)"
          row-key="id"
          :selected-rows-label="getSelectedString"
          selection="single"
          v-model:selected="selected"
          @row-click="onRowClick"
          @row-dblclick="onDbRowClick"
          :pagination="initialPagination"
        >
          <template v-slot:top-right>
            <div class="q-pa-md q-gutter-sm">
              <q-btn color="secondary" @click="clickExcelDownload()" label="엑셀" />
              <q-btn color="primary" @click="clickCreateCategory()" label="추가" />
              <q-btn color="red" @click="clickDeleteCategory()" label="삭제" />
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategoryAPI, deleteCategoryAPI, categoryExcelDownloadAPI } from '../api/index.js';
import ENV from '../utils/PagePath.js';

const selected = ref([]); // 체크박스
const rows = ref([]); // rows를 ref로 변경하여 반응형 데이터로 만듭니다.
const initialPagination = {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
};
const columns = [
  {
    name: 'id',
    required: false,
    label: 'categoryId',
    align: 'left',
    field: row => row.id,
    visible: false
  },
  { name: 'title', align: 'left', label: '카테고리 제목', field: 'title', sortable: true },
  { name: 'description', align: 'left', label: '카테고리 설명', field: 'description', sortable: true },
  { name: 'imageUrl', align: 'left', label: '이미지', field: 'imageUrl', sortable: true },
  { name: 'themeClass', align: 'left', label: '테마', field: 'themeClass', sortable: true },
];

// 미리보기 관련 변수
const expanded = ref(false) // 토글 
const selectedRow = ref(null) // 초기에는 null로 설정

const clickCreateCategory = () => {
  const createUrl = ENV.URL.CREATE_CATEGORY;
  window.open(createUrl, 'popupWindow', 'width=1000,height=1200');
};

const onRowClick = (evt, row) => {
  selectedRow.value = row // 선택된 행 데이터를 selectedRow에 저장
}

const onDbRowClick = (evt, row) => {
  const updateUrl = `${ENV.URL.UPDATE_CATEGORY}${row.id}`
  window.open(updateUrl, 'popupWindow', 'width=1000,height=1200');
};


// 조회 api
const getCategoryList = async () => {
  const { response, error } = await getCategoryAPI();
  if (error) {
    console.log('에러 발생');
    return;
  }
  console.log('response.data : ', response.data);
  rows.value = response.data;
  if (rows.value.length > 0) {
    selectedRow.value = rows.value[0] // 첫 번째 행 데이터를 선택
  }
};

// 삭제 api
const clickDeleteCategory = async () => {
  const categoryId = selected.value.map(obj => obj.id);

  const { response, error } = await deleteCategoryAPI(categoryId);
  if (error) {
    console.log('에러 발생');
    return;
  }
  selected.value = [];
  getCategoryList();
};

// 엑셀 저장
const clickExcelDownload = async () => {
  const params = rows.value;

  const { response, error } = await categoryExcelDownloadAPI(params);
  if (error) {
    console.log('에러 발생');
    return;
  }

  // Blob을 사용하여 파일 다운로드
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'shoux-kream.xlsx'); // 다운로드할 파일 이름
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // 링크 요소 제거
  
  getCategoryList();
};

onMounted(() => {
  getCategoryList();
});
</script>
