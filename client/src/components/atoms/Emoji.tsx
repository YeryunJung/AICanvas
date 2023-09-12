import React from 'react';
import styled from 'styled-components';
import SmileIcon from '../../assets/image/etc/smile.png';
import WowIcon from '../../assets/image/etc/wow.png';
import CryIcon from '../../assets/image/etc/cry.png';

interface EmojiProps {
  emotion: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const EmojiWrapper = styled.div`
  display: inline-block;
  cursor: pointer;
  z-index: 300;
  margin-right: 3px;
`;

const Emoji = ({ emotion, onClick }: EmojiProps) => {
  let EmotionIcon: string;

  switch (emotion) {
    case 'smile':
      EmotionIcon = SmileIcon;
      break;
    case 'wow':
      EmotionIcon = WowIcon;
      break;
    case 'cry':
      EmotionIcon = CryIcon;
      break;
    default:
      EmotionIcon = SmileIcon;
  }

  return (
    <EmojiWrapper onClick={onClick}>
      <img src={EmotionIcon} alt={emotion} width="75px" height="75px" />
    </EmojiWrapper>
  );
};

export default Emoji;
