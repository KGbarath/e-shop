function CartItem({ item }) {
  return (
    <div className="cart-item">
      <img src={item.productId.images[0] || 'https://t3.ftcdn.net/jpg/02/73/31/68/360_F_273316816_N9164vXl3NTl1W50Z3o2ocQmtjBAAPOO.jpg'} alt={item.productId.name} />
      <div>
        <h3>{item.productId.name}</h3>
        <p>Price: ${item.productId.price}</p>
        <p>Quantity: {item.quantity}</p>
      </div>
    </div>
  );
}

export default CartItem;