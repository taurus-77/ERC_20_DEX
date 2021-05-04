import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log('MyApp');
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
