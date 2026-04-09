export const login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (username == "hamza" && password == "123456") {
      return res.status(200).json({ message: "Login successful" });
    }
    return res.status(400).json({ message: "wrong username or password" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
