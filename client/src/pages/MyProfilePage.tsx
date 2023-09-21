import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import theme from '../style/theme';
import { UserProfileState } from '../recoil/profile/atom';
import AlarmBoard from '../components/atoms/AlarmBoard';
import AlarmPageButton from '../components/organisms/AlarmPageButton';
import ExitBox from '../components/organisms/ExitBox';
import ExitBoxOnBlur from '../components/organisms/ExitBoxOnBlur';
import Button from '../components/atoms/Button';
import UserRupee from '../components/atoms/UserRupee';
import DeleteText from '../components/atoms/DeleteText';
import BlurBox from '../components/atoms/BlurBox';
import NameChangeModal from '../components/organisms/NameChangeModal';
import ConfirmModal from '../components/organisms/ConfirmModal';
import { deleteProfile, newNickname } from '../api/profiles';
import { logoutUser } from '../api/user';
import { getAlarms } from '../api/alarm';

const sampleData = [
  {
    id: 1,
    content: '수신한 알림이 없습니다.',
    createdAt: '2023-09-21',
  },
];
const MyProfileContainer = styled.div`
  width: 100vw;
  height: 100vh; /* 화면 높이만큼 컨테이너 높이 설정 */
  display: flex;
`;
const LeftContainer = styled.div`
  width: 50vw;
  height: 100vh; /* 화면 높이만큼 컨테이너 높이 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: ${theme.hamsterColors.sky};
`;
const RightContainer = styled.div`
  width: 50vw;
  height: 100vh; /* 화면 높이만큼 컨테이너 높이 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CenteredAlarmBoard = styled.div`
  align-items: center;
  justify-content: center;
  position: relative;
  height: 520px;
  margin-top: 22px;
`;
const CenteredProfileBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 120px;
`;

const ExitBoxWrapper = styled.div`
  position: fixed;
  top: 3%;
  left: 0%;
`;

const CharacterImage = styled.div<{ imgsrc: string }>`
  width: 300px;
  height: 300px;
  background-image: url(${(props) => props.imgsrc});
  background-size: cover;
  background-position: center;
`;

const NicknameText = styled.span`
  display: flex;
  justify-content: center;
  font-family: 'TmoneyRoundWindExtraBold';
  font-size: 55px;
  align-items: center;
  color: ${(props) => props.theme.colors.mainBlack};
`;

const ExitBoxOnBlurWrapper = styled.div`
  position: fixed;
  top: 3%;
  left: 0%;
  z-index: 300;
`;

const WhiteModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 300;
  transform: translate(-50%, -50%);
`;

function MyProfilePage() {
  // 프로필 관리
  const [userProfile, setUserProfile] = useRecoilState(UserProfileState);
  // 출력 관리 state
  const [changeName, setChangeName] = useState<boolean>(false);
  const [textInputValue, setTextInputValue] = useState<string>('');
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState<boolean>(false);
  // 알림 state
  const [currentPage, setCurrentPage] = useState(0);
  const [alarms, setAlarms] = useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData(profileId: number) {
      try {
        const response = await getAlarms(profileId, currentPage);
        const loadedData = { ...response.content };
        await setAlarms(loadedData);
        console.log(loadedData);
      } catch (error) {
        console.log(error);
      }
    }
    loadData(userProfile.profileId);
  }, [currentPage]);
  const isFirstPage = currentPage === 0;
  const isLastPage = alarms.pageInfo
    ? currentPage === alarms.pageInfo.totalPages - 1
    : false;
  const leftDisabled = isFirstPage;
  const rightDisabled = isLastPage;
  const leftOnClick = () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
  };

  const rightOnClick = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };
  const handleChangeName = () => {
    setChangeName(true);
  };
  const handleChangeChar = () => {
    navigate('/profile/character');
  };
  const handleMyPicture = () => {
    navigate('/profile/drawings');
  };

  const resetUserRecoil = useResetRecoilState(UserProfileState);

  const handleLogout = () => {
    resetUserRecoil();
    localStorage.removeItem('accessToken');
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_KAUTH_ID}&logout_redirect_uri=${process.env.REACT_APP_API_URL}/logout`;
  };

  const handleDeleteProfile = (profileId: number) => {
    deleteProfile(profileId);
    navigate('/login');
  };

  const handleNewName = async (profileId: number, inputText: string) => {
    try {
      const response = await newNickname(profileId, inputText);
      alert('닉네임이 성공적으로 변경되었습니다');
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        nickname: inputText,
      }));
      setTextInputValue('');
      setChangeName(false);
    } catch (error) {
      alert('닉네임 변경에 실패했습니다. 다른 닉네임으로 시도해주세요');
    }
  };

  return (
    <MyProfileContainer>
      {changeName && (
        <>
          <BlurBox />
          <ExitBoxOnBlurWrapper>
            <ExitBoxOnBlur
              color="light"
              onClick={() => {
                setChangeName(false);
              }}
            />
          </ExitBoxOnBlurWrapper>
          <WhiteModalWrapper>
            <NameChangeModal
              title="이름을 지어주세요!"
              inputValue={textInputValue}
              onTextInputChange={setTextInputValue}
              onClick={() =>
                handleNewName(userProfile.profileId, textInputValue)
              }
            />
          </WhiteModalWrapper>
        </>
      )}
      {isDelete && (
        <>
          <BlurBox />
          <WhiteModalWrapper>
            <ConfirmModal
              title={`${userProfile.nickname} 프로필을 삭제할까요?`}
              noCheck={() => setIsDelete(false)}
              okCheck={() => {
                handleDeleteProfile(userProfile.profileId);
              }}
            />
          </WhiteModalWrapper>
        </>
      )}
      {isLogout && (
        <>
          <BlurBox />
          <WhiteModalWrapper>
            <ConfirmModal
              title="정말로 로그아웃 할까요?"
              noCheck={() => setIsLogout(false)}
              okCheck={() => {
                handleLogout();
              }}
            />
          </WhiteModalWrapper>
        </>
      )}
      <LeftContainer>
        <ExitBoxWrapper>
          <ExitBox color="dark" />
        </ExitBoxWrapper>
        <UserRupee />
        {userProfile.profileImg && (
          <CenteredProfileBoard>
            <NicknameText>{userProfile.nickname}</NicknameText>
            <CharacterImage imgsrc={userProfile.profileImg} />
            <Button
              buttonText="      캐릭터 변경      "
              color="skyblue"
              onClick={handleChangeChar}
            />
            <Button
              buttonText="      닉네임 변경      "
              color="skyblue"
              onClick={handleChangeName}
            />
          </CenteredProfileBoard>
        )}
        <DeleteText
          onClick={() => {
            setIsDelete(true);
          }}
          content="프로필 삭제하기"
        />
      </LeftContainer>
      <RightContainer>
        <CenteredAlarmBoard>
          {alarms.data && alarms.data.length > 0 ? (
            <AlarmBoard alarms={alarms.data} />
          ) : (
            <AlarmBoard alarms={sampleData} />
          )}
          {/* <AlarmBoard alarms={sampleData} /> */}
          <AlarmPageButton
            leftOnClick={leftOnClick}
            rightOnClick={rightOnClick}
            leftDisabled={leftDisabled}
            rightDisabled={rightDisabled}
          />
        </CenteredAlarmBoard>
        <Button
          buttonText="       내 그림 보러가기       "
          color="blue"
          onClick={handleMyPicture}
        />
        <Button
          buttonText="             로그아웃             "
          color="darkGray"
          onClick={() => setIsLogout(true)}
        />
      </RightContainer>
    </MyProfileContainer>
  );
}

export default MyProfilePage;
