// Extension event listeners are a little different from the patterns you may have seen in DOM or
// Node.js APIs. The below event listener registration can be broken in to 4 distinct parts:
//
// * chrome      - the global namespace for Chrome's extension APIs
// * runtime     – the namespace of the specific API we want to use
// * onInstalled - the event we want to subscribe to
// * addListener - what we want to do with this event
//
// See https://developer.chrome.com/docs/extensions/reference/events/ for additional details.
chrome.runtime.onInstalled.addListener(async () => {
  console.log('최초 1회 실행');
});

// 크롬 시작 감지 및 초기화 (extension 시작 아님)
chrome.runtime.onStartup.addListener(function () {
  // 시작시 sync(세션)데이터 초기화
  chrome.storage.sync.clear();

});

