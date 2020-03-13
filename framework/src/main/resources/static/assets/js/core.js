/*
 *  v 1.0.20
 */

$.data( document , "defaultLanguage", {
    sProcessing: "處理中...",
    sLengthMenu: "顯示 _MENU_ 項結果",
    sZeroRecords: "沒有匹配結果",
    sInfo: "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
    sInfoEmpty: "顯示第 0 至 0 項結果，共 0 項",
    sInfoFiltered: "(由 _MAX_ 項結果過濾)",
    sInfoPostFix: "",
    sSearch: "搜索:",
    sUrl: "",
    sEmptyTable: "沒有相關數據",
    sLoadingRecords: "載入中...",
    sInfoThousands: ",",
    oPaginate: {
        sFirst:"首頁",
        sPrevious: "上頁",
        sNext: "下頁",
        sLast: "末頁"
    },
    oAria: {
        sSortAscending: ": 以升序排列此列",
        sSortDescending: ": 以降序排列此列"
    },
    search_button_text:"搜索",
    message_alert_title:"提示",
    message_confirm_title:"提示",
    message_confirm_text:"提示",
    message_confirm_button:["是","否"],
    validator_regex_message:"格式错误",
    sInfoBeginPage:" , 第 ",
    sInfoEndPage:" 頁"
});

var hideSize = 3;
function createSearchInput(id, name, title , value,width) {
    return '<input id="' + id + '" name="' + name + '" type="text" placeholder="' + title + '" value="' + value + '" class="input-sm form-control">';
}
//rowValueKey rowTitleKey type
function createSearchSelect( id, name, title , value , rows , nameKey , valueKey) {
    var str = "";
    str += '<select id="' + id + '" name="' + name + '" class="form-control input-sm search-select">';
    $.each(rows,function (i,val) {
        var rowValue = $.isEmpty(val[valueKey]) ? "" :val[valueKey];
        var rowName = $.isEmpty(val[nameKey]) ? "" : val[nameKey];
        str += '<option ' + ( value === rowValue ? 'selected': '' )  + ' value="' + rowValue + '" >' + rowName + '</option>';
    });
    str += '</select>';
    return str;
}

function hideOrDisplaySearch(button,tag) {
    var b = $(button).attr('data') === "close";
    $(tag).find('.sb').css("display",b ? "inline-block" : "none" );
    $(button).children("i:eq(0)").removeClass();
    $(button).children("i:eq(0)").addClass(b ? "fa fa-chevron-up":"fa fa-chevron-down");
    $(button).attr("data" ,b ? "open" : "close" );
}

function createSearch(options) {

    //var more = typeof(options.searchTag.showMore) != "undefined"  ? options.searchTag.showMore : true;
    var searchDiv = '<div class="col-sm-9 m-b-xs" >';
    var more = false;
    $.each(options.searchTag.rows, function (i, row) {

        var data = jQuery.extend({}, {
            id: "",
            name: "",
            title: "",
            value: "",
            nameKey:"name",
            valueKey:"value",
            layoutClass: "m-b-xs col-sm-4",
            display: "inline-block",
            displayCss: row.display === "none" ? "sb" : "",
        }, row);

        more = more || data.display === "none";

        var str = "";
        if( data.type == "select" ){
            str = createSearchSelect(data.id , data.name, data.title, data.value , data.rows,data.nameKey,data.valueKey);
        } else {
            str = createSearchInput(data.id , data.name, data.title ,data.value);
        }

        searchDiv +=
            '<div style="display:' + data.display + '" class="' + data.layoutClass + " " + data.displayCss + '">' +
            '<div class="input-group">' +
            '<span class="input-group-btn">' +
            '<span class="search-text">' + data.title + '</span></span>' + str +
            '</div>' +
            '</div>';
    });
    $(options.searchTag.tag).append(searchDiv +'</div>');

    var language = $.data( document , "localLanguage" ) || $.data( document , "defaultLanguage" );
    options.searchTag.moreDisplay = more ? "inline-block" : "none";
    var searchButton =
        '<div style="background1: #000;position: absolute;right: 0px;top: 0px;" class="col-sm-1">'
        +'<div style="position:relative">'
        +'<button style="float: right;position: absolute;width: 20px;height: 20px;padding: 0px;right: -10px;top: -7px;display:' + options.searchTag.moreDisplay + '" data="close" onclick="hideOrDisplaySearch(this,\'' + options.searchTag.tag + '\')" class="btn btn-default btn-circle" type="button"><i class="fa fa-chevron-down"></i> </button>'
        +'<button style="float: right" type="button" onclick="tableReload(\''+ options.tag +'\')" class="btn btn-sm btn-primary">' + language.search_button_text + '</button>'
        +'</div>'
        +'</div>';

    $(options.searchTag.tag).append(searchButton);

}

function setSearch( paramsCache , searchTag ) {
    if ($.isNotBlank(paramsCache)) {
        var params = paramsCache.split("&");
        for (var i = 0; i < params.length; i++) {
            if( $.isNotBlank(params[i]) && params[i].indexOf("=") > -1 ){
                var param = params[i].split("=");
                var name = param[0];
                var value = decodeURIComponent( param[1] );
                $(searchTag.tag).find("select[name='" + name + "'],input[name='" + name + "']").each(function (i, val) {
                    if( val.tagName == "SELECT" ){
                        $(val).find('option[value="' + value + '"]').attr("selected", true);
                    } else {
                        $(val).val(value);
                    }
                });
            }
        }
    }
}

function setParams( params , searchTag , method , stateSave ) {
    var paramsCache = "";
    $(searchTag.tag).find("input,select").each(function (i, val) {
        params[val.name] = method == "get" ? encodeURIComponent(val.value) : val.value;
        paramsCache += "&" + val.name + "=" + encodeURIComponent(val.value);
    });
    if( stateSave ){
        localStorage.setItem("paramsCache_" + document.location.pathname,paramsCache);
    }
}

function tableReload(tag) {
    $(tag).DataTable().ajax.reload(null, false);
}

