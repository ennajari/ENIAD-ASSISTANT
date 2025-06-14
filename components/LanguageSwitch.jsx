'use client';

const LanguageSwitch = ({ language, setLanguage }) => {
    const isArabic = language === 'ar';

    return (
        <div className="relative flex w-28 h-10 bg-gray-200 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out">
            {/* Background Pill */}
            <div
                className={`absolute top-1 left-1 w-12 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    isArabic ? 'translate-x-14' : 'translate-x-0'
                }`}
            />

            {/* French Button */}
            <div
                className="relative z-10 flex-1 flex items-center justify-center text-sm font-semibold"
                onClick={() => setLanguage('fr')}
            >
                <span className={language === 'fr' ? 'text-orange-600' : 'text-gray-600'}>
                    FR
                </span>
            </div>

            {/* Arabic Button */}
            <div
                className="relative z-10 flex-1 flex items-center justify-center text-sm font-semibold"
                onClick={() => setLanguage('ar')}
            >
                <span className={language === 'ar' ? 'text-orange-600' : 'text-gray-600'}>
                    AR
                </span>
            </div>
        </div>
    );
};

export default LanguageSwitch; 