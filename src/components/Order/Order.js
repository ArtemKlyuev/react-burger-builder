import React from 'react';
import classes from './Order.module.css';
const order = props => {
    const ingredients = [];

    Object.keys(props.ingredients).forEach(ingredient => {
        ingredients.push({
            name: ingredient,
            amount: props.ingredients[ingredient],
            key: ingredient
        });
    });

    const ingredientOutput = ingredients.map(ig => (
        <span style={{textTransform: 'capitalize', display: 'inline-block', margin: '0 8px', border: '1px solid gray', padding: '5px' }} key={ig.key}>
            {ig.name} ({ig.amount})
        </span>
    ));
    return (
        <div className={classes.Order}>
            <p>Ingredients {ingredientOutput}</p>
            <p>
                Price:{' '}
                <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong>{' '}
                (1)
            </p>
        </div>
    );
};

export default order;
