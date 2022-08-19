package com.pomeranian.rpc.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.pomeranian.rpc.dto.TokenDTO;

@Repository
@Mapper
public interface RpcMapper {
	
	public List<TokenDTO> bridgeTokenSearchList(TokenDTO tokenDTO);
	
	public TokenDTO tokenContractDetail(TokenDTO tokenDTO);
	
	public void tokenContractUpdate(TokenDTO tokenDTO);
	
	public void tokenContractVolumeUpdate(TokenDTO tokenDTO);
	
}