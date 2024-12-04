import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useScrollToElement = (elementId) => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToElement = () => {
    // First navigate to home if not already there
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    // Try to scroll immediately if element exists
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // If element doesn't exist, set up an observer to wait for it
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Clean up observer after 2 seconds if element is never found
    setTimeout(() => observer.disconnect(), 2000);
  };

  return scrollToElement;
};