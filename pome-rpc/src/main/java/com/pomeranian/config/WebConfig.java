package com.pomeranian.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import io.ipfs.api.IPFS;

@Component
public class WebConfig implements WebMvcConfigurer {
	
	private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);
	
		
	@Value("${bridge.eth.key}")
    private String bridgeEthKey;
	
	@Value("${bridge.klay.key}")
    private String bridgeKlayKey;
	
	@Value("${bridge.matic.key}")
    private String bridgeMaticKey;
	
	@Value("${bridge.sol.key}")
    private String bridgeSolKey;
	
	@Value("${ipfs.server.url}")
    private String ipfsServerUrl;
	
	public String bridgeEthKey() {
		return bridgeEthKey;
	}
	
	public String bridgeKlayKey() {
		return bridgeKlayKey;
	}
	
	public String bridgeMaticKey() {
		return bridgeMaticKey;
	}
	
	public String bridgeSolKey() {
		return bridgeSolKey;
	}
	
	public IPFS ipfsServerUrl() {
		return new IPFS(ipfsServerUrl);
	}
}
