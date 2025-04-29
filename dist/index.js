"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const reward_routes_1 = __importDefault(require("./routes/reward.routes"));
const referral_routes_1 = __importDefault(require("./routes/referral.routes"));
// import botRoute from './routes/bot.routes'
// import otpRoute from "./routes/sentotp.routes"
// import bot from './controllers/bot.controller';
// console.log("Telegram Bot is running...", bot);
const invite_routes_1 = __importDefault(require("./routes/invite.routes"));
const checkIn_routes_1 = __importDefault(require("./routes/checkIn.routes"));
const buyProduct_routes_1 = __importDefault(require("./routes/buyProduct.routes"));
const productRoutes_route_1 = __importDefault(require("./routes/productRoutes.route"));
const topMinors_routes_1 = __importDefault(require("./routes/topMinors.routes"));
const resetPassword_routes_1 = __importDefault(require("./routes/resetPassword.routes"));
const swaggerConfig_1 = __importDefault(require("./utils/swaggerConfig"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const verifyEamil_routes_1 = __importDefault(require("./routes/verifyEamil.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
// Sample Route
app.get('/', (req, res) => {
    res.json({ message: 'Hello, Express with TypeScript!' });
});
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/rewards', reward_routes_1.default);
app.use('/api/v1/refferal', referral_routes_1.default);
app.use('/api/v1/invitation', invite_routes_1.default);
app.use('/api/v1/checkin', checkIn_routes_1.default);
app.use('/api/v1/orders', buyProduct_routes_1.default);
app.use('/api/v1/minor', topMinors_routes_1.default);
app.use('/api/v1/reset', resetPassword_routes_1.default);
app.use('/api/v1/product', productRoutes_route_1.default);
app.use('/api/v1/email', verifyEamil_routes_1.default);
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
