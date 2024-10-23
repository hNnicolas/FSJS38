import axios from 'axios'
import {config} from '../config'
// Fonction pour récupérer le token d'authentification depuis le stockage local
const getToken = () =>{
    return window.localStorage.getItem('b4y-token')
}

//sauvegarde d'une commentaire
export function saveOneComment(datas){
    return axios.post(`${config.api_url}/api/v1/comment/save`, datas)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//récupération d'un commentaire avec le détail de l'utilisateur 
export function getOneComment(id){
    return axios.get(`${config.api_url}/api/v1/comment/getOneComment/${id}`, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// récupération des commentaires lié par l'id d'un tome
export function getCommentsForTome(tomeId) {
    return axios.get(`${config.api_url}/api/v1/comment/getCommentsForTome/${tomeId}`, {headers: { "x-access-token": getToken() }})
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//récupération de tous les commentaires
export function getAllComment(){
    return axios.get(`${config.api_url}/api/v1/comment/all`, {headers: {"x-access-token": getToken()}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

//changement d'un commentaire (admin)
export function updateOneComment(datas){
  return axios.put(`${config.api_url}/api/v1/comment/updateComment`, datas, {headers: {"x-access-token": getToken()}})
  .then((res)=>{
      return res.data
  })
  .catch((err) => {
      return err
  })
}

//suppression d'un commentaire
export function deleteOneComment(id){
    return axios.delete(`${config.api_url}/api/v1/comment/deleteComment/${id}`, { headers: {"x-access-token": getToken() }})
  .then((res)=>{
      return res.data
  })
  .catch((err) => {
      return err
  })
}


