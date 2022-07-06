import { ButtonStyled } from './styles';

export const Button = props => {
  const { text, onClick } = props;

  return <ButtonStyled onClick={onClick}>{text}</ButtonStyled>;
};
