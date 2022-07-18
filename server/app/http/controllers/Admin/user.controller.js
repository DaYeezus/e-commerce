const DefaultController = require("../default.controller")
const createHttpError = require("http-errors")
const {UserModel} = require("../../../models/User");
const {StatusCodes} = require("http-status-codes");
const {isValidObjectId} = require("mongoose");
const {deleteInvalidPropertyInObject} = require("../../../utils/functions");
module.exports = new (class UserController extends DefaultController {
    async getAll(req, res, next) {
        try {
            const {search} = req.query;
            const dataBaseQuery = {}
            if (search) {
                dataBaseQuery['$text'] = {$search: search.toString()}
            }
            const users = await UserModel.find(dataBaseQuery, {
                username: 1,
                email: 1,
                mobileNumber: 1,
                accessToken: 1,
                Role: 1
            })
            return res.status(StatusCodes.OK).json({
                success: true,
                users
            })
        } catch (e) {
            next(e)
        }
    }

    async getUser(req, res, next) {
        try {
            const {id} = req.params
            if (!isValidObjectId(id)) {
                throw createHttpError.BadRequest('not a valid id')
            }
            const user = await UserModel.findOne({_id: id}, {
                firstName: 1,
                lastName: 1,
                username: 1,
                mobileNumber: 1,
                email: 1,
                birthday: 1,
                Role: 1,
                isPrime: 1,
                isBanned: 1,
            }).catch(err => {
                throw createHttpError.internalServerError(err)
            })
            return res.status(StatusCodes.OK).json({
                success: true,
                user: user
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProfile(req, res, next) {
        try {
            const {id} = req.params
            console.log(req.body)
            const existUser = await UserModel.findOne({_id: id}, {Role: 1, accessToken: 1, refreshToken: 1})
            const body = req.body;
            if (body.Role) {
                if (existUser.Role !== "USER" && req.user.Role !== "SUPERADMIN") {
                    throw createHttpError.BadRequest('you are not able to change the role of this user')
                }
            }
            await UserModel.updateOne({_id: id}, {$set: {...body}}).then(result => {
                if (result.modifiedCount > 0) {
                    existUser.accessToken = "";
                    existUser.refreshToken = "";
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "user profile has been updated successfully."
                    })
                }
                throw createHttpError.BadRequest("user has not been updated successfully.")
            }).catch((error) => {

                throw createHttpError.InternalServerError(error)
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }


})()