import { type PayloadAuthClient } from '../../exports/client.js';
import type { AvailableScope } from '../../types/apiKey.js';
export type ApiKeysManagementClientProps = {
    /** Optional pre-configured auth client */
    authClient?: PayloadAuthClient;
    /** Page title. Default: 'API Keys' */
    title?: string;
    /** Available scopes for key creation. Auto-generated if not provided. */
    availableScopes?: AvailableScope[];
    /** Default scopes to pre-select when creating a key */
    defaultScopes?: string[];
};
/**
 * Client component for API keys management.
 * Lists, creates, and deletes API keys with scope selection.
 */
export declare function ApiKeysManagementClient({ authClient: providedClient, title, availableScopes, defaultScopes, }?: ApiKeysManagementClientProps): import("react").JSX.Element;
export default ApiKeysManagementClient;
