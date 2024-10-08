import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import React from 'react';
import { jwtDecode } from 'jwt-decode';

// TODO: impl POC for web auth
// import {
//   GoogleLogin,
//   useGoogleLogin,
//   googleLogout,
//   useGoogleOAuth,
// } from '@react-oauth/google';
const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!;
const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

const Home: NextPage = () => {
  // TODO: impl POC for web auth
  // const login = useGoogleLogin({
  //   onSuccess: (tokenResponse) => console.log(tokenResponse),
  //   onError: (errorResponse) => console.log(errorResponse),
  //   onNonOAuthError: (nonOAuthError) => console.log(nonOAuthError),
  // });
  const router = useRouter();
  const [oneTimeCode, setOneTimeCode] = React.useState<string | null>(null);
  const [idToken, setIdToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const regex = /code=([^&]*)/;
    const urlParams = window.location.href.match(regex);
    if (!urlParams?.length || urlParams.length < 1) return;
    const oneTimeCode = urlParams[1];
    console.log(oneTimeCode);
    setOneTimeCode(() => decodeURIComponent(oneTimeCode));
  }, []);

  const sendPostRequest = async (code: string) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    return data;
  };
  if (!client_id || !client_secret || !redirect_uri) {
    return (
      <div>
        <h1>Missing env variables</h1>
        <p>
          Please make sure you have the following environment variables in your
          .env file
        </p>
        <ul>
          {!client_id ? <li>NEXT_PUBLIC_GOOGLE_CLIENT_ID</li> : null}
          {!client_secret ? <li>NEXT_PUBLIC_GOOGLE_CLIENT_SECRET</li> : null}
          {!redirect_uri ? <li>NEXT_PUBLIC_GOOGLE_REDIRECT_URI</li> : null}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* USE AUTH API */}

        <div>
          {!oneTimeCode ? (
            <button
              onClick={async () => {
                window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email%20profile&access_type=offline`;
              }}
            >
              Login with Google
            </button>
          ) : null}
          <br />
          {oneTimeCode && !idToken ? (
            <button
              onClick={async () => {
                const result = await sendPostRequest(oneTimeCode);
                console.log(result);
                setIdToken(() => result.id_token);
                router.push('/');
              }}
            >
              Get ID token (JWT)
            </button>
          ) : null}
          {idToken ? (
            <div>
              <h1>ID token (JWT)</h1>
              <p
                style={{
                  width: '100%',
                  wordBreak: 'break-all',
                  whiteSpace: 'normal',
                }}
              >
                {idToken}
              </p>
              <h1>Decoded data</h1>
              <p
                style={{
                  width: '100%',
                  wordBreak: 'break-all',
                  whiteSpace: 'normal',
                }}
              >
                {Object.entries(jwtDecode(idToken)).map(([key, value]) => {
                  return (
                    <div key={key}>
                      <b>{key}</b>: {value}
                    </div>
                  );
                })}
              </p>
              <button
                onClick={() => {
                  setIdToken(null);
                  setOneTimeCode(null);
                }}
              >
                Restart
              </button>
            </div>
          ) : null}

          {/* USE SDK */}
          {/* <h1>Out of the box button</h1>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
          <h1>Custom button</h1>
          <button onClick={() => login()}>Login with custom button</button>
          <h1>Logout</h1>
          <button
            onClick={() => {
              console.log(1, 'logout');
              googleLogout();
              console.log(2, 'logout');
            }}
          >
            Logout
          </button> */}
        </div>
      </main>
    </div>
  );
};

export default Home;
