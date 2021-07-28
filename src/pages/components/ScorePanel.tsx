/* eslint-disable react-hooks/exhaustive-deps */
import './ScorePanel.css';
import { useState, useEffect, useImperativeHandle } from 'react';

interface IScorePanelPorps {
  cRef: any
  speedUp: Function
}

const ScorePanel = ({ cRef, speedUp }: IScorePanelPorps) => {
  
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useImperativeHandle(cRef, () => ({
    resetState: () => {
      setScore(0)
      setLevel(1)
    },
    addScore: () => {
      setScore(score+1)
    },
  }));

  useEffect(() => {
    if (score % 10 === 0) {
      setLevel(parseInt(`${(score+10)/10}`))
      const speed = 300 - (level - 1) * 30
      speedUp(speed)
    }
  }, [score])

  return (
    <div className='scorePanel'>
      <div>
        SCORE:<span className='score'>{score}</span>
      </div>
      <div>
        LEVEL:<span className='level'>{level}</span>
      </div>
    </div>
  );
};

export default ScorePanel