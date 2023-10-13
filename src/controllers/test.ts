const { sequelize } = require("../../models"); // Adjust the path based on your setup
import { Request, Response, NextFunction } from "express";
const { exec } = require("child_process");

export const resetDatabase = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("You can't reset the database in production");
    }

    exec(
      "npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all",
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send(`Error seeding database: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(200).send("Database seeded successfully");
      }
    );
    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const seedDatabase = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("You can't seed the database in production");
    }

    exec(
      "npx sequelize-cli db:seed:all",
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send(`Error seeding database: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(200).send("Database seeded successfully");
      }
    );
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
