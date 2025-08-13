import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CleanSlate v3</title>
        
        {/* Acestea rezolvă problema favicon */}
        <link rel="icon" type="image/png" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
      </Head>
      <Component {...pageProps} />
    </>
  );
}
