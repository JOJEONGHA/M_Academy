;jQuery.noConflict();
/*
 * Definition of the tistory addon js.
 * @version 5.0
 * @author ishaiin(http://www.ishaiin.com).
 */
 (function ($) {
    $(function () {

        //setting Value.
        var setting = {
            fixedSidebar: false, //true시 우측메뉴바를 항상노출로 고정합니다.(권장하지않음)
            soundCloudShow: false, //true시 사운드클라우드를 썸네일에 노출합니다.
            mainItemNum: 9 //메인화면 리스트의 갯수를 조절합니다.
        };

        var targetID = $("#targetID").attr("href"),
            targetReg = /http:\/\/.+skin\//g,
            imageSrc = targetReg.exec(targetID)[0] + "images/";

        //save Data.
        var dataObj = {
            rssArr: [],
            regExr: {
                youtube: /<iframe([\s\S]){0,1}?(.(?!vimeo))+?(youtube).(.){21}/ig,
                vimeo: /<iframe(.+)?src=(.+)?player.vimeo.com\/video\/(.){9}/ig,
                soundCloud: /<iframe(.+)?src=(.+)?soundcloud.(.)+if/g,
                image: /<img(.(?!daumcdn|ccl|width="(\d{1,2}|)"))*?>/g,
                imageSelect: /<img.+?대표.+?>/g,
                rssArticleReg: /og:description".+?".+?"(?= \/>)/g,
                articleReg: /<div class="article">[\s\S]*?(\/MSIE|hx cmt)/g
            },
            templete: {
                youtubeBefore: '<iframe width="320" height="220" src="//www.youtube.com/embed/',
                youtubeAfter: '?wmode=opaque" frameborder="0" allowfullscreen></iframe>',
                soundCloudPlayListBefore: '<iframe width="320" height="220" src="//w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/',
                soundCloudPlayListAfter: '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true" frameborder="0" allowfullscreen></iframe>',
                soundCloudTrackBefore: '<iframe width="320" height="220" src="//w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/',
                soundCloudTrackAfter: '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true" frameborder="0" allowfullscreen></iframe>',
                vimeoBefore: '<iframe width="320" height="220" src="//player.vimeo.com/video/',
                vimeoAfter: '" frameborder="0"webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                imgBefore: '<img src="',
                imgAfter: '" alt="" >'
            },
            mobileCheck: ["iPhone", "iPod", "BlackBerry", "Android", "Windows CE", "LG", "MOT", "SAMSUNG", "SonyEricsson"],
            mobileCheckResult: null,
            mainCheckResult: null,
            resizeTimer: null,
            scrollEvent: {
                topTarget: $(".gotoTop"),
                interval: null
            },
            $preLoader: $("#preLoader"),
            $body: $("body")
        };

        function changeCheck() {
            checkSecond = true;
        }

        var funcObj = {
            //메인체크
            mainCheck: function () {
                var checkObj = {};
                checkObj.urlAddr = decodeURIComponent(window.location.href);
                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                    checkObj.origin = decodeURIComponent(window.location.origin) + "/";
                } else {
                    checkObj.origin = decodeURIComponent(window.location.origin) + "/";
                }

                if (checkObj.urlAddr == checkObj.origin) {
                    this.mainVisible();
                    return true;
                } else {
                    return false;
                }
            },
            //메인만 #main 블락처리 - mainCheck연관
            mainVisible: function () {
                document.getElementById("main").setAttribute("style", "display:block");
                document.getElementById("contentWrap").setAttribute("style", "display:none");
            },
            //func scroll Top action.
            scrollTopMethod: function () {
                var top = window.scrollY ? window.scrollY : document.documentElement.scrollTop;
                if (top > 320) {
                    dataObj.scrollEvent.topTarget.show();
                } else {
                    dataObj.scrollEvent.topTarget.hide();
                }
            },
            //func checkMobile.
            checkMobile: function (mobileArr) {
                for (var e in mobileArr) {
                    if (navigator.userAgent.match(mobileArr[e])) {
                        return true;
                    }
                }
                return false;
            },
            //func call ajax.
            rssAjax: function () {
                var title = [],
                    link = [],
                    desc = [],
                    date = [];
                dataObj.rssArr = [title, link, desc, date];
                return $.ajax({
                    url: '/rss',
                    type: 'GET',
                    async:   true,
                    cache:   false,
                    dataType: 'xml',
                    // timeout: 1000
                });
            },
            //func set rss Array.
            checkRss: function (xml) {
                $(xml).find('item').each(function (i) {
                    var title = $(this).find("title").text(),
                        link = $(this).find("link").text(),
                        description = $(this).find("description").text(),
                        pubDate = $(this).find("pubDate").text().slice(0, 16);

                    var indexHref;

                    if(link.indexOf("/entry") !== -1){
                        indexHref =  link.indexOf("/entry");
                    }else{
                        indexHref = link.lastIndexOf("/");
                    };

                    var str = link.slice(indexHref, link.length);

                    dataObj.rssArr[0][i] = title;
                    dataObj.rssArr[1][i] = str;
                    dataObj.rssArr[2][i] = description;
                    dataObj.rssArr[3][i] = pubDate;
                });
            },
            //func set embed size.
            resizeEmbed: function (target) {

                target.find("embed").add("iframe").each(function () {
                    var that = $(this);
                    var oriHeight = parseInt(that.attr("height"), 10),
                        oriWidth = parseInt(that.attr("width"), 10),
                        fixWidth = that.parent().width(),
                        fixHeigth = (oriHeight * fixWidth) / oriWidth;
                    if (oriWidth > fixWidth) {
                        that.css({
                            "width": "100%",
                            "height": fixHeigth
                        });
                    }
                });
            }
        };

        //msnyReveal 인덱스에따라 이미지로드한후.
        $.fn.msnyReveal = function ($items, index) {
            var msnry = this.data('masonry');
            var itemSelector = msnry.options.itemSelector;
            $items.hide();
            this.append($items);
            var imageOnce = $items.find(".item");
            imageOnce.imagesLoaded().progress(function (imgLoad, image) {
                var $item = $(image.img).parents(itemSelector);
                setTimeout(function () {
                    $item.show();
                    msnry.appended($item);
                }, 30 * index);
            });
        };

        //check Mobile.
        dataObj.mobileCheckResult = funcObj.checkMobile(dataObj.mobileCheck);

        //메인확인
        dataObj.mainCheckResult = funcObj.mainCheck();

        //메인인지 아닌지에따라 각각 타겟설정
        var $targetWrap, varMainFlag;
        if (dataObj.mainCheckResult) {
            $targetWrap = $("#containerMain");
            varMainFlag = true;
        } else {
            $targetWrap = $("#container");
            varMainFlag = false;
        }

        if (setting.fixedSidebar && !dataObj.mobileCheckResult) {

            dataObj.$body.toggleClass("side_on");
            $(".sidebar_wrap").css({
                right: "0"
            });
            $("#btnMenu").toggleClass("btn_close");

            //target PC.
            if (!dataObj.mobileCheckResult) {
                dataObj.$body.css({
                    "margin-right": "300px"
                });
            }

        }

        //setting Rss.
        var rssDone = funcObj.rssAjax();
        var rssComplete = $.when(rssDone)
            .done(function (data) {
            funcObj.checkRss(data);
        }).fail(function () {
            setTimeout(function () {
                location.reload();
            }, 1000);
        }).promise();


        //ajax Start Animation.
        $(document).ajaxStart(function () {
            dataObj.$body.css("overflow", "hidden");
            dataObj.$preLoader.show();
        });

        //Iscroll init.
        $("#sscroll").mCustomScrollbar({
            autoHideScrollbar: false,
            scrollbarPosition: "inside",
            axis: "yx",
            theme: "dark-3"
        });

        // UI.
        $(".cate_deco > ul > li > ul > li > a").each(function () {
            var $this = $(this);
            var target = $this.siblings("ul") ? $this.siblings("ul")[0] : undefined;
            if (target !== undefined) {
                $('<a href="#" class="sub_arrow"><i class="fa fa-sort-desc"></i></a>').insertAfter($this);
            }
        });
        $(".btn_cate").on("click", function (e) {
            e.preventDefault();
            var $this = $(this);
            $this.toggleClass('active');
            $this.siblings("ul").slideToggle('fast');
        });
        $(".cate_deco").on("click", "li li > .sub_arrow", function (e) {
            e.preventDefault();
            var $this = $(this);
            $this.toggleClass('active');
            $this.siblings("ul").slideToggle('fast');
        });

        //scrollTop scroll action.
        $(window).on("scroll", function () {
            clearTimeout(dataObj.scrollEvent.interval);
            dataObj.scrollEvent.interval = setTimeout(funcObj.scrollTopMethod, 200);
        });
        $(dataObj.scrollEvent.topTarget).on("click", function (e) {
            e.preventDefault();
            $("html, body")
                .animate({
                scrollTop: "0"
            }, 800, "easeOutQuint");
        });

        //recent Article.
        $(".sidebar_wrap .recent_article ul").clone().appendTo(".side_entry .recent_article");
        $(".sidebar_wrap .recent_comment ul").clone().appendTo(".side_entry .recent_comment");

        //menu interaction.
        $(".btn_menu").on("click", function (e) {

            e.preventDefault();
            var $body = dataObj.$body;
            $sideWrap = $(".sidebar_wrap");

            if ($body.hasClass("side_on")) {
                $body.toggleClass("side_on");
                $("#btnMenu").toggleClass("btn_close");

                $sideWrap.stop().animate({
                    right: "-300px"
                }, 500, "easeOutCubic");

                //target PC.
                if (!dataObj.mobileCheckResult) {
                    $body.stop().animate({
                        "margin-right": "0"
                    }, 500, "easeOutCubic");
                }

                if (!setting.fixedSidebar && !dataObj.mobileCheckResult) {
                    $("#dimmed").toggle();
                }


            } else {
                $body.toggleClass("side_on");
                $("#btnMenu").toggleClass("btn_close");
                $sideWrap.stop().animate({
                    right: "0"
                }, 500, "easeOutCubic");

                //target PC.
                if (!dataObj.mobileCheckResult) {
                    $body.stop().animate({
                        "margin-right": "300px"
                    }, 500, "easeOutCubic");
                }

                if (!setting.fixedSidebar && !dataObj.mobileCheckResult) {
                    $("#dimmed").toggle();
                }
            }
        });
        $("#dimmed").on("click", function () {

            var $body = dataObj.$body;
            $sideWrap = $(".sidebar_wrap");

            if ($body.hasClass("side_on")) {
                $body.removeClass("side_on");
                $(".btn_menu").removeClass("btn_close");
                $sideWrap.stop().animate({
                    right: "-300px"
                }, 500, "easeOutCubic");
                //target PC.
                if (!dataObj.mobileCheckResult) {
                    $body.stop().animate({
                        "margin-right": "0"
                    }, 500, "easeOutCubic");
                }
                $(this).toggle();
            }
        });

        if (!dataObj.mobileCheckResult) {
            var $containerCate = $targetWrap.masonry({
                columnWidth: 320,
                itemSelector: ".box",
                    "gutter": 45
            });
            $("body").on("mouseenter mouseleave", ".box", function () {
                $(this).find(".view_more").toggle();
                $(this).toggleClass("active");
            });
        }

        //embeb, iframe set Size.
        funcObj.resizeEmbed($(".content"));
        $(window).on("resize", function () {
            funcObj.resizeEmbed($(".content"));
        });

        //이미지, 동영상, 분류처리 함수.
        function checkSort(target, data, rss) {
            var checkRss = rss,
                loadData = data,
                exrImg = dataObj.regExr.image,
                rssArticleReg = dataObj.regExr.rssArticleReg,
                exrYoutube = dataObj.regExr.youtube,
                exrVimeo = dataObj.regExr.vimeo,
                exrSoundCloud = dataObj.regExr.soundCloud,
                imgData = loadData.match(exrImg) ? loadData.match(exrImg)[0] : "none",
                targetImage = target.find(".mask .item img"),
                youtubeData = loadData.match(exrYoutube) ? loadData.match(exrYoutube)[0] : "none",
                vimeoData = loadData.match(exrVimeo) ? loadData.match(exrVimeo)[0] : "none",
                soundCloudData = loadData.match(exrSoundCloud) ? loadData.match(exrSoundCloud)[0] : "none",
                imgDataOrigin = loadData.match(exrImg);

            if (setting.soundCloudShow === false) {
                soundCloudData = "none";
            }


            var totalDefarticle = $.Deferred();

            var insetText;

            if (checkRss) {

                var innerData = $.parseHTML(loadData);
                var tempText = "";

                $(innerData).each(function(){

                    if($(this).text().trim() !== ""){
                        tempText += $.trim($(this).text());
                    }

                })
                insetText = tempText;

            } else {
                rssArticleText = loadData.match(rssArticleReg) ? loadData.match(rssArticleReg)[0].slice(25) : "";
                insetText = rssArticleText;

                if (rssArticleText === "") {
                    var articleText = dataObj.regExr.articleReg;
                    //console.log(articleText)
                    var AT = articleText.exec(loadData);
                    //console.log(loadData)
                    //console.log(AT)
                    var inT = !! AT ? AT[0].replaceAll(/<iframe[\s\S]*?iframe>/, "").replaceAll(/<script[\s\S]*?script>/, "").replaceAll(/<table[\s\S]*?table>/, "").replaceAll(/<style[\s\S]*?style>/, "").replaceAll(/<div class="entry-ccl"[\s\S]*?div>/, "") : AT ? AT[0].replaceAll(/<iframe[\s\S]*?iframe>/, "").replaceAll(/<script[\s\S]*?script>/, "").replaceAll(/<style[\s\S]*?style>/, "").replaceAll(/<table[\s\S]*?table>/, "").replaceAll(/<div class="entry-ccl"[\s\S]*?div>/, "") : null;
                    //console.log(inT)
                    insetText = $($.trim(inT)).text();
                    //console.log(insetText)
                }
                //console.log(insetText)
            }

            if ( !! insetText) {
                target.find(".section_text").text(insetText.slice(0, 200) + "...");
                target.find(".section_text").show();
            } else {
                target.find(".section_text").hide();
            }


            if (imgData !== "none") {

                //이미지가 여러개일경우
                var sLength = imgDataOrigin.length;
                if (sLength > 1) {
                    var innerProcessData;

                    var cfileReg = /cfile/g;
                    var imgDataResort = [];

                    //데이터 재정의
                    for (var g = 0; g < sLength; g++) {
                        if (imgDataOrigin[g].match(cfileReg)) {
                            imgDataResort.push(imgDataOrigin[g]);
                        }
                    }

                    var sSortLength = imgDataResort.length;

                    //대표이미지검색
                    for (var j = 0; j < sSortLength; j++) {
                        innerProcessData = imgDataResort[j].match(dataObj.regExr.imageSelect) ? imgDataResort[j].match(dataObj.regExr.imageSelect)[0] : "none";
                        if (innerProcessData != "none") {
                            break;
                        }
                    }
                    //대표이미지 없을경우
                    if (innerProcessData == "none") {
                        innerProcessData = imgDataResort[0];
                        imgData = innerProcessData;
                    } else {
                        imgData = innerProcessData;
                    }
                }


                var J = imgData.indexOf("http://cfile"),
                    end = imgData.indexOf('"', J);

                //홑따옴표일경우
                if (end == -1) {
                    end = imgData.indexOf("\'", J);
                }

                var string = imgData.slice(J, end),
                    widthTxt = imgData.indexOf('width="') + 7,
                    width = parseInt(imgData.slice(widthTxt, widthTxt + 5), 10),
                    heightTxt = imgData.indexOf('height="') + 8,
                    height = parseInt(imgData.slice(heightTxt, heightTxt + 5), 10),
                    nowSrc = targetImage.attr("src");
                if (width > height) {
                    if (height < 350) {
                        string = string.replace("image", "R400x0");
                    } else {
                        string = string.replace("image", "T350x350");
                    }
                } else {
                    string = string.replace("image", "R400x0");
                }
                targetImage.attr("src", string);
                var F = parseInt(220 * width / height, 10) + "px";
                var z = parseInt(320 * height / width, 10) + "px";

                target.find(".mask > .item img").css({
                    width: "320px",
                    height: z
                });
                totalDefarticle.resolve();
            } else {
                if (youtubeData != "none" || vimeoData != "none" || soundCloudData != "none") {

                    var innerYoutubeData = "" + youtubeData,
                        innerVimeoData = "" + vimeoData;
                    innerSoundCloudData = "" + soundCloudData;

                    if (innerYoutubeData != "none") {

                        var youtubeStringStart = innerYoutubeData.indexOf("embed/"),
                            youtubeString = innerYoutubeData.slice(youtubeStringStart + 6, youtubeStringStart + 17),
                            youtubeTemplete = dataObj.templete.youtubeBefore + youtubeString + dataObj.templete.youtubeAfter;

                        target.find(".mask > .item").html(youtubeTemplete);
                        target.addClass("media youtube");

                    } else if (innerVimeoData != "none") {

                        var vimeoStringStart = innerVimeoData.indexOf("video/"),
                            vimeoStringEnd = innerVimeoData.indexOf(","),
                            vimeoString = innerVimeoData.slice(vimeoStringStart + 6, vimeoStringEnd),
                            vimeoTemplete = dataObj.templete.vimeoBefore + vimeoString + dataObj.templete.vimeoAfter;

                        target.find(".mask > .item").html(vimeoTemplete);
                        target.addClass("media vimeo");

                    } else if (innerSoundCloudData != "none") {

                        var soundStringStart = innerSoundCloudData.indexOf("playlists/"),
                            soundStringString,
                            soundStringTemplete;

                        if (innerSoundCloudData.indexOf("playlists/") != (-1)) {

                            soundStringString = innerSoundCloudData.slice(soundStringStart + 10, soundStringStart + 18),
                            soundStringTemplete = dataObj.templete.soundCloudPlayListBefore + soundStringString + dataObj.templete.soundCloudPlayListAfter;

                        } else {

                            soundStringString = innerSoundCloudData.slice(soundStringStart + 7, soundStringStart + 16),
                            soundStringTemplete = dataObj.templete.soundCloudTrackBefore + soundStringString + dataObj.templete.soundCloudTrackAfter;

                        }

                        target.find(".mask > .item").html(soundStringTemplete);
                        target.addClass("media soundcloud");
                    }

                } else {
                    targetImage.css("display", "none").closest(".box").addClass("text");
                }
                totalDefarticle.resolve();
            }

            return totalDefarticle;
        }

        if (dataObj.mainCheckResult) {

            $("#main").show();
            $("#contentWrap").hide();
            var $container = $targetWrap.masonry({
                columnWidth: 320,
                itemSelector: ".box",
                gutter: 45
            });

            var appendTemplete = '<li class=\"box\"><div class=\"mask\"><a href=\"rssLink\" class=\"item\"><img src=\"./images/loading.gif\" width=\"320\" alt=\"\"></a><div class=\"aside\"><a href=\"rssLink\" class=\"view_more\"><img src=\"./images/plus.png\" alt=\"\"></a></div></div><p class=\"section_title\"><a href=\"rssLink\">rssTitle<span class=\"ico_new\"></span></a></p><p class=\"section_text\">rssText</p><p class=\"section_link\"><span class=\"date\"><img src=\"./images/ic_time.png\" alt=\"\" width=\"14\">rssDate</span></p><p class=\"read_more\"><a href=\"rssLink\">더 보기</a></p></li>';

            //rss먼저확인
            var rssNum,
            currentNum,
            maxNum,
            itemNum = setting.mainItemNum,
                countNum = 0;

            var appendRss = function (startIndex, maxIndex, rssArray, target) {
                var appendHtml = "";
                var imageReg = dataObj.regExr.image;
                var youtubeReg = dataObj.regExr.youtube;
                var vimeoReg = dataObj.regExr.vimeo;
                var soundCloudReg = dataObj.regExr.soundCloud;

                for (var i = startIndex; i < maxIndex; i++) {

                    var imgDataOrigin = rssArray[2][i].match(imageReg);
                    var youtubeDataOrigin = rssArray[2][i].match(youtubeReg);
                    var vimeoDataOrigin = rssArray[2][i].match(vimeoReg);
                    var soundDataOrigin = rssArray[2][i].match(soundCloudReg);

                    var imgData = imgDataOrigin ? imgDataOrigin[0] : "";
                    var reg = /http:.+(?="\sfilem)/;
                    var parsingHTML = $.parseHTML(rssArray[2][i]);
                    var text = $(parsingHTML).text().slice(0, 150) + "....";

                    if (imgDataOrigin !== null) {
                        //이미지가 여러개일경우
                        var sLength = imgDataOrigin.length;
                        if (sLength > 1) {
                            var data;

                            var cfileReg = /cfile/g;
                            var imgDataResort = [];

                            //데이터 재정의
                            for (var g = 0; g < sLength; g++) {
                                if (imgDataOrigin[g].match(cfileReg)) {
                                    imgDataResort.push(imgDataOrigin[g]);
                                }
                            }

                            var sSortLength = imgDataResort.length;

                            //대표이미지검색
                            for (var j = 0; j < sSortLength; j++) {
                                data = imgDataResort[j].match(dataObj.regExr.imageSelect) ? imgDataResort[j].match(dataObj.regExr.imageSelect)[0] : "none";
                                if (data != "none") {
                                    break;
                                }
                            }
                            //대표이미지 없을경우
                            if (data == "none") {
                                data = imgDataResort[0];
                                imgData = data;
                            } else {
                                imgData = data;
                            }
                        }
                    }
                    var templeteData;

                    if (imgData) {

                        var t = imgData.match(reg) ? imgData.match(reg)[0] : "";
                        templeteData = appendTemplete.replaceAll("rssLink", rssArray[1][i]).replaceAll("rssTitle", rssArray[0][i]).replaceAll("./images/loading.gif", t).replaceAll("rssText", text).replaceAll("./images/", imageSrc).replaceAll("rssDate", rssArray[3][i]);

                    } else {

                        templeteData = appendTemplete.replaceAll("<div class=\"mask\"><a href=\"rssLink\" class=\"item\"><img src=\"./images/loading.gif\" width=\"320\" alt=\"\"></a><div class=\"aside\"><a href=\"rssLink\" class=\"view_more\"><img src=\"./images/plus.png\" alt=\"\"></a></div></div>", "<div class=\"mask\"><a href=\"rssLink\" class=\"item\" style=\"display:none\"><img src=\"./images/loading.gif\" width=\"320\" alt=\"\"></a><div class=\"aside\"><a href=\"rssLink\" class=\"view_more\"><img src=\"./images/plus.png\" alt=\"\"></a></div></div>").replaceAll("rssLink", rssArray[1][i]).replaceAll("rssTitle", rssArray[0][i]).replaceAll("rssText", text).replaceAll("./images/", imageSrc).replaceAll("rssDate", rssArray[3][i]);
                    }

                    if (youtubeDataOrigin !== null) {
                        templeteData = templeteData.replaceAll("box", "box media youtube");
                    }
                    if (vimeoDataOrigin) {
                        templeteData = templeteData.replaceAll("box", "box media vimeo");
                    }
                    if (soundDataOrigin) {
                        templeteData = templeteData.replaceAll("box", "box media soundcloud");
                    }
                    appendHtml = templeteData;
                    $container.msnyReveal($(appendHtml), i);
                }
                currentNum = currentNum + rssNum;
            }; //append

            $.when(rssComplete).done(function () {
                rssNum = dataObj.rssArr[0].length < itemNum ? dataObj.rssArr[0].length : itemNum;
                currentNum = 0;
                maxNum = dataObj.rssArr[0].length;
                appendRss(0, rssNum, dataObj.rssArr, $container);
            }); //$document

            var checkSecond = true;

            $(window).scroll(function () {
                var scrollHeight = $(window).scrollTop() + $(window).height();
                var documentHeight = $(document).height();
                if ((scrollHeight + 300) >= documentHeight && maxNum > currentNum && checkSecond) {
                    var limitNum = (currentNum + rssNum) <= maxNum ? (currentNum + rssNum) : maxNum;
                    appendRss(currentNum, limitNum, dataObj.rssArr, $container);
                    checkSecond = false;
                    setTimeout(changeCheck, 300);
                    playNum = currentNum;
                } //IF
            }); //$window
        } else {
            //Image,Media AJAX
            var eachFuntion = (function () {

                var popop = [];
                var eachCount = 0;
                var endCount = 0;

                $.when(rssComplete).done(function () {
                    $targetWrap.find(".box").each(function () {
                        dataObj.$preLoader.show();

                        var index,
                        $this = $(this),
                            src = $this.find(".mask .item").attr("href");

                        var data;

                        for (var i = 0, max = dataObj.rssArr[0].length; i < max; i++) {
                            if (decodeURIComponent(dataObj.rssArr[1][i]) == src) {
                                index = i;
                                break;
                            }
                        }

                        if (index > -1) {

                            var enddd = checkSort($this, dataObj.rssArr[2][index], true);
                            // 루프돌리면 날린다. 검색된 RSS삭제.
                            for (var k = 0; k < 3; k++) {
                                dataObj.rssArr[k].splice(index, 1);
                            }
                            enddd.done(function () {
                                endCount++;
                            });
                            //없으면
                        } else {
                            popop.push(

                            $.ajax({
                                url: src,
                                cache: false,
                                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                                type: "GET",
                                dataType: "html"
                            })
                                .done(function (data) {
                                var defin = new $.Deferred();
                                var enddd = checkSort($this, data, false);

                                enddd.done(function () {
                                    endCount++;
                                });
                            }));
                        }
                        eachCount++;
                    });

                    var count = setInterval(function () {
                        if (eachCount == endCount) {
                            $(".search_list_wrap").css("visibility", "visible");
                            $targetWrap.find(".item").imagesLoaded().done(function (imgLoad) {
                                if (!dataObj.mobileCheckResult) {
                                    $targetWrap.masonry();
                                }

                                dataObj.$preLoader.hide();
                                $(".search_list_wrap").css("visibility", "visible");
                            });

                            clearInterval(count);
                        }
                    }, 200);

                    setTimeout(function () {
                        dataObj.$preLoader.hide();
                        $(".search_list_wrap").css("visibility", "visible");
                        clearInterval(count);
                    }, 5000);
                });
            })();
        }
    });
})(jQuery);