import React from 'react'
import { useAuthStore } from '../store/AuthStore'
import { LogOut, MessageCircle, Settings, UserRound } from 'lucide-react'
import { Link } from 'react-router'

const Navbar = () => {
  const {authUser}= useAuthStore()
  return (
    <header
    className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className='container mx-auto px-4 h-14'>
      <div className='flex items-center justify-between h-full'>
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">QuikTalk</h1>
            </Link>
          </div>

          <div className='flex items-center gap-2'>
          <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className={`flex items-center gap-2 p-2 transition-colors`}>
                  {authUser.profilePic ? (
                      <img
                          src={authUser.profilePic}
                          alt="Profile"
                          className="w-10 h-10 rounded-full "
                      />
                  ) : (
                      <UserRound className="size-5" />
                  )}
                  <span className="hidden sm:inline">Profile</span>
            </Link>

                <Link to={"/logout"} className={`btn btn-sm gap-2`}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </Link>
                
              </>
            )}
          </div>
      </div>
      </div>
    </header>
  )
}

export default Navbar