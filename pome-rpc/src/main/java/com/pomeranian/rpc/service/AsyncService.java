package com.pomeranian.rpc.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.pomeranian.rpc.dto.TokenDTO;
import com.pomeranian.rpc.mapper.RpcMapper;

@Service
public class AsyncService {
	
	/** BridgeMapper **/
	@Autowired
	private RpcMapper bridgeMapper;
	
	@Async
	public void asyncUpdate(String methodname, TokenDTO tokenDTO) {
		try {
            
            if(methodname.equals("token_update")) {
            	bridgeMapper.tokenContractUpdate(tokenDTO);
            	
            } 
            else if(methodname.equals("volume_update")) {
            	bridgeMapper.tokenContractVolumeUpdate(tokenDTO);
            	
            }
            
        } catch(Exception e) {
            e.printStackTrace();
            
        }
		
	}
	
}
