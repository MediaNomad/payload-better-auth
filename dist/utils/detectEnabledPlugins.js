/**
 * Utility to detect which Better Auth plugins are enabled
 */ /**
 * Detects which Better Auth plugins are enabled from the options.
 * Inspects the plugins array by checking plugin identifiers.
 *
 * @param options - Better Auth options containing plugins array
 * @returns Object with boolean flags for each supported plugin
 */ export function detectEnabledPlugins(options) {
    const plugins = options?.plugins ?? [];
    const result = {
        hasAdmin: false,
        hasApiKey: false,
        hasTwoFactor: false,
        hasPasskey: false,
        hasMagicLink: false,
        hasMultiSession: false,
        hasOrganization: false
    };
    for (const plugin of plugins){
        // Better Auth plugins have an id property
        const id = plugin.id;
        switch(id){
            case 'admin':
                result.hasAdmin = true;
                break;
            case 'api-key':
                result.hasApiKey = true;
                break;
            case 'two-factor':
                result.hasTwoFactor = true;
                break;
            case 'passkey':
                result.hasPasskey = true;
                break;
            case 'magic-link':
                result.hasMagicLink = true;
                break;
            case 'multi-session':
                result.hasMultiSession = true;
                break;
            case 'organization':
                result.hasOrganization = true;
                break;
        }
    }
    return result;
}
