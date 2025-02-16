import { useLayoutEffect } from 'react';
import '../styles/NotFound.css';

const NotFound = () => {
    useLayoutEffect(() => {
        const header = document.querySelector('.HEADER');
        if(header) {
          header.style.display = 'none';
        }
        
        return () => {
          if(header) {
             header.style.display = 'block'; 
          }
        };
      }, []);
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>Sorry, the page you are looking for might have been removed or does not exist.</p>
        <a href="/">Go to Home</a>
      </div>
    </div>
  );
}

export default NotFound;
