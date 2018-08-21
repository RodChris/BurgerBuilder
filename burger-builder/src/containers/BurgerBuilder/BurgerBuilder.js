import React, { Component } from 'react';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDINT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
      ingredients: null,
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: null
  };

  componentDidMount () {
      axios.get('https://react-my-burger-e06fd.firebaseio.com/ingredients.json')
            .then(response => {
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState({error: true})
        });
  }

  updatePurchaseState (ingredients) {
      const sum = Object.keys(ingredients)
          .map(igKey => {
              return ingredients[igKey];
          })
          .reduce((sum, el) => {
              return sum + el;
          }, 0);
      this.setState({purchasable: sum > 0});
  }

  addIngredientHandler = (type) => {
      const oldCount = this.state.ingredients[type]
      const updatedCount = oldCount + 1;
      const updatedIngredients = {
        ...this.state.ingredients
      };
      updatedIngredients[type] = updatedCount;
      const priceAddition = INGREDINT_PRICES[type];
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice + priceAddition;
      this.setState({
          totalPrice: newPrice,
          ingredients: updatedIngredients
      });
      this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDINT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
        totalPrice: newPrice,
        ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
      this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    // alert('Purchase complete! Enjoy your burger fatty!')
    // this.setState({loading: true});
    // const order = {
    //     ingredients: this.state.ingredients,
    //     price: this.state.totalPrice,
    //     customer: {
    //       name: 'Chris',
    //       address: {
    //          street: 'Seasame',
    //          zipCode: 15243,
    //          country: 'Russia'
    //       },
    //       phoneNumber: '201-5454'
    //     }
    //   }
    // axios.post('/orders.json', order)
    //       .then(response => {
    //           this.setState({loading: false, purchasing: false});
    //       })            
    //       .catch(error => {
    //           this.setState({loading: false, purchasing: false});
    //       })
    const queryParams = [];
    for (let i in this.state.ingredients) {
        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    const queryString = queryParams.join('&');
    this.props.history.push({
        pathname: '/checkout',
        search: '?' + queryString
    });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo ) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;        
    let burger = this.state.error ? <p>Whoops! Something went wrong bro!</p> : <Spinner />;

    if (this.state.ingredients) {
        burger =  (
            <Auxiliary>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo} 
                purchasable={this.state.purchasable}
                price={this.state.totalPrice}
                ordered={this.purchaseHandler} />
            </Auxiliary>
        )
        orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
    }   

    if (this.state.loading) {
        orderSummary = <Spinner />;
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

export default withErrorHandler(BurgerBuilder, axios);
