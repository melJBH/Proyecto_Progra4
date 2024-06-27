import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users2`; // url para acceder a los .js de resgiter/update, etc
const userSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user2')));

export const userService_2 = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    logout,
    register,
    getAll,
    getById,
    getByName,
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('app/login/authenticate');
}

async function register(user){
    await fetchWrapper.post(`${baseUrl}/register`, user);
}
async function getAll() {
    const response = await fetchWrapper.get(`${baseUrl}/findAll`);
    return response.users; // Asegúrate de que accedes a la propiedad `users` si tu respuesta está estructurada de esa manera.
}


async function getById(id){
    return await fetchWrapper.get(`${baseUrl}/find`, id);
}

async function getByName(name){
    return await fetchWrapper.get(`${baseUrl}/findName`, name);
}

async function update(params){    

    await fetchWrapper.post(`${baseUrl}/update`, params);

    if (params.id === userSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const user = { ...userSubject.value, ...params };
        localStorage.setItem('user', JSON.stringify(user));

        // publish updated user to subscribers
        userSubject.next(user);
    }
}

async function _delete(id){

    await fetchWrapper.delete(`${baseUrl}/delete`, params);

    if(id === userSubject.value.id){
        logout();
    }
}