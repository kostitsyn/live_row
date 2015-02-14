function setLoop(live_row, options) {
	if (typeof live_row == 'string') live_row = document.getElementById(live_row);
	if (!options) var options = {};
	var step = options.step != undefined ? options.step : 1;
	var time_step = options.time_step != undefined ? options.time_step : 20;
	var wrap = getChildrenElements(live_row)[0];
	var children = getChildrenElements(wrap);
	var jqmode = options.jqmode != undefined ? options.jqmode : false;
	var interval = false;

	function getChildrenElements(node) {
		var children = node.childNodes;
		var elements = [];
		for (i = 0; i < children.length; i++) {
			if (children[i].nodeType == 1) elements.push(children[i]);
		}
		return elements;
	}
	function total_width(array) {
		var w = 0;
		for (var i = array.length - 1; i >= 0; i--) {
			w += array[i].offsetWidth;
		};
		return w;
	}

	function is_close() {
		var items = getChildrenElements(wrap);
		return live_row.scrollLeft + live_row.offsetWidth  > total_width(items) - items[items.length - 1].offsetWidth;
	}

	function is_gone() {
		var items = getChildrenElements(wrap);
		return live_row.scrollLeft > items[0].offsetWidth;
	}

	function prep() {
		var j = 0;
		var items = getChildrenElements(wrap);
		for (i = 0; i < children.length; i++) {
			if (children[i].isEqualNode(items[items.length - 1])) j = i;
		}
		var node = children[(j+1) % children.length].cloneNode(true);
		wrap.appendChild(node);
	}

	function shift() {
		var items = getChildrenElements(wrap);
		live_row.scrollLeft -= items[0].offsetWidth;
		wrap.removeChild(items[0]);
	}

	function clearChildren() {
		var items = getChildrenElements(wrap);
		if (items.length > children.length) {
			for (i = children.length; i < items.length; i++) wrap.removeChild(items[i]);
		}
		if (items.length < children.length) {
			var n = items.length;
			while (n < children.length) {
				prep();
				n = getChildrenElements(wrap).length;
			}
		}
	}

	if (jqmode) {
		var animate = function() {
			$(live_row).animate({scrollLeft: "+=" + step + "px"}, time_step, function(){
				if (is_gone()) shift();
				if (is_close()) prep();
			});
		}
	} else {
		var animate = function() {
			live_row.scrollLeft += step;
			if (is_gone()) shift();
			if (is_close()) prep();
		}
	}

	interval = setInterval(animate,time_step);
	if (!interval) return false;
	else return {
		stop: function() {
			clearInterval(interval);
			clearChildren();
		}
	}
}