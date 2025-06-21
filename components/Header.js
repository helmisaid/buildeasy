// File: components/Header.js
// Description: The header component, now with logo and language selector.

// A simple, stylized SVG logo for evop.tech
const EvopLogo = () => (
    <div className="flex justify-center items-center gap-4 flex-wrap p-4 max-w-2xl mx-auto">
    <svg width="240" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <image href="/logo.svg" x="0" y="0" width="30" height="30" />
      <text x="40" y="25" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="bold" fill="white">evop.tech</text>
    </svg>
  
  </div>
);


const Header = ({ lang, setLang, content }) => {
    const inactiveClass = "px-3 py-1 text-sm text-gray-400 rounded-md hover:text-white transition-colors";
    const activeClass = "px-3 py-1 text-sm bg-[#06b6d4] text-white rounded-md font-semibold";

    return (
        <header className="text-center relative">
            <div className="absolute top-0 right-0">
                <div className="flex items-center space-x-2 bg-gray-800/80 p-1 rounded-lg border border-gray-700">
                    <button onClick={() => setLang('id')} className={lang === 'id' ? activeClass : inactiveClass}>ID</button>
                    <button onClick={() => setLang('en')} className={lang === 'en' ? activeClass : inactiveClass}>EN</button>
                </div>
            </div>
            
            <EvopLogo />

            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                Build<span className="text-[#06b6d4]">Easy</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                {content.tagline}
            </p>
        </header>
    );
};

export default Header;
