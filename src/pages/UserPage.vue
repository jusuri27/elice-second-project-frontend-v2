<template>
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="회원 관리"
      :rows="rows"
      :columns="columns.filter(col => col.visible !== false)"
      row-key="userId"
      :selected-rows-label="getSelectedString"
      v-model:selected="selected"
      @row-dblclick="onDbRowClick"
      :pagination="initialPagination"
    >
      <template v-slot:top-right>
        <div class="q-pa-md q-gutter-sm">
          <q-btn color="secondary" @click="clickExcelDownload()" label="엑셀" />
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
import { getUserAPI, updateUserAPI, userExcelDownloadAPI } from '../api/index.js';
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
    name: 'userId',
    required: false,
    label: 'userId',
    align: 'left',
    field: row => row.userId,
    visible: false
  },
  { name: '이름', align: 'left', label: '이름', field: 'userName', sortable: true },
  { name: '아이디', align: 'left', label: '아이디', field: 'userEmail', sortable: true },
  { name: '권한', align: 'left', label: '권한', field: 'userRole', sortable: true },
  { name: '닉네임', align: 'left', label: '닉네임', field: 'userNickName', sortable: true },
  { name: '생성시간', align: 'left', label: '생성시간', field: 'createAt', sortable: true },
  { name: '수정시간', align: 'left', label: '수정시간', field: 'updateAt', sortable: true  }
]

// 모달 화면 관련 변수
const formData = ref([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalFlag = ref('');

const getSelectedString = () => {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.value.length}`
}

const onDbRowClick = (evt, row) => {
  console.log('clicked on', row);
  const role = 
  [
    {name: 'ADMIN', value: 'ADMIN'},
    {name: 'USER', value: 'USER'}
  ];
  formData.value = [
      { key: 'userId', value: row.userId, type: 'hidden'},
      { key: 'userName', value: row.userName, label: '이름', type: 'input', isDisable: true},
      { key: 'userEmail', value: row.userEmail, label: '아이디', type: 'input', isDisable: true},
      { key: 'userRole', value: row.userRole, label: '권한', type: 'select', options: role, isDisable: false},
      { key: 'userNickName', value: row.userNickName, label: '닉네임', type: 'input', isDisable: true},
      { key: 'createAt', value: row.createAt, label: '생성시간', type: 'input', isDisable: true},
      { key: 'updateAt', value: row.userNickName, label: '수정시간', type: 'input', isDisable: true}
  ];
  modalTitle.value = '유저 수정';
  showModal.value = true;
  modalFlag.value = 'update';
};

const closeModal = () => {
  showModal.value = false;
};

// 조회 api
const getUserList = async () => {
  const { response, error } = await getUserAPI();
  if (error) {
    console.log('에러 발생');
    return;
  }
  console.log("response.data : ", response.data);
  // API로부터 받은 데이터를 rows에 반영
  rows.value = response.data;
};

// 수정 api
const saveModal = async () => {
  const params = {};

  // dto에 맞게 데이터 가공
  formData.value.forEach(item => {
    // 셀렉트 박스 미클릭시 : userRole은 String
    // 셀렉트 박스 클릭시 : userRole은 Object
    // 그래서 아래와 같은 if조건문 사용함
    if (item.key === 'userRole' && typeof item.value === 'object') {
      params[item.key] = item.value.value;
    } else {
      params[item.key] = item.value;
    } 
  });

  if (modalFlag.value == 'update') {
    const { response, error } = await updateUserAPI(params);
    if (error) {
      console.log('수정 에러 발생');
      return;
    }
  }

  selected.value = [];
  getUserList();
  showModal.value = false;
};

// 삭제 api
const deleteUserLog = async () => {
  const userIds = selected.value.map(obj => obj.userId);

  const { response, error } = await deleteUserLogAPI(userIds);
  if (error) {
    console.log('에러 발생');
    return;
  }
  selected.value = [];
  getUserList();
};

// 엑셀 저장
const clickExcelDownload = async () => {
  const params = rows.value;

  const { response, error } = await userExcelDownloadAPI(params);
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

onMounted(() => {
  getUserList();
});


</script>