function dataTable(options) {
    //生成搜索条逻辑.
    if (options.searchTag) {
        if ( options.searchTag.rows ) {
            createSearch(options);
        }
    }

    var language = $.data( document , "localLanguage" ) || $.data( document , "defaultLanguage" );

    $.each(options.columns, function (i, column) {
        if( typeof(column.render) == "undefined" ){
            column.render = function (value, type, row, meta) {
                return typeof(value) == "undefined" ? "" : value ;
            };
        }
    }.bind(this));

    // $.each(options.columns, function (i, column) {
    //     if( !column.defaultContent ){
    //         column.defaultContent = "";
    //     }
    // }.bind(this));
    //DataTable.defaults.pageLength = 50;

    var settings = jQuery.extend({}, {
        pageLength: 10,
        responsive: true,
        lengthChange: false,
        searching: false,
        ordering: false,
        info: true,
        serverSide: true,
        processing: true,
        stateSave:false,
        language: language,
        fnDrawCallback: function(oSettings) {
            $(oSettings.nTableWrapper).find(".dataTables_info").append(language.sInfoBeginPage+"<input type='text' id='changePage' class='input-text' style='width:50px;height:27px;text-align: center' value="+oSettings.oAjaxData.page+">"+language.sInfoEndPage);

            var oTable = $(settings.tag).dataTable();

            $('#changePage').keyup(function(e){
                if(e.keyCode==13){

                    if($(this).val() && $(this).val()>0){
                        var redirectpage = $(this).val()-1;
                    }else{
                        var redirectpage = 0;
                    }
                    oTable.fnPageChange( redirectpage );
                }
            });

        },
    }, options);

    if( settings.stateSave ){
        var paramsCache = localStorage.getItem("paramsCache_" + document.location.pathname,paramsCache);
        setSearch( paramsCache , options.searchTag );
    } else {
        localStorage.removeItem("paramsCache_" + document.location.pathname);
    }

    settings.ajax.data = function (params) {
        params.page = params.start / params.length + 1;
        params.rows = params.length;
        delete params.columns;
        delete params.search;
        delete params.order;
        console.log(params);
        if(this.searchTag){
            setParams(params,this.searchTag,options.ajax.type || "post" ,this.stateSave);
        }
    }.bind(settings);

    return $(settings.tag).DataTable(settings);

}

function removeSearchCache(path) {
    localStorage.removeItem("paramsCache_" + path);
    localStorage.removeItem("DataTables_DataTables_Table_0_" + path);
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}

var idArray = new Array();

