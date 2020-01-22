
import TranslationService from './translation-service';

import en from '../assets/i18n/en.json';
import pt from '../assets/i18n/pt.json';

TranslationService.init({ en, pt }, 'en');

window.handleTranslationChangeClick = (anchor: HTMLAnchorElement) => {
	const language = anchor.getAttribute('data-language');
	TranslationService.changeLanguage(language);
}

window.handleButtonClick = () => {
	alert(TranslationService.translate('content.inner-content.alert'));
}



