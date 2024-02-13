import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import useSound from 'use-sound';
import drawBGM from '../assets/sound/background/cheeky_monkey_fun_app_playful_cheeky.mp3';
import stageBGM from '../assets/sound/background/African_fun_long.mp3';
import mainBGM from '../assets/sound/background/mr_clown.mp3';

const BGMContext = createContext<
  | {
      mainPlaying: boolean;
      stagePlaying: boolean;
      drawPlaying: boolean;
      isMuted: boolean;
      startBGM: (bgmType: 'main' | 'stage' | 'draw') => void;
      stopBGM: () => void;
      toggleMute: () => void; // 무음모드 토글 함수
    }
  | undefined
>(undefined);

export const BGMProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mainPlaying, setMainPlaying] = useState(false);
  const [stagePlaying, setStagePlaying] = useState(false);
  const [drawPlaying, setDrawPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playMain, { stop: stopMain }] = useSound(mainBGM, {
    volume: 0.4,
    loop: true,
  });
  const [playStage, { stop: stopStage }] = useSound(stageBGM, {
    volume: 0.4,
    loop: true,
  });
  const [playDraw, { stop: stopDraw }] = useSound(drawBGM, {
    volume: 0.4,
    loop: true,
  });

  const toggleMute = useCallback(() => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  }, []);

  const startBGM = useCallback(
    (bgmType: 'main' | 'stage' | 'draw') => {
      if (!isMuted) {
        if (bgmType === 'main') {
          if (!mainPlaying) {
            if (stagePlaying) {
              stopStage();
              setStagePlaying(false);
            }
            if (drawPlaying) {
              stopDraw();
              setDrawPlaying(false);
            }
            playMain();
            setMainPlaying(true);
          }
        } else if (bgmType === 'stage') {
          if (!stagePlaying) {
            if (mainPlaying) {
              stopMain();
              setMainPlaying(false);
            }
            if (drawPlaying) {
              stopDraw();
              setDrawPlaying(false);
            }
            playStage();
            setStagePlaying(true);
          }
        } else if (bgmType === 'draw') {
          if (!drawPlaying) {
            if (mainPlaying) {
              stopMain();
              setMainPlaying(false);
            }
            if (stagePlaying) {
              stopStage();
              setStagePlaying(false);
            }
            playDraw();
            setDrawPlaying(true);
          }
        }
      }
    },
    [isMuted, mainPlaying, stagePlaying, drawPlaying],
  );

  const stopBGM = useCallback(() => {
    if (mainPlaying) {
      stopMain();
      setMainPlaying(false);
    }
    if (stagePlaying) {
      stopStage();
      setStagePlaying(false);
    }
    if (drawPlaying) {
      stopDraw();
      setDrawPlaying(false);
    }
  }, [mainPlaying, stagePlaying, drawPlaying]);

  const value = useMemo(
    () => ({
      mainPlaying,
      stagePlaying,
      drawPlaying,
      isMuted,
      startBGM,
      stopBGM,
      toggleMute,
    }),
    [
      mainPlaying,
      stagePlaying,
      drawPlaying,
      isMuted,
      startBGM,
      stopBGM,
      toggleMute,
    ],
  );

  return <BGMContext.Provider value={value}>{children}</BGMContext.Provider>;
};

export const useBGM = () => {
  const context = useContext(BGMContext);
  if (context === undefined) {
    throw new Error('useBGM must be used within a BGMProvider');
  }
  return context;
};
