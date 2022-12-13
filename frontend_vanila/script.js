var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var el = document.querySelector('.word');
var arr = [];
function insert_word(word, rating) {
    var pos = 0;
    while (pos < arr.length && arr[pos][0] <= rating)
        pos++;
    if (pos > 0 && arr[pos - 1][0] == rating)
        return;
    arr.splice(pos, 0, [rating, word]);
}
function get_span(s, className) {
    if (className === void 0) { className = ""; }
    var res = document.createElement('span');
    res.textContent = s;
    res.className = className;
    return res;
}
function get_word_html(word, rating) {
    var res = document.createElement('div'), outer_bar = document.createElement('div'), inner_bar = document.createElement('div'), row = document.createElement('div');
    outer_bar.className = "outer-bar";
    inner_bar.className = "inner-bar";
    res.className = "row-wrapper";
    row.className = "row";
    var perc = 100 - (rating - 1) / 10;
    if (perc < 1)
        perc = 1;
    inner_bar.style.width = perc.toString() + "%";
    if (rating <= 300)
        inner_bar.style.backgroundColor = "var(--green)";
    else if (rating <= 500)
        inner_bar.style.backgroundColor = "var(--yellow)";
    else
        inner_bar.style.backgroundColor = "var(--red)";
    outer_bar.appendChild(inner_bar);
    row.appendChild(get_span(word));
    row.appendChild(get_span(rating.toString()));
    res.appendChild(outer_bar);
    res.appendChild(row);
    return res;
}
el.addEventListener('keypress', function (event) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(event.key === 'Enter')) return [3 /*break*/, 2];
                return [4 /*yield*/, fetch('http://localhost:8000/check_guess', {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ word: el.value })
                    })
                        .then(function (response) { return response.json(); })
                        .then(function (data) {
                        var _a, _b;
                        var message = document.querySelector('.message');
                        var word = el.value;
                        if (document.querySelector(".how-to-play")) {
                            document.querySelector(".how-to-play").remove();
                        }
                        message.innerHTML = "";
                        if (data.error != "ok") {
                            message.appendChild(get_span("Извините, я не знаю это слово", "message-text"));
                            return;
                        }
                        insert_word(word, data.rating);
                        var history = document.querySelector('.guess-history');
                        history.innerHTML = "";
                        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                            var p = arr_1[_i];
                            history.appendChild(get_word_html(p[1], p[0]));
                            if (p[1] == word)
                                (_a = history.lastElementChild) === null || _a === void 0 ? void 0 : _a.classList.add("current");
                        }
                        message.appendChild(get_word_html(word, data.rating));
                        (_b = message.lastElementChild) === null || _b === void 0 ? void 0 : _b.classList.add("current");
                        var info = document.querySelector(".info-bar :nth-child(4)");
                        info.textContent = arr.length.toString();
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=script.js.map