const input = <HTMLInputElement>document.querySelector('.word');
const dropdown = <HTMLDivElement>document.querySelector('.dropdown');
const message = document.querySelector('.message');

let arr: [number, string][] = [], tips = 0;


function insert_word_to_list(word: string, rating: number) {
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
    
    let perc = 100 - (rating - 1) / 2000 * 100;
    if (perc < 1) perc = 1;

    inner_bar.style.width = perc.toString() + "%";
    if (rating <= 500) inner_bar.style.backgroundColor = "var(--green)";
    else if (rating <= 1500) inner_bar.style.backgroundColor = "var(--yellow)";
    else inner_bar.style.backgroundColor = "var(--red)";
    
    outer_bar.appendChild(inner_bar);
    row.appendChild(get_span(word));
    row.appendChild(get_span(rating.toString()));
    res.appendChild(outer_bar);
    res.appendChild(row);

    return res;
}


function insert_word(word: string, rating: number) {
    if (document.querySelector(".how-to-play"))
        (<HTMLElement>document.querySelector(".how-to-play")).remove();
    message!.innerHTML = "";
    
    insert_word_to_list(word, rating);
    const history = document.querySelector('.guess-history')
    history!.innerHTML = ""
    for (let p of arr) {
        history!.appendChild(get_word_html(p[1], p[0]));
        if (p[1] == word)
        history!.lastElementChild?.classList.add("current");
    }
    message!.appendChild(get_word_html(word, rating));
    message!.lastElementChild?.classList.add("current");
    
    document.querySelector(".info-bar :nth-child(4)")!.textContent = (arr.length - tips).toString();
    document.querySelector(".info-bar :nth-child(6)")!.textContent = tips.toString();
}


input.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        await fetch('http://localhost:8000/check_guess',
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: input.value })
            }
        )
        .then((response) => response.json())
        .then((data) => {
            if (data.error != "ok") {
                message!.innerHTML = "";
                message!.appendChild(get_span("Извините, я не знаю это слово", "message-text"));
                return;
            }
            insert_word(input.value, data.rating);
            input.value = "";
        })
    }
})


document.querySelector(".btn")!.addEventListener('click', async (event) => {
    if (dropdown.style.display == "block")
        dropdown.style.display = "none";
    else
        dropdown.style.display = "block";
});


document.querySelector(".tip")!.addEventListener('click', async (event) => {
    dropdown.style.display = "none";
    
    let num = 300, i = 0;
    if (arr.length > 0 && arr[0][0] <= 2 * num)
        num = (arr[0][0] >> 1);
    if (num <= 1) {
        num = 2;
        if (arr[i][0] == 1) num = 1;
        for (; i < arr.length && arr[i][0] == num; i++) num++;
        if (i == arr.length)
        num = arr[arr.length - 1][0] + 1;
    }

    await fetch('http://localhost:8000/hint',
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: num })
        }
    )
    .then((response) => response.json())
    .then((data) => {
        tips++;
        insert_word(data.word, num);
    });

});