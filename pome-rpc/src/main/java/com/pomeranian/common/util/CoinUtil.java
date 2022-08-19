package com.pomeranian.common.util;

public class CoinUtil {
	private static String fillZero(int zeroCount)
	{
		char[] zeroBuf = new char[zeroCount];
		
		for(int i = 0; i < zeroCount ; i ++)
		{
			zeroBuf[i]  = '0';
		}
		return String.valueOf(zeroBuf, 0, zeroCount);
	}
	
	private static String removeComma(String value)
	{
		if(value.indexOf(',') < 0)
			return value;
		char[] buf = new char[value.length()];
		int i = 0,j = 0;
		for(i = 0; i < value.length(); i ++)
		{
			if(value.charAt(i) == ',') 
				continue;
			buf[j++] = value.charAt(i);
		}
		return String.valueOf(buf, 0, j);
	}
	
	private static String insertComma(String value)
	{
		if(value.indexOf(',') > 0)
			return value;
		String intValue = "";
		String floatValue = "";
		int nDotPos = value.indexOf('.');
		if(nDotPos > 0)
		{
			intValue = value.substring(0,nDotPos);
			floatValue = value.substring(nDotPos);
		}
		else
		{
			intValue = value;
		}
		
		int nCommaCount =  intValue.length() / 3;
		if( (intValue.length() % 3) == 0) nCommaCount --;
		if(nCommaCount < 1)
			return value;
		
			
		char[] commaBuf = new char[intValue.length() + nCommaCount];
		int j = commaBuf.length-1;
		int d = 0;
		for(int i = intValue.length()-1; i > 0 ; i--)
		{
			commaBuf[j--] = intValue.charAt(i);
			d ++;
			if(d == 3)
			{
				commaBuf[j--] = ',';
				d = 0;
			}
		}
		commaBuf[0] = intValue.charAt(0);
		return String.valueOf(commaBuf, 0, commaBuf.length) + floatValue;
	}
	
	private static String stripIntegerZero(String value)
	{
		int startZeros = 0;
		for(int i = 0; i < value.length(); i ++)
		{
			if(value.charAt(i) == '0') startZeros ++;
			else break;
		}
		if(startZeros > 0)
			value = value.substring(startZeros);
		if(value.isEmpty())
			value = "0";
		return value;
	}
	
	static String stripFloatZero(String value)
	{
//		if(value.isEmpty()) return "";
		int posDot = value.indexOf('.');
		if(posDot == -1)
		{
			stripIntegerZero(value);
			value += ".0";
			return value;
		}

		int posStart = 0,posEnd = 0;
		for(posStart = 0; posStart < value.length(); posStart ++)
		{
			if(value.charAt(posStart) != '0')
				break;
		}

		if(posStart >= value.length())
		{
			//value = "0.0";
			return "0.0";
		}
		if(posStart == posDot)
		{
			return value.substring(0,posStart) + ".0";
		}
		for(posEnd = value.length()-1; posEnd >= 0 ; posEnd --)
		{
			if(value.charAt(posEnd) != '0')
				break;
		}
		value = value.substring(posStart,(posEnd-posStart) + 1);
		posEnd -= posStart;
		posStart = 0;
		if(value.charAt(posEnd) == '.')
			value += "0";
		if(value.charAt(0) == '.')
			value = "0" + value;
		return value;
	}
	

	/**
	 * 문자열 정수 표현에 소수점 삽입 
	 * integerToFloatDecimals("2012340000000000000",18) -> 2.01234
	 * @param intValue
	 * @param decimals
	 * @return 
	 */
	public static String integerToFloatDecimals(String intValue,int decimals)
	{
		String  strResult = "";
		String strValue = intValue.trim();
		if(strValue.isEmpty()) return "";
		int nDotPos = strValue.indexOf('.');
		if(nDotPos != -1)
		{
			strValue = strValue.substring(0,nDotPos);
		}

		if(strValue.length() == decimals)
		{
			strResult = "0." + strValue;
		}
		else if(strValue.length() > decimals)
		{
			strResult = strValue.substring(0, strValue.length()-decimals);
			strResult += ".";
			strResult += strValue.substring(strValue.length()-decimals);
		}
		else
		{
			
			strResult = "0.";
			strResult += fillZero(decimals - strValue.length());
			strResult += strValue;
		}
		strResult = stripFloatZero(strResult);
		return strResult;
	}	
	
	/**
	 * 문자열 실수 표현에서 소숫점 제거 
	 * floatToIntegerDecimals("2.01234",18) -> 2012340000000000000 
	 * @param floatValue
	 * @param decimals
	 * @return
	 */
	public static String floatToIntegerDecimals(String floatValue,int decimals)
	{
		String strResult = "";
		String  strValue = floatValue.trim();
		if(strValue.isEmpty()) return "";
		
		int nDotPos = strValue.indexOf('.');
		if(nDotPos == -1)
		{
			strResult = strValue;
			strResult += fillZero(decimals);
		}
		else
		{
			String digits = strValue.substring(0,nDotPos);
			String  floats = "",zeros = "";
			if(strValue.length() - (nDotPos+1) >= decimals)
			{
				floats = strValue.substring(nDotPos+1,decimals);
			}
			else
			{
				floats = strValue.substring(nDotPos+1);
				zeros = fillZero(decimals-floats.length());
			}
			strResult = digits + floats + zeros;
		}

		stripIntegerZero(strResult);
		return strResult;
	}

	public static String displayBalance(String intValue,int decimals)
	{
		intValue = intValue.trim();
		if(intValue.isEmpty()) return "";
		
		intValue = removeComma(intValue);
		String balance = integerToFloatDecimals(intValue,decimals);
		if(balance.endsWith(".0"))
			balance = balance.substring(0,balance.length()-2);
		return balance;
	}
	
	public static String storeBalance(String floatValue ,int decimals)
	{
		floatValue = floatValue.trim();
		if(floatValue.isEmpty()) return "";
		
		floatValue = removeComma(floatValue);
		return floatToIntegerDecimals(floatValue,decimals);
	}
	
}
