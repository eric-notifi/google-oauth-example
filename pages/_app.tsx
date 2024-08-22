// import { GoogleOAuthProvider } from '@react-oauth/google';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // TODO: impl POC for web auth
    // <GoogleOAuthProvider clientId="tbd">
    <Component {...pageProps} />
    // </GoogleOAuthProvider>
  );
}

export default MyApp;
