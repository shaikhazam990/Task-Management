import { Provider } from 'react-redux';
import { store } from '../store';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../context/ThemeContext';
import { CMDProvider } from '../context/CMDContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CMDProvider>
          <Component {...pageProps} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(18,18,31,0.95)',
                color: '#e0e0ff',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'Instrument Sans, sans-serif',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#0d0d1a' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0d0d1a' } },
            }}
          />
        </CMDProvider>
      </ThemeProvider>
    </Provider>
  );
}
