import './SnakeBody.css';
import { IPoint } from '../index';

export interface ISnakeBodyProps extends IPoint {
  isHead?: boolean;
}

const SnakeBody = ({ x, y, isHead = false }: ISnakeBodyProps) => {
  return (
    <div
      className={isHead ? 'head' : ''}
      style={{ left: x, top: y }}
    />
  );
};

export default SnakeBody
