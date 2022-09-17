# 🙋‍♂️ Pomeranian - 블록체인 지갑 프로젝트

<br>

## 💡 Introduction
- 이더리움지갑을 생성,조회,복원할 수 있는 지갑
- 소개 및 발표자료 PPT ([링크](https://github.com/tyrannojung/Pomeranian/blob/main/ppt.pdf))

## 과제 목표

- 스마트컨트렉트를 활용하여 지갑복원
- 스마트컨트렉트 데이터의 암호화

## 요구 사항

- ethers.js & web3 활용
- ipfs & solidity 활용
- 잔고, 토큰조회 모듈 api 제작
- private key를 활용한 대칭키 방식 암호화 알고리즘 사용

<br>

## 🔖 API 목록

- Postman Export ([링크](https://github.com/tyrannojung/Pomeranian/blob/main/postman.json)) 

- 메인넷 잔고 가져오기
```bash
Curl
curl -X 'GET' \
'http://localhost:8085/pome-rpc/{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{"address":""}'

Response body
{"result": "string","balance": "string"}
```


- 토큰 잔고 가져오기
```bash
Curl
curl -X 'GET' \
'http://localhost:8085/pome-rpc/token-balance/{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{ "contract_address":"" , "address":"" , "decimal": }'

Response body
{"result": "string","balance": "string"}
```


- 토큰 컨트랙트 유효성 체크
```bash
Curl
curl -X 'GET' \
'http://localhost:8085/pome-rpc/validate{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{"contract_address":""}'

Response body
{ "result": "string", "token_detail": { "token_type": "string", "token_contract": "string", "token_img": "string", "token_symbol": "string", "token_decimals": int, "token_volume": int } }
```


- 백업데이터 가져오기
```bash
Curl
curl -X 'GET' \
'http://localhost:8085/ipfs/{{hash}}' \ // ipfs return hash value
--data '{"address":""}'

Response body
{ "backup": "string" }
```



- 백업데이터 저장하기
```bash
Curl
curl -X 'POST' \
'http://localhost:8085/pome-rpc/data-backup' \
--data json-file

Response body
{ "result":"string", "value":"string"}
```

## EXAMPLE
![merge_from_ofoct](https://user-images.githubusercontent.com/58019931/190841578-323e40b0-29a7-4258-905b-c130f8675859.jpg)




<br>

## 🔖 사용하기

```bash
/src/main/resources/application-private.properties
```
- 해당 경로에서 이더리움, 클레이튼, 폴리곤, 솔라나의 Web3
- 추후 application-private.properties는 ignore 처리한다.


![화면 캡처 2022-09-16 180721](https://user-images.githubusercontent.com/58019931/190601557-3e651a9d-599c-43f6-b128-8d38f53a0f60.png)

