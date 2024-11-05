<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-3">
        <q-card class="my-card" flat bordered>
          <q-img style="max-width: 540px; max-height: 360px; background: #f4f4f4;" :src="selectedRow?.imageKey || 'https://cdn.quasar.dev/img/parallax2.jpg'" />

            <q-list style="margin-top: 20px">
              <q-item>
                <q-item-section>
                  <q-item-label>상품명</q-item-label>
                  <q-item-label caption lines="2">{{ selectedRow?.title || 'Secondary line text.' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />

              <q-item>
                <q-item-section>
                  <q-item-label>제조사</q-item-label>
                  <q-item-label caption>{{ selectedRow?.manufacturer || 'Secondary line text.' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />

              <q-item>
                <q-item-section>
                  <q-item-label>요약 설명</q-item-label>
                  <q-item-label caption>{{ selectedRow?.shortDescription || 'Secondary line text.' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />

              <q-item>
                <q-item-section>
                  <q-item-label>상세 설명</q-item-label>
                  <q-item-label caption>{{ selectedRow?.detailDescription || 'Secondary line text.' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />

              <q-item>
                <q-item-section>
                  <q-item-label>재고</q-item-label>
                  <q-item-label caption>{{ selectedRow?.inventory || 'Secondary line text.' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />

              <q-item>
                <q-item-section>
                  <q-item-label>가격</q-item-label>
                  <q-item-label caption>{{ selectedRow?.price || 'Secondary line text.' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />

              <q-item>
                <q-item-section>
                  <q-item-label>키워드</q-item-label>
                  <q-item-label caption>{{ selectedRow?.keyWords || '' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
        </q-card>
      </div>
      <div class="col-9">
        <q-table
          flat bordered
          title="상품 관리"
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
              <q-btn color="primary" @click="clickCreateItem()" label="추가" />
              <q-btn color="red" @click="clickDeleteItem()" label="삭제" />
            </div>
          </template>
        </q-table>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getItemAPI, deleteItemAPI, itemExcelDownloadAPI } from '../api/index.js';
import ENV from '../utils/PagePath.js';

// 테이블 화면 관련 변수
const selected = ref([]); // 체크박스
const rows = ref([]); // rows를 ref로 변경하여 반응형 데이터로 만듭니다.
const initialPagination = {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
      }
const columns = [
  {
    name: 'id',
    required: false,
    label: 'itemId',
    align: 'left',
    field: row => row.id,
    visible: false
  },
  { name: 'title', align: 'left', label: '상품명', field: 'title', sortable: true },
  { name: 'manufacturer', align: 'left', label: '제조사', field: 'manufacturer', sortable: true },
  { name: 'shortDescription', align: 'left', label: '요약 설명', field: 'shortDescription', sortable: true },
  { name: 'detailDescription', align: 'left', label: '상세 설명', field: 'detailDescription', sortable: true },
  { name: 'imageKey', align: 'left', label: '사진 경로', field: 'imageKey', sortable: true },
  { name: 'inventory', align: 'left', label: '재고', field: 'inventory', sortable: true  },
  { name: 'price', align: 'left', label: '가격', field: 'price', sortable: true  },
  { name: 'keyWords', align: 'left', label: '키워드', field: 'keyWords', sortable: true  }
];

// 선택된 행 데이터
const selectedRow = ref(null) // 초기에는 null로 설정

const onRowClick = (evt, row) => {
  selectedRow.value = row // 선택된 행 데이터를 selectedRow에 저장
}

const clickCreateItem = () => {
  const createUrl = ENV.URL.CREATE_ITEM;
  window.open(createUrl, 'popupWindow', 'width=1000,height=1200');
};

const onDbRowClick = (evt, row) => {
  const updateUrl = `${ENV.URL.UPDATE_ITEM}${row.id}`
  window.open(updateUrl, 'popupWindow', 'width=1000,height=1200');
};


// 조회 api
const getItemList = async () => {
  const { response, error } = await getItemAPI();
  if (error) {
    console.log('에러 발생');
    return;
  }
  // API로부터 받은 데이터를 rows에 반영
  rows.value = response.data.map(item => ({
      ...item,
      keyWords: item.keyWords ? item.keyWords.join(', ') : ''
  }));
  if (rows.value.length > 0) {
    selectedRow.value = rows.value[0] // 첫 번째 행 데이터를 선택
  }
};

// 삭제 api
const clickDeleteItem = async () => {
  const itemId = selected.value.map(obj => obj.id);

  const { response, error } = await deleteItemAPI(itemId);
  if (error) {
    console.log('에러 발생');
    return;
  }
  selected.value = [];
  getItemList();
};

// 엑셀 저장
const clickExcelDownload = async () => {
  const params = rows.value;

  const { response, error } = await itemExcelDownloadAPI(params);
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
  
  getItemList();
};

// 컴포넌트가 마운트될 때 getUserList를 호출
onMounted(() => {
  getItemList();
  
});
</script>
