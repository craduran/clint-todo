import '../styles/globals.css'
import 'antd/dist/antd.css';
import type { AppProps } from 'next/app'
import store from './../app/store'
import { Provider } from 'react-redux'

import firebase from "../firebase/initFirebase";
import { SSRProvider } from '@react-aria/ssr';
firebase();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (

    <Provider store={store}>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </Provider>
  )
}
