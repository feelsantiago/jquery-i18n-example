import i18next, { TFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

type Resource = { [ key: string ]: any };

class TranslationService {

	private i18nT: TFunction;
	private i18nAttributeKey = 'data-i18n';
	private i18nAttributeOptions = 'data-i18n-options';
	private languageKeys: string[];

    /**
     * Initialize i18n and detect the browser language to translate.
     * @param resources Object with translations languages { en: { key: value }, pt: { key: value }}.
     * @param defaultLanguage Default language to fallback when language detection fails.
     * @param $ JQuery Object
     * @param jqueryLocalize Function that call JQuery.localize() to update texts.
     */
    async init<T, K extends keyof T>(resources: T, defaultLanguage: K) {

        this.languageKeys = Object.keys(resources);
        const translations = {};

        // example: { 'pt': translation: { "home": "casa" }}
        this.languageKeys.forEach(key => translations[key] = { translation: resources[key] });
        this.i18nT = await i18next.use(LanguageDetector).init({ 
            fallbackLng: defaultLanguage as string,
            preload: this.languageKeys,
            resources: translations 
		});
		
		this.refresh();
    }

    async changeLanguage(language: string) {
        await i18next.changeLanguage(language);
        this.refresh();
	}

	public translate (key: string, options?: any) {
		return this.i18nT(key, options);
	}

	private refresh() {
		const language = this.getLanguageKey(i18next.language);
		const resource = i18next.getResourceBundle(language, '');
		this.run(resource);
	}
	
	private run(resource: Resource) {	
		const selectors = Object.keys(resource);
		const elements = document.querySelectorAll(selectors.map(selector => `#${selector}, .${selector}`).join(', '));
		this.findTranslatedElements(elements, resource);		
	}

	private findTranslatedElements (elements: NodeListOf<Element> | HTMLCollection, resource: Resource) {
	
		for (let i = 0; i < elements.length; i++) {

			if(!(elements[i].children.length > 0)) {
				this.translateElement(elements[i]);
			} 
			
			this.findTranslatedElements(elements[i].children, resource)
		}
	}

	private translateElement(element: Element) {

		const translationKey = element.getAttribute(this.i18nAttributeKey);
		const translationOptions = element.getAttribute(this.i18nAttributeOptions);

		if (translationKey) {
			element.innerHTML = this.i18nT(translationKey, translationOptions);
		}
	}

	private getLanguageKey (key: string) {
		return this.languageKeys.find((language => {

			if (language === key) return true;
			
			const keyWithoutHifen = key.split('-')[0];
			const languageWithoutHifen = key.split('-')[0]; 
			
			if (keyWithoutHifen === languageWithoutHifen) return true;

			return false;
		}))
	}

}

export default new TranslationService();