export type ForgotPasswordViewProps = {
    /** Custom logo element */
    logo?: React.ReactNode;
    /** Page title. Default: 'Forgot Password' */
    title?: string;
    /** Path to login page. Default: '/admin/login' */
    loginPath?: string;
    /** Success message to show after email is sent */
    successMessage?: string;
};
/**
 * Forgot password page component for requesting a password reset email.
 * Uses Better Auth's forgetPassword endpoint.
 */
export declare function ForgotPasswordView({ logo, title, loginPath, successMessage, }: ForgotPasswordViewProps): import("react").JSX.Element;
export default ForgotPasswordView;
