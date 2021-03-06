import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {
  state = {           
      purchasing: false,
  };

  componentDidMount () {
      this.props.onInitIngredients();
  }

  updatePurchaseState (ingredients) {
      const sum = Object.keys(ingredients)
          .map(igKey => {
              return ingredients[igKey];
          })
          .reduce((sum, el) => {
              return sum + el;
          }, 0);
      return sum > 0;
  }

  purchaseHandler = () => {
      this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo ) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;        
    let burger = this.props.error ? <p>Whoops! Something went wrong bro!</p> : <Spinner />;

    if ( this.props.ings ) {
        burger =  (
            <Auxiliary>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                    ingredientAdded={this.props.onIgredientAdded}
                    ingredientRemoved={this.props.onIgredientRemoved}
                    disabled={disabledInfo} 
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    price={this.props.price}
                    ordered={this.purchaseHandler} />
            </Auxiliary>
        )
        orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
    }   

    return (
      <Auxiliary>
          <Modal show={this.state.purchasing}
                 modalClosed={this.purchaseCancelHandler}>
                 {orderSummary}
          </Modal>     
          {burger}    
      </Auxiliary>
    );
  }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIgredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)), 
        onIgredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
