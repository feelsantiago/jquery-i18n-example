import i18next, { TFunction } from 'i18next';
import jqueryI18next from 'jquery-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

class TranslationService {

    private i18nT: TFunction;
    private refreshTranslation: (() => void);

    /**
     * Initialize i18n and detect the browser language to translate.
     * @param resources Object with translations languages { en: { key: value }, pt: { key: value }}.
     * @param defaultLanguage Default language to fallback when language detection fails.
     * @param $ JQuery Object
     * @param jqueryLocalize Function that call JQuery.localize() to update texts.
     */
    async init<T, K extends keyof T>(resources: T, defaultLanguage: K, $: JQueryStatic, jqueryLocalize: () => void) {

        const keys = Object.keys(resources);
        const translations = {};

        // example: { 'pt': translation: { "home": "casa" }}
        keys.forEach(key => translations[key] = { translation: resources[key] });
        this.i18nT = await i18next.use(LanguageDetector).init({ 
            fallbackLng: defaultLanguage as string,
            preload: keys,
            resources: translations 
        });
        jqueryI18next.init(i18next, $);

        this.refreshTranslation = jqueryLocalize;
        this.refreshTranslation();
    }

    async changeLanguage(language: string) {
        await i18next.changeLanguage(language);
        this.refreshTranslation();
    }

}

export default new TranslationService();