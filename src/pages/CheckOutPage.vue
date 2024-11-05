<template>
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="주문 관리"
      :rows="rows"
      :columns="columns.filter(col => col.visible !== false)"
      row-key="id"
      selection="single"
      :selected-rows-label="getSelectedString"
      v-model:selected="selected"
      @row-dblclick="onDbRowClick"
      :pagination="initialPagination"
    >
      <template v-slot:top-right>
        <div class="q-pa-md q-gutter-sm">
          <q-btn color="secondary" @click="clickExcelDownload()" label="엑셀" />
          <q-btn color="red" @click="clickDeleteCheckOut()" label="삭제" />
        </div>
      </template>
    </q-table>
  </div>
  <ModalComponent 
    v-if="showModal"
    :formData ="formData"
    :modalTitle ="modalTitle"
    @closeModal="closeModal"
    @saveModal="saveModal"
  >
  </ModalComponent>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCheckOutAPI, updateCheckOutAPI, deleteCheckOutAPI, checkOutExcelDownloadAPI } from '../api/index.js';
import ModalComponent from 'src/components/modal/ModalComponent.vue'

const selected = ref([]);

// 테이블 화면 관련 변수
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
    label: 'id',
    align: 'left',
    field: row => row.id,
    visible: false
  },
  { name: '주문 제목', align: 'left', label: '주문 제목', field: 'summaryTitle', sortable: true },
  { name: '총 가격', align: 'left', label: '총 가격', field: 'totalPrice', sortable: true },
  { name: '배송상태', align: 'left', label: '배송상태', field: 'deliveryStatus', sortable: true },
  { name: '유저id', align: 'left', label: '유저id', field: 'userId', sortable: true },
  { name: '배송요청사항', align: 'left', label: '배송요청사항', field: 'request', sortable: true },
  { name: '주소1', align: 'left', label: '주소1', field: 'address1', sortable: true  },
  { name: '주소2', align: 'left', label: '주소2', field: 'address2', sortable: true  }
]

// 모달 화면 관련 변수
const formData = ref([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalFlag = ref('');

const onDbRowClick = (evt, row) => {
  console.log('clicked on', row);
  const role = 
  [
    {name: 'READY', value: 'READY'},
    {name: 'START', value: 'START'},
    {name: 'SHIPPING', value: 'SHIPPING'},
    {name: 'ARRIVED', value: 'ARRIVED'}
  ];
  formData.value = [
      { key: 'id', value: row.id, type: 'hidden'},
      { key: 'summaryTitle', value: row.summaryTitle, label: '주문 제목', type: 'input', isDisable: true},
      { key: 'totalPrice', value: row.totalPrice, label: '총 가격', type: 'input', isDisable: true},
      { key: 'deliveryStatus', value: row.deliveryStatus, label: '배송상태', type: 'select', options: role, isDisable: false},
      { key: 'userId', value: row.userId, label: '유저id', type: 'input', isDisable: true},
      { key: 'request', value: row.request, label: '배송요청사항', type: 'input', isDisable: true},
      { key: 'address1', value: row.address1, label: '주소1', type: 'input', isDisable: true},
      { key: 'address2', value: row.address2, label: '주소2', type: 'input', isDisable: true}
  ];
  modalTitle.value = '주문 수정';
  showModal.value = true;
  modalFlag.value = 'update';
};

const closeModal = () => {
  showModal.value = false;
};

// 조회 api
const getCheckOutList = async () => {
  const { response, error } = await getCheckOutAPI();
  if (error) {
    console.log('에러 발생');
    return;
  }
  
  rows.value = response.data.map(order => {
    const { address, ...rest } = order;
        return {
            ...rest,
            recipientName: address.recipientName,
            recipientPhone: address.recipientPhone,
            postalCode: address.postalCode,
            address1: address.address1,
            address2: address.address2
        };
    });
  console.log("rows.value : ", rows.value);
};

// 수정 api
const saveModal = async () => {
  const params = {};

  // dto에 맞게 데이터 가공
  formData.value.forEach(item => {
    // 셀렉트 박스 미클릭시 : userRole은 String
    // 셀렉트 박스 클릭시 : userRole은 Object
    // 그래서 아래와 같은 if조건문 사용함
    if (item.key === 'deliveryStatus' && typeof item.value === 'object') {
      params[item.key] = item.value.value;
    } else {
      params[item.key] = item.value;
    } 
  });

  console.log('params : ', params);
  
  if (modalFlag.value == 'update') {
    const { response, error } = await updateCheckOutAPI(params);
    if (error) {
      console.log('수정 에러 발생');
      return;
    }
  }

  selected.value = [];
  showModal.value = false;
  getCheckOutList();
};

// 삭제 api
const clickDeleteCheckOut = async () => {
  const checkOutId = selected.value.map(obj => obj.id);

  const { response, error } = await deleteCheckOutAPI(checkOutId);
  if (error) {
    console.log('에러 발생');
    return;
  }
  selected.value = [];
  getCheckOutList();
};

// 엑셀 저장
const clickExcelDownload = async () => {
  const params = rows.value;
  console.log('params : ', params);
  const { response, error } = await checkOutExcelDownloadAPI(params);
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
  
  getCheckOutList();
};

onMounted(() => {
  getCheckOutList();
});
</script>