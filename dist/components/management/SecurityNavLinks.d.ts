export type SecurityNavLinksProps = {
    /** Base path for security views. Default: '/admin/security' */
    basePath?: string;
    /** Show Two-Factor Auth link. Default: true */
    showTwoFactor?: boolean;
    /** Show API Keys link. Default: true */
    showApiKeys?: boolean;
    /** Show Passkeys link. Default: true */
    showPasskeys?: boolean;
};
/**
 * Navigation links for security management features.
 * Rendered in admin sidebar via afterNavLinks injection.
 * Uses Payload's nav CSS classes for native styling.
 *
 * Links are conditionally shown based on which Better Auth plugins are enabled.
 */
export declare function SecurityNavLinks({ basePath, showTwoFactor, showApiKeys, showPasskeys, }?: SecurityNavLinksProps): import("react").JSX.Element | null;
export default SecurityNavLinks;
