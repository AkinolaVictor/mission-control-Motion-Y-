import "@/styles/globals.css";
import StoreProvider from '../components/StoreProvider';

export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}
