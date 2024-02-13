import React, { Profiler } from 'react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { GlobalStyle } from './style/GlobalStyle';
import theme from './style/theme';
import 'react-toastify/dist/ReactToastify.css';
import { BGMProvider } from './sounds/MusicContext';
import AppRouter from './route/AppRouter';

function App() {
  const onRender = (
    id: any,
    phase: any,
    actualDuration: any,
    baseDuration: any,
    startTime: any,
    commitTime: any,
    interactions: any,
  ) => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions,
    });
  };

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ToastContainer limit={1} position="top-center" theme="colored" />
        <BGMProvider>
          <Profiler id="App" onRender={onRender}>
            <AppRouter />
          </Profiler>
        </BGMProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
