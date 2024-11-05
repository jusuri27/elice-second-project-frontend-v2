import axios from '../axios.js';
import * as api from '../path';

const USER = api.path.USER;

const getUserAPI = () => {
    return axios({
            url: USER,
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

const updateUserAPI = (params) => {
    return axios({
            url: USER,
            method: 'put',
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

const userExcelDownloadAPI = (params) => {
    return axios({
            url: `${USER}/excel/download`,
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

export { getUserAPI, updateUserAPI, userExcelDownloadAPI };