function loadForm(form,data) {

    var defaults = {
        isValidate:true,
        ajaxMethod:"GET",
        beforeSubmit:function () {return true;},
        action:data.action || form.action,
        actionMethod:data.actionMethod || form.method || "POST"
    };

    this.elementMap = {};
    this.values = null;
    this.jform = $(form);
    this.data = jQuery.extend({} ,defaults , data);

    this.jform.attr("action",this.data.action);
    this.jform.attr("method",this.data.actionMethod);

    $.data( form , "loadForm", this );

    this.setRows = function (name,rows) {
        this.elementMap[name].rows = rows;
        return this;
    };

    this.refresh = function(name){
        console.log("_refresh=" + (name?name:"all"));
        if( name ){
            var el = this.elementMap[name];
            this.setElementRows(el);
            this.setElementValue(el);
        } else {
            $.each(this.data.elements, function (i, el) {
                if( !name || ( name && name == el.name) ){
                    this.setElementRows(el);
                    this.setElementValue(el);
                }
            }.bind(this));
        }
        return this;
    };

    this.setValues = function () {
        if( arguments.length == 1 ){
            this.values = arguments[0];
        } else if(arguments.length == 2) {
            var name = arguments[0]
            var value = arguments[1];
            this.elementMap[name].setValue(value);
        }
        return this;
    };

    this.getFrame = function (name) {
        return document.getElementById(this.elementMap[name].uid);
    };

    this.hide = function (name) {
        if( this.elementMap[name] && !$("#" + this.elementMap[name].uid).hasClass("hide") ){
            $("#" + this.elementMap[name].uid).addClass("hide");
        }
    }

    this.show = function (name) {
        if( this.elementMap[name] && $("#" + this.elementMap[name].uid).hasClass("hide") ){
            $("#" + this.elementMap[name].uid).removeClass("hide");
        }
    }

    this.initializedElement = function () {
        $.each(this.data.elements, function (i, el) {
            el.name = el.name || guid();
            if( typeof(el.id) === "undefined" || el.id == null ){
                el.id = $.inArray(el.name, idArray) != -1 ? this.jform.attr("id") + "_" + el.name : el.name;
            }
            idArray.push(el.id);
            el = jQuery.extend({}, {
                getValue: function () {
                    var value = el.loadForm.values ? el.loadForm.values[this.data || this.name]:this.value;
                    console.log("getValue " + el.id + "=" + value);
                    return typeof(value) === "undefined" || value === null ? this.defaultValue : value;
                },
                setValue:function (value) {
                    if(el.loadForm.values){
                        el.loadForm.values[this.name] = value;
                    } else {
                        this.value = value;
                    }
                },
                getRows: function () {
                    return this.rows;
                },
                loadForm: this,
                rowValueKey: 'id',
                rowTitleKey: 'title',
                valueKey:null,
                titleStyle:'',
                format:"yyyy-MM-dd HH:mm:ss",
                data:null,
                defaultValue:undefined,
                uid: guid(),
                height: null,
                disabled: false,
                readonly: false,
                showRemove: false,
                aspectRatio:1,
                disabledTxt: el.disabled ?'disabled':'',
                readonlyTxt: el.readonly ?'readonly':'',
                type:'html',
                //select2OptionFormat:null,//select2
                select2SelectionLength:-1,//select2
                select2AllowClear:false,//select2
                multiple:false,//select2
            }, el);
            this.elementMap[el.name] = el;
            this.data.elements[i] = el;
        }.bind(this));

        console.log("initialized ajaxMethod=" + this.data.ajaxMethod);
        console.log("initialized action=" + this.data.action);
        console.log("initialized actionMethod=" + this.data.actionMethod);
        console.log("initialized data.elements.length=" + this.data.elements.length);
        // console.log("elementMap.length=" + this.data.elements.length);
    };

    this.renderElement = function (el) {
        console.log("render=" + el.id + ' type=' + el.type);
        this.elementType[el.type].render(el);
    };

    this.setElementValue = function(el){
        console.log("setValue=" + el.id + ' type=' + el.type);
        this.elementType[el.type].setValue(el);
    };

    this.setElementRows = function(el){
        console.log("setRows=" + el.id + ' type=' + el.type);
        this.elementType[el.type].setRows(el);
    };

    this.renderAll = function () {
        $.each(this.data.elements, function (i, el) {
            this.renderElement(el);
            this.setElementRows(el);
            this.setElementValue(el);
        }.bind(this));
    };

    this.initializedForm = function () {
        var validateRules = {},validateMessages = {};
        $.each(this.data.elements, function (i, el) {
            if(el.validate){
                $.each(el.validate, function(name, value) {
                    var validate = name.indexOf("_msg") == -1 ? validateRules : validateMessages ;
                    validate[el.name] = validate[el.name] || {};
                    validate[el.name][name.replace("_msg","")] = value;
                }.bind(this));
            }
        }.bind(this));

        //validate init
        this.validator = this.jform.validate({
            rules: validateRules,
            messages: validateMessages,
            //提交时不触发
            onsubmit: false,
            validatorAfter : function(validateForm,errorList,elements) {
                if( errorList && errorList.length > 0 && errorList[0] && errorList[0].message ){
                    var msg = null;
                    $.each(this.data.elements,function (i,val) {
                        if( val.title && val.title != "" && val.name == $(errorList[0].element).attr('name') ){
                            msg = "["+ val.title + "]" + errorList[0].message;
                            return false;
                        }
                    });
                    if( msg ){
                        $.alert(msg,2);
                    } else if(errorList[0]){
                        $.alert(errorList[0],2);
                    }
                }
            }.bind(this)
        });

        this.jform.ajaxForm({
            dataType: "json",
            /*action: this.data.action,
             method: this.data.actionMethod,*/
            beforeSubmit:function (formData, jqForm, options) {
                if( this.data.isValidate && !this.jform.valid() ){
                    if (this.validator){
                        this.validator.focusInvalid();
                    }
                    return false;
                }
                var isSubmit = this.data.beforeSubmit(formData, jqForm, options);
                if( isSubmit ){
                    $.loading();
                    return true;
                }
                return false;
            }.bind(this),
            success: function (responseText, statusText) {
                $.close("loading");
                if (data.success) {
                    data.success(responseText, statusText);
                }
            },error:function (e,xhr,opt){
                alert("Error requesting " + opt.url + ": " + xhr.status + " " + xhr.statusText);
                $.close("loading");
                $.alert("error");
            }
        });
    };

    this.writeOuterFrame = function (el, html) {
        var frame = ""
        var layoutClass = el.layoutClass || el.loadForm.data.layoutClass || "col-sm-12" ;

        if ("html" != el.type) {
            frame ='<div style="margin-bottom: 5px" id="' + el.uid + '" class="' + layoutClass + '"><div class="form-group"><label style="' + el.titleStyle + '" >' + el.title + '</label>' + html + '<label class="error" style="display:none;position:absolute" for="' + el.id + '" /></div></div>';
        } else {
            frame = '<div style="margin-bottom: 5px" id="' + el.uid + '" class="' + layoutClass + '">' + html + '</div>';
        }
        this.jform.append(frame);
    }

    //Hidden
    var _hidden = function () {
        this.setRows = function (el) {};
        this.render = function (el) {
            var valueText = el.getValue() ? "value=\"" + el.getValue() + "\"" : "";
            el.loadForm.jform.append('<input id="' + el.id + '" type="hidden" name="' + el.name + '" ' + valueText + ' />');
        };
        this.setValue = function (el) {
            var value = el.getValue();
            $('#' + el.id).val(value);
        };
        return this;
    }

    //date
    /*
    var _date = function () {

        this.setRows = function (el) {};
        this.render = function (el) {

            //HH:mm                 type:time
            //HH:mm:ss              type:time
            //yyyy                  type:year
            //yyyy-MM               type:month
            //yyyy-MM-dd            type:date
            //yyyy-MM-dd HH         type:datetime
            //yyyy-MM-dd HH:mm      type:datetime
            //yyyy-MM-dd HH:ss      type:datetime

            var showTime = el.format.indexOf("HH") > -1;
            var showYear = el.format.indexOf("yyyy") > -1;
            var showMonth = el.format.indexOf("MM") > -1;
            var showDay = el.format.indexOf("dd") > -1;
            var type = showYear ?  ( showTime ? "datetime" : ( showDay ? "date" : ( showMonth ? "month" :  ( showDay ? "date" : "year" )  ) ) )  : "time" ;
            var range = el.range ? true : false;
            //el.button1 = true;

            var parmas = {
                theme: 'molv',
                elem: '#' + el.id, //指定元素
                type: type,
                format: el.format,
                range:range,
            };

            var html = '<input ' + el.disabledTxt + ' ' + el.readonlyTxt + ' id="' + el.id + '" name="' + el.name + '" type="text" class="form-control"  placeholder="' + ( el.placeholder || el.title ) + '" >';

            //按钮弹出时间控件存在bug占时不兼容。
            if( el.button1 ){
                parmas['eventElem'] = '#' + el.id + '_button1';
                parmas['trigger'] = "click";
                var button1 = "<span class='input-group-btn'><button type='button' id='" + el.id + "_button1' class=\"btn btn-primary\"><i class=\"fa fa-calendar\"></i></button></span>";
                html ='<div class="input-group">'  + html + button1 +'</div>';
            }

            el.loadForm.writeOuterFrame(el, html);

            if( range && el.range instanceof Array ){
                parmas['done'] = function (value, date, endDate) {
                    if( value == "" ){
                        el.loadForm.setValues(el.range[0],"").refresh(el.range[0]);
                        el.loadForm.setValues(el.range[1],"").refresh(el.range[1]);
                    } else {
                        var values = value.split(" - ");
                        el.loadForm.setValues(el.range[0],values[0]).refresh(el.range[0]);
                        el.loadForm.setValues(el.range[1],values[1]).refresh(el.range[1]);
                    }
                }.bind(el);
            }

            laydate.render(parmas);

        };
        this.setValue = function (el) {
            if( !el.range ){
                var date = getDateByString(el.getValue());
                if( date ){
                    $("#" + el.id).val(date.format(el.format));
                }
                return;
            }
            if ( el.range instanceof Array ) {
                var value0 = el.loadForm.elementMap[el.range[0]].getValue();
                var value1 = el.loadForm.elementMap[el.range[1]].getValue();
                var date0 = getDateByString(value0);
                var date1 = getDateByString(value1);
                if( date0 || date1 ){
                    date0 = date0 || date1;
                    date1 = date1 || date0;
                    var value = ( date0 ? date0.format(el.format) : "" ) + " - " + ( date1 ? date1.format(el.format) : "" );
                    $("#" + el.id).val( value );
                }
            } else {
                $("#" + el.id).val(el.getValue());
            }
        };
        return this;
    }
    */

    //date
    var _date = function () {

        this.setRows = function (el) {};
        this.render = function (el) {

            //HH:mm                 type:time
            //HH:mm:ss              type:time
            //yyyy                  type:year
            //yyyy-MM               type:month
            //yyyy-MM-dd            type:date
            //yyyy-MM-dd HH         type:datetime
            //yyyy-MM-dd HH:mm      type:datetime
            //yyyy-MM-dd HH:ss      type:datetime

            var showTime = el.format.indexOf("HH") > -1;
            var showYear = el.format.indexOf("yyyy") > -1;
            var showMonth = el.format.indexOf("MM") > -1;
            var showDay = el.format.indexOf("dd") > -1;
            var type = showYear ?  ( showTime ? "datetime" : ( showDay ? "date" : ( showMonth ? "month" :  ( showDay ? "date" : "year" )  ) ) )  : "time" ;
            var range = el.range ? true : false;

            var html = '<input ' + el.disabledTxt + ' ' + el.readonlyTxt + ' id="' + el.id + '" name="' + el.name + '" type="text" class="form-control"  placeholder="' + ( el.placeholder || el.title ) + '" >';

            el.loadForm.writeOuterFrame(el, html);

            laydate.render({
                theme: 'molv',
                elem: '#' + el.id, //指定元素
                type: type,
                format: el.format,
                range:range,
            });

        };
        this.setValue = function (el) {
            if( !el.range ){
                var date = getDateByString(el.getValue());
                if( date ){
                    $("#" + el.id).val(date.format(el.format));
                }
                return;
            }
            $("#" + el.id).val(el.getValue());
        };
        return this;
    }

    //select
    var _select = function () {
        this.setRows = function (el) {
            //$("#" + el.id).empty();
            var rows = el.getRows();
            var html = "";
            if(rows){
                $.each(rows, function (i, row) {
                    var subValue = row[el.rowValueKey];
                    var title = row[el.rowTitleKey];
                    html += '<option value="' + subValue + '" >' + title + '</option>';
                });
            }
            $("#" + el.id).html(html);
        };
        this.render = function (el) {
            var html = '<select ' + el.disabledTxt + ' id="' + el.id + '" name="' + el.name + '" class="form-control" >' + html + '</select>';
            el.loadForm.writeOuterFrame(el, html);
        };
        this.setValue = function (el) {
            $("#" + el.id).find('option').removeAttr("selected");
            var values = getValueArray(el);
            $.each(values, function (i, value) {
                $("#" + el.id).find('option[value="' + value + '"]').attr("selected", true);
            });
        };
        return this;
    }

    //radio or checkbox
    var _radioAndCheckbox = function () {
        this.setRows = function(el){
            // $('#' + el.uid + ' .el-context').empty();
            var html = "";
            var rows = el.getRows();
            if(rows){
                $.each(rows, function (i, row) {
                    var subValue = row[el.rowValueKey];
                    var title = row[el.rowTitleKey];
                    var subId = el.id + "_" + subValue;
                    var divClass = (el.type === 'checkbox') ? 'class="checkbox checkbox-success checkbox-inline"':'class="radio radio-inline radio-success"';
                    var inputClass = (el.type === 'checkbox') ? 'class="styled"':"";
                    html += '<div ' + divClass + ' >' +
                        '<input class="multi-radio" ' + el.disabledTxt + ' ' + el.readonlyTxt + ' name="' + el.name + '" type="' + el.type + '" ' + inputClass + ' id="' + subId + '" value="' + subValue + '" />' +
                        '<label for="' + subId + '">' + title + '</label>' +
                        '</div>';
                });
            }
            $('#' + el.uid + ' .el-context').html(html);
        };
        this.render = function (el) {
            var html = '<div class="el-context" style="min-height: 34px" ></div>';
            el.loadForm.writeOuterFrame(el, html);
        }
        this.setValue = function (el) {
            var values = getValueArray(el);
            $.each(values, function (i, value) {
                $("#" + el.uid + " input[name='"+el.name+"'][type='"+el.type+"'][value='"+value+"']").attr("checked","true");
            });
        };
        return this;
    };

    var getValueArray = function (el) {
        var values = Array();
        var value = el.getValue();
        if (typeof value == "string" || typeof value == "number" ) {
            try {
                values = el.splitKey ? value.split(el.splitKey) : [value];
            }finally {}
        } else if (typeof value == "object" && value instanceof Array) {
            for (var i = 0; i < value.length; i++) {
                if (typeof value[i] == "string" || typeof value[i] == "number") {
                    values.push(value[i]);
                } else if (typeof value[i] == "object") {
                    try{
                        values.push(value[i][el.valueKey || el.rowValueKey]);
                    }finally{}
                }
            }
        }
        return values;
    };

    //html
    var _html = function () {
        this.setRows = function(){};
        this.render = function (el) {
            el.loadForm.writeOuterFrame(el, "");
        };
        this.setValue = function (el) {
            if (el.render) {
                el.render(  document.getElementById(el.uid) , el.getValue(), this.result, el.getRows());
            }
        };
        return this;
    }

    //textarea
    var _textarea = function () {
        this.setRows = function(){};
        this.render = function (el) {
            var heightTxt = el.height ? "height:" + el.height + "px;" : "height:120px;";
            var html = '<textarea ' + el.disabledTxt + ' ' + el.readonlyTxt + ' style="resize:none;' + heightTxt + '" id="' + el.id + '" name="' + el.name + '" class="form-control" placeholder="' + ( el.placeholder || el.title ) + '"></textarea>';
            if(el.button0 || el.button1) {
                if(el.readonly==false && el.disabled==false){
                    var button0 = "";
                    var button1 = "";
                    if(el.button0){
                        button0 = '<span class=\"input-group-btn\" style=\"vertical-align: bottom;\"><button type=\"button\" id="'+el.id+'_button0" class=\"btn btn-primary\" >'+el.button0+'</button></span>';
                    }
                    if(el.button1){
                        button1 = '<span class=\"input-group-btn\" style=\"vertical-align: bottom;\"><button type=\"button\" id="'+el.id+'_button1" class=\"btn btn-primary\" >'+el.button1+'</button></span>';
                    }
                    html ='<div class="input-group">' + button0 + html + button1 +'</div>';
                }
            }
            el.loadForm.writeOuterFrame(el, html);
        }
        this.setValue = function (el) {
            var value = el.getValue();
            if (value) {
                $('#' + el.uid + ' textarea').val(value);
            }
        }
        return this;
    }

    //ueditor
    function _ueditor(){
        this.setRows = function(){};
        this.render = function (el) {
            var heightTxt = el.height ? "height:" + ( el.height ) + "px;" : "";
            var html = '<textarea ' + el.disabledTxt + ' ' + el.readonlyTxt + ' style="width: 100%;' + heightTxt + '" id="' + el.id + '" name="' + el.name + '" class="force-validate" ></textarea>';
            el.loadForm.writeOuterFrame(el, html);
            UE.getEditor(el.id).addListener( 'ready', function( editor ) {
                el.ue_ready = true;
                if( el.disabled || el.readonly ){
                    this.setDisabled();
                }
            } );

        }
        this.setValue = function (el) {
            var value = el.getValue();
            if (value && UE.getEditor(el.id) ) {
                if( el.ue_ready ) {
                    UE.getEditor(el.id).setContent(value, false);
                } else {
                    UE.getEditor(el.id).addListener('ready', function (editor) {
                        this.setContent(value, false);
                    });
                }
            }
        }
        return this;
    }

    //text or password
    var _textOrPassword = function () {
        this.setRows = function(){};
        this.render = function (el) {
            var html = '<input ' + el.disabledTxt + ' ' + el.readonlyTxt + ' id="' + el.id + '" name="' + el.name + '" type="' + el.type + '" class="form-control"  placeholder="' + ( el.placeholder || el.title ) + '" >';
            if(el.button0 || el.button1){
                var button0 = "";
                var button1 = "";
                if(el.button0){
                    button0 = '<span class=\"input-group-btn\"><button type=\"button\" id="'+el.id+'_button0"  class=\"btn btn-primary\">'+el.button0+'</button></span>';
                }
                if(el.button1){
                    button1 = '<span class=\"input-group-btn\"><button type=\"button\" id="'+el.id+'_button1" class=\"btn btn-primary\">'+el.button1+'</button></span>';
                }
                html ='<div class="input-group">' + button0 + html + button1 +'</div>';
            }
            el.loadForm.writeOuterFrame(el, html);
        };
        this.setValue = function (el) {
            var value = el.getValue();
            $('#' + el.id).val(value);
        };
        return this;
    };


    var audioType = /(ogg|mp3|mp?g|wav)$/i;
    var videoType = /(ogg|mp4|mp?g|mov|webm|3gp)$/i;
    var imageType = /\.(gif|png|jpe?g)$/i;


    //file
    var _filephoto = function () {
        this.initFileinput = function (el,initialPreview,initialPreviewConfig) {
            $("#" + el.id ).fileinput({
                layoutTemplates: {
                    main1: "{preview}\n" +
                        "<div class=\'input-group {class}\'>\n" +
                        "   {caption}\n" +
                        "   <div class=\'input-group-btn\ input-group-prepend'>\n" +
                        " <button type=\"button\" id=\"" + el.id + "_remove_button\" style=\"display: " + ( el.showRemove ? "inline":"none" ) + "\" tabindex=\"500\" onclick=\"clearFileinput('" + el.id + "')\" class=\"btn btn-danger\"><i class=\"glyphicon glyphicon-trash\"></i>&nbsp;<span class=\"hidden-xs\">"+( el.button0 ? el.button0:"移除" )+"</span></button>" +
                        "       {remove}\n" +
                        "       {upload}\n" +
                        "       {browse}\n" +
                        "   </div>\n" +
                        "</div>",
                    actionDelete:"",
                },
                initialPreview:initialPreview,
                initialPreviewConfig:initialPreviewConfig,
                showUpload:false,
                initialPreviewAsData: true,
                language: 'zh-TW', //设置语言
                showRemove: false,
            }).on('fileselect', function(event, numFiles, label) {
                $("#" + $(this).attr("id") + "_remove").attr("value","");
            }).on('fileselectnone', function(event) {
                setRemoveTrue($(this).attr("id"));
            });

        }
        this.setRows = function(){};
        this.render = function (el) {
            var html =
                '<input id="' + el.id + '_remove" name="' +  el.name + '_remove" type="hidden" value="" >' +
                '<input id="' + el.id + '" name="' +  el.name + '" type="file" '+el.multiple+' '+ el.disabledTxt + ' >';
            el.loadForm.writeOuterFrame(el, html);
            this.initFileinput(el);
        };
        this.setValue = function (el) {
            var src = el.getValue();
            var initialPreview;
            var initialPreviewConfig;
            if( src && src != "" ){
                initialPreview = [src];
                var filetype = src.replace(/^.+\./,'').toLowerCase();
                if( src.match(audioType) ){
                    initialPreviewConfig = [{
                        type: "audio", size: 0, filetype: "audio/"+filetype, caption: filetype, filename: filetype , downloadUrl:src
                    }];
                } else if( src.match(videoType) ){
                    initialPreviewConfig = [{
                        type: "video", size: 0, filetype: "video/"+filetype, caption: filetype, filename: filetype ,downloadUrl:src
                    }];
                } else if( src.match(imageType) ){
                    initialPreviewConfig = [{
                        type: "image", size: 0, caption: filetype, filename: filetype , downloadUrl:src
                    }];
                } else {
                    initialPreviewConfig = [{
                        type: "other", size: 0, caption: filetype, filename: filetype , downloadUrl:src
                    }];
                }
                $("#" + el.id ).fileinput('destroy');
                this.initFileinput(el,initialPreview,initialPreviewConfig);
            }
        };
        return this;
    };

    var _cropper = function () {
        this.setRows = function(){};
        this.render = function (el) {
            if(!el.height){
                el.height = "400px";
            }
            var html = '<img style="width: 100%;height:'+el.height+'" id="' + el.id +'_img" ><div style="height: 10px"></div><input type="file" name="'+el.id+'" id="'+el.id+'" '+ el.disabledTxt + ' /> ' +
                '<input type="hidden" id="' + el.id +'_remove" name="' + el.id +'_remove"  />' +
                '<input type="hidden" id="' + el.id +'_x" name="' + el.id +'_x"/>' +
                '<input type="hidden" id="' + el.id +'_y" name="' + el.id +'_y"/>' +
                '<input type="hidden" id="' + el.id +'_w" name="' + el.id +'_w"/>' +
                '<input type="hidden" id="' + el.id +'_h" name="' + el.id +'_h"/>';
            el.loadForm.writeOuterFrame(el, html);
            $("#" + el.id ).fileinput({
                layoutTemplates: {
                    main1: "{preview}\n" +
                        "<div class=\'input-group {class}\'>\n" +
                        "   {caption}\n" +
                        "   <div class=\'input-group-btn\ input-group-prepend'>\n" +
                        " <button type=\"button\" id=\"" + el.id + "_remove_button\" style=\"display: " + ( el.showRemove ? "inline":"none" ) + "\" tabindex=\"500\" onclick=\"clearFileinput('" + el.id + "');clearCropper('" + el.id + "')\" class=\"btn btn-danger\"><i class=\"glyphicon glyphicon-trash\"></i>&nbsp;<span class=\"hidden-xs\">"+( el.button0 ? el.button0:"移除" )+"</span></button>" +
                        "       {remove}\n" +
                        "       {upload}\n" +
                        "       {browse}\n" +
                        "   </div>\n" +
                        "</div>"
                },
                language: 'zh-TW', //设置语言
                uploadExtraData: function (previewId, index) {

                },//上传时除了文件以外的其他额外数据
                showPreview: false,//隐藏预览
                showUpload: false, //是否显示上传按钮
                showRemove: false,
                showCaption: true,//是否显示标题
            }).on('fileselect', function(event, numFiles, label) {
                $("#" + $(this).attr("id") + "_remove").attr("value","");
            }).on('fileselectnone', function(event) {
                clearCropper($(this).attr("id"));
            });

            var image = document.getElementById(el.id+"_img");

            el.cropper = new Cropper(image, {
                viewMode:1,
                aspectRatio: el.aspectRatio,
                zoomable:false,
                autoCrop: false, //关闭自动显示裁剪框
                crop : function(event) {
                    /*
                    console.log(event.detail.x);
                    console.log(event.detail.y);
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                    console.log(event.detail.rotate);
                    console.log(event.detail.scaleX);
                    console.log(event.detail.scaleY);
                    */
                    $("#" + this.id + "_x").val(event.detail.x);
                    $("#" + this.id + "_y").val(event.detail.y);
                    $("#" + this.id + "_w").val(event.detail.width);
                    $("#" + this.id + "_h").val(event.detail.height);
                }.bind(el),
                ready:function () {
                    if( !this.cropper.isUse ){
                        this.cropper.reset().disable();
                    }else{
                        this.cropper.reset().crop();
                    }
                    // $("#" + this.id + "_max").removeClass("hide");
                    // $("#" + this.id + "_max").click(function() {
                    //     this.cropper.setCropBoxData({
                    //         "width":530.1333333333333,
                    //         "height":298.2,
                    //         "left":145.3733357747396,
                    //         "top":105.79999389648438,
                    //     });
                    // }.bind(this));
                    if(this.hidden){
                        if( this && !$("#" + this.uid).hasClass("hide") ){
                            $("#" + this.uid).addClass("hide");
                        }
                    }
                }.bind(el),
            });

            $.data( image , "cropper" , el.cropper );

            $("#" + el.id ).on('change',function () {
                var img = $("#" + this.id + "_img" );
                var input = $("#" + this.id );
                if (input[0].files && input[0].files[0]) {
                    var reader = new FileReader();
                    reader.readAsDataURL(input[0].files[0]);
                    reader.onload = function (e) {
                        img.removeAttr('src');
                        img.attr('src', e.target.result);
                        if( this.cropper ){
                            this.cropper.isUse = true;
                            this.cropper.reset().enable();
                            this.cropper.reset().replace(e.target.result);
                        }
                    }.bind(this);
                }
            }.bind(el));
        };

        this.setValue = function (el) {
            var src = el.getValue();
            if( el.cropper && src && src != "" ) {
                el.cropper.reset().replace(src);
            }
        };
        return this;
    };
    /*
     $("#my").select2({
     //单选并且大于0,显示搜索框
     minimumResultsForSearch: -1,
     //样式选择
     theme: "bootstrap",
     //是否有清空选择
     allowClear:true,
     //多选时，最多选择个数
     maximumSelectionLength: 2,
     //多选还是单选
     multiple:true,
     //格式化
     templateResult:function (option) {
     return $("<span>" + ( option.id + "-" + option.text )  + '</spen>');
     }
     });

     //改变状态
     $("#my").prop("disabled", false);
     $("#my").prop("disabled", true);

     //得到选中元素的id和text
     $("#my").select2("data")[0].id
     $("#my").select2("data")[0].text

     //添加一条数据在后边
     $('#my').append("<option id='1' >asdfasf</option>");

     //添加一条数据在最前边
     $('#my').prepend("<option id='1' >asdfasf</option>");

     //清空所有数据
     $("#my").val(null).trigger("change");
     $("#my option").remove()

     //改变value
     $("#my").val("2").trigger("change");

     //清空选项
     $("#my").val(null).trigger("change");

     //当select改变的时候出发 selecting(old value) - change(new value) - select(new value)
     //unselect和unselecting是多选时候才会触发
     $('#my').on("select2:select",function(e) {
     console.log("select" + $(this).select2("data")[0].id);
     });

     $('#my').on("select2:selecting",function(e) {
     console.log("selecting" + $(this).select2("data")[0].id);
     });

     $('#my').on("select2:unselect",function(e){
     console.log("unselect" +$(this).select2("data")[0].id);
     });

     $('#my').on("select2:unselecting",function(e){
     console.log("unselecting" +$(this).select2("data")[0].id);
     });

     $('#my').on("change",function(e){
     console.log("change" +$(this).select2("data")[0].id);
     });
     */

    var _select2 = function () {
        this.setRows = function (el) {
            $("#" + el.id).val(null).trigger("change");
            $("#" + el.id + " option").remove()
            var html = "";
            var rows = el.getRows();
            if( rows ){
                $.each(rows, function (i, row) {
                    var subValue = row[el.rowValueKey];
                    var title = row[el.rowTitleKey];
                    html += '<option value="' + subValue + '" >' + title + '</option>';
                });
            }
            $("#" + el.id).append(html);
        };
        this.render = function (el) {
            var html = '<select style="width:100%" id="' + el.id + '" name="' + el.name + '"  class="form-control" ></select>';
            el.loadForm.writeOuterFrame(el, html);
            $("#" + el.id).select2({
                minimumResultsForSearch: -1,
                theme: "bootstrap",
                // allowClear:true,
                maximumSelectionLength: el.select2SelectionLength,
                multiple:el.multiple,
                templateResult:el.select2OptionFormat
            });
            $("#" + el.id ).change( function() {
                $($(this).next()).removeClass('error');
                var label = $($(this).parent()).find("label[for='" + $(this).attr('id') + "']");
                if( label.length > 0 ){
                    $(label.get(0)).css("display","none");
                }
            });
            if( el.disabled ){
                $("#" + el.id).prop("disabled", true);
            }
        };
        this.setValue = function (el) {
            var values = getValueArray(el);
            $("#" + el.id).val(values).trigger("change");
        };
        return this;
    }

    var _label = function () {
        this.setRows = function(){};
        this.render = function (el) {
            // <p class="form-control-static">email@example.com</p>
            var html = '<p id="' + el.id + '" name="' + el.name + '" class="form-control-static" style="border-bottom:1px solid #e5e6e7;padding: 6px 12px;">' + ( el.placeholder || el.title ) + '</p>';
            if(el.button0 || el.button1) {
                var button0 = "";
                var button1 = "";
                if(el.button0){
                    button0 = '<span class=\"input-group-btn\" style=\"vertical-align: bottom;\"><button type=\"button\" id="'+el.id+'_button0" class=\"btn btn-primary\" >'+el.button0+'</button></span>';
                }
                if(el.button1){
                    button1 = '<span class=\"input-group-btn\" style=\"vertical-align: bottom;\"><button type=\"button\" id="'+el.id+'_button1" class=\"btn btn-primary\" >'+el.button1+'</button></span>';
                }
                html ='<div class="input-group">' + button0 + html + button1 +'</div>';

            }
            el.loadForm.writeOuterFrame(el, html);
        };
        this.setValue = function (el) {
            var value = el.getValue();
            var rows = el.getRows();
            if( rows ){
                var text = "";
                var values = getValueArray(el);
                $.each(values, function (i, v) {
                    $.each(rows, function (i, row) {
                        var id = row[el.rowValueKey];
                        var title = row[el.rowTitleKey];
                        if ( v == id ) {
                            text += text === "" ? title : "," + title ;
                        }
                    });
                });
                $('#' + el.id).html(text);
            } else {
                $('#' + el.id).html(value);
            }
        };
        return this;
    }

    this.elementType = {
        "text": new _textOrPassword(),
        "hidden": new _hidden(),
        "password": new _textOrPassword(),
        "number": new _textOrPassword(),
        "checkbox": new _radioAndCheckbox(),
        "radio": new _radioAndCheckbox(),
        "select": new _select(),
        "date": new _date(),
        "html": new _html(),
        "textarea": new _textarea(),
        "ueditor": new _ueditor(),
        "filephoto": new _filephoto(),
        "cropper": new _cropper(),
        "select2":new _select2(),
        "label":new _label(),
    };

    this.initializedElement();
    this.renderAll();
    this.initializedForm();
    return this;
}

