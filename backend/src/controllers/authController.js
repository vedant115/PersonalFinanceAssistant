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
    res.status(200).cookie("token", token, { httpOnly: true }).send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
};
