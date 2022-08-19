package com.pomeranian.rpc.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Setter;
import lombok.ToString;

@ToString
public class RpcDTO {
	
	private String method;
	private List<Object> params;
	private Integer id;
	private String jsonrpc;
	
	public RpcDTO(String data, String to) {
		// TODO Auto-generated constructor stub
		method = "eth_call";
		id = 1;
		jsonrpc = "2.0";
		List<Object> param = new ArrayList<Object>();
		PramObject paramObject = new PramObject();
		paramObject.setTo(to);
		paramObject.setData(data);
		param.add(paramObject);
		param.add("latest");
		params = param;
		
	}
	
	@Setter
	@ToString
	class PramObject {
		private String data;
		private String to;

	}

}


