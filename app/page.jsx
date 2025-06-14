'use client';
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { suggestedQuestionsData } from "@/data/suggestedQuestions";
import SuggestedQuestionsModal from "@/components/SuggestedQuestionsModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBookOpen, faCertificate, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f97316" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2.25 9l9.75 6.75L21.75 9 12 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
  </svg>
);

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f97316" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V21M19.5 3.75A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H12M12 6H4.5A2.25 2.25 0 002.25 8.25v12A2.25 2.25 0 004.5 22.5H12" />
  </svg>
);

const CertificateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f97316" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v9.75A2.25 2.25 0 0113.5 21h-3a2.25 2.25 0 01-2.25-2.25V9m7.5 0H6.75" />
  </svg>
);

const UniversityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f97316" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V21h18V10.5M12 3L2.25 9l9.75 6.75L21.75 9 12 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
  </svg>
);

const SuggestionCard = ({ title_fr, title_ar, icon, onClick }) => (
  <div onClick={onClick} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer w-full text-center">
    <div className="flex justify-center mb-3">
      <div className="flex items-center justify-center h-16 w-16 bg-orange-100 rounded-full">
        {icon}
      </div>
    </div>
    <h3 className="font-semibold text-gray-800">{title_fr}</h3>
    <p className="text-sm text-gray-500" lang="ar">{title_ar}</p>
  </div>
);

export default function Home() {

  const [expand, setExpand] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, category: null });
  const {selectedChat} = useAppContext()
  const containerRef = useRef(null)

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  },[messages])

  const openModal = (category) => {
    setModalState({ isOpen: true, category });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, category: null });
  };

  const handleQuestionSelect = (question) => {
    setPrompt(question);
  };

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand}/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-gray-50 text-gray-800 relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={()=> (expand ? setExpand(false) : setExpand(true))}
             className="rotate-180" src={assets.menu_icon} alt=""/>
            <Image className="opacity-70" src={assets.chat_icon} alt=""/>
          </div>

          {messages.length === 0 ? (
            <>
            <div className="flex items-center gap-8">
              <Image src={assets.logo_m} alt="" className="h-16 w-auto"/>
              <h1 className="text-2xl font-medium">Hi, I'm Eniad-Assistant.</h1>
            </div>
            <p className="text-sm mt-4 text-gray-600">How can I help you today?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-8">
                <SuggestionCard 
                  title_fr={suggestedQuestionsData.admission.title_fr}
                  title_ar={suggestedQuestionsData.admission.title_ar}
                  icon={<FontAwesomeIcon icon={faGraduationCap} style={{color: '#60a5fa'}} size="2x" />}
                  onClick={() => openModal('admission')}
                />
                <SuggestionCard 
                  title_fr={suggestedQuestionsData.specialisations.title_fr}
                  title_ar={suggestedQuestionsData.specialisations.title_ar}
                  icon={<FontAwesomeIcon icon={faBookOpen} style={{color: '#a78bfa'}} size="2x" />}
                  onClick={() => openModal('specialisations')}
                />
                <SuggestionCard 
                  title_fr={suggestedQuestionsData.bourses.title_fr}
                  title_ar={suggestedQuestionsData.bourses.title_ar}
                  icon={<FontAwesomeIcon icon={faCertificate} style={{color: '#fbbf24'}} size="2x" />}
                  onClick={() => openModal('bourses')}
                />
                <SuggestionCard 
                  title_fr={suggestedQuestionsData.campus.title_fr}
                  title_ar={suggestedQuestionsData.campus.title_ar}
                  icon={<FontAwesomeIcon icon={faBuildingColumns} style={{color: '#6ee7b7'}} size="2x" />}
                  onClick={() => openModal('campus')}
                />
            </div>
            </>
          ):
          (
          <div ref={containerRef}
          className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
          > 
          <p className="fixed top-8 border border-gray-300 hover:border-gray-400 py-1 px-2 rounded-lg font-semibold mb-6">{selectedChat.name}</p>
          {messages.map((msg, index)=>(
            <Message key={index} message={msg}/>
          ))}
          {
            isLoading && (
              <div className="flex gap-4 max-w-3xl w-full py-3">
                <Image className="h-9 w-9 p-1 border border-gray-300 rounded-full"
                 src={assets.logo_icon} alt="Logo"/>
                 <div className="loader flex justify-center items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-gray-800 animate-bounce"></div>
                  <div className="w-1 h-1 rounded-full bg-gray-800 animate-bounce"></div>
                  <div className="w-1 h-1 rounded-full bg-gray-800 animate-bounce"></div>
                 </div>
              </div>
            )
          }
            
          </div>
        )
        }
        <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} prompt={prompt} setPrompt={setPrompt}/>
        <p className="text-xs absolute bottom-1 text-gray-500">Eniad-Assistant can make mistakes. Consider checking important information.</p>

        </div>
      </div>
      <SuggestedQuestionsModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        categoryData={modalState.category ? suggestedQuestionsData[modalState.category] : null}
        onQuestionSelect={handleQuestionSelect}
      />
    </div>
  );
}
