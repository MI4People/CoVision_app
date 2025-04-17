import * as Localization from "expo-localization";

const locales = Localization.getLocales(); // Returns array of locale objects
export const locale = locales[0].languageTag; // e.g. "en-US"
