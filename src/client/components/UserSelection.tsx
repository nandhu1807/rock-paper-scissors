import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Body,
  ComputerButton,
  Container,
  Flex,
  Heading,
  IconDiv,
  IconImage,
  InfoPlayer1,
  ResetButton,
  Winner,
  WinnerContainer,
  WinnerFlex,
} from '../styles/UserSelection.Styles';
import Score from './Score';
import Rock from '../images/icon-rock.svg';
import Paper from '../images/icon-paper.svg';
import Scissors from '../images/icon-scissors.svg';
import actionTypes from '../utils/actionTypes';
import { Choice, findWinner, Outcome, randomChoice } from '../utils/GameLogic';
import { RootState } from '../utils/store';
import { GetAllValuesFromStorage } from '../utils/types';

interface GameState {
  player1Choice: 'Rock' | 'Paper' | 'Scissors' | null;
  player2Choice: 'Rock' | 'Paper' | 'Scissors' | null;
  player1Name: string;
  player2Name: string;
  score1: number;
  score2: number;
  winner: string | null;
}

interface Options {
  Rock: Display;
  Paper: Display;
  Scissors: Display;
}

type Display = {
  icon: string;
};

function UserSelection(props: { selectedMode: string }) {
  const dispatch = useDispatch();

  const [gameState, setGameState] = useState<GameState>({
    player1Choice: null,
    player2Choice: null,
    player1Name: '',
    player2Name: '',
    score1: 0,
    score2: 0,
    winner: null,
  });

  const getValuesFromLocalStorage: GetAllValuesFromStorage = useSelector(
    (state: RootState) => state.getFromStorageReducer.mapFromStorage,
  );

  useEffect(() => {
    dispatch({
      type: actionTypes.GET_ALL_VALUES_FROM_STORAGE,
    });
  }, [props.selectedMode]);

  useEffect(() => {
    if (getValuesFromLocalStorage !== null) {
      setGameState((prevState) => ({
        ...prevState,
        score1: getValuesFromLocalStorage.score1,
        score2: getValuesFromLocalStorage.score2,
      }));
    }
  }, [getValuesFromLocalStorage]);

  useEffect(() => {
    let play1Name = '',
      play2Name = '';
    if (props.selectedMode === 'P VS P') {
      play1Name = 'PLAYER 1';
      play2Name = 'PLAYER 2';
    } else if (props.selectedMode === 'P VS C') {
      play1Name = 'YOU';
      play2Name = 'COMPUTER';
    } else {
      play1Name = 'COMPUTER 1';
      play2Name = 'COMPUTER 2';
    }

    setGameState({
      player1Choice: null,
      player2Choice: null,
      player1Name: play1Name,
      player2Name: play2Name,
      score1: 0,
      score2: 0,
      winner: null,
    });
  }, [props.selectedMode]);

  useEffect(() => {
    if (gameState.player1Choice !== null && gameState.player2Choice !== null) {
      const winner: Outcome = findWinner(gameState.player1Choice, gameState.player2Choice);
      const winnerName: string =
        winner === 'WIN'
          ? `${gameState.player1Name} WIN`
          : winner === 'LOOSE'
          ? `${gameState.player2Name} WIN`
          : 'TIE';
      setGameState({ ...gameState, winner: winnerName });
      handleScore(winner);
    }
  }, [gameState.player1Choice, gameState.player2Choice]);

  function handleUserChoice(choice: any): void {
    let computerChoice: Choice;
    if (props.selectedMode === 'P VS C') {
      computerChoice = randomChoice();
      setGameState((prevState) => ({
        ...prevState,
        player1Choice: choice,
        player2Choice: computerChoice,
      }));
    } else {
      if (gameState.player1Choice !== null) {
        setGameState((prevState) => ({ ...prevState, player2Choice: choice }));
      } else {
        setGameState((prevState) => ({ ...prevState, player1Choice: choice }));
      }
    }
  }

  function handlePlayForComputer(): void {
    const computer1Choice = randomChoice();
    const computer2Choice = randomChoice();
    setGameState({ ...gameState, player1Choice: computer1Choice, player2Choice: computer2Choice });
  }

  function handleScore(result: Outcome): void {
    switch (result) {
      case 'WIN':
        dispatch({
          type: actionTypes.SAVE_ALL_VALUES_IN_STORAGE,
          payload: {
            score1: gameState.score1 + 1,
            score2: gameState.score2 - 1,
          },
        });
        setGameState((prevState) => ({
          ...prevState,
          score1: prevState.score1 + 1,
          score2: prevState.score2 - 1,
        }));
        break;
      case 'LOOSE':
        dispatch({
          type: actionTypes.SAVE_ALL_VALUES_IN_STORAGE,
          payload: {
            score1: gameState.score1 - 1,
            score2: gameState.score2 + 1,
          },
        });
        setGameState((prevState) => ({
          ...prevState,
          score1: prevState.score1 - 1,
          score2: prevState.score2 + 1,
        }));
        break;
      case 'TIE':
      default:
        break;
    }
  }

  function handlePlayAgain(): void {
    setGameState({ ...gameState, player1Choice: null, player2Choice: null, winner: null });
  }

  const displayElements: Options = {
    Rock: {
      icon: Rock,
    },
    Paper: {
      icon: Paper,
    },
    Scissors: {
      icon: Scissors,
    },
  };

  return (
    <>
      <Score gameState={gameState} selectedMode={props.selectedMode} />
      <Body className={'user-selection-body'}>
        {props.selectedMode === 'P VS C' && !gameState.winner && (
          <InfoPlayer1>PLEASE CHOOSE ANY ONE TO START PLAY</InfoPlayer1>
        )}
        {props.selectedMode === 'P VS P' &&
          !gameState.winner &&
          gameState.player1Choice === null && (
            <InfoPlayer1>PLEASE CHOOSE ANY ONE FOR {gameState.player1Name}</InfoPlayer1>
          )}
        {props.selectedMode === 'P VS P' &&
          !gameState.winner &&
          gameState.player1Choice !== null && (
            <InfoPlayer1>PLEASE CHOOSE ANY ONE FOR {gameState.player2Name}</InfoPlayer1>
          )}
        {props.selectedMode !== 'C VS C' &&
          !gameState.winner &&
          Object.entries(displayElements).map(([key, value], index) => {
            return (
              <IconDiv
                key={index}
                className={`user-selection-icon-div user-selection-icon-div-${index}`}
              >
                <IconImage
                  className={`user-selection-icon-image-${index}`}
                  src={value.icon}
                  alt={`Play ${value.icon}`}
                  onClick={() => handleUserChoice(key)}
                />
              </IconDiv>
            );
          })}
        {props.selectedMode === 'C VS C' && !gameState.winner && (
          <ComputerButton
            className={'user-selection-play-computer-button'}
            onClick={() => handlePlayForComputer()}
          >
            PLAY FOR COMPUTER
          </ComputerButton>
        )}
        <Flex className={'user-selection-picked-flex'}>
          {gameState.player1Choice && (
            <Container className={'user-selection-player1-container'}>
              <Heading
                className={'user-selection-player1-heading'}
              >{`${gameState.player1Name} PICKED`}</Heading>
              <img
                className={'user-selection-player1-img'}
                src={displayElements[gameState.player1Choice]['icon']}
                alt={`Play ${gameState.player1Choice}`}
              />
            </Container>
          )}
          {gameState.player2Choice && (
            <Container className={'user-selection-player2-container'}>
              <Heading
                className={'user-selection-player2-heading'}
              >{`${gameState.player2Name} PICKED`}</Heading>
              <img
                className={'user-selection-player2-img'}
                src={displayElements[gameState.player2Choice]['icon']}
                alt={`Play ${gameState.player1Choice}`}
              />
            </Container>
          )}
        </Flex>
        {gameState.winner && (
          <WinnerFlex className={'user-selection-winner-flex'}>
            <WinnerContainer className={'user-selection-winner-container'}>
              <Winner className={'user-selection-winner-name'}>{gameState.winner}</Winner>
              <ResetButton className={'user-selection-reset-button'} onClick={handlePlayAgain}>
                PLAY AGAIN
              </ResetButton>
            </WinnerContainer>
          </WinnerFlex>
        )}
      </Body>
    </>
  );
}

UserSelection.propTypes = {
  selectedMode: PropTypes.string,
};

export default UserSelection;