function setRemoveTrue(id) {
    var $remove_button = $("#" + id + "_remove_button" );
    if( $remove_button.length > 0 && $remove_button.attr("display") !== "none" ){
        $("#" + id + "_remove").attr("value","true");
    }
}

function clearFileinput(id) {
    $("#" + id).fileinput('clear');
    setRemoveTrue(id);
}

function clearCropper(id) {
    try {
        var cropper = $.data($("#" + id + "_img").get(0), "cropper");
        cropper.reset().clear();
        cropper.reset().disable();
        $("#" + id + "_img").parent().find(".cropper-hide").css("display", "none");
        setRemoveTrue(id);
    }catch (e) {}
}

jQuery(function () {
    // var menu_href = sessionStorage.getItem("menu_href");
    // var datas  = $(".metismenu").find("a");
    // try{
    //     var selectIndex = menu_href.split(",");
    //     if( selectIndex.length == 1){
    //         $($(".metismenu").children("li").get(selectIndex[0])).addClass("active");
    //     } else {
    //         var li = $($(".metismenu").children("li").get(selectIndex[0]));
    //         li.addClass("active");
    //         $(li.find("li").get(selectIndex[1])).addClass("active");
    //     }
    // }catch(e){}
    //
    // $.each( datas , function (i, data) {
    //     if( $(data).attr("href").toString() != "#" ){
    //         data.onclick = function () {
    //             if( $(data).parent().parent().hasClass("metismenu") ){
    //                 var index = $(".metismenu").children("li").index( $(this).parent());
    //                 sessionStorage.setItem("menu_href",index);
    //             } else {
    //                 var li = $(this).parent();
    //                 var ul = $(this).parent().parent();
    //                 var subIndex = ul.children("li").index(li);
    //                 var rootli = $(this).parent().parent().parent();
    //                 var index = $(".metismenu").children("li").index( rootli );
    //                 sessionStorage.setItem("menu_href",index + ","  + subIndex);
    //             }
    //         };
    //     }
    // });

    if($.validator){
        $.extend($.validator.defaults,{ignore:function () {
                if( $( this ).css('display') == "none" ){
                    return $( this ).hasClass("force-validate") ? false : true ;
                }
                return false;
            }});
    }

    var language = $.data( document , "localLanguage" ) || $.data( document , "defaultLanguage" );

    if(jQuery.validator) {
        jQuery.validator.addMethod("regex", function (value, element, params) {
            if(  value == "" ){
                var settings = $.data( element.form, "validator" ).settings;
                var required = false;
                if( settings.rules && settings.rules[element.id] && typeof settings.rules[element.id]["required"] != "undefined" ){
                    required = settings.rules[element.id]["required"];
                }
                if(!required){
                    return true;
                }
            }
            if( typeof params == "undefined" || params == null ){
                return true;
            }else if( typeof params == "string" ){
                var messages = $.data( element.form, "validator" ).settings.messages;
                messages[element.id] = messages[element.id] || {};
                messages[element.id]['regex'] = params;
                return false;
            }else if( typeof params == "boolean" ){
                return params
            }else if( typeof params == "object" ){
                var exp = new RegExp(params);
                return exp.test(value);
            }
        }, language.validator_regex_message);
    }

});

