const productRoutes = require('./product_routes');
const authRoutes = require('./auth_routes');
const orderRoutes = require('./order_routes');

module.exports = (app) => {
    app.use('/auth', authRoutes);
    app.use('/product', productRoutes);
    app.use('/order', orderRoutes);
}