import * as transactionService from "../services/transactionService.js";

export const create = async (req, res) => {
  //  console.log("Creating transaction for user:", req);
  try {
    const transaction = await transactionService.createTransaction(
      req.body,
      req.user.id
    );

    res.status(201).send(transaction);
  } catch (error) {
    res.status(500).send(error); // check status code
  }
};

export const getAll = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByUser(
      req.user.id
    );
    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user.id
    );
    res.status(200).send(transaction);
  } catch (error) {
    res.status(500).send(error);
  }
};
