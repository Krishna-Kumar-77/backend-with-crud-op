const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modles/userModle");
const Data = require('../modles/dataModle')

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Enter All the required fields");
    }

    // check if already Exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(401);
      throw new Error("Email already Exist");
    }
    // generating hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashpassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Enter all the required fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not Found with this Email");
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
    const { name, password, email } = req.body;
    if (email) {
      res.status(400);
      throw new Error("You can not update your Email");
    }

    if (!name && !password) {
      res.status(400);
      throw new Error("Enter your field which you want to update");
    }
    if (name && password) {
      res.status(4000);
      throw new Error("You can Update only one field at a time");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400);
      throw new Error("Invalid Credentials");
    }

    if (user.id.toString() !== req.user.id.toString()) {
      res.status(401);
      throw new Error("You are not Authorized person");
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      const updatePassword = await User.findByIdAndUpdate(
        req.params.id,
        { password: hashpassword },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json(updatePassword);
    }
    if (name) {
      const updateName = await User.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json(updateName);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400);
      throw new Error("Please Enter Your valid User Id");
    }
    const user = await User.findById(id);
    if (!user) {
      res.status(400);
      throw new Error("Their is no User with This ID");
    }

    if (user.id.toString() !== req.user.id.toString()) {
      res.status(401);
      throw new Error("You are not Authorized person");
      }
      
      const datas = await Data.find({user: user.id})
      datas.forEach(myData => {
          
            myData.remove();
      })
    await user.remove();
    res.status(202).json({ user: id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
