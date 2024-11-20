import { faAlignCenter } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'; // Asegúrate de importar useState

  
const BalanceSection = ({
    account,
    connectWallet,
    disconnectWallet,
    balanceTokenA,
    balanceTokenB,
    balanceActionAmountA,
    setBalanceActionAmountA,
    balanceActionAmountB,
    setBalanceActionAmountB,
    withdrawTokenA,
    approveAmountA,
    setApproveAmountA,
    approveTokenA,
    depositAmountA,
    setDepositAmountA,
    depositTokenA,
    withdrawAmountB,
    setWithdrawAmountB,
    withdrawTokenB,
    approveAmountB,
    setApproveAmountB,
    approveTokenB,
    depositAmountB,
    setDepositAmountB,
    depositTokenB,
    reloadBalances,
    withdrawPendingBalances
}) => {
  
    return (
        <div className="trade-balance">
            <div className="trade-head-dv">
                <h2>Balance</h2>
            </div>
            {!account ? (
                <button className="trade-button" onClick={connectWallet}>Connect wallet</button>
            ) : (
                <button className="trade-button" onClick={disconnectWallet}>Disconnect wallet</button>
            )}

            {!account ? (
                <p className="account-detection">Disconnected wallet</p>
            ) : (
                <p className="account-detection">{account}</p>
            )}

            <div className="token-container">
            <div className="trade-cont-f">
                <h3>ONCE: {balanceTokenA*1e12}</h3>
                <form className='trade-form' onSubmit={(e) => { e.preventDefault(); 
                    if (e.nativeEvent.submitter.id === 'withdraw') {
                        withdrawTokenA();
                    } else if (e.nativeEvent.submitter.id === 'approve') {
                        approveTokenA();
                    } else if (e.nativeEvent.submitter.id === 'deposit') {
                        depositTokenA();
                    }
                }}>
                    <input
                        className='trade-input'
                        type="text"
                        id="amount"
                        placeholder="Amount"
                        value={balanceActionAmountA} // Use a single state for the input
                        onChange={(e) => setBalanceActionAmountA(e.target.value)}
                    />
                    <button className="trade-button balance-btn-square tooltip" type="submit" id="approve" data-title="Approve"><i class="fa-regular fa-circle-check"></i></button>
                    <button className="trade-button balance-btn-square tooltip" type="submit" id="deposit" data-title="Deposit"> <i class="fa-solid fa-arrow-right-to-bracket" style={{ transform: 'rotate(90deg)' }}></i></button>
                    <button className="trade-button balance-btn-square tooltip" type="submit" id="withdraw" data-title="Withdraw"><i class="fa-solid fa-arrow-up-from-bracket"></i></button>
                </form>
            </div>

            <div className="trade-cont-f">
                <h3>USDC: {balanceTokenB*1e12}</h3>
                <form className='trade-form' onSubmit={(e) => { e.preventDefault(); 
                    if (e.nativeEvent.submitter.id === 'withdraw') {
                        withdrawTokenB();
                    } else if (e.nativeEvent.submitter.id === 'approve') {
                        approveTokenB();
                    } else if (e.nativeEvent.submitter.id === 'deposit') {
                        depositTokenB();
                    }
                }}>
                    <input
                        className='trade-input'
                        type="text"
                        id="amount"
                        placeholder="Amount"
                        value={balanceActionAmountB} // Use a single state for the input
                        onChange={(e) => setBalanceActionAmountB(e.target.value)}
                    />
                    <button className="trade-button balance-btn-square tooltip" type="submit" id="approve" data-title="Approve"><i class="fa-regular fa-circle-check"></i></button>
                    <button className="trade-button balance-btn-square tooltip" type="submit" id="deposit" data-title="Deposit"> <i class="fa-solid fa-arrow-right-to-bracket" style={{ transform: 'rotate(90deg)' }}></i></button>
                    <button className="trade-button balance-btn-square tooltip" type="submit" id="withdraw" data-title="Withdraw"><i class="fa-solid fa-arrow-up-from-bracket"></i></button>
                </form>
            </div>
            </div>

                <div className="trade-buttons balance-gap-buttons">
                    <button className="trade-button" onClick={reloadBalances}>Reload</button>
                    <button className="trade-button" >Add token</button>
                </div>

                <div>
                    <p className='fee-information'>1% fee on deposit</p>
                </div>


        </div>
    );
};

export default BalanceSection;