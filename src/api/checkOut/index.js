import axios from '../axios.js';
import * as api from '../path.js';

const CHECKOUT = api.path.CHECKOUT;

const getCheckOutAPI = () => {
    return axios({
            url: CHECKOUT.LIST,
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

const updateCheckOutAPI = (params) => {
    return axios({
            url: `${CHECKOUT.UPDATE}/${params.id}`,
            method: 'patch',
            data: params
        })
        .then(res => {
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const deleteCheckOutAPI = (checkOutId) => {
    return axios({
            url: `${CHECKOUT.DELETE}/${checkOutId}`,
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

const checkOutExcelDownloadAPI = (params) => {
    return axios({
            url: `${CHECKOUT.LIST}/excel/download`,
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

export { getCheckOutAPI, updateCheckOutAPI, deleteCheckOutAPI, checkOutExcelDownloadAPI };