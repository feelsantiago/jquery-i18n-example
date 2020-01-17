import $ from 'jquery';
import TranslationService from './translation-service';

import en from '../assets/i18n/en.json';
import pt from '../assets/i18n/pt.json';

const localize = () => {
    $('#header').localize();
    $('#nav').localize();
    $('#content').localize();
}

$(document).ready(async () => {
    await TranslationService.init({ en, pt }, "en", $, localize);

    $('.btn-language').click((event) => {
        TranslationService.changeLanguage(event.target.getAttribute("data-language"));
    })
})