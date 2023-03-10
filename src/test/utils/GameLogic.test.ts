import { Choice, findWinner, randomChoice } from '../../client/utils/GameLogic';

describe('Game Logic Random Choice Tests', () => {
  test('should return random choice as Rock', () => {
    jest.spyOn(Math, 'floor').mockReturnValue(0);
    expect(randomChoice()).toBe('Rock');
  });

  test('should return random choice as Paper', () => {
    jest.spyOn(Math, 'floor').mockReturnValue(1);
    expect(randomChoice()).toBe('Paper');
  });

  test('should return random choice as Scissors', () => {
    jest.spyOn(Math, 'floor').mockReturnValue(2);
    expect(randomChoice()).toBe('Scissors');
  });

  test('should return random choice as default Rock', () => {
    jest.spyOn(Math, 'floor').mockReturnValue(3);
    expect(randomChoice()).toBe('Rock');
  });
});

describe('Game Logic Find Winner Tests', () => {
  let player1Choice: Choice = 'Paper',
    player2Choice: Choice = 'Paper';

  test('should return findWinner as TIE', () => {
    player1Choice = 'Paper';
    player2Choice = 'Paper';
    expect(findWinner(player1Choice, player2Choice)).toBe('TIE');
  });

  test('should return findWinner as WIN', () => {
    player1Choice = 'Paper';
    player2Choice = 'Rock';
    expect(findWinner(player1Choice, player2Choice)).toBe('WIN');
  });

  test('should return findWinner as LOOSE', () => {
    player1Choice = 'Scissors';
    player2Choice = 'Rock';
    expect(findWinner(player1Choice, player2Choice)).toBe('LOOSE');
  });
});
