/* @flow */

import APIBase from './base';

import type { OtherLocaleTranslation } from './types';


export default class EntityAPI extends APIBase {
    /**
     * Return a list of entities for a project and locale.
     *
     * Pass in a `resource` to restrict the list to a specific path.
     * If the `exclude` array has values, those entities will be excluded from
     * the query. Use this to query for the next set of entities.
     */
    async getEntities(
        locale: string,
        project: string,
        resource: string,
        exclude: ?Array<number>,
    ): Promise<Object> {
        const payload = new FormData();
        payload.append('locale', locale);
        payload.append('project', project);

        if (resource !== 'all') {
            payload.append('paths[]', resource);
        }

        if (exclude && exclude.length) {
            payload.append('exclude_entities', exclude.join(','));
        }

        const headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');

        return await this.fetch('/get-entities/', 'POST', payload, headers);
    }

    async getHistory(
        entity: number,
        locale: string,
        pluralForm: number = -1,
    ) {
        const payload = new URLSearchParams();
        payload.append('entity', entity.toString());
        payload.append('locale', locale);
        payload.append('plural_form', pluralForm.toString());

        const headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');

        return await this.fetch('/get-history/', 'GET', payload, headers);
    }

    async getOtherLocales(
        entity: number,
        locale: string,
        pluralForm: number = -1,
    ): Promise<Array<OtherLocaleTranslation>> {
        const payload = new URLSearchParams();
        payload.append('entity', entity.toString());
        payload.append('locale', locale);
        payload.append('plural_form', pluralForm.toString());

        const headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');

        const results = await this.fetch('/other-locales/', 'GET', payload, headers);

        return results.map(entry => {
            return {
                code: entry.locale__code,
                locale: entry.locale__name,
                direction: entry.locale__direction,
                script: entry.locale__script,
                translation: entry.string,
            };
        });
    }
}
