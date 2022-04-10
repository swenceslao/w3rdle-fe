import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import { Fade } from '@mui/material';
import '../../App.css';

function Modal({
  title, open, setClose, children,
}) {
  return (
    <Fade in={open}>
      <div className="absolute w-full h-full grid place-cente">
        <div
          className="z-10 flex place-self-center flex-col rounded-xl bg-white p-5 pb-10 drop-shadow-3xl dark:bg-zinc-800 dark:text-white"
          style={{ width: 'min(600px, 90vw)', height: 'min(580px, 80vh)' }}
        >
          <div className="flex justify-between items-center pb-5">
            <CloseIcon className="text-white dark:text-zinc-800" />
            <h2 className="font-black text-2xl">{title}</h2>
            <CloseIcon
              onClick={setClose}
              sx={{ cursor: 'pointer' }}
            />
          </div>
          <div className="modal overscroll-contain overflow-y-scroll sm:px-7">
            {children}
          </div>
        </div>
        <div
          className="bg-neutral-200 dark:bg-gray-700 opacity-80 z-0 absolute w-full h-full grid place-center"
          onClick={setClose}
          role="none"
        />
      </div>
    </Fade>
  );
}

Modal.defaultProps = {
  setClose: () => {},
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setClose: PropTypes.func,
  children: PropTypes.instanceOf(Object).isRequired,
};

export default Modal;
