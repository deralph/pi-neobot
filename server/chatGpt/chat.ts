import { Request, Response } from "express";
import user from "../schema/user";

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

const answer = async (req: Request, res: Response) => {
  const { text, username } = req.body;
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    console.log(req.body);

    const User_ = await user.findById(username);
    if (!User_) {
      res.status(401).json({
        error: " no user found kindly\n login before use",
      });
    }
    const date = new Date().toLocaleDateString();
    const checkDate = new Date(date) > new Date(User_.expiresIn);

    if (User_.requestNo >= 3) {
      if (!User_.expiresIn) {
        res.status(200).json({
          error:
            "You have exceeded the trial limit subscribe to enjoy more benefit",
        });
        if (checkDate) {
          res.status(200).json({
            error:
              "You have exceeded the trial limit subscribe to enjoy more benefit",
          });
        }
      }
    }

    const message: ChatCompletionRequestMessage[] = [
      { role: "user", content: text },
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
      max_tokens: 800,
    });

    if (!response?.data?.choices[0].message?.content) {
      res.status(500).json({
        error: "unable to generate response at this time \n Please try again",
      });
    }

    const subscribed = await user.updateRequest(
      User_.username,
      User_.requestNo + 1
    );
    if (!subscribed) {
      res.status(500).json({
        error: "user request unuploaded",
      });
    }
    return res
      .status(200)
      .json({ message: response?.data?.choices[0].message?.content });
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      // throw new Error("an error ocured when getting response");
    } else {
      console.log(error.message);
      // throw new Error("an error ocured when getting response");
      console.log(error);
    }
    res.status(502).json({
      error: "an error occured, try again later",
    });
  }
};

export default answer;
