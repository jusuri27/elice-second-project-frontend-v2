const BASE_URL = 'http://localhost:8080';
// const BASE_URL = 'https://jrqggzccfxaqcbkg.tunnel-pt.elice.io';
export default {
    URL: {
        HOME: BASE_URL,
        CREATE_CATEGORY: `${BASE_URL}/category/add`,
        UPDATE_CATEGORY: `${BASE_URL}/category/edit/`, // 아직 미구현
        CREATE_ITEM: `${BASE_URL}/item/item-add`,
        UPDATE_ITEM: `${BASE_URL}/item/edit/`,
    }
};