/**
 * 关闭Iframe
 *
 * //close all
 * $.close();
 *
 * //close last open popup
 * $.close(-1);
 *
 *  //close layer title
 * $.close(string);
 *
 *  //close layer id
 * $.close(number);
 *
 */
$.close = function () {

    var _layer = top.window.layer;
    var _document = top.window.document;

    if( arguments.length == 0 ){
        _layer.closeAll();
    } else if( typeof(arguments[0]) == "number" ){
        if( arguments[0] == -1  ) {
            var lastIframe = $(".layui-layer-iframe:last", top.window.document);
            lastIframe.length ?  _layer.close(lastIframe.attr("times")) : void(0);
        } else {
            _layer.close(arguments[0]);
        }
    } else if( typeof(arguments[0]) == "string" ){
        if( arguments[0] === "dialog" || arguments[0] === "page" || arguments[0] === "iframe" || arguments[0] === "loading" || arguments[0] === "tips" ){
            _layer.closeAll(arguments[0]);
            return;
        }
        var findIframe = $(".layui-layer-iframe .layui-layer-title:contains('" + arguments[0] + "')", _document);
        findIframe.length ? _layer.close( findIframe.parent().attr("times") ) : void(0);
    }

};

/**
 * 得到指定弹出层的window对象
 *
 * //get last open layer frame
 * $.getIframe();
 *
 * //get layer frame by title
 * $.getIframe(title);
 *
 * //get layer frame by id
 * $.getIframe(number);
 *
 * var _window = $.getIframe(param);
 * var _document = _window.document;
 *
 * @returns {*}
 */

