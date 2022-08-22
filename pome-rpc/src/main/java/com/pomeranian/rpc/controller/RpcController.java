package com.pomeranian.rpc.controller;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.bouncycastle.jcajce.provider.digest.Keccak;
import org.bouncycastle.util.encoders.Hex;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.pomeranian.config.WebConfig;
import com.pomeranian.rpc.dto.RpcDTO;
import com.pomeranian.rpc.dto.TokenDTO;
import com.pomeranian.rpc.dto.TokenType;
	
@Controller
public class RpcController {
	
	private static final Logger logger = LoggerFactory.getLogger(RpcController.class);
	
	/** WebConfig **/
	@Autowired
	private WebConfig webConfig;
	
	//######################## 테스트용 ########################
	@GetMapping("/kthuluWallet")
	public ModelAndView testlogin(
			Locale locale
			, HttpSession session
			, @RequestParam(name = "kthulu", required = false) String kthulu){
		
		ModelAndView mav = new ModelAndView("index");
		System.out.println(kthulu);
		
		JSONObject joResponse = new JSONObject(kthulu);
		
		JSONObject joResponse2 = (JSONObject)joResponse.get("kthulu");
		if (joResponse2.getString("result").equals("OK")) {
			if(joResponse2.getString("cmd").equals("LOGIN")) {
				mav.addObject("TEST", "LOGIN");
				
			}else {
				mav.addObject("TEST", "LOGOUT");
				
			}
		}
		
		return mav;
		
    }
	
	@PostMapping("/kthuluWallet")
	public String testPostLogin(
			Locale locale
			, HttpSession session
			, @RequestParam(name = "kthulu", required = false) String kthulu
			, Model model){
		
		JSONObject joResponse = new JSONObject(kthulu);
		JSONObject joResponse2 = (JSONObject)joResponse.get("kthulu");
		
		System.out.println(joResponse);
		if (joResponse2.getString("result").equals("OK")) {
			if(joResponse2.getString("cmd").equals("LOGIN")) {
				model.addAttribute("TEST", "LOGIN");
				
			}else {
				model.addAttribute("TEST", "LOGOUT");
				
			}
		}
		return "/index";
		
	}
	//######################## 테스트용 END ########################
	
//	@GetMapping(value="/kthulu-rpc/token-search")
//	@ResponseBody
//	public String bridgeTokenSearchList(
//			Locale locale
//			, TokenDTO tokenDTO) {
//		Gson tokenSelect = new Gson();
//		//System.out.println(tokenDTO.toString());
//		List<TokenDTO> bridgeTokenSearchList = bridgeService.bridgeTokenSearchList(tokenDTO);
//		return tokenSelect.toJson(bridgeTokenSearchList);
//	}
	
