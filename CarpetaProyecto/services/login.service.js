import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/logins`; // url para acceder a los .js de resgiter/update, etc
const loginSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('login')));

export const loginService = {
    login: loginSubject.asObservable(),
    get loginValue() { return loginSubject.value },
    logout,
    login,
    register,
    getAll,
    getByAdmin: getByUser,    
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('login');
    loginSubject.next(null);
    Router.push('app/login/register');
}

async function login(identification, password) {
    const login = await fetchWrapper.post(`${baseUrl}/authenticate`, { identification, password });

    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    loginSubject.next(login);
    localStorage.setItem('login', JSON.stringify(login));
}

async function register(params){
    await fetchWrapper.post(`${baseUrl}/register`, params);
}

async function getAll(){
    return await fetchWrapper.get(`${baseUrl}/findAll`);
}

async function getByUser(params){
    return await fetchWrapper.get(`${baseUrl}/find`, params);
}

async function update(params){    

    await fetchWrapper.post(`${baseUrl}/update`, params);

    if (params.id_user === loginSubject.value.id_user) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const login = { ...loginSubject.value, ...params };
        localStorage.setItem('login', JSON.stringify(login));

        // publish updated user to subscribers
        loginSubject.next(login);
    }
}

async function _delete(id){

    await fetchWrapper.delete(`${baseUrl}/delete`, id);

    if(id === loginSubject.value.id){
        logout();
    }
}