$.getIframe = function () {

    var _window = top.window;
    var _document = top.window.document;
    if( arguments.length == 0 ){
        var lastIframe = $(".layui-layer-iframe:last", _document);
        iframe = _window.frames.length && lastIframe.length ? _window.frames["layui-layer-iframe" + lastIframe.attr("times")] : null;
    } else if ( typeof(arguments[0]) == "number" ) {
        iframe = _window.frames.length ? _window.frames[ "layui-layer-iframe" + arguments[0]]:null;
    } else if ( typeof(arguments[0]) == "string" ) {
        var layerTitle = $(".layui-layer-iframe .layui-layer-title:contains('" + arguments[0] + "')", _document);
        iframe = _window.frames.length && layerTitle.length ? _window.frames["layui-layer-iframe" + layerTitle.parent().attr("times")] : null;
    }
    return iframe;
};

/**
 * arguments
 * title string
 * url string
 * isFull boolean
 * area Array ['893px', '1000px']
 * closeFunction function
 *
 * $.open(title,url);
 * $.open(title,url,isFull);
 * $.open(title,url,area);
 * $.open(title,url,closeFunction);
 * $.open(title,url,isFull,area,closeFunction);
 */
$.open = function () {

    var _layer = top.window.layer;
    var title = arguments[0];
    var url = arguments[1];
    var isFull = getValueOfType("boolean", false, arguments[2], arguments[3], arguments[4]);
    var closeFunction = getValueOfType("function", null, arguments[2], arguments[3], arguments[4]);
    var area = getValueOfType("array", ( isFull ? [$(window).width()+'px', $(window).height()+'px'] : ['893px', '600px'] ), arguments[2], arguments[3], arguments[4]) ;

    var index = _layer.open({
        type: 2,
        title: title,
        shadeClose: true,
        maxmin: true, //开启最大化最小化按钮
        content:url,
        area: area,
        skin: 'layui-layer-molv', //样式类名
        cancel: closeFunction,
    });

    if(isFull){
        _layer.full(index);
    }

    return index;

};

