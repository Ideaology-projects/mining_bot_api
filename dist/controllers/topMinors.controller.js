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
exports.TopMinors = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const TopMinors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            orderBy: {
                totalBalance: 'desc',
            },
            take: 10,
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.TopMinors = TopMinors;
