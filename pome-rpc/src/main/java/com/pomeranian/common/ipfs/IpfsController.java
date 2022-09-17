package com.pomeranian.common.ipfs;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class IpfsController {
	
	private static final Logger logger = LoggerFactory.getLogger(IpfsController.class);
	
	private final IpfsUtil ipfsUtil;
	private final Gson gson;
	
	/**
	 * uploadFile
	 * @param multipartFile
	 * @param response
	 * @return
	 */
    @PostMapping("/ipfs")
    public String uploadFile(
    		@RequestParam(value="ipfs_file", required=false) List<MultipartFile> multipartFile
    		, HttpServletResponse response) {
    	
    	String strResult = "{ \"result\":\"FAIL\" }";
    	ArrayList<String> testArrayList = new ArrayList<String>();
    	
    	try {
    		String hashValue = "";
    		if(multipartFile != null && !multipartFile.get(0).getOriginalFilename().equals("")) {
    	        // 다중 처리
    			for(MultipartFile file:multipartFile) {
    	        		hashValue = ipfsUtil.saveFile(file);
    	        		testArrayList.add(hashValue);
    	            }
    	        String jsonPlace = gson.toJson(testArrayList);
    	        strResult = "{ \"result\":\"OK\", \"value\":"+jsonPlace+"}";
    	    }
    	    	
    	}catch(Exception e){
    	    e.printStackTrace();
    	    
    	}
    	response.setHeader("Access-Control-Allow-Origin", "*");
    	return strResult;
    	
    }

    /**
     * getFile
     * @param hash
     * @return
     */
    @GetMapping("/ipfs/{hash}")
    public ResponseEntity<byte[]> getFile(@PathVariable("hash") String hash) {
    	HttpHeaders headers = new HttpHeaders();
        byte[] bytes = ipfsUtil.loadFile(hash);
        String stringFrmJsonByteArray = new String(bytes);
        try {
        	// JSONType
        	ObjectMapper mapper = new ObjectMapper();
            mapper.readTree(stringFrmJsonByteArray);
            headers.add("Content-Type", "application/json; charset=utf-8");
            
        } catch (Exception e) {
        	// JSONType이 아닐때, 이미지
        	headers.set("Content-type", MediaType.ALL_VALUE);
        	
		}
        return ResponseEntity.status(HttpStatus.OK).headers(headers).body(bytes);

    }
}
