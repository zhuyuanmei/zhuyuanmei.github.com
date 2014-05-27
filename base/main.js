/**
 * @Description: main.js
 * @Version:     v1.0
 */
(function(exports) {
    main = exports;
})((function() {
    var exports = {};
    exports.name    = 'main.js';
    exports.version = '1.0';

    var commonStr = 'J_catalog_',
        dataStr = 'J_Data',
        num = 1,
        sumPage,
        perPage = 5;

    var pageTemp = [
        '<div class="page">',
        '{{#PreviewFlag}}',
            '<a href="javascript:;" class="J_Preview disabled" data-page="1">&lt;</a>',
        '{{/PreviewFlag}}',
        '{{&pages}}',
        '{{#NextFlag}}',
            '<a href="javascript:;" class="J_Next" data-page="1">&gt;</a>',
        '{{/NextFlag}}',
        '</div>'
    ];

    function Page(){}

    Page.prototype.init = function(){
        var hash = {};

        var maxPage = Math.ceil(sumPage / perPage);

        hash.NextFlag = true;

        hash.PreviewFlag = true;

        var pageHtml = '';

        for (var i = 1; i <= maxPage ; i++) {
            if(i === 1){
                pageHtml = pageHtml + '<a class="current J_Page" href="javascript:;" data-page="' + i + '">' + i + '</a>';
            }else{
                pageHtml = pageHtml + '<a class="J_Page" href="javascript:;" data-page="' + i + '">' + i + '</a>';
            }
        }

        hash.pages = pageHtml;

        var $page = Mustache.render(pageTemp.join(''), hash);

        $('#' + commonStr + num).append($page);

        $('.container').data('page-'+num,true);

        this.render();
    };

    Page.prototype.render = function(){
        var items = $('#' + dataStr + num).find('li'),
            catalog = commonStr + num;

        $.each(items, function(key, value) {
            if(key+1 > perPage){
                $(value).hide();
            };
        });

        $('#' + catalog).delegate('.page .J_Page','click',function(){
            var $this = $(this),
                $prePage = $('#' + catalog + ' .J_Preview'),
                $nextPage = $('#' + catalog + ' .J_Next');

            if(!($this.hasClass('current'))){
                $this.siblings().removeClass('current');
                $this.addClass('current');

                var actPage = $this.attr('data-page');

                $.each(items, function(key, value) {
                    if((actPage-1)*perPage+1 <= key+1 && key+1 <= actPage*perPage){
                        $(value).show();
                    }else{
                        $(value).hide();
                    }
                });

                $prePage.attr('data-page',actPage);

                $nextPage.attr('data-page',actPage);

                actPage === '1' ? $prePage.addClass('disabled') : $prePage.removeClass('disabled');

                parseInt(actPage) === Math.ceil(sumPage / perPage) ? $nextPage.addClass('disabled') : $nextPage.removeClass('disabled');
            }
        });

        $('#' + catalog).delegate('.page .J_Preview','click', function(){
            var $this = $(this),
                $nextPage = $('#' + catalog + ' .J_Next');
            if($this.attr('data-page') !== '1'){
                $nextPage.removeClass('disabled');

                var curPage = parseInt($this.attr('data-page'))-1;

                $this.attr('data-page',curPage);

                $nextPage.attr('data-page',curPage);

                $.each(items, function(key, value) {
                    if((curPage-1)*perPage+1 <= key+1 && key+1 <= curPage*perPage){
                        $(value).show();
                    }else{
                        $(value).hide();
                    }
                });

                $.each($('#' + catalog + ' .J_Page'), function(key, value) {
                    if(parseInt($(value).attr('data-page')) === curPage){
                        $(value).siblings().removeClass('current');
                        $(value).addClass('current');
                    }
                });

                if(curPage === 1){
                    $this.addClass('disabled');
                }
            }
        });

        $('#' + catalog).delegate('.page .J_Next','click', function(){
            var $this = $(this),
                $prePage = $('#' + catalog + ' .J_Preview');
            if(parseInt($this.attr('data-page')) !== Math.ceil(sumPage / perPage)){
                $prePage.removeClass('disabled');

                var curPage = parseInt($this.attr('data-page'))+1;

                $this.attr('data-page',curPage);

                $prePage.attr('data-page',curPage);

                $.each(items, function(key, value) {
                    if((curPage-1)*perPage+1 <= key+1 && key+1 <= curPage*perPage){
                        $(value).show();
                    }else{
                        $(value).hide();
                    }
                });

                $.each($('#' + catalog + ' .J_Page'), function(key, value) {
                    if(parseInt($(value).attr('data-page')) === curPage){
                        $(value).siblings().removeClass('current');
                        $(value).addClass('current');
                    }
                });

                if(curPage === Math.ceil(sumPage / perPage)){
                    $this.addClass('disabled');
                }
            }
        });
    };

    var page = new Page();

    $('.cr-container input').click(function(){
        var $this = $(this);
        $this.siblings().removeClass('current');
        $this.addClass('current');

        num = $this.attr('data-num');
        $('#' + commonStr + num).siblings().hide();
        $('#' + commonStr + num).show();

        sumPage = $('#' + dataStr + num).find('li').length;

        if(sumPage > perPage && !($('.container').data('page-'+num))){
            page.init();
        }
    });

    /**
     * 对外接口
     */
    exports.init = function() {
        //首屏默认触发分页函数
        $('#select-img-1').trigger('click');
    };

    return exports;
})());