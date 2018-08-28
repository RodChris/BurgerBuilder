import React from 'react'

import classes from './Order.css'

const order = (props) => {
    return (
        <div className={classes.order}>
            <p>Ingredients: </p>
            <p>Price: <strong></strong></p>
        </div>
    );
}

export default order;
