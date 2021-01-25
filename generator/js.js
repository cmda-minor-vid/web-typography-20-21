/* https://stackoverflow.com/questions/33145762/parse-a-srt-file-with-jquery-javascript/33147421 */
var PF_SRT = function () {
	var pattern = /(\d+)\n([\d:,]+)\s+-{2}\>\s+([\d:,]+)\n([\s\S]*?(?=\n{2}|$))/gm;
	var _regExp;

	var init = function () {
		_regExp = new RegExp(pattern);
	};
	var parse = function (f) {
		
		if (typeof (f) != "string")
			throw "Sorry, Parser accept string only.";

		var result = [];
		if (f == null)
			return _subtitles;

		f = f.replace(/\r\n|\r|\n/g, '\n')

		//console.log(pattern.exec(f));
		while ((matches = pattern.exec(f)) != null) {
			result.push(toLineObj(matches));
		}
		//console.log(result);
		return result;
	}
	var toLineObj = function (group) {
		return {
			line: group[1],
			startTime: group[2],
			endTime: group[3],
			text: group[4]
		};
	}
	init();
	return {
		parse: parse
	}
}();
var captions;
$(function () {
	$("#doParse").on('click', function () {
		try {
			var text = $("#source").val();
			var result = PF_SRT.parse(text);
			var wrapper = $("#result");
			var paras = $("#paras");
			wrapper.html('');
			paras.html('');
			for (var line in result) {
				var obj = result[line];
				//console.log(obj);
				if(line%3 == 0) {
					wrapper.append("// " + obj.text + "\n");
				}
				let regexp = /([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{3})/g;
				var str = obj.startTime;
				var array = [...str.matchAll(regexp)];
				var hh = (array[0][1]*3600);
				var mm = (array[0][2]*60);
				var ss = (array[0][3]*1);
				var mls = (array[0][4]/1000);
				var stt = hh + mm + ss + mls;
				str = obj.endTime;
				array = [...str.matchAll(regexp)];
				var hh = (array[0][1]*3600);
				var mm = (array[0][2]*60);
				var ss = (array[0][3]*1);
				var mls = (array[0][4]/1000);
				var ett = hh + mm + ss + mls;
				//console.log(startTime);
				wrapper.append("captions[" + (obj.line - 1) + "] = ['" + stt + "','" + ett + "'];\n");
			}
			var result = PF_SRT.parse(text);
			for (line in result) {
				var obj = result[line];
				paras.append("&lt;p class=\"\">" + obj.text + "&lt;/p>\n");
			}
		} catch (e) {
			alert(e);
		}
		console.log(captions[3]);
	});
	$("#doParse").click();
});
