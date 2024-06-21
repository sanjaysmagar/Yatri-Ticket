import {useRouter} from 'next/navigation'
import { useAuth} from './auth'
import { useContext, useEffect } from 'react';

export default function PublicRoute (WrappedComponent) {
    return(props) =>{
      const { user, loading } = useAuth()
      const router = useRouter()

       useEffect(() =>{
        if(!loading && user){
            return router.push('/')
        }
       },[user])

        if(loading || user){
            return null
        }

        return <WrappedComponent {...props} />
    }
}

