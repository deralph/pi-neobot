import axios from "axios";
import { Router } from "express";
import InvoicesModel from "../schema/data";
import platformAPIClient from "../services/platformAPIClient";
import "../types/session";
// import user from "../schema/user";

const config = {
  headers: {
    Authorization: `Key bddjbksqtnqcafxvcw3gxzisvtgdnmtv2mgqk0bj2jdlgwivrinan4wsou8vgx13`,
  },
};

export default function mountPaymentsEndpoints(router: Router) {
  // handle the incomplete payment
  router.post("/incomplete", async (req, res) => {
    const payment = req.body.payment!;
    const paymentId = payment.identifier;
    const txid = payment.transaction && payment.transaction.txid;
    const txURL = payment.transaction && payment.transaction._link;

    /* 
      implement your logic here
      e.g. verifying the payment, delivering the item to the user, etc...

      below is a naive example
    */

    // find the incomplete order
    const app = req.app;
    const orderCollection = app.locals.orderCollection;
    // const order = await orderCollection.findOne({ pi_payment_id: paymentId });
    const order = await InvoicesModel.findOne({ pi_payment_id: paymentId });

    // order doesn't exist
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
    // await orderCollection.updateOne(
    //   { pi_payment_id: paymentId },
    //   { $set: { txid, paid: true } }
    // );
    await InvoicesModel.updateOne(
      { pi_payment_id: paymentId },
      { $set: { txid, paid: true } }
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
    const app = req.app;

    const paymentId: any = req.body.paymentId;
    const currentPayment = await platformAPIClient.get(
      `/v2/payments/${paymentId}`,
      config
    );
    console.log(currentPayment);
    // const orderCollection = app.locals.orderCollection;

    /* 
      implement your logic here 
      e.g. creating an order record, reserve an item if the quantity is limited, etc...
    */

    // await orderCollection.insertOne({
    //   pi_payment_id: paymentId,
    //   product_id: currentPayment.data.metadata.productId,
    //   user: req.body.uid,
    //   txid: null,
    //   paid: false,
    //   cancelled: false,
    //   created_at: new Date(),
    // });

    await InvoicesModel.updateOne(
      { invoiceId: req.body.uid },
      { $set: { pi_payment_id: paymentId } }
    );

    // let Pi Servers know that you're ready
    const responseFromPi = await platformAPIClient.post(
      `/v2/payments/${paymentId}/approve`,
      {},
      config
    );
    return res
      .status(200)
      .json({ message: `Approved the payment ${paymentId}` });
  });

  // complete the current payment
  router.post("/complete", async (req, res) => {
    const app = req.app;

    const paymentId = req.body.paymentId;
    const txid = req.body.txid;
    // const orderCollection = app.locals.orderCollection;

    /* 
      implement your logic here
      e.g. verify the transaction, deliver the item to the user, etc...
    */

    try {
      // await orderCollection.updateOne(
      //   { pi_payment_id: paymentId },
      //   { $set: { txid: txid, paid: true } }
      // );
      const payment = await platformAPIClient.get(
        `/v2/payments/${paymentId!}`,
        config
      );

      const invoice = await InvoicesModel.findOneAndUpdate(
        { pi_payment_id: paymentId },
        { $set: { txid: txid, paid: true, tip: payment.data?.metadata?.tip } },
        { new: true }
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

      // const User = await user.subscribeUser(req.body.username);
      // if (!User) {
      //   res.status(500).json({
      //     message: `user needs to be signed in`,
      //   });
      // }

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
    const app = req.app;

    const paymentId = req.body.paymentId;
    const orderCollection = app.locals.orderCollection;

    /*
      implement your logic here
      e.g. mark the order record to cancelled, etc...
    */

    // await orderCollection.updateOne(
    //   { pi_payment_id: paymentId },
    //   { $set: { cancelled: true } }
    // );
    await InvoicesModel.updateOne(
      { pi_payment_id: paymentId },
      { $set: { cancelled: true } }
    );
    return res
      .status(200)
      .json({ message: `Cancelled the payment ${paymentId}` });
  });
}
