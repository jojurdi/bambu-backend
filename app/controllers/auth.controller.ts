const mailClient = require("../controllers/mail.controller.ts");
const db = require("../models/index.ts");
const config = require("../config/auth.config.ts");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');


// activation
exports.activation = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        token: req.params.token,
      },
    })

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    if (new Date().getTime() > user.tokenExpires.getTime()) {
      return res.status(404).send({ message: "Your token has expired." });
    }

    await User.update(
      { status: 'active' },
      { where: { id: user.id } }
    );
    res.send({ message: "User activate successfully!" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//register
exports.signup = async (req, res) => {
  // Save User to Database
  try {

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      token: crypto.createHash('md5').update(req.body.email).digest("hex"),
      tokenExpires: new Date().setHours(new Date().getHours() + 24) //expires in 24 hours
    });


    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) {
        await mailClient.sendMail(user).catch(console.error);
        res.send({ message: "User registered successfully!" });
      }
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      await mailClient.sendMail(user).catch(console.error);
      if (result) res.send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//start session
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
        status: 'active'
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//end session
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};
