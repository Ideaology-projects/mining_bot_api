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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, stock } = req.body;
        if (!name || !price || !stock) {
            res.status(400).json({ message: "Please provide name, price, and stock" });
            return;
        }
        const newProduct = yield prismaClient_1.default.product.create({
            data: { name, price, stock },
        });
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createProduct = createProduct;
