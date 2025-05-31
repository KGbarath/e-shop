function OrderSummary({ order }) {
  return (
    <div className="order-summary">
      <h3>Order #{order._id}</h3>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total}</p>
      <h4>Items:</h4>
      {order.items.map((item) => (
        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{item.productId.name}</span>
          <span>{item.quantity} x ${item.price}</span>
        </div>
      ))}
    </div>
  );
}

export default OrderSummary;