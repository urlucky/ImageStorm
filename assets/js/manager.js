$(function(){

    //拖拽模块
    (function($){

        var $current, $placeholder;

        $.fn.sortable = function(){

            var $items = $(this).children('[draggable=true]'),
                $placeholder = $('<li class="img-wrapper placeholder"></li>'),
                isDragging,
                index;

            $(this).data('items', $items);

            $items.on('dragstart', function(event) {
                
                isDragging = true;

                event.originalEvent.dataTransfer.effectAllowed = 'move';

                $current = $(this);
                $current.widthData = $current[0].offsetWidth;
                $current.heightData = $current[0].offsetHeight;
                index = $(this).index();

            }).on('dragend', function(event) {

                if(!isDragging) {return false;}
                $placeholder.after($current);
                $placeholder.detach();

                var newIndex = $current.index();
                $current.show();
                if(index !== newIndex) {
                    $current.parent().trigger('sortchange');
                }

                $current = $();
            }).add($placeholder).on('dragenter dragover drop', function(event) {
                event.preventDefault();

                if($current.parent().data('items').is(this)) {
                    
                    $current.hide();
                    $placeholder.css('width', $current.widthData);
                    $placeholder.css('height', $current.heightData);
                    if($(this).index() > $placeholder.index()) {
                        $(this).after($placeholder);
                    }else {
                        $(this).before($placeholder);
                    }
                }                
            });

            return this;

        }

        var cateSort = $('.cates').sortable();
        var imgSort = $('.list-wrapper').sortable();

    })($);

    //图片操作
    (function($){

        function ImgItem(wp) {
            this._init(wp);
        }

        ImgItem.prototype = {

            _init: function(wp) {
                this.$wp = wp;
                this.$editBtn = this.$wp.find('.img-edit-btn');
                this.$editUl = this.$wp.find('.img-edit');
                this.$name = this.$wp.find('.img-name');
                this.$dots = this.$wp.find('.dot');
                this.$edit = this.$wp.find('li.edit');
                this.$delete = this.$wp.find('li.delete');
                this.name = this.$name.text();

                this.$editUl.show();
                this._bind();
            },
            _edit: function(newName) {
                console.log('edit');
            },
            _delete: function() {
                console.log('delete');
            },
            _bind: function() {
                var that = this;

                $(window).on('click', function(event) {
                    if(!$(event.target).is(that.$dots.add(that.$editBtn))) {
                        that.$editUl.hide();
                    }
                });

                that.$edit.on('click', function(event) {
                    that.$name.attr('contenteditable', 'true');
                    that.$name.focus();
                });

                that.$name.on('blur', function(event) {
                    var newName = that.$name.text();
                    if(that.name != newName) {
                        that._edit(newName);
                        that.name = newName;
                    }
                });

                that.$delete.on('click', function(event) {
                    that._delete();
                });
            }

        }

        $('.img-edit-btn').on('mousedown', function(event) {
            var wp = $(this).closest('.img-wrapper');
            new ImgItem(wp);
        });

    })($);


    //分类操作
    (function($){

        function CateItem(wp) {
            this._init(wp);
        }

        CateItem.prototype = {

            _init: function(wp) {

                this.$wp = wp;
                this.$name = this.$wp.find('.cate-name');
                this.$num = this.$wp.find('.cate-num');
                this.$edit = this.$wp.find('i.edit');
                this.$delete = this.$wp.find('i.delete');
                this.name = this.$name.text();

                this._bind();

            },
            _edit: function(newName) {
                console.log('edit')
            },
            _delete: function() {
                console.log('delete.');
            },
            _bind: function() {
                var that = this;

                that.$edit.on('click', function(event) {
                    event.stopPropagation();
                    that.$name.attr('contenteditable', 'true');
                    that.$name.focus();
                });

                that.$name.on('blur', function(event) {
                    var newName = that.$name.text();
                    if(that.name != newName) {
                        that._edit(newName);
                        that.name = newName;
                    }
                });

                that.$delete.on('click', function(event) {
                    event.stopPropagation();
                    that._delete();
                });
            }

        }

        $('.cate').on('mousedown', '.edit, .delete', function(event) {
            var wp = $(this).closest('.cate');
            new CateItem(wp);
        });

    })($);

    //webuploader
    (function($){

        var $list = $('#fileList'),
            thumbnailWidth = 100,
            thumbnailHeight = 100;

        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: true,

            // swf文件路径
            swf: '/js/Uploader.swf',

            // 文件接收服务端。
            server: 'http://webuploader.duapp.com/server/fileupload.php',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#filePicker',

            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        // 当有文件添加进来的时候
        uploader.on( 'fileQueued', function( file ) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<img>' +
                        '<div class="info">' + file.name + '</div>' +
                    '</div>'
                    ),
                $img = $li.find('img');


            // $list为容器jQuery实例
            $list.append( $li );

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if ( !$percent.length ) {
                $percent = $('<p class="progress"><span></span></p>')
                        .appendTo( $li )
                        .find('span');
            }

            $percent.css( 'width', percentage * 100 + '%' );
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on( 'uploadSuccess', function( file ) {
            $( '#'+file.id ).addClass('upload-state-done');
        });

        // 文件上传失败，显示上传出错。
        uploader.on( 'uploadError', function( file ) {
            var $li = $( '#'+file.id ),
                $error = $li.find('div.error');

            // 避免重复创建
            if ( !$error.length ) {
                $error = $('<div class="error"></div>').appendTo( $li );
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').remove();
        });

    })($);

    //新建相册和上传图片的弹窗
    (function($){

        function Dialog(wp){
            this._init(wp);
        }

        Dialog.prototype = {
            _init: function(wp) {
                this.$wp = wp;
                this.$closeBtn = this.$wp.find('.close-btn');
                this._bind();
                this._show();
            },
            _show: function() {
                this.$wp.show();
            },
            _hide: function() {
                this.$wp.hide();
            },
            _bind: function() {
                var that = this;
                that.$closeBtn.on('click', function(event) {
                    that._hide();
                });
            }
        }

        $('.newcate-btn').on('mousedown', function(event) {
            new Dialog($('#newcate-dialog'));
        });

        $('.imgupload-btn').on('mousedown', function(event) {
            new Dialog($('#picupload-dialog'));
        });

    })($);

});

