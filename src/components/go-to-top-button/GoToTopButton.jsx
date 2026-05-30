import { useEffect, useState } from "react";
import { FaCaretUp } from 'react-icons/fa';
import './go-to-top-button.scss';

const GoToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const clickHandler = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const scrollHandler = () => {
    setIsVisible(window.scrollY > 300);
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <button
      id="go-to-top-button"
      onClick={clickHandler}
      className={isVisible ? 'visible' : ''}
    >
      <FaCaretUp size={24} />
    </button>
  );
}

export default GoToTopButton;