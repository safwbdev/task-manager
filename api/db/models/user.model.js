const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const jwtSecret = "6752323uy2guysagd74w8rt73yuwggwr37et37gr734guyg447ru437igri"

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
})


UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
            if (err) {
                resolve(token);
            } else {
                reject();
            }
        })

    })
}

UserSchema.methods.generateRefreshAuthToken = function() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex');

                return resolve(token);
            }
        })
    })
}

UserSchema.methods.createSession = function() {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject("filed to save session to database." + e)
    })
}

// MODELS
UserSchema.statics.findByIdAndToken = function(_id, token) {
    const User = this;
    return User.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if (!user) return Promise.reject();
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) resolve(user);
                else {
                    reject();
                }
            })
        })

    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if (expiresAt > secondsSinceEpoch){
        return false;
    }
    else {
        return true;
    }
}

// MIDDLEWARE
UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 20;
    if(user.isModified('password')){
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})



// HELPERS
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshAuthTokenExpiryTime();

        user.sessions.push({ 'token' : refreshToken, expiresAt });

        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        })
    })
}

let generateRefreshAuthTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    retun ((Date.now() / 1000) + secondsntilExpire);
}


const User = mongoose.model('User', UserSchema);

module.exports = { User }