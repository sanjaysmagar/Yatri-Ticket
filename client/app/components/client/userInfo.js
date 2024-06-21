'use client'

import Link from 'next/link'
import { FaUser } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './auth'

export default function UserInfo(){
   const { user, setUser } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    
    const handleLogOut = async () => {
      
      try {
        const response = await fetch('http://localhost:5000/logout',{
          method: 'GET',
          credentials: 'include'
        })
    
        if (response.ok) {
        
          setUser(null)
          if (pathname === '/') {
            window.location.reload(); 
          } else {
            router.push('/').then(() => {
              window.location.reload(); 
            });
          }

        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    return(
      <div>
      {user ? (
      <div className="flex items-center">
  <div className="text-blue-900">
    <FaUser size={24} />
  </div>
  <div className="text-lg font-bold text-gray-800 ml-4 pr-8">
    {user.firstName} {user.lastName}
  </div>
  <div className='px-3'>
      <button className='bg-blue-900 text-white rounded-md h-8 w-20 hover:bg-green-500' onClick={handleLogOut}>Log Out</button>
      </div>
</div>
 ) : (
      <div className='flex '>
      <div className='px-3'>
      <button className='bg-blue-900 text-white rounded-md h-8 w-20 hover:bg-green-500'><Link  href='/login'>Login</Link></button>
      </div>
      <div className='px-3'>
      <button className='bg-blue-900 text-white h-8 w-20 rounded-md hover:bg-green-500' ><Link  href='/register'>SignUp</Link></button>
      </div>
</div> 
    )}
    </div>
    )
}