function getValueOfType(){
    var type = arguments[0];
    var def = arguments[1];
    for(var i=2;i<arguments.length;i++){
        if(  type == typeof(arguments[i]) || ( "array" === type && "object" == typeof(arguments[i]) && arguments[i] instanceof Array ) ) {
            return arguments[i]
        }
    }
    return def;
}

/**
 *
 * 第一个字符串参数为message
 * 第二个字符串参数为跳转URL
 * 第一个方法参数为确认后回调方法
 * 第一个数字参数为样式
 * 不分参数先后循序
 *
 *  $.alert(message);
 *  $.alert(message,url);
 *  $.alert(message,function(){});
 *  $.alert(message,1);
 *  $.alert(message,url,1);
 *  $.alert(message,function(){},1);
 */
$.alert = function(){
    var _layer = top.window.layer;
    var language = $.data( document , "localLanguage" ) || $.data( document , "defaultLanguage" );
    var title = language.message_alert_title;
    var text = arguments[0];
    var url =  "string" == typeof(arguments[1]) ? arguments[1] : null;
    var callback = "function" == typeof(arguments[1]) ? arguments[1] : null;
    var icon = "number" == typeof(arguments[1]) ? arguments[1] : arguments[2];

    var index = _layer.alert(text, {
        title:title,
        skin: 'layui-layer-molv', //样式类名
        btn: 'OK',
        icon: icon ? icon : 1 ,
    }, function () {
        if( url ){
            location.href = url;
        } if( callback ) {
            callback();
        }
        _layer.closeAll("dialog");
    });
    return index;
};

