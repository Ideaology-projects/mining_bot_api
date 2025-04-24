import { Request, Response } from 'express'; 
import prisma from '../database/prismaClient'; 

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, price, stock } = req.body;
  
      if (!name || !price || !stock) {
        res.status(400).json({ message: "Please provide name, price, and stock" });
        return;
      }
  
      const newProduct = await prisma.product.create({
        data: { name, price, stock },
      });
  
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  