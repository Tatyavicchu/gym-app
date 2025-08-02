import { useEffect, useState } from 'react';

const PageLayout = ({ children, bgImage }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const imageScale = Math.max(1 - scrollY / 1000, 0.5);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background image */}
      <div
        className="fixed top-0 left-0 w-full h-[50vh] bg-cover bg-center transition-all duration-300 z-[-10]"
        style={{
          backgroundImage: `url(${bgImage})`,
          transform: `scale(${imageScale})`,
        }}
      />

      {/* Content Wrapper */}
      <div className="mt-[50vh] p-4 space-y-6">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
