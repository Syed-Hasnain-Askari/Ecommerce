import React,{useState} from 'react'
import './home.css'
import Footer from './Footer'
import CheckoutForm from './CheckoutForm'
import {useSelector} from 'react-redux'
import axios from 'axios';
import key from './Config/dev';
import { loadStripe } from '@stripe/stripe-js';
import {Elements,useStripe,useElements,CardElement} from '@stripe/react-stripe-js';
function Checkout(props) {
    //Redrive Products Items from Cart reducer
    const state = useSelector(state => state.cart)
    const {cartItems} = state
    Object.values(cartItems).map(x=>(
      console.log(x.name)
    ))
    //Set Payment CartElement
    const [isProcessing, setIsProcessing] = useState(false)
    const [checkoutErrorMsg, setCheckoutErrorMsg] = useState("")
    const [buttonMsg, setButtonMsg] = useState("Pay")
    //Caculate the Total price to show in Order section
    const Price = cartItems.reduce((a, c) => a + c.price * c.qty, -10)
    //Declear from Stripe Payment
    const stripe = useStripe()
    const element = useElements()
    // Custom styling can be passed to options when creating an Element.
    const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: 'blue',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'blue'
        },
        width:"50px"
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };
    const handleChange = (e) => {
        if(e.error){
            return setCheckoutErrorMsg(e.error.message)
        }
        setCheckoutErrorMsg("")
    }
    //Used in Paymeny Button
    const handlePayment = async (e) => {

        e.preventDefault()

        setIsProcessing(true)
        setButtonMsg("Processing...")

        const cardElement = element.getElement('card')

        const billingInfo = {
            name: e.target.name.value,
            phone: e.target.phone.value,
            email: e.target.email.value,
            address: {
                line1: e.target.address.value
            }
        }

        try {
            // Got our client secret
            const paymentIntent = await axios.post("/payment", {
                amount: Price * 100
            })

            // Create PaymentMethod Object
            const paymentMethodObj = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: billingInfo
            })

            if(paymentMethodObj.error){
                setCheckoutErrorMsg(paymentMethodObj.error.message)
                setIsProcessing(false)
                setButtonMsg("Pay")
                return
            }
            
            // Confirm Payment Method
            const confirmPayment = await stripe.confirmCardPayment(paymentIntent.data, {
                payment_method: paymentMethodObj.paymentMethod.id
            })

            if(confirmPayment.error){
                setCheckoutErrorMsg(confirmPayment.error.message)
                setIsProcessing(false)
                setButtonMsg("Pay")
                return
            }

            setButtonMsg("Success! Payment is Complete")

            setTimeout(() => {
                setButtonMsg("Pay")
                setIsProcessing(false)
            }, 2000)
            
        } catch (error) {
            setCheckoutErrorMsg(error.message)
            setIsProcessing(false)
        }

    }
    return (
        <div className="page-holder">
        {/*  Modal */}
        <div className="modal fade" id="productView" tabIndex={-1} role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body p-0">
                <div className="row align-items-stretch">
                  <div className="col-lg-6 p-lg-0"><a className="product-view d-block h-100 bg-cover bg-center" style={{background: 'url(img/product-5.jpg)'}} href="img/product-5.jpg" data-lightbox="productview" title="Red digital smartwatch" /><a className="d-none" href="img/product-5-alt-1.jpg" title="Red digital smartwatch" data-lightbox="productview" /><a className="d-none" href="img/product-5-alt-2.jpg" title="Red digital smartwatch" data-lightbox="productview" /></div>
                  <div className="col-lg-6">
                    <button className="close p-4" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <div className="p-5 my-md-4">
                      <ul className="list-inline mb-2">
                        <li className="list-inline-item m-0"><i className="fas fa-star small text-warning" /></li>
                        <li className="list-inline-item m-0"><i className="fas fa-star small text-warning" /></li>
                        <li className="list-inline-item m-0"><i className="fas fa-star small text-warning" /></li>
                        <li className="list-inline-item m-0"><i className="fas fa-star small text-warning" /></li>
                        <li className="list-inline-item m-0"><i className="fas fa-star small text-warning" /></li>
                      </ul>
                      <h2 className="h4">Red digital smartwatch</h2>
                      <p className="text-muted">$250</p>
                      <p className="text-small mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Vestibulum ultricies aliquam convallis.</p>
                      <div className="row align-items-stretch mb-4">
                        <div className="col-sm-7 pr-sm-0">
                          <div className="border d-flex align-items-center justify-content-between py-1 px-3"><span className="small text-uppercase text-gray mr-4 no-select">Quantity</span>
                            <div className="quantity">
                              <button className="dec-btn p-0"><i className="fas fa-caret-left" /></button>
                              <input className="form-control border-0 shadow-0 p-0" type="text" defaultValue={1} />
                              <button className="inc-btn p-0"><i className="fas fa-caret-right" /></button>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-5 pl-sm-0"><a className="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0" href="cart.html">Add to cart</a></div>
                      </div><a className="btn btn-link text-dark p-0" href="#"><i className="far fa-heart mr-2" />Add to wish list</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {/* HERO SECTION*/}
          <section className="py-5 bg-light">
            <div className="container">
              <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
                <div className="col-lg-6">
                  <h1 className="h2 text-uppercase mb-0">Checkout</h1>
                </div>
                <div className="col-lg-6 text-lg-right">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                      <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                      <li className="breadcrumb-item"><a href="cart.html">Cart</a></li>
                      <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </section>
          <section className="py-5">
            {/* BILLING ADDRESS*/}
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>
            <div className="row">
              <div className="col-lg-8">
                <form  onSubmit={handlePayment}>
                  <div className="row">
                    <div className="col-lg-6 form-group">
                      <label className="text-small text-uppercase" htmlFor="firstName">First name</label>
                      <input className="form-control form-control-lg" id="firstName" type="text" placeholder="Enter your first name" />
                    </div>
                    <div className="col-lg-6 form-group">
                      <label className="text-small text-uppercase" htmlFor="email">Email address</label>
                      <input className="form-control form-control-lg" id="email" type="email" placeholder="e.g. Jason@example.com" />
                    </div>
                    <div className="col-lg-6 form-group">
                      <label className="text-small text-uppercase" htmlFor="phone">Phone number</label>
                      <input className="form-control form-control-lg" id="phone" type="tel" placeholder="e.g. +02 245354745" />
                    </div>
                    <div className="col-lg-12 form-group">
                      <label className="text-small text-uppercase" htmlFor="address">Address line 1</label>
                      <input className="form-control form-control-lg" id="address" type="text" placeholder="House number and street name" />
                    </div>
                    <div className="col-lg-6 form-group">
                    </div>
                    <div className="col-lg-12 form-group">
                      <button className="btn btn-dark" type="submit" disabled={isProcessing}>{buttonMsg}</button>
                    </div>
                  </div>
                </form>
              </div>
              {/* ORDER SUMMARY*/}
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <ul className="list-unstyled mb-0">
                      {Object.values(cartItems).map((x,i)=>(
                          <div>
                          <li key={i} className="d-flex align-items-center justify-content-between"><strong className="small font-weight-bold">{x.name}</strong><span className="text-muted small">${x.price * x.qty}</span></li>
                          <li className="border-bottom my-2"/>
                          </div>
                      ))}
                      {/* {cartItems.map((item,index)=>(
                        <div>
                        <li key={index} className="d-flex align-items-center justify-content-between"><strong className="small font-weight-bold">{item.name}</strong><span className="text-muted small">${cartItems.reduce((a, c) => a + c.price * c.qty,0)}</span></li>
                        <li className="border-bottom my-2"/>
                        </div>
                      ))} */}
                       <li className="d-flex align-items-center justify-content-between"><strong className="text-uppercase small font-weight-bold">Shipping Fees</strong><span>$10</span></li>
                      <li className="d-flex align-items-center justify-content-between"><strong className="text-uppercase small font-weight-bold">Total</strong><span>${cartItems.reduce((a, c) => a + c.price * c.qty,-10)}</span></li>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                  <p className="text-body">
                  {checkoutErrorMsg}
                  </p>
                  </div>
              </div>
                <div className="row">
                        <div className="col">
                        <CardElement
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={handleChange}/>
                        </div>
              </div>
              </div>
            </div>
          </section>
        </div>
          <Footer/>
      </div>
    )
}
export default function BillingDetails(){
  const stripePromise = loadStripe(key.publishableKey);
  return(
    <div>
      <Elements stripe={stripePromise}>
        <Checkout/>
      </Elements>
    </div>
  )
}