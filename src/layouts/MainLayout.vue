<template>
  <q-layout view="lHh Lpr lFf">
    <HeaderLayout />
    <SideMenuLayout
      @changeMainView="changeMainView"
      :menuList ="menuList"
    />
    <q-page-container>
      <component :is="currentView" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import HeaderLayout from 'layouts/HeaderLayout.vue'
import SideMenuLayout from 'layouts/SideMenuLayout.vue'

import UserLog from 'pages/UserLogPage.vue'
import Category from 'src/pages/CategoryPage.vue'
import Item from 'src/pages/ItemPage.vue'
import User from 'src/pages/UserPage.vue'
import CheckOut from 'src/pages/CheckOutPage.vue'

defineOptions({
  name: 'MainLayout'
})

const menuList = [
  {
    title: '주문 관리',
    icon: 'shopping_bag',
    component: CheckOut
  },
  {
    title: '회원 관리',
    icon: 'manage_accounts',
    component: User
  },
  {
    title: '카테고리 관리',
    icon: 'category',
    component: Category
  },
  {
    title: '상품 관리',
    icon: 'inventory_2',
    component: Item
  },
  {
    title: '사용자 로그',
    icon: 'record_voice_over',
    component: UserLog
  }
]


const currentView = ref(menuList[3].component) // 기본값을 첫 번째 컴포넌트로 설정

const changeMainView = (link) => {
  currentView.value = link.component
};

// localhost:8080에서 관리자 버튼 클릭시 토큰값 넘겨받고 url에 남아있는 토큰 내용 삭제
// url에 토큰 내용을 삭제했기 때문에 새로고침시 url에 토큰값이 있을때만 세션스토리지에 저장
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get('token');
const tokenFromSession = sessionStorage.getItem('accessToken');

if (tokenFromUrl) {
  sessionStorage.setItem('accessToken', tokenFromUrl);
}

urlParams.delete('token');
const newUrl = window.location.pathname + '?' + urlParams.toString();
window.history.replaceState({}, document.title, newUrl);

</script>
