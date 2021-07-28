import './index.css';
import { useEffect, useState } from 'react';
import ScorePanel from './components/ScorePanel';
import Snake from './components/Snake';
import Food from './components/Food';
import useKeyPress from '../utils/hooks/useKeyPress';
import { useRef } from 'react';

export interface IPoint {
  x: number;
  y: number;
}

const Stage = () => {
  const [isPause, setIsPause] = useState(false);
  const [tips, setTips] = useState('游戏中');
  const snakeRef = useRef<any>(null);
  const foodRef = useRef<any>(null);
  const scorePanelRef = useRef<any>(null);

  useKeyPress([32, 82], (e) => {
    switch (e.key) {
      case ' ':
        setIsPause(!isPause);
        break;
      case 'r':
        resetGame();
        break;
    } 
  });

  // 在这 setHeadPoint 会报错
  // Cannot update a component (`Stage`) while rendering a different component (`Snake`)
  const snakeEat = (snakePs: IPoint[]) => {
    setTimeout(() => {
      const foodP = foodRef.current.setFood(snakePs);
      snakeRef.current.refreshFoodP(foodP);
      scorePanelRef.current.addScore();
    }, 0);
  };

  const gameOver = (reason: string) => { 
    setTimeout(() => {
      setIsPause(true);
      setTips(`游戏结束： ${reason}`);
    }, 0);
  };

  const resetGame = () => {
    snakeRef.current.resetState();
    scorePanelRef.current.resetState();
    const foodP = foodRef.current.setFood();
    snakeRef.current.refreshFoodP(foodP);
    setIsPause(false);
    setTips(`游戏中`);
  }

  const speedUp = (speed: number) => {
    snakeRef.current.speedUp(speed);
  }

  useEffect(() => {
    const foodP = foodRef.current.setFood();
    snakeRef.current.refreshFoodP(foodP);
  }, []);

  return (
    <div>
      <div className="main">
        <div className="controlInfo">暂停：空格  重开：r 支持连按加速</div>
        <div className="tips">{tips}</div>
        <div className="stage">
          <Snake
            cRef={snakeRef}
            isPause={isPause}
            gameOver={gameOver}
            snakeEat={snakeEat}
          />
          <Food cRef={foodRef} />
        </div>
        <ScorePanel cRef={scorePanelRef} speedUp={speedUp} />
      </div>
    </div>
  );
};

export default Stage;
 