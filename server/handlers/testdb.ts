import { Router, Request, Response } from "express";
import user from "../schema/user";

export const createUser = async (req: Request, res: Response) => {
  try {
    const User_ = await user.createUser(req.body);
    res.status(200).json({ User: User_ });
  } catch (error) {
    console.log(error);
    res.status(500).json({ User: "unable to create user" });
  }
};
export const findUser = async (req: Request, res: Response) => {
  try {
    const User_ = await user.findById(req.body.username);
    res.status(200).json({ User: User_ });
  } catch (error) {
    console.log(error);
    res.status(500).json({ User: "unable to find user" });
  }
};
export const updateRequest = async (req: Request, res: Response) => {
  try {
    const User_ = await user.updateRequest(req.body.username, 1);
    res.status(200).json({ User: User_ });
  } catch (error) {
    console.log(error);
    res.status(500).json({ User: "unable to find user" });
  }
};
export const subscribeUser = async (req: Request, res: Response) => {
  try {
    const User_ = await user.subscribeUser(req.body.username);
    res.status(200).json({ User: User_ });
  } catch (error) {
    console.log(error);
    res.status(500).json({ User: "unable to find user" });
  }
};
