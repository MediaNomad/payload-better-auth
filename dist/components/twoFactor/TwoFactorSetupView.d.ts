export type TwoFactorSetupViewProps = {
    /** Custom logo element */
    logo?: React.ReactNode;
    /** Page title. Default: 'Set Up Two-Factor Authentication' */
    title?: string;
    /** Path to redirect after successful setup. Default: '/admin' */
    afterSetupPath?: string;
    /** Callback after successful setup */
    onSetupComplete?: () => void;
};
/**
 * Two-factor authentication setup component.
 * Displays QR code for TOTP apps and allows verification.
 * Uses Better Auth's twoFactor plugin endpoints.
 */
export declare function TwoFactorSetupView({ logo, title, afterSetupPath, onSetupComplete, }: TwoFactorSetupViewProps): import("react").JSX.Element;
export default TwoFactorSetupView;
