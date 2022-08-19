/*Copyright pomeranian, Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/
const agent=window.navigator.userAgent.toLowerCase();let laserExtensionId;switch(true){case agent.indexOf("edge")>-1:laserExtensionId="msEdge";break;case agent.indexOf("edg/")>-1:laserExtensionId="chromeEdge";break;case agent.indexOf("chrome")>-1:laserExtensionId="mddpglhmcebhajmfkkjjcmpaijmdjajo";break;case agent.indexOf("safari")>-1:laserExtensionId="safari";break}try{console.log("check ===== "+laserExtensionId);var port=chrome.runtime.connect(laserExtensionId);port.onMessage.addListener(function(data,sen){if(data['kthulu']['result']=="OK"){var form=document.createElement('form');form.setAttribute('method','post');form.setAttribute('action','/kthuluWallet');document.charset="utf-8";var hiddenField=document.createElement('input');hiddenField.setAttribute('type','hidden');hiddenField.setAttribute('name','kthulu');hiddenField.setAttribute('value',JSON.stringify(data));form.appendChild(hiddenField);document.body.appendChild(form);form.submit()}})}catch(e){console.log('kthulu install')}async function cli_connectKthulu(param){return new Promise((resolve,reject)=>{if(param=='LOGIN'){chrome.runtime.sendMessage(laserExtensionId,{message:"loginProcess"},function(response){resolve(response)})}else if(param=='LOGOUT'){chrome.runtime.sendMessage(laserExtensionId,{message:"logoutProcess"},function(response){resolve(response)})}else{reject('no type')}})}function cli_checkKthulu(){var kthulu=new Object();var obj=new Object();obj.cmd="CHECK";if(port){obj.result="OK"}else{obj.result="FAIL"}kthulu.kthulu=obj;return kthulu}