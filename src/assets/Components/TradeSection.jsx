import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLeft } from '@fortawesome/free-solid-svg-icons';

const TradeSection = ({
  executeBuyOrderAmount,
  setExecuteBuyOrderAmount,
  executeBuyOrderAtMarket,
  executeSellOrderPrice,
  setExecuteSellOrderPrice,
  executeSellOrderAtMarket,
  createBuyOrderAmount,
  setCreateBuyOrderAmount,
  createBuyOrderPrice,
  setCreateBuyOrderPrice,
  createBuyOrder,
  createSellOrderAmount,
  setCreateSellOrderAmount,
  createSellOrderPrice,
  setCreateSellOrderPrice,
  createSellOrder,
  sellOrders,
  buyOrders
}) => {

  const lowestSellPrice = Math.min(...sellOrders.map(order => parseFloat(order.price)));
  const highestBuyPrice = Math.max(...buyOrders.map(order => parseFloat(order.price)));
  
  return (
    <div className='trade-trade'>
      <div className="trade-head-dv">
        <h2>Trade</h2>
      </div>

      <form className="trade-form-type" onSubmit={(e) => { e.preventDefault(); executeBuyOrderAtMarket(); }}>
        <label htmlFor="token">Instant buy</label>
        <div className="trade-group">
          <input
            className='trade-input'
            type="number"
            name="token"
            id="token"
            placeholder="USDC"
            value={executeBuyOrderAmount}
            onChange={(e) => setExecuteBuyOrderAmount(e.target.value)}
          />
          <button className="trade-button2" type="submit">Buy</button>
        </div>
        <p>≈ {executeBuyOrderAmount / lowestSellPrice} ONCE</p>
      </form>

      <form className="trade-form-type" onSubmit={(e) => { e.preventDefault(); executeSellOrderAtMarket(); }}>
        <label htmlFor="token2">Instant sell</label>
        <div className="trade-group">
          <input
            className='trade-input'
            type="number"
            name="token2"
            id="token2"
            placeholder="ONCE"
            value={executeSellOrderPrice}
            onChange={(e) => setExecuteSellOrderPrice(e.target.value)}
          />
          <button className="trade-button2" type="submit">Sell</button>
        </div>
        <p>≈ {executeSellOrderPrice * highestBuyPrice} USDC</p>
      </form>

      <form className="trade-form-type trade-f2" onSubmit={(e) => { e.preventDefault(); createBuyOrder(); }}>
        <label htmlFor="token3">Buy limit order</label>
        <div className="trade-group trade-f2">
          <input
            className='trade-input'
            type="number"
            name="token3"
            id="token3"
            placeholder="USDC"
            value={createBuyOrderAmount}
            onChange={(e) => setCreateBuyOrderAmount(e.target.value)}
          />
          <input
            className='trade-input'
            type="number"
            placeholder="Price"
            name="price"
            id="price"
            value={createBuyOrderPrice}
            onChange={(e) => setCreateBuyOrderPrice(e.target.value)}
          />
        </div>
        <p>= {createBuyOrderAmount/createBuyOrderPrice} ONCE</p>
        <button className="trade-button" type="submit">Create limit order</button>
      </form>

      <form className="trade-form-type trade-f2" onSubmit={(e) => { e.preventDefault(); createSellOrder(); }}>
        <label htmlFor="token4">Sell limit order</label>
        <div className="trade-group f2">
          <input
            className='trade-input'
            type="number"
            name="token4"
            id="token4"
            placeholder="ONCE"
            value={createSellOrderAmount}
            onChange={(e) => setCreateSellOrderAmount(e.target.value)}
          />
          <input
            className='trade-input'
            type="number"
            placeholder="Price"
            name="price2"
            id="price2"
            value={createSellOrderPrice}
            onChange={(e) => setCreateSellOrderPrice(e.target.value)}
          />
        </div>
        <p>= {createSellOrderAmount*createSellOrderPrice} USDC</p>
        <button className="trade-button" type="submit">Create limit order</button>
      </form>
    </div>
  );
};

export default TradeSection;