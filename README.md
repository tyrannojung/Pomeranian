# 🙋‍♂️ Pomeranian - 블록체인 지갑 프로젝트
![ezgif-3-284a714f63](https://user-images.githubusercontent.com/58019931/190843731-7253d688-1ec9-4be1-811a-aa0b33832107.gif)

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
 
**Business Process**
<img width="1016" alt="스크린샷 2022-09-17 오후 2 18 34" src="https://user-images.githubusercontent.com/58019931/190841750-0c226cdd-7aa3-4abb-b6f2-f914d3c5c382.png">
<br>

## 🔖 API 목록

- Postman Export ([링크](https://github.com/tyrannojung/Pomeranian/blob/main/postman.json)) 

- 메인넷 잔고 가져오기
```bash
curl -X 'GET' \
'http://localhost:8085/pome-rpc/{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{"address":""}'

Response body
{"result": "string","balance": "string"}
```


- 토큰 잔고 가져오기
```bash
curl -X 'GET' \
'http://localhost:8085/pome-rpc/token-balance/{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{ "contract_address":"" , "address":"" , "decimal": }'

Response body
{"result": "string","balance": "string"}
```


- 토큰 컨트랙트 유효성 체크
```bash
curl -X 'GET' \
'http://localhost:8085/pome-rpc/validate{{type}}' \ //type [ethereum, klaytn, polygon, solana]
-H 'Content-Type: application/json' \
--data '{"contract_address":""}'

Response body
{ "result": "string", "token_detail": { "token_type": "string", "token_contract": "string", "token_img": "string", "token_symbol": "string", "token_decimals": int, "token_volume": int } }
```


- 백업데이터 가져오기
```bash
curl -X 'GET' \
'http://localhost:8085/ipfs/{{hash}}' \ // ipfs return hash value
--data '{"address":""}'

Response body
{ "backup": "string" }
```



- 백업데이터 저장하기
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

## 🔖 사용하기

```bash
Pomeranian/pome-rpc/src/main/resources/application-private.properties
```
- 해당 경로에서 이더리움, 클레이튼, 폴리곤, 솔라나 key값 입력 (infura.io, klaytnapi, polygon-rpc, quiknode)
- 추후 application-private.properties는 ignore 처리한다.
- ipfs서버(5001) 입력
```bash
Pomeranian/pome-rpc/
```
- spring project 서버 실행
```bash
Pomeranian/extension/
```
- extension 크롬 등록 시작
 
