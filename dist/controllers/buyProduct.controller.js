"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const purchaseProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: { dailyCheckinRewards: true },
        });
        const product = yield prisma.product.findUnique({
            where: { id: productId },
        });
        if (!user || !product) {
            return res.status(400).json({ message: 'Invalid user or product ID' });
        }
        const totalCost = product.price * quantity;
        if (!user.dailyCheckinRewards ||
            user.dailyCheckinRewards.coins < totalCost) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        yield prisma.$transaction([
            prisma.order.create({
                data: {
                    userId,
                    productId,
                    quantity,
                    totalCost,
                },
            }),
            prisma.dailyCheckinRewards.update({
                where: { userId },
                data: { coins: { decrement: totalCost } },
            }),
        ]);
        return res.status(200).json({ message: 'Purchase successful' });
    }
    catch (error) {
        console.error('Error in purchaseProduct:', error);
        return res.status(500).json({ message: 'Something went wrong', error });
    }
});
exports.purchaseProduct = purchaseProduct;
