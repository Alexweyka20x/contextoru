let el = <HTMLInputElement>document.querySelector('.word');
let arr: [number, string][] = [];

function insert_word(word: string, rating: number) {
    let pos = 0
    while (pos < arr.length && arr[pos][0] <= rating) pos++;
    if (pos > 0 && arr[pos - 1][0] == rating) return;
    arr.splice(pos, 0, [rating, word]);
}

function get_span(s: string, className: string = "") {
    let res = document.createElement('span');
    res.textContent = s;
    res.className = className
    return res;
}

function get_word_html(word: string, rating: number) {
    let res = document.createElement('div'), outer_bar = document.createElement('div'), inner_bar = document.createElement('div'), row = document.createElement('div');
    outer_bar.className = "outer-bar";
    inner_bar.className = "inner-bar";
    res.className = "row-wrapper";
    row.className = "row"
    
    let perc = 100 - (rating - 1) / 10;
    if (perc < 1) perc = 1;

    inner_bar.style.width = perc.toString() + "%";
    if (rating <= 300) inner_bar.style.backgroundColor = "var(--green)";
    else if (rating <= 500) inner_bar.style.backgroundColor = "var(--yellow)";
    else inner_bar.style.backgroundColor = "var(--red)";
    
    outer_bar.appendChild(inner_bar);
    row.appendChild(get_span(word));
    row.appendChild(get_span(rating.toString()));
    res.appendChild(outer_bar);
    res.appendChild(row);

    return res;
}

el.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        await fetch('http://localhost:8000/check_guess',
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: el.value })
            }
        )
        .then((response) => response.json())
        .then((data) => {
            const message = document.querySelector('.message');
            let word = el.value;

            if (document.querySelector(".how-to-play")) {
                (<HTMLElement>document.querySelector(".how-to-play")).remove();
            }

            message!.innerHTML = "";
            if (data.error != "ok") {
                message!.appendChild(get_span("Извините, я не знаю это слово", "message-text"));
                return;
            }

            insert_word(word, data.rating);
            const history = document.querySelector('.guess-history')
            history!.innerHTML = ""
            for (let p of arr) {
                history!.appendChild(get_word_html(p[1], p[0]));
                if (p[1] == word)
                    history!.lastElementChild?.classList.add("current");
            }
            message!.appendChild(get_word_html(word, data.rating));
            message!.lastElementChild?.classList.add("current");

            const info = document.querySelector(".info-bar :nth-child(4)");
            info!.textContent = arr.length.toString();
        })
    }
})