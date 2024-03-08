import { useEffect } from 'react';

function SidebarResize() {
  useEffect(() => {
    const handleResize = () => {
      const sideBar = document.querySelector('.sidebar');

      if (window.innerWidth < 768) {
        sideBar.classList.add('close');
      } else {
        sideBar.classList.remove('close');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

}

export default SidebarResize;
