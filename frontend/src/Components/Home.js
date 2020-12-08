import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {Navbar} from './Navbar';
import {Listproduct} from '../store/action/productListAction'

export default function Home() {

  const productList = useSelector(state => state.productList);
  const { products,loading, error } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(Listproduct())
    return{
      //
    }
  }, [])
  return(
    loading?
    <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
    </div>:
    error?<div>{error}</div>:
    <div>
    <Navbar/>
    <div className="container">
      <div className="row">
        {products.map(items=>(
            <div className="col-md-3 col-sm-6">
            <div className="product-grid6" key={items.id}>
              <div className="product-image6">
                <a href="#">
                  <Link to={`/Preview/${items.id}`}><img className="pic-1" src={items.imageSrc} /></Link>
                </a>
              </div>
              <div className="product-content">
                <h3 className="title"><a href="#">${items.price}</a></h3>
                <div className="price">$
                  <span>${items.price}</span>
                </div>
              </div>
              <ul className="social">
                <li><a href data-tip="Quick View"><i className="fa fa-search" /></a></li>
                <li><a href data-tip="Add to Wishlist"><i className="fa fa-shopping-bag" /></a></li>
                <li><a href data-tip="Add to Cart"><i className="fa fa-shopping-cart" /></a></li>
              </ul>
            </div>
          </div> 
        ))}       
      </div>
    </div>
    </div>
     
  )
}