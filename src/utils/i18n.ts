export default class T {
  constructor(locales, locale) {
    this.locales = locales;
    if (locale) {
      this.locale = locale;
    }
  }

  setLocale(code) {
    this.locale = code;
  }

  _(line) {
    const { locales, locale } = this;
    if (locale && locales[locale] && locales[locale][line]) {
      line = locales[locale][line];
    }

    return line;
  }
}
