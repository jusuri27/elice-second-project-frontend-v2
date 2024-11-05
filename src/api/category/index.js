import axios from '../axios.js';
import * as api from '../path';

const CATEGORY = api.path.CATEGORY;

const getCategoryAPI = () => {
    return axios({
            url: CATEGORY,
            method: 'get'
        })
        .then(res => {
            if (!res.data) {
                throw new Error("응답 에러: 데이터가 없습니다.");
            }
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const deleteCategoryAPI = (categoryId) => {
    return axios({
            url: `${CATEGORY}/${categoryId}`,
            method: 'delete'
        })
        .then(res => {
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const categoryExcelDownloadAPI = (params) => {
    return axios({
            url: `${CATEGORY}/excel/download`,
            method: 'post',
            data: params,
            responseType: 'blob'
        })
        .then(res => {
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

export { getCategoryAPI, deleteCategoryAPI, categoryExcelDownloadAPI };