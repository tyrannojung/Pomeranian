package com.pomeranian.rpc.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pomeranian.rpc.dto.TokenDTO;
import com.pomeranian.rpc.mapper.RpcMapper;
import com.pomeranian.rpc.service.RpcService;

@Service("BridgeService")
public class RpcServiceImpl implements RpcService {
	
	/** BridgeMapper **/
	@Autowired
	private RpcMapper bridgeMapper;
	
	public List<TokenDTO> bridgeTokenSearchList(TokenDTO tokenDTO) {
		return bridgeMapper.bridgeTokenSearchList(tokenDTO);
		
	}
	
	public TokenDTO tokenContractDetail(TokenDTO tokenDTO) {
		return bridgeMapper.tokenContractDetail(tokenDTO);
		
	}

}