//操作文件对象
var fso = new ActiveXObject("Scripting.FileSystemObject");
var f1;  //获取文件的句柄

function search() {
	var word = $('#word').val();        //待查单词
	var article =  $('#article').val();  //文章名
	/*
			if(searchArticle(article)){
				$('#article').readOnly="readonly";  //只读
			}
	 */
	var appid = '2015063000000001';
	var key = '12345678';
	var salt = (new Date).getTime();
	var query = word;
	// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
	var from = 'en';
	var to = 'zh';
	var str1 = appid + query + salt + key;
	var sign = MD5(str1);
	$.ajax({
		url : 'http://api.fanyi.baidu.com/api/trans/vip/translate',
		type : 'get',
		dataType : 'jsonp',
		data : {
			q : query,
			appid : appid,
			salt : salt,
			from : from,
			to : to,
			sign : sign
		},
		success : function(data) {
			//console.log(data);
			$('#result').val(data.trans_result[0].dst);
			//传入数据
			if(data.trans_result[0].src !="" && data.trans_result[0].src !="undefiend"){
				writeInTxt(article,data.trans_result[0].src, data.trans_result[0].dst);
			}
		}
	});
}

/**
 *利用ActiveX对象,向文件中写内容
 */
function writeInTxt(article,src, dst) {

    //按日期命名文件名
	//var filename = getFileName();
	filename = article;
	//指定存储的文件夹
	var strFolder = "C:\\Users\\chuang\\Desktop\\Reading\\" ;
	try {				
		//检查文件夹是否存在
		if (!fso.FolderExists(strFolder)){
			// 创建文件夹
			var strFolderName = fso.CreateFolder(strFolder);
			//alert(strFolderName);
		}
		//尝试读文件
		var txt = strFolder + filename + ".txt";
		//获取已经有多少行
		var count = getLine(txt);
		//alert("当前文档有" + count +"行.");      //注意因为WriteLine方法会多写一行
		//拼字符串
		var cotent = count + "." + src + "：    " + dst ;				
		//追加
		var ForAppending = 8;
		f1 = fso.OpenTextFile(txt, ForAppending);   //为了追加打开文件
		f1.WriteLine(cotent);
		f1.Close();
	} catch (e) {
		//alert(e.name + ": " + e.message);
		//文件不存在就创建文件
		f1 = fso.createtextfile(strFolder + filename + ".txt", true); 
		f1.WriteLine("1." + src + "：    " + dst);
		f1.Close();
	}
}

/**
 *通过换行符,获取文件行数
 */
function getLine(src) {
	var count = 0;
	var ForReading = 1;
	var f1 = fso.OpenTextFile(src, ForReading);
	var content = f1.ReadAll();
	var arr = content.split("\r\n");
	for (var i = 0; i < arr.length; i++) {
		//alert("第" + (i + 1) + "行数据为:" + arr[i]);
		count ++;
	}
	return count;
}

function getFileName(){
	//按日期命名文件名
	var filename = "";
	var theDate = new Date();
	filename += theDate.getFullYear() + "-"; // 获取年份 
	filename += (theDate.getMonth() + 1) + "-"; // 获取月份 
	filename += theDate.getDate(); // 获取日 
	return filename;
}
//暂时没用到
function searchArticle(article){
	try {
		//尝试读文件
		var txt = "C:\\Users\\chuang\\Desktop\\Reading\\" + article + ".txt";
        var ForAppending = 8 ;
		f1 = fso.OpenTextFile(txt, ForAppending);   //为了追加打开文件
		f1.Close();
		//文件存在article的input的元素设置灰色
		return true;
	} catch (e) {
		return false;
	}
}

function showWords(){
	var article =  $('#article').val();  //文章名
    var ForReading = 1;
    var txt = "C:\\Users\\chuang\\Desktop\\Reading\\" + article + ".txt";
    f1 = fso.OpenTextFile(txt, ForReading);   //为了追加打开文件
    var content = f1.ReadAll();

	//获取已经有多少行
	var count = getLine(txt);
    $('#articleWords').attr("rows",count * 2)
    $('#articleWords').val(content);  //文章名

}