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
    res.status(500).send(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await transactionService.getTransactionsByUser(
      req.user.id,
      req.query
    );
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || "Internal Server Error" });
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

export const update = async (req, res) => {
  try {
    // console.log("Update request body:", req.body);
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).send(transaction);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user.id);
    res.status(200).send({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};
