import { Router, Request, Response } from "express";
import InvoicesModel from "../schema/data";
import user from "../schema/user";
import { User } from "../types/interfaces";

export const createUser = async (req: Request, res: Response) => {
  const userDetails: User = {
    username: req.body.username,
    subscribedIn: "",
    expiresIn: "",
    requestNo: 0,
  };
  try {
    const User = await user.findById(req.body.username);
    if (!User) {
      const User_ = await user.createUser(userDetails);

      if (!User_) {
        res.status(500).json({ error: "unable to create user" });
      }
      res.status(200).json({ User: User_ });
    }
    res.status(200).json({ User: User });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to create user" });
  }
};

export const subscribeUser = async (req: Request, res: Response) => {
  try {
    const User_ = await user.subscribeUser(req.body.username);
    res.status(200).json({ User: User_ });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to find user" });
  }
};
export const checkInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await InvoicesModel.find({ paid: true });
    res.status(200).json({ count: invoice.length, User: invoice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to find payments" });
  }
};
