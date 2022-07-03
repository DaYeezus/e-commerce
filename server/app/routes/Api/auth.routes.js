const authController = require("../../http/controllers/Api/auth.controller");

const router = require("express").Router();
//? Email Authentication Routes
router.post("/email/login", authController.loginByEmail);
router.post("/email/register", authController.registerByEmail);
router.post(
    "/email/verify-account/:verificationToken",
    authController.verifyAccountByEmail
);
router.post("/email/resend-code/:token", authController.resendOTPToEmail);
router.post("/email/get-reset-password", authController.getResetPasswordLink);
router.post(
    "/email/reset-password/:resetPasswordToken",
    authController.resetPassword
);
router.post("/email/logout/:accessToken", authController.logOut);

//? Mobile Authentication
router.post("/mobile/get-otp", authController.getOTP);
router.post("/mobile/validate-otp", authController.validateOTP);

module.exports = {
    AuthRouter: router,
};
