import axios from "axios";
import { Router } from "express";
import PaymentModel from "../schema/payment";
import platformAPIClient from "../services/platformAPIClient";
import user from "../schema/user";

import "../types/session";

const config = {
  headers: {
    Authorization: `Key bddjbksqtnqcafxvcw3gxzisvtgdnmtv2mgqk0bj2jdlgwivrinan4wsou8vgx13`,
  },
};

export default function mountPaymentsEndpoints(router: Router) {
  // handle the incomplete payment
  router.post("/incomplete", async (req, res) => {
    const payment = req.body.payment;
    const paymentId = payment.identifier;
    const txid = payment.transaction && payment.transaction.txid;
    const txURL = payment.transaction && payment.transaction._link;

    // find the incomplete order
    const order = await PaymentModel.findOne({ pi_payment_id: paymentId });

    // // order doesn't exist
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    // check the transaction on the Pi blockchain
    const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
    const paymentIdOnBlock = horizonResponse.data.memo;

    // and check other data as well e.g. amount
    if (paymentIdOnBlock !== order.pi_payment_id) {
      return res.status(400).json({ message: "Payment id doesn't match." });
    }

    // mark the order as paid

    await PaymentModel.findOneAndUpdate(
      { pi_payment_id: paymentId },
      { paid: true },
      {
        new: true,
      }
    );

    // let Pi Servers know that the payment is completed
    await platformAPIClient.post(
      `/v2/payments/${paymentId}/complete`,
      {
        txid,
      },
      config
    );
    return res
      .status(200)
      .json({ message: `Handled the incomplete payment ${paymentId}` });
  });

  // approve the current payment
  router.post("/approve", async (req, res) => {
    const paymentId: any = req.body.paymentId;
    const currentPayment = await platformAPIClient.get(
      `/v2/payments/${paymentId}`,
      config
    );
    console.log(currentPayment);

    await PaymentModel.create({
      username: req.body.username,
      uid: req.body.uid,
      pi_payment_id: paymentId,
    });

    // let Pi Servers know that you're ready
    const responseFromPi = await platformAPIClient.post(
      `/v2/payments/${paymentId}/approve`,
      {},
      config
    );
    console.log(responseFromPi);
    return res
      .status(200)
      .json({ message: `Approved the payment ${paymentId}` });
  });

  // complete the current payment
  router.post("/complete", async (req, res) => {
    const app = req.app;

const metadata = req.body.metadata!.username
    const paymentId = req.body.paymentId;
    const txid = req.body.txid;

    try {
      const payment = await platformAPIClient.get(
        `/v2/payments/${paymentId}`,
        config
      );
      console.log(payment);
      const invoice = await PaymentModel.findOneAndUpdate(
        { pi_payment_id: paymentId },
        { paid: true },
        {
          new: true,
        }
      );

      if (!invoice) {
        return res
          .status(404)
          .json({ error: "not_found", message: "Invoice not found" });
      }

      // let Pi server know that the payment is completed
      const responseFromPi = await platformAPIClient.post(
        `/v2/payments/${paymentId}/complete`,
        { txid },
        config
      );
      console.log(responseFromPi);

      try {
         await user.subscribeUser(metadata);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "unable to find user" });
      }

      return res
        .status(200)
        .json({ message: `Completed the payment ${paymentId}` });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: `an error occured and couldn't complete the payment of ${paymentId}`,
      });
    }
  });

  // handle the cancelled payment
  router.post("/cancelled_payment", async (req, res) => {
    const paymentId = req.body.paymentId;

    /*
      implement your logic here
    */

    await PaymentModel.findOneAndUpdate(
      { pi_payment_id: paymentId },
      { cancelled: true },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: `Cancelled the payment ${paymentId}` });
  });
}
