import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import toast from 'react-hot-toast'

const SpeakerIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

const MuteIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

const Message = ({message}) => {
    // Safety check to prevent crashing on undefined message
    if (!message) {
        return null; 
    }

    const { role, content, audio } = message;
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(()=>{
        if (content) Prism.highlightAll()
    }, [content])

    useEffect(() => {
        if (audio && audioRef.current) {
            const audioSrc = `data:audio/mpeg;base64,${audio}`;
            audioRef.current.src = audioSrc;
        }
    }, [audio]);

    const toggleAudio = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true));
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const copyMessage = ()=>{
        if (content) {
            navigator.clipboard.writeText(content);
            toast.success('Message copied to clipboard');
        }
    }

  return (
    <div className='flex flex-col items-center w-full max-w-3xl text-sm'>
      <div className={`flex flex-col w-full mb-8 ${role === 'user' && 'items-end'}`}>
        <div className={`group relative flex max-w-2xl py-3 rounded-xl ${role === 'user' ? 'bg-gray-50 px-5' : 'gap-3'}`}>
            <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'} transition-all`}>
                <div className='flex items-center gap-2 opacity-70'>
                    { role === 'user' ? (
                        <>
                        <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4 cursor-pointer'/>
                        <Image src={assets.pencil_icon} alt='' className='w-4.5 cursor-pointer'/>
                        </>
                    ) : (
                        <>
                        {audio && (
                            <>
                                <button onClick={toggleAudio} className='cursor-pointer w-5 h-5 flex items-center justify-center'>
                                    {isPlaying ? <MuteIcon className='w-full h-full text-orange-500' /> : <SpeakerIcon className='w-full h-full' />}
                                </button>
                                <audio ref={audioRef} onEnded={handleAudioEnded} preload="auto"></audio>
                            </>
                        )}
                        <Image onClick={copyMessage} src={assets.copy_icon} alt='' className='w-4.5 cursor-pointer'/>
                        <Image src={assets.regenerate_icon} alt='' className='w-4 cursor-pointer'/>
                        <Image src={assets.like_icon} alt='' className='w-4 cursor-pointer'/>
                        <Image src={assets.dislike_icon} alt='' className='w-4 cursor-pointer'/>
                        </>
                    )}
                </div>
            </div>
            { role === 'user' ? (
                <span className='text-gray-800'>{content}</span>
            ) : (
                <>
                <Image src={assets.logo_icon} alt='' className='h-9 w-9 p-1 border border-gray-300 rounded-full'/>
                <div className='space-y-4 w-full overflow-x-auto'>
                    <Markdown>{content || ""}</Markdown>
                </div>
                </>
            )}
        </div>
      </div>
    </div>
  )
}

export default Message
