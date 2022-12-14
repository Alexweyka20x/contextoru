# pip install -r requirements.txt
# python -m uvicorn main:app --reload
from gensim.models import KeyedVectors
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "*"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Guess(BaseModel):
    word: str

class Hint(BaseModel):
    number: int


w2v = KeyedVectors.load_word2vec_format('wiki_1e8-cleared.w2v')
secret = 'карта'
vals = w2v.most_similar(secret, topn=100000)
print(vals[:10])
d = {k: i+2 for i, (k, v) in enumerate(vals)}


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/check_guess")
async def check_guess(guess: Guess):
    print(guess)
    if guess.word == secret:
        print({'rating': 1, 'error': 'ok'})
        return {'rating': 1, 'error': 'ok'}
    elif guess.word in d:
        print({'rating': d[guess.word], 'error': 'ok'})
        return {'rating': d[guess.word], 'error': 'ok'}
    print({"error": 'word is not found'})
    return {"error": 'word is not found'}


@app.post("/hint")
async def hint(number: Hint):
    if number.number == 1:
        return { 'error': 'this word is secret!' }
    if number.number > len(vals) + 1:
        return { 'error': 'i dont know this word' }
    return { 'word': vals[number.number - 2][0], 'error': 'ok' }