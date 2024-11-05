import axios from '../axios.js';
import * as api from '../path';

const USERLOG = api.path.USERLOG;

const getUserLogAPI = () => {
    return axios({
            url: USERLOG,
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

const createUserLogAPI = (params) => {
    return axios({
            url: USERLOG,
            method: 'post',
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

const updateUserLogAPI = (params) => {
    return axios({
            url: USERLOG,
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

const deleteUserLogAPI = (userLogIds) => {
    return axios({
            url: USERLOG,
            method: 'delete',
            data: userLogIds
        })
        .then(res => {
            return { response: res, error: null };
        })
        .catch(err => {
            console.error(err);
            return { response: null, error: err };
        });
};

const userLogExcelDownloadAPI = (params) => {
    return axios({
            url: `${USERLOG}/excel/download`,
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

export { getUserLogAPI, createUserLogAPI, updateUserLogAPI, deleteUserLogAPI, userLogExcelDownloadAPI };