import React, { useEffect } from 'react';

function DarkModeToggle() {
  useEffect(() => {
    const toggler = document.getElementById('theme-toggle');

    function handleToggleChange() {
      if (toggler.checked) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }

    toggler.addEventListener('change', handleToggleChange);

    // Clean up the event listener when the component unmounts
    return () => {
      toggler.removeEventListener('change', handleToggleChange);
    };
  }, []); // Empty dependency array ensures this effect runs once, similar to componentDidMount

}

export default DarkModeToggle;