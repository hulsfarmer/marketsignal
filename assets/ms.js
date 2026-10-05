/* MarketSignal 공통: 테마 전환 버튼. 선택은 브라우저에 저장, 기본은 밝은 화면(기기 설정과 무관).
   테마가 바뀌면 window 에 'ms-theme' 이벤트를 보내 차트가 다시 그려지게 한다. */
(function(){
  var KEY = "ms_theme";
  var root = document.documentElement;
  function isDark(){ return root.getAttribute("data-theme") === "dark"; }
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8z"/></svg>';
  function paint(btn){
    btn.innerHTML = isDark() ? SUN : MOON;
    btn.setAttribute("aria-label", isDark() ? "밝은 화면으로" : "어두운 화면으로");
    btn.title = btn.getAttribute("aria-label");
  }
  function fire(){ try { window.dispatchEvent(new Event("ms-theme")); } catch(e){} }
  // 방문자 수: api.marketsignal.kr 에 방문 1회 기록(하루 1회 순방문, 쿠키 없음) 후 푸터에 표시. 로컬 개발 화면은 세지 않음
  function visits(){
    var foot = document.querySelector(".site-footer .wrap > div");
    if (!foot || !window.fetch) return;
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    fetch("https://api.marketsignal.kr/v1/hit?" + (local ? "nocount=1&" : "") + "t=" + Date.now(), {cache: "no-store"})
      .then(function(r){ return r.json(); })
      .then(function(v){
        if (v == null || v.total == null) return;
        var f = function(n){ return Number(n).toLocaleString("ko-KR"); };
        var d = new Date(v.since + "T00:00:00");
        var el = document.createElement("div");
        el.className = "visits";
        el.textContent = "오늘 방문 " + f(v.today) + " · 누적 방문 " + f(v.total) + " (" + (d.getMonth() + 1) + "/" + d.getDate() + "부터)";
        foot.appendChild(el);
      })["catch"](function(){});
  }
  document.addEventListener("DOMContentLoaded", function(){
    visits();
    var btn = document.getElementById("themebtn");
    if (!btn) return;
    paint(btn);
    btn.addEventListener("click", function(){
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch(e){}
      paint(btn); fire();
    });
  });
})();
