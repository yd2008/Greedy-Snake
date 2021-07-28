import './Food.css';
import { useState, useImperativeHandle } from 'react';
import { IPoint } from '../index';

interface IFoodProps {
  cRef: any;
}

const Food = ({ cRef }: IFoodProps) => {
  const randomInt = () => Math.floor(Math.random() * 30) * 10;

  const [point, setPoint] = useState<IPoint>({
    x: randomInt(),
    y: randomInt(),
  });

  const cannotSet = (snakePs: IPoint[], point: IPoint) => {
    for (let i = 0; i < snakePs.length; i++) {
      const body = snakePs[i];
      if (body.x === point.x && body.y === point.y) {
        return true;
      }
    }
    return false;
  };

  useImperativeHandle(cRef, () => ({
    setFood: (
      snakePs: IPoint[] = [
        { x: 20, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 0 },
      ],
    ) => {
      let { x, y } = snakePs[0];
      while (cannotSet(snakePs, { x, y })) {
        x = randomInt();
        y = randomInt();
      }
      setPoint({ x, y });
      return { x, y };
    },
  }));

  return (
    <div className="food" style={{ left: point.x, top: point.y }}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Food;
