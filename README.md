# web-furigana

web-furigana is a quick and dirty browser plugin that adds International Phonetic Alphabet representations of words to websites. It uses HTML's ruby text, which inserts the IPA as small characters above the <ruby>main<rt>ˈmān</rt></ruby> <ruby>word<rt>ˈwərd</rt>.</ruby> 

The IPA wordlists are taken from [the ipa-dict project](https://github.com/open-dict-data/ipa-dict), and are released under the MIT license.

To use in Firefox, follow the instructions [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing) to install as a temporary add-on.

It's a prototype, and breaks easily on pages that use javascript to dynamically load text. It is being only sporadically worked on.
