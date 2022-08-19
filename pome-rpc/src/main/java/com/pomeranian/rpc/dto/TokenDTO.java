package com.pomeranian.rpc.dto;

import java.util.Date;

import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Component("TokenDTO")
public class TokenDTO {
	
	private transient int token_idx;
	private String token_type;
	private String token_contract;
	private String token_name;
	private String token_img;
	private String token_symbol;
	private int token_decimals;
	private int token_volume;
	private Date token_udate;
	private Date token_rdate;
	
}