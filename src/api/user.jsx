import axios from "axios"
import {config} from "../config"

// Fonction pour récupérer le token d'authentification depuis le stockage local
const getToken = () =>{
    return window.localStorage.getItem('b4y-token')
}

// Fonction pour ajouter un nouvel utilisateur
export function addOneUser(datas) {
    return axios.post(`${config.api_url}/api/v1/user/save`, datas)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Fonction pour connecter un utilisateur
export function loginUser(datas){
    return axios.post(`${config.api_url}/api/v1/user/login`, datas)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Fonction pour mettre à jour le profil d'un utilisateur
export function updateProfil(datas, id){
    return axios.put(`${config.api_url}/api/v1/user/update/${id}`, datas, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Fonction pour mettre à jour le statut d'un utilisateur
export function updateUserStatus(id, status) {
    return axios.put(`${config.api_url}/api/v1/user/status/${id}`, { status }, { headers: { "x-access-token": getToken() } })
      .then((res) => {
        return { status: res.status, msg: res.data.msg || 'Statut mis à jour avec succès.' }
      })
      .catch((err) => {
        return { status: 500, msg: "Erreur lors de la mise à jour du statut." }
      })
}

// Fonction pour récupérer les infos d'un utilisateur
export function getOneUser(id) {
    return axios.get(`${config.api_url}/api/v1/user/${id}`)
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
}

// Fonction pour récupérer tous les utilisateurs
export function getAllUsers() {
    return axios.get(`${config.api_url}/api/v1/users/all`, { headers: { "x-access-token": getToken() } })
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Fonction pour récupérer tous les utilisateurs par statut (banni ou autorisé)
export function getAllUsersByStatus(status) {
    return axios.put(`${config.api_url}/api/v1/users/${status}`, { headers: { "x-access-token": getToken() } })
        .then((res) => res.data)
        .catch((err) => {
            return { status: 500, msg: "Erreur lors de la récupération des utilisateurs." }
        })
}

// Fonction pour supprimer un utilisateur
export function deleteUser(id){
    return axios.delete(`${config.api_url}/api/v1/user/delete/${id}`, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Fonction pour vérifier la validité du token d'authentification
export function checkMyToken(){
    return axios.get(`${config.api_url}/api/v1/user/checkToken`, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })    
}
