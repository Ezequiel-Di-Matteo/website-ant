import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TokenExchangeABI from "./TokenExchangeABI.json";
import ERC20ABI from "./ERC20ABI.json";
import USDCABI from "./USDCABI.json";
import "./Trade.css";
import OrderBook from "../../assets/Components/OrderBook";
import TradeSection from "../../assets/Components/TradeSection";
import BalanceSection from "../../assets/Components/BalanceSection";

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const TokenExchange = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenAContract, setTokenAContract] = useState(null);
  const [tokenBContract, setTokenBContract] = useState(null);
  const [balanceTokenA, setBalanceTokenA] = useState(null);
  const [balanceTokenB, setBalanceTokenB] = useState(null);
  const [depositAmountA, setDepositAmountA] = useState("");
  const [depositAmountB, setDepositAmountB] = useState("");
  const [sellOrders, setSellOrders] = useState([]);
  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrdersByUser, setSellOrdersByUser] = useState([]);
  const [buyOrdersByUser, setBuyOrdersByUser] = useState([]);
  const [approveAmountA, setApproveAmountA] = useState("");
  const [approveAmountB, setApproveAmountB] = useState("");
  const [createBuyOrderPrice, setCreateBuyOrderPrice] = useState("");
  const [createBuyOrderAmount, setCreateBuyOrderAmount] = useState("");
  const [createSellOrderPrice, setCreateSellOrderPrice] = useState("");
  const [createSellOrderAmount, setCreateSellOrderAmount] = useState("");
  const [balanceActionAmountA, setBalanceActionAmountA] = useState("");
  const [balanceActionAmountB, setBalanceActionAmountB] = useState("");
  const [executeSellOrderPrice, setExecuteSellOrderPrice] = useState("");
  const [executeBuyOrderAmount, setExecuteBuyOrderAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [ref, setRef] = useState("");
  const [day, setDay] = useState(0); // Asegúrate de inicializar day en el estado
  const contractAddresses = [
    '0x2E93D469825C1342862fa6629a02aec4D5611803'
  ];
  let firstLoad = true;
  const [showAlert, setShowAlert] = useState(true); // Estado para controlar la ventana de aviso
  const [alertMessage, setAlertMessage] = useState("Our service offers low-market-cap tokens, which are highly volatile and not recommended for long-term investments. Use only capital you're willing to lose, as significant value loss may occur within a day of launch.<br/><br/>This service is in development, and proper functionality is not guaranteed. Any losses due to malfunction are the user's responsibility."); // Estado para el mensaje de la ventana de aviso

  useEffect(() => {
    document.title = "Trade | Antagon";

    setRef(getQueryParam("ref"));

    // *************************************************************** //
    if (window.ethereum && firstLoad) {
      firstLoad = false;
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      const contractAddress = contractAddresses[day];
      const contractInstance = new web3.eth.Contract(
        TokenExchangeABI,
        contractAddress
      );
      setContract(contractInstance);

      const tokenAAddress = "0x1d2A8D66EF47316d6fe5aD7db1587E34B17a52E5";
      const tokenBAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
      setTokenAContract(new web3.eth.Contract(ERC20ABI, tokenAAddress));
      setTokenBContract(new web3.eth.Contract(ERC20ABI, tokenBAddress));

      if (account) {
        getInternalBalances();

        getSellOrders();

        getBuyOrders();

        getBuyOrdersByUser();

        getSellOrdersByUser();
      }
    }
  }, [account, walletAddress]);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("Failed to connect wallet.");
      }

      if (localStorage.getItem("storedWalletAddress") === null) {
        localStorage.setItem("storedWalletAddress", ref);
      }
      if (localStorage.getItem("storedWalletAddress") == "null" || !web3.utils.isAddress(localStorage.getItem("storedWalletAddress"))) {
        setWalletAddress("0x6b4F3B38BED86E51De3a557328064492CF805480");
      } else {
        setWalletAddress(localStorage.getItem("storedWalletAddress"));
      }

    } else {
      alert("Please install MetaMask!");
    }
    
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setContract(null);
    setTokenAContract(null);
    setTokenBContract(null);
    setBalanceTokenA(null);
    setBalanceTokenB(null);
    // Se limpia cualquier otro estado si es necesario
  };

  const getInternalBalances = async () => {
    try {
      const balances = await contract.methods
        .getPendingBalances()
        .call({ from: account });
      setBalanceTokenA(web3.utils.fromWei(balances.amountTokenA, "ether"));
      setBalanceTokenB(web3.utils.fromWei(balances.amountTokenB, "ether"));
    } catch (error) {
      console.error("Error fetching internal balances:", error);
    }
  };

  const reloadBalances = () => {
    getInternalBalances();
  };

  const reloadOrders = () => {
    getBuyOrders();
    getSellOrders();
    getBuyOrdersByUser();
    getSellOrdersByUser();
  };

  const depositTokenA = async () => {
    try {
      const amountInWei = balanceActionAmountA * 1e6;
      const estimatedGas = await contract.methods
      .depositTokenA(amountInWei, walletAddress)
      .estimateGas({ from: account });


      await contract.methods.depositTokenA(amountInWei, walletAddress).send({
        from: account,
        gasPrice: web3.utils.toWei("40", "gwei"),
      });
      alert(`Deposited ${balanceActionAmountA} ONCE`);
      setDepositAmountA("");
      getInternalBalances();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error depositing ONCE:", errorMessage);
      alert(`Deposit failed: ${errorMessage}`);
    }
  };

  const depositTokenB = async () => {
    try {
      const amountInWei = balanceActionAmountB * 1e6;
      const estimatedGas = await contract.methods
        .depositTokenB(amountInWei, walletAddress)
        .estimateGas({ from: account });


      await contract.methods.depositTokenB(amountInWei, walletAddress).send({
        from: account,
        gasPrice: web3.utils.toWei("40", "gwei"),
      });
      alert(`Deposited ${balanceActionAmountB} USDC`);
      setDepositAmountB("");
      getInternalBalances();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error depositing USDC:", errorMessage);
      alert(`Deposit failed: ${errorMessage}`);
    }
  };

  const approveTokenA = async () => {
    try {
      const amountInWei = balanceActionAmountA * 1e6;
      await tokenAContract.methods
        .approve(contract.options.address, amountInWei)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });
      
      handleCloseAlert(); // Cierra la ventana de aviso si está abierta
      setShowAlert(true); // Muestra la ventana de aviso
      setAlertMessage(`Approved ${balanceActionAmountA} ONCE`); // Mensaje de éxito
      setApproveAmountA("");
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error approving ONCE:", errorMessage);
      alert(`Approval failed: ${errorMessage}`);
    }
  };

  const approveTokenB = async () => {
    try {
      const amountInWei = balanceActionAmountB * 1e6;
      await tokenBContract.methods
        .approve(contract.options.address, amountInWei)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });
      alert(`Approved ${balanceActionAmountB} USDC`);
      setApproveAmountB("");
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error approving USDC:", errorMessage);
      alert(`Approval failed: ${errorMessage}`);
    }
  };

  const withdrawTokenA = async () => {
    try {
      const amountInWei = balanceActionAmountA * 1e6;

      // Estimar el gas antes de enviar la transacción
      const estimatedGas = await contract.methods
        .withdrawTokenA(amountInWei)
        .estimateGas({ from: account });

      await contract.methods.withdrawTokenA(amountInWei).send({
        from: account,
        gasPrice: web3.utils.toWei("40", "gwei"),
      });
      alert(`Withdrew ${balanceActionAmountA} ONCE`);
      getInternalBalances();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error withdrawing ONCE:", errorMessage);
      alert(`Withdrawal failed: ${errorMessage}`);
    }
  };

  const withdrawTokenB = async () => {
    try {
      const amountInWei = balanceActionAmountB * 1e6;
      const estimatedGas = await contract.methods
        .withdrawTokenB(amountInWei)
        .estimateGas({ from: account });

      await contract.methods.withdrawTokenB(amountInWei).send({
        from: account,
        gasPrice: web3.utils.toWei("40", "gwei"),
      });
      alert(`Withdrew ${balanceActionAmountB} USDC`);
      getInternalBalances();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error withdrawing USDC:", errorMessage);
      alert(`Withdrawal failed! ${errorMessage}`);
    }
  };

  const createBuyOrder = async () => {
    try {
      const priceInWei = createBuyOrderPrice * 1e6;
      const amountInWei = createBuyOrderAmount * 1e6;
      const estimatedGas = await contract.methods
      .addBuyOrderUsingInternalBalance(priceInWei, amountInWei)
      .estimateGas({ from: account });


      await contract.methods
        .addBuyOrderUsingInternalBalance(priceInWei, amountInWei)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });
      alert("Buy order created successfully!");
      setCreateBuyOrderPrice("");
      setCreateBuyOrderAmount("");
      getSellOrders();
      getBuyOrders();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error creating buy order:", errorMessage);
      alert(`Buy order creation failed: ${errorMessage}`);
    }
  };

  const createSellOrder = async () => {
    try {
      const priceInWei = createSellOrderPrice * 1e6;
      const amountInWei = createSellOrderAmount * 1e6;
      const estimatedGas = await contract.methods
      .addSellOrderUsingInternalBalance(priceInWei, amountInWei)
      .estimateGas({ from: account });


      await contract.methods
        .addSellOrderUsingInternalBalance(priceInWei, amountInWei)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });
      alert("Sell order created successfully!");
      setCreateSellOrderPrice("");
      setCreateSellOrderAmount("");
      getSellOrders();
      getBuyOrders();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error creating sell order:", errorMessage);
      alert(`Sell order creation failed: ${errorMessage}`);
    }
  };

  const executeBuyOrderAtMarket = async () => {
    try {
      // Verificar que el precio y la cantidad no estén vacíos
      if (!executeBuyOrderAmount) {
        alert("Please enter amount.");
        return;
      }

      // Convertir el precio y la cantidad a wei
      const amountInWei = executeBuyOrderAmount * 1e6;

      const estimatedGas = await contract.methods
      .executeBuyOrderAtMarketUsingInternalBalance(amountInWei)
      .estimateGas({ from: account });

      // Llamar al método del contrato
      await contract.methods
        .executeBuyOrderAtMarketUsingInternalBalance(amountInWei)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });

      alert("Buy order executed successfully!");
      setExecuteBuyOrderAmount("");
      getSellOrders();
      getBuyOrders();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error executing buy order:", errorMessage);
      alert(`Buy order execution failed: ${errorMessage}`);
    }
  };

  const executeSellOrderAtMarket = async () => {
    try {
      const priceInWei = executeSellOrderPrice * 1e6;
      const estimatedGas = await contract.methods
      .executeSellOrderAtMarketUsingInternalBalance(priceInWei)
      .estimateGas({ from: account });


      await contract.methods
        .executeSellOrderAtMarketUsingInternalBalance(priceInWei)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });
      alert("Sell order executed successfully!");
      setExecuteSellOrderPrice("");
      getSellOrders();
      getBuyOrders();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error executing sell order:", error);
      alert(`Sell order execution failed: ${errorMessage}`);
    }
  };

  const getSellOrders = async () => {
    try {
      const orders = await contract.methods.getSellOrders().call();
      const formattedOrders = orders.map((order) => ({
        price: (parseFloat(order.price) / 1e12).toFixed(6),
        amount: parseFloat(web3.utils.fromWei(order.amount, "ether") * 1e12).toFixed(6),
        user: order.user,
      }));

      const orderMap = formattedOrders.reduce((acc, { price, amount }) => {
        const parsedPrice = parseFloat(price);
        if (acc[parsedPrice]) {
          acc[parsedPrice] += parseFloat(amount);
        } else {
          acc[parsedPrice] = parseFloat(amount);
        }
        return acc;
      }, {});

      // Obtener los 10 precios más bajos y ordenarlos de mayor a menor
      const sortedOrders = Object.keys(orderMap)
        .sort((a, b) => parseFloat(a) - parseFloat(b))  // Ordenar de menor a mayor
        .slice(0, 10)  // Tomar solo los 10 primeros (precios más bajos)
        .sort((a, b) => parseFloat(b) - parseFloat(a));  // Reordenar de mayor a menor

      // Rellenar con guiones si hay menos de 10 órdenes
      const filledOrders = Array(10).fill({ price: 0, totalAmount: 0 });
      const startIndex = Math.max(0, 10 - sortedOrders.length); // Calcular el índice de inicio

      sortedOrders.forEach((price, index) => {
        filledOrders[startIndex + index] = {
          price: parseFloat(price).toFixed(2),
          totalAmount: orderMap[price].toFixed(2),
        };
      });

      setSellOrders(filledOrders);
    } catch (error) {
      console.error("Error fetching sell orders:", error);
    }
  };

  const getBuyOrders = async () => {
    try {
      const orders = await contract.methods.getBuyOrders().call();
      const formattedOrders = orders.map((order) => ({
        price: (parseFloat(order.price) / 1e12).toFixed(6),
        amount: parseFloat(web3.utils.fromWei(order.amount, "ether") * 1e12).toFixed(6),
        user: order.user,
      }));

      const orderMap = formattedOrders.reduce((acc, { price, amount }) => {
        const parsedPrice = parseFloat(price);
        if (acc[parsedPrice]) {
          acc[parsedPrice] += parseFloat(amount);
        } else {
          acc[parsedPrice] = parseFloat(amount);
        }
        return acc;
      }, {});

      // Obtener los 10 precios más altos y ordenarlos de mayor a menor
      const sortedOrders = Object.keys(orderMap)
        .sort((a, b) => parseFloat(b) - parseFloat(a))
        .slice(0, 10);  // Tomar solo los 10 primeros (precios más altos)

      // Rellenar con guiones si hay menos de 10 órdenes
      const filledOrders = Array(10).fill({ price: 0, totalAmount: 0 });
      sortedOrders.forEach((price, index) => {
        filledOrders[index] = {
          price: parseFloat(price).toFixed(2),
          totalAmount: orderMap[price].toFixed(2),
        };
      });

      setBuyOrders(filledOrders);
    } catch (error) {
      console.error("Error fetching buy orders:", error);
    }
  };

  const getBuyOrdersByUser = async () => {
    try {
      const orders = await contract.methods.getBuyOrdersByUser().call({ from: account });
      setBuyOrdersByUser(orders);
      return orders; // Devuelve las órdenes obtenidas
    } catch (error) {
      console.error("Error fetching user's buy orders:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  const formattedBuyOrdersByUser = buyOrdersByUser.map(order => ({
    price: (parseFloat(order.price) / 1e12).toFixed(2),
    amountA: (parseFloat(order.amount) / parseFloat(order.price) * 1e6).toFixed(2),
    amountB: (parseFloat(order.amount) / 1e6).toFixed(2),
    id: parseInt(order.permanentIndex.toString().replace('n', ''), 10)
  }));

  const getSellOrdersByUser = async () => {
    try {
      const orders = await contract.methods.getSellOrdersByUser().call({ from: account });
      setSellOrdersByUser(orders);
      return orders; // Devuelve las órdenes obtenidas
    } catch (error) {
      console.error("Error fetching user's buy orders:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  const formattedSellOrdersByUser = sellOrdersByUser.map(order => ({
    price: (parseFloat(order.price) / 1e12).toFixed(2),
    amountA: (parseFloat(order.amount) / 1e6).toFixed(2),
    amountB: ((parseFloat(order.amount) * (parseFloat(order.price) / 1e6) / 1e12)).toFixed(2),
    id: parseInt(order.permanentIndex.toString().replace('n', ''), 10)
  }));

  const removeBuyOrder = async (permanentIndex) => {
    try {
      const estimatedGas = await contract.methods
      .removeBuyOrder(permanentIndex)
      .estimateGas({ from: account });


      await contract.methods
        .removeBuyOrder(permanentIndex)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });
      handleCloseAlert(); // Cierra la ventana de aviso si está abierta
      setShowAlert(true); // Muestra la ventana de aviso
      setAlertMessage("Buy order removed successfully!"); // Mensaje de éxito
      getSellOrders();
      getBuyOrders();
      getSellOrdersByUser();
      getBuyOrdersByUser();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error executing order removal:", error);
      handleCloseAlert(); // Cierra la ventana de aviso si está abierta
      setShowAlert(true); // Muestra la ventana de aviso
      setAlertMessage(`Error: ${errorMessage}`); // Mensaje de error
    }
  };

  const removeSellOrder = async (permanentIndex) => {
    try {
      const estimatedGas = await contract.methods
      .removeSellOrder(permanentIndex)
      .estimateGas({ from: account });


      await contract.methods
        .removeSellOrder(permanentIndex)
        .send({
          from: account,
          gasPrice: web3.utils.toWei("40", "gwei"),
        });
      handleCloseAlert(); // Cierra la ventana de aviso si está abierta
      setShowAlert(true); // Muestra la ventana de aviso
      setAlertMessage("Buy order removed successfully!"); // Mensaje de éxito
      getSellOrders();
      getBuyOrders();
      getSellOrdersByUser();
      getBuyOrdersByUser();
    } catch (error) {
      const errorMessage = error?.data?.message || "Unknown error.";
      console.error("Error executing order removal:", error);
      handleCloseAlert(); // Cierra la ventana de aviso si está abierta
      setShowAlert(true); // Muestra la ventana de aviso
      setAlertMessage(`Error: ${errorMessage}`); // Mensaje de error
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false); // Cierra la ventana de aviso
  };

  return (
    <main className="trade-main">
      {showAlert && (
        <div className="alert-modal">
          <div className="alert-content">
            <i className="fa fa-exclamation-triangle" aria-hidden="true" style={{ fontSize: '50px', color: 'white' }}></i>
            <div className="alert-text-container">
              <p className="alert-text" dangerouslySetInnerHTML={{ __html: alertMessage }}></p> {/* Muestra el mensaje de alerta */}
            </div>
            <button className="alert-button" onClick={handleCloseAlert}>Aceptar</button>
          </div>
        </div>
      )}
      <section className="trade-section">
        <article className="trade-article">
          <div>
            <BalanceSection
              account={account}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
              balanceTokenA={balanceTokenA}
              balanceTokenB={balanceTokenB}
              balanceActionAmountA={balanceActionAmountA}
              setBalanceActionAmountA={setBalanceActionAmountA}
              balanceActionAmountB={balanceActionAmountB}
              setBalanceActionAmountB={setBalanceActionAmountB}
              withdrawTokenA={withdrawTokenA}
              approveAmountA={approveAmountA}
              setApproveAmountA={setApproveAmountA}
              approveTokenA={approveTokenA}
              depositAmountA={depositAmountA}
              setDepositAmountA={setDepositAmountA}
              depositTokenA={depositTokenA}
              withdrawTokenB={withdrawTokenB}
              approveAmountB={approveAmountB}
              setApproveAmountB={setApproveAmountB}
              approveTokenB={approveTokenB}
              depositAmountB={depositAmountB}
              setDepositAmountB={setDepositAmountB}
              depositTokenB={depositTokenB}
              reloadBalances={reloadBalances}
            />
          </div>

          <div>
            <TradeSection
              executeBuyOrderAmount={executeBuyOrderAmount}
              setExecuteBuyOrderAmount={setExecuteBuyOrderAmount}
              executeBuyOrderAtMarket={executeBuyOrderAtMarket}
              executeSellOrderPrice={executeSellOrderPrice}
              setExecuteSellOrderPrice={setExecuteSellOrderPrice}
              executeSellOrderAtMarket={executeSellOrderAtMarket}
              createBuyOrderAmount={createBuyOrderAmount}
              setCreateBuyOrderAmount={setCreateBuyOrderAmount}
              createBuyOrderPrice={createBuyOrderPrice}
              setCreateBuyOrderPrice={setCreateBuyOrderPrice}
              createBuyOrder={createBuyOrder}
              createSellOrderAmount={createSellOrderAmount}
              setCreateSellOrderAmount={setCreateSellOrderAmount}
              createSellOrderPrice={createSellOrderPrice}
              setCreateSellOrderPrice={setCreateSellOrderPrice}
              createSellOrder={createSellOrder}
              sellOrders={sellOrders.map((order) => ({
                price: order.price,
                amountA: order.totalAmount,
                amountB: (
                  parseFloat(order.price) * parseFloat(order.totalAmount)
                ).toFixed(2),
              }))}
              buyOrders={buyOrders.map((order) => ({
                price: order.price,
                amountA: (
                  parseFloat(order.totalAmount) / parseFloat(order.price) * 1e6
                ).toFixed(2),
                amountB: order.totalAmount,
              }))}
            />
          </div>

          <div>
            <OrderBook
              tokenA="ONCE"
              tokenB="USDC"
              sellOrders={sellOrders.map((order) => ({
                price: (
                  ( order.totalAmount === 0 && order.price === 0) 
                    ? '--' 
                    : order.price
                ),
                amountA: (
                  ( order.totalAmount === 0 && order.price === 0) 
                    ? '--' 
                    : order.totalAmount
                ),
                amountB: (
                  ( order.totalAmount === 0 && order.price === 0) 
                    ? '--' 
                    : parseFloat(order.price) * parseFloat(order.totalAmount).toFixed(2)
                ),
              }))}
              buyOrders={buyOrders.map((order) => ({
                price: (
                  ( order.totalAmount === 0 && order.price === 0) 
                    ? '--' 
                    : order.price
                ),
                amountA: (
                  ( order.totalAmount === 0 && order.price === 0) 
                    ? '--' 
                    : (order.totalAmount / order.price).toFixed(2)
                ),
                amountB: (
                  ( order.totalAmount === 0 && order.price === 0) 
                    ? '--' 
                    : parseFloat(order.totalAmount).toFixed(2)
                ),
              }))}
              currentPrice={
                sellOrders[9]?.price ||
                buyOrders[buyOrders.length - 1]?.price ||
                "N/A"
              }
              onRefresh={reloadOrders}
              getBuyOrdersByUser={getBuyOrdersByUser}
              getSellOrdersByUser={getSellOrdersByUser}
              buyOrdersByUser={formattedBuyOrdersByUser}
              sellOrdersByUser={formattedSellOrdersByUser}
              removeBuyOrder={removeBuyOrder}
              removeSellOrder={removeSellOrder}
            />
          </div>
        </article>
      </section>
    </main>
  );
};

export default TokenExchange;
