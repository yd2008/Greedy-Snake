/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useImperativeHandle } from 'react';
import './Snake.css';
import { IPoint } from '../index';
import useKeyPress from '../../utils/hooks/useKeyPress';
import SnakeBody, { ISnakeBodyProps } from './SnakeBody';

const defaultSnakeBody: ISnakeBodyProps[] = [
  { x: 20, y: 0 },
  { x: 10, y: 0 },
  { x: 0, y: 0 },
];

interface ISnakeProps {
  isPause: boolean;
  snakeEat: Function;
  gameOver: Function;
  cRef: any;
}

const Snake = ({ isPause, snakeEat, gameOver, cRef }: ISnakeProps) => {
  const [bodyPoints, setBodyPoints] =
    useState<ISnakeBodyProps[]>(defaultSnakeBody);
  const [speed, setSpeed] = useState(350);
  const [resetTimer, setResetTimer] = useState(true);
  const intervalRef = useRef<NodeJS.Timer>();
  const directionRef = useRef<'u' | 'd' | 'l' | 'r'>('r');
  const foodPRef = useRef<IPoint>({ x: -999, y: -999 });

  useImperativeHandle(cRef, () => ({
    resetState: () => {
      directionRef.current = 'r';
      setSpeed(350);
      setBodyPoints(defaultSnakeBody);
    },
    refreshFoodP: (foodP: IPoint) => {
      foodPRef.current = foodP;
    },
    speedUp: (speed: number) => {
      setSpeed(speed);
    },
  }));

  useKeyPress([37, 38, 39, 40], (e) => {
    setResetTimer(!resetTimer)
    switch (e.key) {
      case 'ArrowUp':
        moveUp(true);
        break;
      case 'ArrowDown':
        moveDown(true);
        break;
      case 'ArrowLeft':
        moveLeft(true);
        break;
      case 'ArrowRight':
        moveRight(true);
        break;
    }
  });

  const run = () => {
    switch (directionRef.current) {
      case 'u':
        moveUp();
        break;
      case 'd':
        moveDown();
        break;
      case 'l':
        moveLeft();
        break;
      case 'r':
        moveRight();
        break;
    }
  };

  // 检查判断状态
  const stateCheck = (bodyPs: IPoint[] = []) => {
    if (bodyPs.length === 0) return true;
    const { x, y } = bodyPs[0];
    if (x > 290 || y > 290|| x < 0 || y < 0) {
      gameOver('撞墙了啦');
      return true;
    }
    for (let i = 1; i < bodyPs.length; i++) {
      const body = bodyPs[i];
      if (x === body.x && y === body.y) {
        gameOver('吃到自己啦');
        return true;
      }
    }
    return false;
  };

  // 是否吃到果实
  const isEat = ({ x, y }: IPoint) => {
    if (x === foodPRef.current.x && y === foodPRef.current.y) {
      return true;
    } else {
      return false;
    }
  };

  const moveUp = (isUser: boolean = false) => {
    if (directionRef.current === 'd' && isUser === true) return;
    setBodyPoints((prevPoints) => {
      const newPoints = prevPoints.map((p, idx) => {
        if (idx === 0) return { ...p, y: p.y - 10 };
        return { ...prevPoints[idx - 1] };
      });
      return handleNewPoints(prevPoints, newPoints);
    });
    directionRef.current = 'u';
  };

  const moveDown = (isUser: boolean = false) => {
    if (directionRef.current === 'u' && isUser === true) return;
    setBodyPoints((prevPoints) => {
      const newPoints = prevPoints.map((p, idx) => {
        if (idx === 0) return { ...p, y: p.y + 10 };
        return { ...prevPoints[idx - 1] };
      });
      return handleNewPoints(prevPoints, newPoints);
    });
    directionRef.current = 'd';
  };

  const moveLeft = (isUser: boolean = false) => {
    if (directionRef.current === 'r' && isUser === true) return;
    setBodyPoints((prevPoints) => {
      const newPoints = prevPoints.map((p, idx) => {
        if (idx === 0) return { ...p, x: p.x - 10 };
        return { ...prevPoints[idx - 1] };
      });
      return handleNewPoints(prevPoints, newPoints);
    });
    directionRef.current = 'l';
  };

  const moveRight = (isUser: boolean = false) => {
    if (directionRef.current === 'l' && isUser === true) return;
    setBodyPoints((prevPoints) => {
      const newPoints = prevPoints.map((p, idx) => {
        if (idx === 0) return { ...p, x: p.x + 10 };
        return { ...prevPoints[idx - 1] };
      });
      return handleNewPoints(prevPoints, newPoints);
    });
    directionRef.current = 'r';
  };

  const handleNewPoints = (prevPoints: IPoint[], newPoints: IPoint[]) => {
    if (stateCheck(newPoints)) {
      return prevPoints;
    } else {
      if (isEat(newPoints[0])) {
        newPoints.push(prevPoints[prevPoints.length - 1]);
        snakeEat(newPoints);
      }
      return [...newPoints];
    }
  };

  useEffect(() => {
    if (isPause) return;
    const id = setInterval(run, speed);
    intervalRef.current = id;
    return () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
    };
  }, [isPause, speed, resetTimer]);

  return (
    <div className='snake'>
      {bodyPoints.map((p, idx) => {
        return (
          <SnakeBody
            isHead={idx === 0 ? true : false}
            key={idx}
            x={p.x}
            y={p.y}
          />
        );
      })}
    </div>
  );
};

export default Snake;
