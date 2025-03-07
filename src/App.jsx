import { useState, useEffect } from "react";
import axios from "axios";
import espressoImg from "./assets/espresso.jpg";
import cappuccinoImg from "./assets/cappuccino.jpg";
import latteImg from "./assets/latte.jpg";
import mochaImg from "./assets/mocha.jpg";

const App = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/menu")
      .then(response => {
        const menuWithImages = response.data.map((item) => {
          let image;
          if (item.name === "Espresso") image = espressoImg;
          if (item.name === "Cappuccino") image = cappuccinoImg;
          if (item.name === "Latte") image = latteImg;
          if (item.name === "Mocha") image = mochaImg;
          return { ...item, image };
        });
        setMenu(menuWithImages);
      })
      .catch(error => console.error("Error fetching menu:", error));
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!name || !email) {
      alert("Please enter your name and email.");
      return;
    }

    axios.post("http://localhost:5000/order", { items: cart, name, email, message })
      .then(response => {
        alert(response.data.message);
        setCart([]);
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch(error => console.error("Error placing order:", error));
  };

  return (
    <div>
      {/* Header */}
      <header>Cozy Coffee Shop ☕</header>

      {/* Menu Section */}
      <h2>Menu</h2>
      <div className="menu-container">
        {menu.map((item) => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <h2>Cart 🛒</h2>
      <div className="cart-container">
        {cart.length > 0 ? (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price.toFixed(2)}
                <button onClick={() => removeFromCart(index)}>❌</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Cart is empty</p>
        )}
      </div>

      {/* Contact Form */}
      <div className="contact-form">
        <h2>Customer Details</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button onClick={handleSubmitOrder}>Place Order</button>
      </div>

      {/* Footer */}
      <footer>
        ☕ Contact: 123-456-7890 | 📍 Address: 123 Coffee St, Vancouver
      </footer>
    </div>
  );
};

export default App;
