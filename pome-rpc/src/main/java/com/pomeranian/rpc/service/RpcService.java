package com.pomeranian.rpc.service;

import java.util.List;

import com.pomeranian.rpc.dto.TokenDTO;

public interface RpcService {
	
	public List<TokenDTO> bridgeTokenSearchList(TokenDTO tokenDTO);
	
	public TokenDTO tokenContractDetail(TokenDTO tokenDTO);
	
}