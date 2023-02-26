import { Request, Response } from "express";
import user from "../schema/user";

const { Configuration, OpenAIApi } = require("openai");
// require("dotenv").config();

const answer = async (req: Request, res: Response) => {
  const { text } = req.body;
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
    });
    const User_ = user.findById(req.session.username);
    if (!User_) {
      res.status(400).json({
        error: " no user found kindly login before use",
      });
      console.log("an error ocurred in the registering of user");
    }

    const date = new Date().toLocaleDateString();
    const checkDate = new Date(date) > new Date(User_.expiresIn);

    if (User_.requestNo == 3 && checkDate) {
      res.status(400).json({
        error:
          "user have exceeded the trial limit subscribe to enjoy more benefit",
      });
    }
    if (!completion.data.choices[0].text) {
      res.status(500).json({
        error: "unable to generate response at this time",
      });
    }
    await User_.updateRequest(User_.username, User_.requestNo + 1);

    return res.status(200).json({ message: completion.data.choices[0].text });
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      res.status(500).json({
        error: "an error occured",
      });
      throw new Error("an error ocured when getting response");
    } else {
      console.log(error.message);
      throw new Error("an error ocured when getting response");
    }
    // console.log(error);
  }
};

export default answer;
