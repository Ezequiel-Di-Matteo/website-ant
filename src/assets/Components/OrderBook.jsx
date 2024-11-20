import React, { useState } from "react"; // Agregar useEffect

const OrderBook = ({
  tokenA,
  tokenB,
  sellOrders,
  buyOrders,
  currentPrice,
  onRefresh,
  getBuyOrdersByUser,
  getSellOrdersByUser,
  buyOrdersByUser,
  sellOrdersByUser,
  removeBuyOrder,
  removeSellOrder,
}) => {
  const [showMyOrders, setShowMyOrders] = useState(false); // Estado para controlar la tabla
  const [title, setTitle] = useState("Order book"); // Estado para el título

  const handleMyOrdersClick = async () => {
    // Cambiar a función asíncrona
    setShowMyOrders(!showMyOrders);
    setTitle(showMyOrders ? "Order book" : "Open orders");
    getBuyOrdersByUser();
    getSellOrdersByUser();
    console.log(buyOrdersByUser);
    console.log(sellOrdersByUser);
  };

  const handleDeleteBuyOrder = async (permanentIndex) => {
    try {
      console.log(permanentIndex);
      await removeBuyOrder(permanentIndex); // Llama a la función para eliminar la orden
      onRefresh(); // Llama a la función para refrescar la lista
    } catch (error) {
      console.error("Error al eliminar la orden:", error); // Manejo de errores
    }
  };

  const handleDeleteSellOrder = async (permanentIndex) => {
    try {
      console.log(permanentIndex);
      await removeSellOrder(permanentIndex); // Llama a la función para eliminar la orden
      onRefresh(); // Llama a la función para refrescar la lista
    } catch (error) {
      console.error("Error al eliminar la orden:", error); // Manejo de errores
    }
  };

  return (
    <div id="order-book">
      <div className="trade-head-dv">
        <h2>{title}</h2>
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>Price</th>
            <th>{tokenA}</th>
            <th>{tokenB}</th>
          </tr>
        </thead>
        <tbody>
          {showMyOrders ? (
            sellOrdersByUser.length > 0 ? (
              <>
                {sellOrdersByUser.map((order, index) => (
                  <tr key={`sell-${index}`}>
                    <td className="p-v red">{order.price}</td>
                    <td className="a-a">{order.amountA}</td>
                    <td className="b-a">{order.amountB}</td>
                    <td>
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={() => handleDeleteSellOrder(order.id)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                ))}
                {/* Renderizar filas vacías si hay menos de 9 filas en total */}
                {Array(Math.max(10 - sellOrdersByUser.length, 0))
                  .fill()
                  .map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                      <td colSpan="7" className="empty-row"></td>
                    </tr>
                  ))}
              </>
            ) : (
              Array(10)
                .fill()
                .map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="empty-row"></td>
                    <td className="empty-row"></td>
                    <td colSpan="7" className="empty-row"></td>
                  </tr>
                ))
            )
          ) : sellOrders.length > 0 ? (
            sellOrders.map((order, index) => (
              <tr key={`sell-${index}`}>
                <td className="p-v red">{order.price}</td>
                <td className="a-a">{order.amountA}</td>
                <td className="b-a">{order.amountB}</td>
              </tr>
            ))
          ) : (
            <>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <h3>{currentPrice}</h3>

      <table className="order-table">
        <thead>
          <tr>
            <th>Price</th>
            <th>{tokenA}</th>
            <th>{tokenB}</th>
          </tr>
        </thead>
        <tbody>
          {showMyOrders ? (
            buyOrdersByUser.length > 0 ? (
              <>
                {buyOrdersByUser.map((order, index) => (
                  <tr key={`buy-${index}`}>
                    <td className="p-v green">{order.price}</td>
                    <td className="a-a">{order.amountA}</td>
                    <td className="b-a">{order.amountB}</td>
                    <td>
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={() => handleDeleteBuyOrder(order.id)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                ))}
                {/* Renderizar filas vacías si hay menos de 9 filas en total */}
                {Array(Math.max(10 - buyOrdersByUser.length, 0))
                  .fill()
                  .map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                      <td colSpan="7" className="empty-row"></td>
                    </tr>
                  ))}
              </>
            ) : (
              Array(10)
                .fill()
                .map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="empty-row"></td>
                    <td className="empty-row"></td>
                    <td colSpan="7" className="empty-row"></td>
                  </tr>
                ))
            )
          ) : buyOrders.length > 0 ? (
            buyOrders.map((order, index) => (
              <tr key={`buy-${index}`}>
                <td className="p-v green">{order.price}</td>
                <td className="a-a">{order.amountA}</td>
                <td className="b-a">{order.amountB}</td>
              </tr>
            ))
          ) : (
            <>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
              <tr>
                <td className="empty-row">--</td>
                <td className="empty-row">--</td>
                <td colSpan="7" className="empty-row">
                  --
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <button className="trade-button" onClick={onRefresh}>
        Update
      </button>
      <button className="trade-button" onClick={handleMyOrdersClick}>
        Open orders
      </button>
    </div>
  );
};

export default OrderBook;
