import * as AuthService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await AuthService.loginUser(req.body);
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};
