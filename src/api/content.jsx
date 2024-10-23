import axios from 'axios'
import { config } from '../config'

// Fonction pour récupérer le token d'authentification depuis le stockage local
const getToken = () => {
    return window.localStorage.getItem('b4y-token')
}

// Ajout des images secondaires à la table content 
export function addOneContent(contentData) {
    return axios.post(`${config.api_url}/api/v1/content/save`, contentData, {headers: {"x-access-token": getToken()}
    })
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération d'un contenu d'un tome
export function getOneContent(id) {
    return axios.get(`${config.api_url}/api/v1/content/one/${id}`, {headers: {"x-access-token": getToken()}
    })
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Modification d'un contenu d'un tome
export function updateOneContent(id, contentData) {
    return axios.put(`${config.api_url}/api/v1/content/update/${id}`, contentData, {headers: {"x-access-token": getToken()}
    })
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Suppression du contenu d'un tome
export function deleteOneContent(id) {
    return axios.delete(`${config.api_url}/api/v1/content/delete/${id}`, {headers: {"x-access-token": getToken()}
    })
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}
