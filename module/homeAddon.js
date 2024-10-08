ModuleCache.homeAddon = {
    pwa: {
        init: () => {
            if (navigator.serviceWorker && !navigator.serviceWorker.controller) {
                navigator.serviceWorker.register('sw.js');
            }
        }

    },
    adLoader: {
        done: false,
        init: () => {
            if (!Module.pref.get("agreePrivacy")) {
                let read = document.createElement("p");
                read.className = "actBtn";
                read.innerText = "查看";
                read.setAttribute("aria-label", "查看隐私政策");
                read.tabIndex = 0;
                read.onclick = () => {
                    Module.yuni.showNative('privacy');
                    Module.msg.restore();
                };
                Module.msg.change("请阅读并同意隐私协议", "./icon/privacy.svg", "#FB966E", [read]);
            };
            document.getElementById("closead").onclick = async () => {
                for (let i = 0; i < 1000;) {
                    document.getElementById("adinfo").innerText = "正在关闭广告..." + Number(i) / Number(10) + "%";
                    i += Math.round(Math.random() * 50);
                    await util.sleep(Math.round(Math.random() * 250));
                }
                document.getElementById("ads").parentElement.removeChild(document.getElementById("ads"));
                await util.sleep(50);
                alert("广告已关闭！");
            };
        },
        lazyinit: async () => {
            if (Module.adLoader.done || window.disableAds) return;
            document.getElementById("ads").style.display = "block";
            if (Module.pref.get("adPref") == "any") {
                //Anti uBlock Origin
                (async () => {
                    await util.sleep(2000);
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            if (this.status === 200) {
                                if (!this.responseURL.startsWith("https")) {
                                    console.log("广告被拦截");
                                    Module.adLoader.loadSelfAd();
                                } else {
                                    (adsbygoogle = window.adsbygoogle || []).push({});
                                    util.loadScriptAsync("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1806614386308377");
                                    document.getElementById("closead").style.display = "none";
                                    Module.adLoader.done = true;
                                }
                            }
                        }
                    };
                    xmlhttp.open("HEAD", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", true);
                    xmlhttp.send();
                })()
            } else {
                Module.adLoader.loadSelfAd();
            }
        },
        loadSelfAd: () => {
            console.log("加载自定义广告");
            Module.agariAD.lazyinit();
        }
    },
    agariAD: {
        lazyinit: async () => {
            console.log("Agari AD loaded. Fetch AD info...");
            let adinfo = await (await fetch("./agari.json")).json();
            switch (adinfo.type) {
                case "html": {
                    document.getElementById("selfad").innerHTML = adinfo.content;
                }
            };
            Module.adLoader.done = true;
        }
    }
}