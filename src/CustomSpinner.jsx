import React from 'react';
import { Spinner } from 'react-bootstrap';

function CustomSpinner() {
  return (
   <div className='spinner-container'>
   <Spinner animation="border" role="status" variant="danger">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
  );
}

export default CustomSpinner;
