const expect = require('chai').expect;
const mongoose = require('mongoose');
const AuthController = require('../controllers/auth');

const User = require('../models/user');

describe('Auth Controller', function() {
    before(function(done) {
        mongoose
          .connect(
            'mongodb+srv://WATN:123qwe123@cluster0-igf25.mongodb.net/shop', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
          )
          .then(result => {
            const user = new User({
                _id: '5c0f66b979af55031b34728a',
                cart: { items: [] },
                admin: true,
                name: 'admin',
                email: 'admin@mail.ru',
                password: '123qwe123',
                order: [],
            });
            return user.save();
          })
          .then(() => {
            done();
          });
    });

    it('auth is failed, return status 401 message "Auth failed!"', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'admin@mail.ru',
                password: '123qwe123'
            }
        };

        // AuthController.getUserStatus(req, res, () => {}).then(() => {
        //     expect(res.statusCode).to.be.equal(200);
        //     expect(res.admin).to.be.equal(true);
        //     expect(res.expiresIn).to.be.equal(3600);
        //     expect(res.).to.be.equal('I am new!');
        //     done();
        // });

        AuthController.login(req, res, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('status', 401);
            expect(res.message).to.be.equal('Auth failed!');
            done();
        });

        User.findOne.restore();
    });
})
