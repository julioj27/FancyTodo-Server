const { User } = require('../models/index.js');

const {comparePassword} = require('../helpers/bcrypt.js');
const {signToken} = require('../helpers/jwt.js');

class UserController {
    static async postUserLoginHandler(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        try {
            const user = await User.findOne({
                where: {
                    email
                }
            })

            const dataPassword = user ? user.password : '';

            if(!user) {
                throw 'Invalid username or password'
            } else if(!comparePassword(password, dataPassword)) {
                throw 'Invalid username or password'
            } else {
                const payload = {
                    email: user.email
                };

                const token = signToken(payload);

                res.status(200).json({token});
            }

        } catch(err) {
            if(err.name === 'SequelizeValidationError') {
                err = err.errors.map(error => error.message);

                res.status(400).json(err);
            }
        }
    }

    static async postUserRegisterHandler(req, res) {
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        }

        try {
            const user = await User.create(newUser);
            
            res.status(201).json({user});
        } catch(err) {
            res.status(400).json({err});
        }

    }
}

module.exports = UserController;