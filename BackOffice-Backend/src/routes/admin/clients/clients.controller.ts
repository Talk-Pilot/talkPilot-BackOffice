import { Request, Response } from "express";
import { getDb } from "../../../core/db/mongo";

export const createNewClient = async (req: Request, res: Response) => {
    try {
        const { name, email, phone } = req.body;
        const client = { name, email, phone };
        const result = await getDb().collection("clients").insertOne(client);
    
        res.status(201).json({
            _id: result.insertedId,
            ...client
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Failed to create client" });
    }
};