import exp from "constants";
import { Router, Request, Response } from "express";
import PaymentModel from "../schema/payment";
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
    const allUsers = await user.findAll();
    const allpayments = await PaymentModel.find({ paid: true });
    const paidUser: object[] = [];
    allUsers.map((user: any) => {
      if (user.expiresIn) {
        paidUser.push(user);
      }
    });

    res.status(200).json({
      count: allUsers.length,
      subscribers: paidUser.length,
      fullyPaid: allpayments.length,
      allUsers,
      paidUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to find payments" });
  }
};
export const checkUser = async (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({ message: "check console" });
  // try {
  //   const User = await user.findById("Jraphael441");
  //   res.status(200).json({ User });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "unable to find user" });
  // }
};
