import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'
import ChatLabel from './ChatLabel'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const Sidebar = ({expand, setExpand}) => {

    const {openSignIn} = useClerk()
    const {user, chats, createNewChat} = useAppContext()
    const [openMenu, setOpenMenu] = useState({id: 0, open: false})

  return (
    <div className={`flex flex-col justify-between bg-gray-100 pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}>
      <div>
        <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`}>
            {expand ? (
              <span className={`${inter.className} text-2xl tracking-tight text-gray-600 whitespace-nowrap`}>Eniad-Assistant</span>
            ) : (
              <Image className="w-10" src={assets.logo_icon} alt='Eniad-Assistant'/>
            )}

            <div onClick={()=> expand ? setExpand(false) : setExpand(true)}
             className='group relative flex items-center justify-center hover:bg-gray-200 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
                <Image src={assets.menu_icon} alt='' className='md:hidden'/>
                <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt='' className='hidden md:block w-7'/>
                <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}>
                    {expand ? 'Close sidebar' : 'Open sidebar'}
                    <div className={`w-3 h-3 absolute bg-gray-800 rotate-45 ${expand ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}></div>
                </div>
            </div>
        </div>

        <button onClick={createNewChat} className={`mt-8 flex items-center justify-center cursor-pointer ${expand ? "bg-orange-400 hover:bg-orange-500 text-white rounded-2xl gap-2 p-2.5 w-max" : "group relative h-9 w-9 mx-auto hover:bg-gray-200 rounded-lg"}`}>
            <Image className={expand ? 'w-6' : 'w-7'} src={expand ? assets.chat_icon : assets.chat_icon_dull} alt=''/>
            <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
                New chat
                <div className='w-3 h-3 absolute bg-gray-800 rotate-45 left-4 -bottom-1.5'></div>
            </div>
            {expand && <p className='text-white font-medium'>New chat</p>}
        </button>

        <div className={`mt-8 text-gray-600 text-sm ${expand ? "block" : "hidden"}`}>
            <p className='my-1'>Recents</p>
            {chats.map((chat, index)=> <ChatLabel key={index} name={chat.name} id={chat._id} openMenu={openMenu} setOpenMenu={setOpenMenu}/>)}
        </div>
      </div>

      <div>
        <div className={`flex items-center cursor-pointer group relative ${expand ? "gap-1 text-gray-700 text-sm p-2.5 border border-gray-300 rounded-lg hover:bg-gray-200" : "h-10 w-10 mx-auto hover:bg-gray-200 rounded-lg"}`}>
            <Image className={expand ? "w-5" : "w-6.5 mx-auto"} src={expand ? assets.phone_icon : assets.phone_icon_dull} alt=''/>
            <div className={`absolute -top-60 pb-8 ${!expand && "-right-40"} opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}>
                <div className='relative w-max bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg'>
                    <Image src={assets.qrcode} alt='' className='w-44'/>
                    <p>Scan to get Eniad-Assistant App</p>
                    <div className={`w-3 h-3 absolute bg-gray-800 rotate-45 ${expand ? "right-1/2" : "left-4"} -bottom-1.5`}></div>
                </div>
            </div>
            {expand && <> <span>Get App</span> <Image alt='' src={assets.new_icon}/> </>}
        </div>

        <div onClick={user ? null : openSignIn}
         className={`flex items-center ${expand ? 'hover:bg-gray-200 rounded-lg' : 'justify-center w-full'} gap-3 text-gray-600 text-sm p-2 mt-2 cursor-pointer`}>
            {
                user ? <UserButton/>
                : <Image src={assets.profile_icon} alt='' className='w-7'/>
            }
            
            {expand && <span>My Profile</span>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
