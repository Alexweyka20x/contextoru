const elem = document.querySelector('.input-text')

elem.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        await fetch('http://localhost:8000/check_guess',
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: elem.value })
            }
        )
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            const history = document.querySelector('.history')
            history.innerHTML += `<p>${elem.value}   ->>>>>   ${data.rating}</p>`
        })
    }
})