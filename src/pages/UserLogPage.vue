<template>
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="사용자 로그"
      :rows="rows"
      :columns="columns.filter(col => col.visible !== false)"
      row-key="userLogId"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
      @row-click="onRowClick"
      :pagination="initialPagination"
    >
      <template v-slot:top-right>
        <div class="q-pa-md q-gutter-sm">
          <q-btn color="secondary" @click="clickExcelDownload()" label="엑셀" />
          <!-- <q-btn color="primary" @click="createUserLog()" label="추가" />
          <q-btn color="red" @click="deleteUserLog()" label="삭제" /> -->
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
import { getUserLogAPI, createUserLogAPI, updateUserLogAPI, deleteUserLogAPI, userLogExcelDownloadAPI } from '../api/index.js';
import ModalComponent from 'src/components/modal/ModalComponent.vue'

// 테이블 화면 관련 변수
const selected = ref([]); // 체크박스
const rows = ref([]); // rows를 ref로 변경하여 반응형 데이터로 만듭니다.
const initialPagination = { // 페이지네이션
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
      }
const columns = [
  {
    name: 'userLogId',
    required: false,
    label: 'userLogId',
    align: 'left',
    field: row => row.userLogId,
    visible: false
  },
  { name: '유저명',     align: 'left',  label: '유저명',        field: 'userName', sortable: true },
  { name: '유저IP',     align: 'left',  label: '사용자IP',      field: 'clientIp', sortable: true },
  { name: '요청경로',   align: 'left',  label: '요청경로',      field: 'requestUrl', sortable: true },
  { name: '요청메서드', align: 'left',  label: '요청메서드',    field: 'requestMethod', sortable: true },
  { name: '요청시간',   align: 'left',  label: '요청시간',      field: 'requestTime', sortable: true },
  { name: '응답상태',   align: 'left',  label: '응답상태',      field: 'responseStatus', sortable: true  },
  { name: '응답시간',   align: 'left',  label: '응답시간',      field: 'responseTime', sortable: true  }
]

// 모달 화면 관련 변수
const formData = ref([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalFlag = ref('');

const getSelectedString = () => {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.value.length}`
}

const onRowClick = (evt, row) => {
  console.log('clicked on', row);
  formData.value = [
      { key: 'userLogId', value: row.userLogId, type: 0},
      { key: 'clientIp', value: row.clientIp, label: 'Client IP', type: 'input', isDisable: false},
      { key: 'requestMethod', value: row.requestMethod, label: 'Request Method', type: 'select', options: [ '11', '22', '33', '44', '55' ], isDisable: false},
      { key: 'requestUrl', value: row.requestUrl, label: 'Request URI', type: 'input', isDisable: false},
      { key: 'responseStatus', value: row.responseStatus, label: 'Response Status', type: 'file', isDisable: false}
  ];
  modalTitle.value = '사용자 로그 수정';
  // showModal.value = true;
  modalFlag.value = 'update';
};

const closeModal = () => {
  showModal.value = false;
};

const createUserLog = async () => {
  formData.value = [
      { key: 'clientIp', value: '', label: 'Client IP', type: 'input', isDisable: false},
      { key: 'requestMethod', value: '', label: 'Request Method', type: 'select', options: [ '11', '22', '33', '44', '55' ], isDisable: false},
      { key: 'requestUrl', value: '', label: 'Request URI', type: 'input', isDisable: false},
      { key: 'responseStatus', value: '', label: 'Response Status', type: 'file', isDisable: false}
  ];
  modalTitle.value = '사용자 로그 추가';
  showModal.value = true;
  modalFlag.value = 'create';
};


// 조회 api
const getUserList = async () => {
  const { response, error } = await getUserLogAPI();
  if (error) {
    console.log('에러 발생');
    return;
  }

  // API로부터 받은 데이터를 rows에 반영
  rows.value = response.data;
};

// 삭제 api
const deleteUserLog = async () => {
  const userLogIds = selected.value.map(obj => obj.userLogId);

  const { response, error } = await deleteUserLogAPI(userLogIds);
  if (error) {
    console.log('에러 발생');
    return;
  }
  selected.value = [];
  getUserList();
};

// 추가 ,수정 api
const saveModal = async () => {
  const params = {};

  // dto에 맞게 데이터 가공
  formData.value.forEach(item => {
    params[item.key] = item.value;
  });

  console.log('params : ', params);

  if (modalFlag.value == 'update') {
    const { response, error } = await updateUserLogAPI(params);
    if (error) {
      console.log('수정 에러 발생');
      return;
    }
  } else if (modalFlag.value == 'create') {
    const { response, error } = await createUserLogAPI(params);
    if (error) {
      alert('추가 에러 발생');
      return;
    }
  }

  selected.value = [];
  getUserList();
  showModal.value = false;
};

// 엑셀 저장
const clickExcelDownload = async () => {
  const params = rows.value;
  const { response, error } = await userLogExcelDownloadAPI(params);
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
  
  getUserList();
};

// 컴포넌트가 마운트될 때 getUserList를 호출
onMounted(() => {
  getUserList();
});


</script>