/**
 *
 * 第一个字符串参数为message
 * 第一个方法参数为确认后回调方法
 * 不分参数先后循序
 *
 */
$.confirm = function(){

    var _layer = top.window.layer;
    var language = $.data( document , "localLanguage" ) || $.data( document , "defaultLanguage" );

    var title = language.message_confirm_title;
    var text = arguments[0];
    var fun = "function" == typeof(arguments[1]) ? arguments[1] : arguments[2];
    var button = arguments[1] instanceof  Array ? arguments[1] : arguments[2];

    _layer.confirm(text, {
        btn : button ? button : language.message_confirm_button,
        title : title,
        skin: 'layui-layer-molv', //样式类名
        icon: 3,
    }, function(){
        if( fun ) fun();
        _layer.closeAll("dialog");
    }, function(){

    });


};
var loadingIndex = -1;
/**
 * 加载loading
 * @returns {number}
 */
$.loading = function () {
    var _layer = top.window.layer;
    return _layer.load(1, {
        shade: [0.1,'#fff'] //0.1透明度的白色背景
    });
};

$.fn.loadForm = function(options){
    var form = this.get(0);
    if( !form ){
        return;
    }
    if( typeof(options) == "undefined" ){
        return $.data( form , "loadForm");
    } else {
        return new loadForm(form, options);
    }
};

/*
function _templateAnalysis( template , data ) {
    while ( match = /{{(.*?)}}/g.exec(template) ) {
        var fullName = match[0];
        var replaceName = null;
        var name = match[1];
        var value = null;
        if( $.trim(name) === "" ){
            return null;
        }
        try{
            value = eval(name);
            replaceName = new String(fullName);
            replaceName = replaceName.replace(new RegExp("\\[","gm"),"\\[");
            replaceName = replaceName.replace(new RegExp("\\]","gm"),"\\]");
            replaceName = replaceName.replace(new RegExp("\\(","gm"),"\\(");
            replaceName = replaceName.replace(new RegExp("\\)","gm"),"\\)");
        } catch (e){}
        if( typeof(value) === "undefined" || value == null ){
            return null;
        }
        console.info("url replace:fullName=" + fullName + " value=" + value);
        template = template.replace(new RegExp(replaceName,"gm"),value);
    }
    return template;
}
*/

function templateAnalysis( template , data ) {
    var regular = /{{(.*?)}}/g;
    var template_cp = template
    while ( match = regular.exec(template) ) {
        var fullName = match[0];
        var name = match[1];
        var value = null;
        if( $.trim(name) === "" ){
            return null;
        }
        try{
            value = eval(name);
        } catch (e){}
        if( typeof(value) === "undefined" || value == null ){
            return null;
        }
        console.info("url replace:fullName=" + fullName + " value=" + value);
        template_cp = template_cp.replace(fullName,value);
    }
    return template_cp;
}

function tmd(args,data,queueName) {
    var url = null;
    if ( typeof args  == "string" ) {
        var regular = /{{(.*?)}}/g;
        url = args;
        if( regular.test(url) ){
            url = templateAnalysis(url,data);
        }
    } else if( typeof args  == "function"  ){
        try{
            url = args.apply(null,data);
        }catch (e){}
    }
    console.info("url:"+ url);
    if( url && url != "" ){
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function (result) {
                data.push(result.data||result.rows);
                $(document).dequeue(queueName);
            },
            error:function () {
                data.push(null);
                $(document).dequeue(queueName);
            }
        });
    } else {
        data.push(null);
        $(document).dequeue(queueName);
    }
}

$.ajaxObject = function () {
    var queueName = "queue" + guid();
    var data = Array();
    var callback = arguments[arguments.length-1];
    for(var i=0;i<arguments.length-1;i++){
        $(document).queue(queueName, tmd.bind(this,arguments[i],data,queueName));
    }
    $(document).queue(queueName,function(){
        callback.apply(null,data);
    });
    $(document).dequeue(queueName);
};

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}


var ymd = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
var hms = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
var ymdhms = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;

var ymdRE = new RegExp(ymd);
var hmsRE = new RegExp(hms);
var ymdhmsRE = new RegExp(ymdhms);

function getDateByString(value) {
    var date = null;
    try {
        if ( value ) {
            console.info( value + "=" + value.replace(/\-/g, "/"));
            if(ymdRE.test(value)){
                value = value.replace(/\-/g, "/");
                date = new Date(value + " 00:00:00");
            } else if(hmsRE.test(value)){
                value = value.replace(/\-/g, "/");
                date = new Date("1970/01/01 " + value);
            } else if(ymdhmsRE.test(value)){
                value = value.replace(/\-/g, "/");
                date = new Date(value);
            }
        }
    } catch (e) {
        console.log("Date error");
    }
    console.info("date" + date );
    return date;
}

$.format = function(value){
    var format = "yyyy-MM-dd hh:mm:ss";
    var defaultValue = "";
    if ( this instanceof String ) {
        format = this;
    } else if ( this instanceof  Array ) {
        format = this.length > 0 ? this[0] : format;
        defaultValue = this.length > 1 ? this[1] : defaultValue;
    }
    var date = getDateByString(value);
    console.info(date);
    return date ? date.format(format):defaultValue;
};

$.isNotBlank = function (obj) {
    return !$.isBlank(obj);
};

$.isBlank = function (obj) {
    if(typeof obj == "undefined" || obj == null){
        return true;
    } else {
        if( typeof obj == "string" && obj.replace(/(^\s*)|(\s*$)/g, '') == "" ){
            return true;
        }
        return false;
    }
};

$.isNotEmpty = function (obj) {
    return !$.isEmpty(obj);
};

$.isEmpty = function (obj) {
    return typeof obj == "undefined" || obj == null;
};