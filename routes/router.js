const productRoutes = require('./product_routes');
const authRoutes = require('./auth_routes');

module.exports = (app) => {
    app.use('/product', productRoutes);
    app.use('/auth', authRoutes);
    

}