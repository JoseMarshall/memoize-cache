export const orders = require('./orders.json');

export const getOrderById = id =>
  orders.find(o => o.orderId == id);

export const getTotalPrice = order =>
  order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
