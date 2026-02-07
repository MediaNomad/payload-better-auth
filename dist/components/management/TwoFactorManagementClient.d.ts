import { type PayloadAuthClient } from '../../exports/client.js';
export type TwoFactorManagementClientProps = {
    /** Optional pre-configured auth client */
    authClient?: PayloadAuthClient;
    /** Page title. Default: 'Two-Factor Authentication' */
    title?: string;
};
/**
 * Client component for two-factor authentication management.
 * Shows 2FA status and allows enabling/disabling.
 */
export declare function TwoFactorManagementClient({ authClient: providedClient, title, }?: TwoFactorManagementClientProps): import("react").JSX.Element;
export default TwoFactorManagementClient;
