import { jsx as _jsx } from "react/jsx-runtime";
import { LoginView } from './LoginView.js';
/**
 * Server component wrapper for LoginView.
 * Reads login configuration from payload.config.custom.betterAuth.login
 * and passes it as props to the client LoginView component.
 */ export async function LoginViewWrapper({ initPageResult }) {
    const { req } = initPageResult;
    const { payload } = req;
    // Read login config from payload.config.custom.betterAuth.login
    const loginConfig = payload.config.custom?.betterAuth?.login ?? {};
    return /*#__PURE__*/ _jsx(LoginView, {
        afterLoginPath: loginConfig.afterLoginPath,
        requiredRole: loginConfig.requiredRole,
        requireAllRoles: loginConfig.requireAllRoles,
        enablePasskey: loginConfig.enablePasskey,
        enableSignUp: loginConfig.enableSignUp,
        defaultSignUpRole: loginConfig.defaultSignUpRole,
        enableForgotPassword: loginConfig.enableForgotPassword,
        resetPasswordUrl: loginConfig.resetPasswordUrl,
        title: loginConfig.title
    });
}
export default LoginViewWrapper;
