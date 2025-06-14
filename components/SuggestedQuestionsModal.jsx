'use client';
import { useState } from 'react';
import LanguageSwitch from './LanguageSwitch';

const SuggestedQuestionsModal = ({ isOpen, onClose, categoryData, onQuestionSelect }) => {
    const [language, setLanguage] = useState('fr'); // 'fr' or 'ar'

    if (!isOpen || !categoryData) return null;

    const handleQuestionClick = (questionText) => {
        onQuestionSelect(questionText);
        onClose();
    };

    const isArabic = language === 'ar';

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className={`flex justify-between items-center pb-4 border-b ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <h3 className={`text-xl font-semibold ${isArabic ? 'text-right' : 'text-left'}`}>
                        {isArabic ? categoryData.title_ar : categoryData.title_fr}
                    </h3>
                    <LanguageSwitch language={language} setLanguage={setLanguage} />
                </div>

                <div className={`mt-4 space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                    {categoryData.questions.map((q, index) => (
                        <div 
                            key={index} 
                            className="p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleQuestionClick(isArabic ? q.ar : q.fr)}>
                            <p>{isArabic ? q.ar : q.fr}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuggestedQuestionsModal; 