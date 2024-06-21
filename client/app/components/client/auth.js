'use client'
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const checkLogIn = async () =>{
       
            try{
            const response = await fetch('http://localhost:5000/check-login',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                  },
                credentials: 'include'
            })
            if(response.ok){
                const data = await response.json()
                setUser(data)
            }
            else{
                setUser(null)
            }
        }
          catch(error){
            console.error(error)
            setUser(null)
          }
          finally{
            setLoading(false)
          }
        }
    
         checkLogIn()
        },[])
    
        return(
            <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
                {children}
            </AuthContext.Provider>
        )
}

export const useAuth = () => useContext(AuthContext)