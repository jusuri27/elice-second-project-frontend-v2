export const API_BASE_URL = 'http://localhost:8080/api/admin';
// export const API_BASE_URL = 'https://jrqggzccfxaqcbkg.tunnel-pt.elice.io/api/admin';

export const path = {
    USERLOG: `${API_BASE_URL}/user-log`,
    ITEM: `${API_BASE_URL}/item`,
    CATEGORY: `${API_BASE_URL}/category`,
    USER: `${API_BASE_URL}/user`,
    CHECKOUT: {
        LIST: `${API_BASE_URL}/checkout`,
        UPDATE: `${API_BASE_URL}/checkout/delivery-status`,
        DELETE: `${API_BASE_URL}/checkout`,
    },
}