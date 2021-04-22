// Paths to all IPA dicts
const prefix = "resources/ipa-dict-master/data/";
const arabic = prefix + "ar.txt";
const german = prefix + "de.txt";
const en_UK = prefix + "en_UK.txt";
const en_US = prefix + "en_US.txt";
const esperanto = prefix + "eo.txt";
const spanish_ES = prefix + "es_ES.txt";
const spanish_MX = prefix + "es_MX.txt";
const farsi = prefix + "fa.txt";
const finnish = prefix + "fi.txt";
const french = prefix + "fr_FR.txt";
const quebecois = prefix + "fr_QC.txt";
const icelandic = prefix + "is.txt";
const japanese = prefix + "ja.txt";
const jamaican = prefix + "jam.txt";
const khmer = prefix + "km.txt";
const korean = prefix + "ko.txt";
const malay = prefix + "ma.txt";
const norwegian = prefix + "nb.txt";
const odia = prefix + "or.txt";
const romanian = prefix + "ro.txt";
const swedish = prefix + "sv.txt";
const swahili = prefix + "sw.txt";
const isan = prefix + "tts.txt";
const central_vietnamese = prefix + "vi_C.txt";
const northern_vietnamese = prefix + "vi_N.txt";
const southern_vietnamese = prefix + "vi_S.txt";
const cantonese = prefix + "yue.txt";
const mandarin_simplified = prefix + "zh_hans.txt";
const mandarin_traditional = prefix + "zh.hant.txt";


function parse_dict(dict_in) {
    let w = new Map();
    // Split on newline, split on tab, add to map
    dict_in.split(/\n|\r\n/).map(x => x.split(/\t/)).forEach(element => w.set(element[0], element[1]));
    return w;
};

function edit_html(raw_dict) {
    let words = parse_dict(raw_dict);
    let doc = document.body.innerHTML;

    function tokenize(z) {
        let i = 0;
        let n = [];
        let t = [];
        let bracket_count = 0;
        while (i < z.length) {
            let y = z[i];
            switch (y) {
                case " ":
                case "\r\n":
                case "\n":
                case ",":
                case "!":
                case "?":
                case ".":
                case "(":
                case ")":
                case "[":
                case "]":
                case "{":
                case "}":
                case "/":
                case "-":
                case "_":
                case "—":
                case "\"":
                    if (bracket_count === 0) {
                        // Flush t to n, reset t to empty string, then add y to n
                        n.push(t.join(""));
                        t = [];
                        n.push(y);
                    } else {
                        // Just add y to t
                        t.push(y);
                    };
                    i++;
                    break;
                case "<":
                    if (bracket_count === 0) {
                        n.push(t.join(""));
                        t = [];
                        t.push(y);
                        bracket_count = bracket_count + 1;
                    } else {
                        t.push(y);
                        bracket_count = bracket_count + 1;
                    };
                    i++;
                    break;
                case ">":
                    if (bracket_count <= 0) {
                        // Hacky error, unbalanced <s (and likely a malformed HTML file)
                        console.log("Error: Unbalanced >s!");
                    } else {
                        if (bracket_count === 1) {
                            t.push(y);
                            n.push(t.join(""));
                            t = [];
                            bracket_count = bracket_count - 1;
                        } else {
                            t.push(y);
                            bracket_count = bracket_count - 1;
                        };
                    };
                    i++;
                    break;
                default:
                    t.push(y);
                    i++;
            };
        };
        // Final flush
        n.push(t.join(""));
        return n;
    };

    function parse(a) {
        let i = 0;
        let n = [];
        let ignore = false;
        while (i < a.length) {
            let y = a[i];
            if (!ignore) {
                if (/<!--/.test(y)) {
                    n.push(y);
                    i++;
                } else if (y === "<script>") {
                    n.push(y);
                    ignore = true;
                    i++;
                } else if (y === "</script>") {
                    n.push(y);
                    ignore = false;
                    i++;
                } else {
                    if (words.get(y.normalize("NFC").toLowerCase()) !== undefined) {
                        let z = [];
                        z.push("<ruby>")
                        z.push(y);
                        z.push("<rt style=\"font-size: 75%\">");
                        z.push(words.get(y.normalize("NFC").toLowerCase())
                            .split(",")[0].replace(/\//g, ""));
                        z.push("</rt></ruby>");
                        n.push(z.join(""));
                        i++;
                    } else {
                        n.push(y);
                        i++;
                    };
                }
            } else {
                n.push(y);
                i++;
            };
        };
        return n.join("");
    };

    document.body.innerHTML = parse(tokenize(doc));
};

var url = browser.runtime.getURL(en_US);

var words = fetch(url).then(x => x.text()).then(x => edit_html(x));