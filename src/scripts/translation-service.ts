import i18next, { TFunction } from 'i18next';
import jqueryI18next from 'jquery-i18next';

class TranslationService {

    private i18nT: TFunction;
    private refreshTranslation: (() => void);

    async init<T, K extends keyof T>(resources: T, defaultLanguage: K, $: JQueryStatic, jqueryLocalize: () => void) {

        const keys = Object.keys(resources);
        const translations = {};

        // example: { 'pt': translation: { "home": "casa" }}
        keys.forEach(key => translations[key] = { translation: resources[key] });
        this.i18nT = await i18next.init({ resources: translations });
        jqueryI18next.init(i18next, $);

        this.refreshTranslation = jqueryLocalize;
        await this.changeLanguage(defaultLanguage as string);
    }

    async changeLanguage(language: string) {
        await i18next.changeLanguage(language);
        this.refreshTranslation();
    }

}

export default new TranslationService();