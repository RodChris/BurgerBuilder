import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input'

import axios from '../../../axios-orders';

import classes from './ContactData.css'

 class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode:''
        }
    }

    orderHandler = (event) => {
        event.preventDefault();

        this.setState({loading: true});

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Chris',
                address: {
                    street: 'Seasame',
                    zipCode: 15243,
                    country: 'Russia'
                    },
                phoneNumber: '201-5454'
                },
            loading: false
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState( {loading: false} );
                this.props.history.push('/');
            })            
            .catch(error => {
                this.setState( {loading: false} );
            })
        }

    render() {
        let form = (
            <form>
                    <Input inputtype='input' type="text" name="name" placeHolder="Your Name"/>
                    <Input inputtype='input' type="email" name="email" placeHolder="Your Email"/>
                    <Input inputtype='input' type="text" name="address" placeHolder="Your Address"/>   
                    <Button btnType='Success' clicked={this.orderHandler}>Order</Button>                
                </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;
