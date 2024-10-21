import axios from "axios"
import {config} from "../config"

// Fonction pour récupérer le token d'authentification depuis le stockage local
const getToken = () =>{
    return window.localStorage.getItem('b4y-token')
}

//récupération de tous les tomes
export function displayTomes(){
    return axios.get(`${config.api_url}/api/v1/tome/all`)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//récupération d'un seul tome
export function takeOneTome(id, token){
    return axios.get(`${config.api_url}/api/v1/tome/one/${id}`, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//ajout d'un tome
export function addOneTome(datas) {

    return axios.post(`${config.api_url}/api/v1/tome/save`, datas, {headers: {"x-access-token": getToken()}})
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//modification d'un tome
export function updateOneTome(datas, id){
    return axios.put(`${config.api_url}/api/v1/tome/update/${id}`, datas, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//suppression d'un tome
export function deleteOneTome(id){
    return axios.delete(`${config.api_url}/api/v1/tome/${id}`, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}
