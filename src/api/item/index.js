import axios from '../axios.js';
import * as api from '../path';

const ITEM = api.path.ITEM;

const getItemAPI = () => {
    return axios({
            url: ITEM,
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

const deleteItemAPI = (itemId) => {
    return axios({
            url: `${ITEM}/${itemId}`,
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

const itemExcelDownloadAPI = (params) => {
    return axios({
            url: `${ITEM}/excel/download`,
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

export { getItemAPI, deleteItemAPI, itemExcelDownloadAPI };