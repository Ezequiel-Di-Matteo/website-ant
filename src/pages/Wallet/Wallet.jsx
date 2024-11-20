import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Wallet.css';


const data = Array.from({ length: 100 }, (_, index) => ({
    name: `Token ${index + 1}`,
    chain: `Chain ${String.fromCharCode(65 + (index % 26))}`, // A-Z
    amount: (Math.random() * 100).toFixed(4), // Genera un número aleatorio con 4 decimales
}));


const About = () => {
    useEffect(() => {
        document.title = "Wallet | Antagon"; 
    }, []);
    return (
        <main className='about-main'>
            <section className='about-section'>
                <article className="about-article">
                    <div className="product-container">
                        
                        <div className='wallet-balance'>
                            <p className='wallet-balance-title'>Estimated Balance</p>
                            <p className='wallet-balance-value'>23,095.47 USDT</p>
                        </div>

                        <div className="wallet-buttons">
                            <button className="wallet-button">Deposit</button>
                            <button className="wallet-button">Withdraw</button>
                        </div>
                        
                    </div>

                    <div className="list-container">
                        <div className="list-header">
                            <p>Nombre</p>
                            <p>Chain</p>
                            <p>Amount</p>
                            <p>Action</p>
                        </div>
                        <div className="list-body">
                            {data.map((item, index) => (
                                <div key={index} className="list-item">
                                    <p>{item.name}</p>
                                    <p>{item.chain}</p>
                                    <p>{item.amount}</p>
                                    <div className="action-buttons">
                                        <button className="action-button">Deposit</button>
                                        <button className="action-button">Withdraw</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </article>
            </section>
        </main>
    );
};

export default About;