	@PostMapping(value="/kthulu-rpc/token-balance/{token_type}", consumes=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getTokenBalance(
			Locale locale
			, TokenDTO tokenDTO
			, @RequestBody HashMap<String, Object> map) {
		String strResult = "{ \"result\":\"FAIL\" }";
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json; charset=utf-8");
		// 스마트컨트렉트 주소를 가져온다.
		String contract_address = (String)map.get("contract_address");
		String wallet_address = (String)map.get("address");
		int token_decimal = (Integer)map.get("decimal");
		System.out.println(contract_address + "," + wallet_address + "," + token_decimal);
		
		tokenDTO.setToken_contract(contract_address);
		
		if(contract_address == null || contract_address.equals("") || wallet_address == null || wallet_address.equals(""))
			return ResponseEntity.status(HttpStatus.OK).headers(headers).body(strResult); 
		
		try {
			if(tokenDTO.getToken_type().equals("ethereum") || tokenDTO.getToken_type().equals("klaytn") || tokenDTO.getToken_type().equals("polygon")) {
				
				String url = "";
				switch(tokenDTO.getToken_type()) {
					case "ethereum" :
						System.out.println(tokenDTO.getToken_type());
						url = "https://mainnet.infura.io/v3/" + webConfig.bridgeEthKey();
						break;
					case "klaytn" :
						System.out.println(tokenDTO.getToken_type());
						url = "https://public-node-api.klaytnapi.com/v1/cypress";
						break;
					case "polygon" :
						System.out.println(tokenDTO.getToken_type());
						url = "https://polygon-rpc.com";
						break;
						
				}
				// 여기서부터 시작한다.
            	String callData = "0x" + new String(hashWithBouncyCastle("balanceOf(address)").getBytes(),0, 8) + "000000000000000000000000" + wallet_address.substring(2,wallet_address.length());
            	JSONObject joResponse = postJsonRpc(url, new RpcDTO(callData,contract_address));
            	System.out.println(joResponse);
            	if (!joResponse.isNull("result") && !joResponse.get("result").equals("0x")) {
            		strResult = "{ \"result\":\"OK\",  \"balance\":\""+ decimalCalculator((String)joResponse.get("result"),18,"ether") +"\"}";
            		
            	}
	        //솔라나
			} else {
				System.out.println("솔라나");
				
				
				
			}

		} catch (Exception e) {
			//e.printStackTrace();
			System.out.println(e.getMessage().toString());
			
		}
		
		
		return ResponseEntity.status(HttpStatus.OK).headers(headers).body(strResult); 
	}
	
	
	@PostMapping(value="/kthulu-rpc/validate/{token_type}", consumes=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> valiContract(
			Locale locale
			, TokenDTO tokenDTO
			, @RequestBody HashMap<String, String> map) {
		String strResult = "{ \"result\":\"FAIL\" }";

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json; charset=utf-8");
		// 스마트컨트렉트 주소를 가져온다.
		String contract_address = map.get("contract_address");
		tokenDTO.setToken_contract(contract_address);
		
		//값이 없을때.
		if(contract_address == null || contract_address.equals(""))
			return ResponseEntity.status(HttpStatus.OK).headers(headers).body(strResult); 
		
		try {
			if(tokenDTO.getToken_type().equals("ethereum") || tokenDTO.getToken_type().equals("klaytn") || tokenDTO.getToken_type().equals("polygon")) {
				
				String url = "";
				switch(tokenDTO.getToken_type()) {
					case "ethereum" :
						System.out.println(tokenDTO.getToken_type());
						url = "https://mainnet.infura.io/v3/" + webConfig.bridgeEthKey();
						break;
					case "klaytn" :
						System.out.println(tokenDTO.getToken_type());
						url = "https://public-node-api.klaytnapi.com/v1/cypress";
						break;
					case "polygon" :
						System.out.println(tokenDTO.getToken_type());
						url = "https://polygon-rpc.com";
						break;
						
				}
				
				JSONObject joResponse = postJsonRpc(url, new RpcDTO("0x" + hashWithBouncyCastle("totalSupply()"),contract_address));
				
	            // 결과값이 나오며, total잔고가 있어야 정상적인 스마트컨트랙트
	            if (!joResponse.isNull("result") && !joResponse.get("result").equals("0x")) {
	            	//여기서 token name
	            	Gson gson = new Gson();
            		JSONObject joResponse1 = postJsonRpc(url, new RpcDTO("0x" + hashWithBouncyCastle("decimals()"),contract_address));
            		if(joResponse1.isNull("result")) {
            			strResult = "{ \"result\":\"OK\"}";
            			return ResponseEntity.status(HttpStatus.OK).headers(headers).body(strResult); 
            			
            		}
            		JSONObject joResponse2 = postJsonRpc(url, new RpcDTO("0x" + hashWithBouncyCastle("symbol()"),contract_address));
            		if(joResponse2.isNull("result")) {
            			strResult = "{ \"result\":\"OK\"}";
            			return ResponseEntity.status(HttpStatus.OK).headers(headers).body(strResult); 
            			
            		}
            		String subString = (String)joResponse2.get("result");  
            		String hexString = subString.substring(2, subString.length());
            		subString = (String)joResponse1.getString("result");
            		String hexInt = subString.substring(2, subString.length());
            		tokenDTO.setToken_decimals(Integer.parseInt(hexInt,16));
            		// hex -> string
            		StringBuilder output = new StringBuilder();
            		for(int i = 0; i < hexString.length(); i+=2){
            		    String str = hexString.substring(i, i+2);
            		    output.append((char)Integer.parseInt(str, 16));
            		    
            		}
            		tokenDTO.setToken_symbol(output.toString().trim());
            		tokenDTO.setToken_img(getTokenImgUrl(tokenDTO.getToken_symbol()));
            		
            		System.out.println("HIHIHI" + gson.toJson(tokenDTO));
            		strResult = "{ \"result\":\"OK\", \"token_detail\":"+ gson.toJson(tokenDTO) +"}";


	            		
	            	
	            	
	            }
	        //솔라나
			} else {
				System.out.println("솔라나");
				
				
				
			}

		} catch (Exception e) {
			//e.printStackTrace();
			System.out.println(e.getMessage().toString());
			
		}
		System.out.println(strResult);
		return ResponseEntity.status(HttpStatus.OK).headers(headers).body(strResult); 
		
	}
	
	/**
	 * home
	 * @param locale
	 * @param session
	 * @return
	 */
	// consumes  : 들어오는 데이터 타입 정의 Content-Type: application/json
	@PostMapping(value="/kthulu-rpc/{type}", consumes=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> balanceBridge(
			Locale locale
			, @PathVariable("type") String type
			, @RequestBody HashMap<String, String> map) {
		
        String strResult = "{ \"result\":\"FAIL\" }";
		
		// 상수값 비교를 위해 대문자로 변환한다.
		String token = type.toUpperCase();
		
		// 지갑주소를 가져온다.
		String address = map.get("address");
		try {
			// 타입4가지중 하나가 있는지 확인하고, 지갑주소를 보냈는지 체크한다.
			if(Arrays.stream(TokenType.values()).anyMatch((t) -> t.name().equals(token)) && (address != null && !address.equals(""))) {
				
				HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
				factory.setConnectTimeout(5000); //타임아웃 설정 5초
	            factory.setReadTimeout(5000); //타임아웃 설정 5초
	            RestTemplate restTemplate = new RestTemplate(factory);
	            
				HttpHeaders headers = new HttpHeaders();
				JSONObject jsonObject = new JSONObject();
				
				if(TokenType.ETHEREUM.toString().equals(token)) {
					String url = "https://mainnet.infura.io/v3/" + webConfig.bridgeEthKey();
					headers.add("Content-Type", "application/json; charset=utf-8");

					jsonObject.put("method", "eth_getBalance");
					JSONArray jsonArr = new JSONArray();
					jsonArr.put(address);
					jsonArr.put("latest");
					
					jsonObject.put("params", jsonArr);
					jsonObject.put("id", 1);
					jsonObject.put("jsonrpc", "2.0");
					
		            HttpEntity<String> request = new HttpEntity<>(jsonObject.toString(), headers);

		            String result = restTemplate.postForObject(url, request, String.class);
		            JSONObject joResponse = new JSONObject(result);
                    strResult = "{ \"result\":\"OK\",  \"balance\":\""+ decimalCalculator((String)joResponse.get("result"),18,"ether") +"\"}";
					
				}
				if(TokenType.KLAYTN.toString().equals(token)) {
					String url = "https://public-node-api.klaytnapi.com/v1/cypress";
					headers.add("Content-Type", "application/json; charset=utf-8");

					jsonObject.put("method", "eth_getBalance");
					JSONArray jsonArr = new JSONArray();
					jsonArr.put(address);
					jsonArr.put("latest");
					
					jsonObject.put("params", jsonArr);
					jsonObject.put("id", 1);
					jsonObject.put("jsonrpc", "2.0");
					
		            HttpEntity<String> request = new HttpEntity<>(jsonObject.toString(), headers);

		            String result = restTemplate.postForObject(url, request, String.class);
		            JSONObject joResponse = new JSONObject(result);
		            strResult = "{ \"result\":\"OK\",  \"balance\":\""+ decimalCalculator((String)joResponse.get("result"),18,"ether") +"\"}";
					
				}
				if(TokenType.POLYGON.toString().equals(token)) {
					String url = "https://polygon-rpc.com";
					headers.add("Content-Type", "application/json; charset=utf-8");

					jsonObject.put("method", "eth_getBalance");
					JSONArray jsonArr = new JSONArray();
					jsonArr.put(address);
					jsonArr.put("latest");
					
					jsonObject.put("params", jsonArr);
					jsonObject.put("id", 1);
					jsonObject.put("jsonrpc", "2.0");
					
		            HttpEntity<String> request = new HttpEntity<>(jsonObject.toString(), headers);

		            String result = restTemplate.postForObject(url, request, String.class);
		            JSONObject joResponse = new JSONObject(result);
		            strResult = "{ \"result\":\"OK\",  \"balance\":\""+ decimalCalculator((String)joResponse.get("result"),18,"ether") +"\"}";
					
				}
				if(TokenType.SOLANA.toString().equals(token)) {
					String url = "https://snowy-bold-shard.solana-mainnet.discover.quiknode.pro/"+ webConfig.bridgeSolKey();
					headers.add("Content-Type", "application/json; charset=utf-8");
					jsonObject.put("method", "getBalance");
					JSONArray jsonArr = new JSONArray();
					jsonArr.put(address);
					jsonObject.put("params", jsonArr);
					jsonObject.put("id", 1);
					jsonObject.put("jsonrpc", "2.0");
					HttpEntity<String> request = new HttpEntity<>(jsonObject.toString(), headers);
					String result = restTemplate.postForObject(url, request, String.class);
					JSONObject joResponse = new JSONObject(result);
					strResult = "{ \"result\":\"OK\",  \"balance\":"+ decimalCalculator(String.valueOf(joResponse.getJSONObject("result").get("value")),6,"sol") +" }";
					
				}

			} else {
				System.out.println("No Type");
				
			}
		} catch (Exception e) {
			//e.printStackTrace();
			System.out.println(e.getMessage().toString());
			
		}
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json; charset=utf-8");
		return ResponseEntity.status(HttpStatus.OK).headers(headers).body(strResult);
    }
	
	// 함수들
	
	// keccak 인코딩
    public String hashWithBouncyCastle(final String originalString) {
        Keccak.Digest256 digest256 = new Keccak.Digest256();
        byte[] hashbytes = digest256.digest(originalString.getBytes(StandardCharsets.UTF_8));
        return new String(Hex.encode(hashbytes));
        
    }
    
    // 데시말 계산
    public String decimalCalculator(String Hexadecimal, int decimals, String type) {
        
    	BigInteger bigInteger = null ;
    	
    	if(type.equals("ether")) {
        	Hexadecimal = Hexadecimal.trim();
    		if(Hexadecimal.isEmpty()) return "";
        	
        	if(Hexadecimal.equals("0x0"))    // 0일 경우 처리
        		Hexadecimal = "0";
            else
            	Hexadecimal = Hexadecimal.replace("0x", "");	
            
            bigInteger = new BigInteger(Hexadecimal, 16);
    	} else {
    		bigInteger = new BigInteger(Hexadecimal);
    	}
    	
        // 10제곱근을 위한 초기값 설정
        BigInteger decimal = new BigInteger("10");
        BigDecimal bigDecHex = new BigDecimal(bigInteger);
        BigDecimal bigDec = new BigDecimal(decimal.pow(decimals));
        Hexadecimal = bigDecHex.divide(bigDec).toPlainString();
        
    	return Hexadecimal;
    }
	
	// json-rpc 함수 조회
	public JSONObject postJsonRpc(String url, RpcDTO bridgeDTO) {
		HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
		factory.setConnectTimeout(5000); //타임아웃 설정 5초
        factory.setReadTimeout(5000); //타임아웃 설정 5초
        RestTemplate restTemplate = new RestTemplate(factory);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json; charset=utf-8");
		
		Gson gson = new Gson();
		String jsonString = gson.toJson(bridgeDTO);
		System.out.println(jsonString);
		
        HttpEntity<String> request = new HttpEntity<>(jsonString, headers);
        String result = restTemplate.postForObject(url, request, String.class);
        JSONObject joResponse = new JSONObject(result);
        
        return joResponse;
		
	}
	
	public String getTokenImgUrl(String tokenUpper) {
		char img_value = tokenUpper.charAt(0);
		if(!Character.isDigit(img_value))
			img_value = Character.toLowerCase(img_value);
		String img_url = "http://localhost:8085/upload/token/" + img_value +".png";
		System.out.println(img_url);
		
		return img_url;
	}
	
}
