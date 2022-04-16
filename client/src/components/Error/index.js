import React from 'react';
import PropTypes from 'prop-types';

function Error({ children }) {
  return (
    <div className="absolute top-20 w-full grid place-items-center" data-testid="error">
      <div className="w-fit px-8 py-2 bg-gray-800 text-white text-center">
        {children}
      </div>
    </div>
  );
}

Error.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Error;
