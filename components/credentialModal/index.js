import { Wrapper } from './styles';
import { Portal } from '../portal';
import { Button } from '../button';

export const CredentialModal = props => {
  const {
    title,
    description,
    buttonText,
    onClick,
    onClose,
    isButtonLoading = false,
  } = props;

  return (
    <Portal>
      <Wrapper>
        <div className="background"></div>
        <div className="credential-modal">
          <div className="credential-modal-close" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
            >
              <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
            </svg>
          </div>
          <div className="credential-modal-content">
            <p className="credential-modal-title">{title}</p>
            <p className="credential-modal-description">{description}</p>
            <div className="credential-modal-button">
              <Button
                onClick={onClick}
                text={buttonText}
                isLoading={isButtonLoading}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    </Portal>
  );
};
