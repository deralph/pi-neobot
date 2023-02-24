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
    // const User_ = user.findById(req.session.uid);
    // if (!User_) console.log("an error ocurred in the registering of user");
    // if (User_.requestNo > 3) {
    //   res.status(200).json({ output: "user have exceeded the trial limit " });
    // }
    if (completion.data.choices[0].text) {
      // const updateReq = User_.updateRequest(User_.uid, User_.requestNo + 1);
      // console.log(updateReq);
      return res.status(200).json({ output: completion.data.choices[0].text });
    }
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      throw new Error("an error ocured when getting response");
    } else {
      console.log(error.message);
      throw new Error("an error ocured when getting response");
    }
    // console.log(error);
  }
};

export default answer;
