import type { AdminViewProps } from 'payload';
type LoginViewWrapperProps = AdminViewProps;
/**
 * Server component wrapper for LoginView.
 * Reads login configuration from payload.config.custom.betterAuth.login
 * and passes it as props to the client LoginView component.
 */
export declare function LoginViewWrapper({ initPageResult }: LoginViewWrapperProps): Promise<import("react").JSX.Element>;
export default LoginViewWrapper;
