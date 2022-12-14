# ๐โโ๏ธ Pomeranian - ๋ธ๋ก์ฒด์ธ ์ง๊ฐ ํ๋ก์ ํธ
![ezgif-3-284a714f63](https://user-images.githubusercontent.com/58019931/190843731-7253d688-1ec9-4be1-811a-aa0b33832107.gif)

<br>

## ๐ก Introduction
- ์ด๋๋ฆฌ์์ง๊ฐ์ ์์ฑ,์กฐํ,๋ณต์ํ  ์ ์๋ ์ง๊ฐ
- ์๊ฐ ๋ฐ ๋ฐํ์๋ฃ PPT ([๋งํฌ](https://github.com/tyrannojung/Pomeranian/blob/main/ppt.pdf))

## ๊ณผ์  ๋ชฉํ

- ์ค๋งํธ์ปจํธ๋ ํธ๋ฅผ ํ์ฉํ์ฌ ์ง๊ฐ๋ณต์
- ์ค๋งํธ์ปจํธ๋ ํธ ๋ฐ์ดํฐ์ ์ํธํ

## ์๊ตฌ ์ฌํญ

- ethers.js & web3 ํ์ฉ
- ipfs & solidity ํ์ฉ
- ์๊ณ , ํ ํฐ์กฐํ ๋ชจ๋ api ์ ์
- private key๋ฅผ ํ์ฉํ ๋์นญํค ๋ฐฉ์ ์ํธํ ์๊ณ ๋ฆฌ์ฆ ์ฌ์ฉ
 
**Business Process**
<img width="1016" alt="แแณแแณแแตแซแแฃแบ 2022-09-17 แแฉแแฎ 2 18 34" src="https://user-images.githubusercontent.com/58019931/190841750-0c226cdd-7aa3-4abb-b6f2-f914d3c5c382.png">
<br>

## ๐ API ๋ชฉ๋ก

- Postman Export ([๋งํฌ](https://github.com/tyrannojung/Pomeranian/blob/main/postman.json)) 

- ๋ฉ์ธ๋ท ์๊ณ  ๊ฐ์ ธ์ค๊ธฐ
```bash
curl -X 'GET' \
'http://localhost:8085/pome-rpc/{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{"address":""}'

Response body
{"result": "string","balance": "string"}
```


- ํ ํฐ ์๊ณ  ๊ฐ์ ธ์ค๊ธฐ
```bash
curl -X 'GET' \
'http://localhost:8085/pome-rpc/token-balance/{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{ "contract_address":"" , "address":"" , "decimal": }'

Response body
{"result": "string","balance": "string"}
```


- ํ ํฐ ์ปจํธ๋ํธ ์ ํจ์ฑ ์ฒดํฌ
```bash
curl -X 'GET' \
'http://localhost:8085/pome-rpc/validate{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{"contract_address":""}'

Response body
{ "result": "string", "token_detail": { "token_type": "string", "token_contract": "string", "token_img": "string", "token_symbol": "string", "token_decimals": int, "token_volume": int } }
```


- ๋ฐฑ์๋ฐ์ดํฐ ๊ฐ์ ธ์ค๊ธฐ
```bash
curl -X 'GET' \
'http://localhost:8085/ipfs/{{hash}}' \ // ipfs return hash value
--data '{"address":""}'

Response body
{ "backup": "string" }
```



- ๋ฐฑ์๋ฐ์ดํฐ ์ ์ฅํ๊ธฐ
```bash
curl -X 'POST' \
'http://localhost:8085/pome-rpc/data-backup' \
--data json-file

Response body
{ "result":"string", "value":"string"}
```

## EXAMPLE
![merge_from_ofoct](https://user-images.githubusercontent.com/58019931/190841578-323e40b0-29a7-4258-905b-c130f8675859.jpg)




<br>

## ๐ ์ฌ์ฉํ๊ธฐ

```bash
Pomeranian/pome-rpc/src/main/resources/application-private.properties
```
- ํด๋น ๊ฒฝ๋ก์์ ์ด๋๋ฆฌ์, ํด๋ ์ดํผ, ํด๋ฆฌ๊ณค, ์๋ผ๋ key๊ฐ ์๋ ฅ (infura.io, klaytnapi, polygon-rpc, quiknode)
- ์ถํ application-private.properties๋ ignore ์ฒ๋ฆฌํ๋ค.
- ipfs์๋ฒ(5001) ์๋ ฅ
```bash
Pomeranian/pome-rpc/
```
- spring project ์๋ฒ ์คํ
```bash
Pomeranian/extension/
```
- extension ํฌ๋กฌ ๋ฑ๋ก ์์
 
