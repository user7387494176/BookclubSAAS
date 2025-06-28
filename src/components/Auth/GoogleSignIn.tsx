import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleSignIn: React.FC = () => {
  const { login } = useAuth();

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with actual client ID
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
          }
        );
      }
    };

    const handleCredentialResponse = (response: any) => {
      // Decode JWT token to get user info
      const userInfo = parseJwt(response.credential);
      
      const userData = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
      };

      login(userData);
    };

    const parseJwt = (token: string) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    };

    // Initialize after a short delay to ensure Google API is loaded
    setTimeout(initializeGoogleSignIn, 100);
  }, [login]);

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full"></div>
    </div>
  );
};

export default GoogleSignIn;