import { jsx as _jsx } from "react/jsx-runtime";
import { DefaultTemplate } from '@payloadcms/next/templates';
import { getVisibleEntities } from '@payloadcms/ui/shared';
import { ApiKeysManagementClient } from '../ApiKeysManagementClient.js';
import { getApiKeyScopesConfig } from '../../../plugin/index.js';
import { buildAvailableScopes } from '../../../utils/generateScopes.js';
/**
 * API Keys management view for Payload admin panel.
 * Server component that provides the admin layout.
 */ export async function ApiKeysView({ initPageResult, params, searchParams }) {
    const { req } = initPageResult;
    const { payload } = req;
    // Await params/searchParams for Next.js 15+ compatibility
    const resolvedParams = params ? await params : undefined;
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const visibleEntities = getVisibleEntities({
        req
    });
    // Build available scopes from plugin config and collections
    const scopesConfig = getApiKeyScopesConfig();
    const availableScopes = buildAvailableScopes(payload.config.collections, scopesConfig);
    // Get default scopes from config
    const defaultScopes = scopesConfig?.defaultScopes ?? [];
    return /*#__PURE__*/ _jsx(DefaultTemplate, {
        i18n: req.i18n,
        locale: req.locale,
        params: resolvedParams,
        payload: payload,
        permissions: initPageResult.permissions,
        searchParams: resolvedSearchParams,
        user: req.user ?? undefined,
        visibleEntities: visibleEntities,
        children: /*#__PURE__*/ _jsx(ApiKeysManagementClient, {
            availableScopes: availableScopes,
            defaultScopes: defaultScopes
        })
    });
}
export default ApiKeysView;
