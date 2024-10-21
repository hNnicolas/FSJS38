import { createSlice } from "@reduxjs/toolkit"

// État initial : initialise `infos` avec des propriétés par défaut
const initialState = {
  infos: {
    id: null,
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    status: null, 
  },
  isLogged: false,
}

// Création du slice utilisateur
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action pour connecter un utilisateur
    connectUser: (state, action) => {
      state.infos = action.payload 
      state.isLogged = true 
    },
    // Action pour déconnecter un utilisateur
    logoutUser: (state) => {
      state.infos = initialState.infos 
      state.isLogged = false  
    },
    
  }
})

// Exportation des actions pour l'utilisation dans les composants
export const { connectUser, logoutUser } = userSlice.actions

// Sélecteur pour obtenir l'utilisateur dans le store Redux
export const selectUser = (state) => state.user 

export default userSlice.reducer
