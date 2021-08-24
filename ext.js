
function onLoaded() {
    var csInterface = new CSInterface();
   
    
    var appName = csInterface.hostEnvironment.appName;
    
    if(appName != "FLPR"){
    	loadJSX();
    }    
    
    var appNames = ["ILST"];
    for (var i = 0; i < appNames.length; i++) {
        var name = appNames[i];
        if (appName.indexOf(name) >= 0) {
           var btn = document.getElementById("btn_" + name);
           if (btn)
                btn.disabled = false;
        }
    }
    

    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    // Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	
}



/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
	
    //Update the background color of the panel
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBackgroundColor);
        
    var styleId = "ppstyle";
    
    var csInterface = new CSInterface();
	var appName = csInterface.hostEnvironment.appName;
    
    if(appName == "PHXS"){
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", "border-radius:3px;");
	}
	if(appName == "PHXS" || appName == "PPRO" || appName == "PRLD") {
		////////////////////////////////////////////////////////////////////////////////////////////////
		// NOTE: Below theme related code are only suitable for Photoshop.                            //
		// If you want to achieve same effect on other products please make your own changes here.    //
		////////////////////////////////////////////////////////////////////////////////////////////////
		
	    
	    var gradientBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 40) + " , " + toHex(panelBackgroundColor, 10) + ");";
	    var gradientDisabledBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 15) + " , " + toHex(panelBackgroundColor, 5) + ");";
	    var boxShadow = "-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);";
	    var boxActiveShadow = "-webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);";
	    
	    var isPanelThemeLight = panelBackgroundColor.red > 127;
	    var fontColor, disabledFontColor;
	    var borderColor;
	    var inputBackgroundColor;
	    var gradientHighlightBg;
	    if(isPanelThemeLight) {
	    	fontColor = "#000000;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, -70) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -90) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, 54) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -40) + " , " + toHex(panelBackgroundColor,-50) + ");";
	    } else {
	    	fontColor = "#ffffff;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, 100) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -45) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, -20) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -20) + " , " + toHex(panelBackgroundColor, -30) + ");";
	    }
	    
	
	    //Update the default text style with pp values
	    
	    addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + fontColor + "; background-color:" + toHex(panelBackgroundColor) + ";");
	    addRule(styleId, "button, select, input[type=text], input[type=button], input[type=submit]", borderColor);    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", gradientBg);    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", boxShadow);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", gradientHighlightBg);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", boxActiveShadow);
	    addRule(styleId, "[disabled]", gradientDisabledBg);
	    addRule(styleId, "[disabled]", disabledFontColor);
	    addRule(styleId, "input[type=text]", "padding:1px 3px;");
	    addRule(styleId, "input[type=text]", "background-color: " + inputBackgroundColor) + ";";
	    addRule(styleId, "input[type=text]:focus", "background-color: #ffffff;");
	    addRule(styleId, "input[type=text]:focus", "color: #000000;");
	    
	} else {
		// For AI, ID and FL use old implementation	
		addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + reverseColor(panelBackgroundColor) + "; background-color:" + toHex(panelBackgroundColor, 20));
	    addRule(styleId, "button", "border-color: " + toHex(panelBgColor, -50));
	}
}

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
    
    if (stylesheet) {
        stylesheet = stylesheet.sheet;
           if( stylesheet.addRule ){
               stylesheet.addRule(selector, rule);
           } else if( stylesheet.insertRule ){
               stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
           }
    }
}


function reverseColor(color, delta) {
    return toHex({red:Math.abs(255-color.red), green:Math.abs(255-color.green), blue:Math.abs(255-color.blue)}, delta);
}

/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = computedValue.toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with (color) {
             hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        };
    }
    return "#" + hex;
}

function onAppThemeColorChanged(event) {
    // Should get a latest HostEnvironment object from application.
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
} 



    
/**
 * Load JSX file into the scripting context of the product. All the jsx files in 
 * folder [ExtensionRoot]/jsx will be loaded. 
 */
function loadJSX() {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$._ext.evalFiles("' + extensionRoot + '")');
}

function evalScript(script, callback) {
    new CSInterface().evalScript(script, callback);
}
//var start = document.getElementById("reloadDiv").innerHTML;
var tempSepName = [];

function run(sep_info) {
	
	//alert("ex  "+sep_info);
	
	sep_info = sep_info.split(',undefined');
	//alert("ex2  "+sep_info);
	var sep_name = sep_info[0];
	var sep_RGB = sep_info[1];
	sep_name = sep_name.split(',');
	sep_RGB = sep_RGB.split(' RGB ');
	//alert("1  "+sep_name);
	//alert("2   "+sep_RGB);
	
	var pantone = /PANTONE/i;
	var nazwa = [];
	for (i = 0; i < sep_name.length; i++) {
		if (sep_name[i].search(pantone) != -1) {
			nazwa[i] = sep_name[i].replace(pantone, "P.");
		}
		else { nazwa[i] = sep_name[i] }
		document.getElementById("s" + i).value = nazwa[i];
		document.getElementById("colorMark_" + i).style.backgroundColor = "rgb("+sep_RGB[i+1]+")";
		document.getElementById("c" + i).checked = true;
		
		tempSepName[i] = sep_name[i];

	}
	for (i = 13; i >= sep_name.length; i--) {
		document.getElementById("s" + i).value = "_";
		document.getElementById("colorMark" + i).style.backgroundColor = "0";
		document.getElementById("c" + i).checked = false;
		alert(document.getElementById("c" + i).checked);

	}
	//for (f = 0; f < 15; f++) {document.getElementById("r" + f).value = f + 1;}

}
function onClickButton01() {
	document.getElementById("reloadDiv").innerHTML=start;
	
	var artwork = 0;
	if (document.getElementById("TEST").checked == true) {
		artwork = 1;
	}

	drag();
	var tab = document.location.pathname;
	var extScript = '$._ext_ILST.run("' + tab + '","' + artwork + '")';
	evalScript(extScript, run);
}
function onClickButton02() {
	document.getElementById("reloadDiv").innerHTML=start;
	drag();
	var tab = document.location.pathname;
	var extScript = '$._ext_ILST.run2()';
	evalScript(extScript, run);
}

function onClickButton03() {
	//alert(document.getElementById("color_box_0").lastElementChild.checked);
	var colorName = [];
	var sepName = [];
	var techColorName = [];
	var techSepname = [];
	var lp = 0;
	var tlp = 0;
	for (i = 0; i <10; i++) {
		//alert(document.getElementById("color_box_" + i).lastElementChild.checked)
		if (document.getElementById("color_box_" + i).lastElementChild.checked==true) {
			//alert("licznik  "+i+" lp "+lp);
			colorName[lp]=document.getElementById("color_box_" + i).firstElementChild.value;
			sepName[lp] = tempSepName[document.getElementById("color_box_" + i).lastElementChild.getAttribute('value')];
			lp++;
		}
	}
	for (t = 10; t<14; t++) {
		//alert("AAAAA" +t +"   "+document.getElementById("color_box_" + t).lastElementChild.checked);
		if (document.getElementById("color_box_" + t).lastElementChild.checked==true) {
		//	alert("VALUE   "+document.getElementById("color_box_" + t).lastElementChild.getAttribute('value'));
		//	alert("VALUE   "+document.getElementById("color_box_" + t).firstElementChild.getAttribute('id').toString());
			techColorName[tlp]=document.getElementById("color_box_" + t).firstElementChild.value;
			techSepname[tlp]=tempSepName[document.getElementById("color_box_" + t).lastElementChild.getAttribute('value')];
			tlp++;
		}
	}
	//alert(colorName);
	//alert(sepName);
	//alert("tech    "+ techColorName);
	//alert(techSepname);
//	var extScript = '$._ext_ILST.go("' + colorName + '"," 1  ","  2  ","  3  ")';

	var extScript = '$._ext_ILST.go("' + colorName + '","'+ sepName + '","' + techColorName + '","' + techSepname + '")';
	evalScript(extScript);
}
function onClickButton04() {
	document.getElementById("reloadDiv").innerHTML=start;
	drag();

}
function drag(){


		var dragSrcEl = null;
		var valueIput = null;
		var check_value = null;
		function handleDragStart(e) {
		  this.style.opacity = '0.4';
		
		  dragSrcEl = this;
		  e.dataTransfer.effectAllowed = 'move';
		  e.dataTransfer.setData('text/html', this.innerHTML);
		  valueIput= this.firstElementChild.value;
		  check_value=this.lastElementChild.checked;
		  //console.log(check_value +"   pobierany");
		
		}
		
		function handleDragOver(e) {
		  if (e.preventDefault) {
			e.preventDefault();
		  }
		
		  e.dataTransfer.dropEffect = 'move';
		  
		  return false;
		}
		
		function handleDragEnter(e) {
		  this.classList.add('over');
		  this.firstElementChild.style.opacity = '0.4';
		}
		
		function handleDragLeave(e) {
		  this.classList.remove('over');
		  this.firstElementChild.style.opacity = '1';
		}
		
		function handleDrop(e) {
		  if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		  }
		  
		  if (dragSrcEl != this) {
			//console.log(this.firstElementChild.value+"   znika");
			dragSrcEl.innerHTML = this.innerHTML;
			dragSrcEl.firstElementChild.style.opacity = '1';
			dragSrcEl.firstElementChild.value=this.firstElementChild.value;
			dragSrcEl.lastElementChild.value=this.lastElementChild.value;
			dragSrcEl.lastElementChild.checked=this.lastElementChild.checked;
			this.innerHTML = e.dataTransfer.getData('text/html');	
			this.firstElementChild.value=valueIput;
			this.lastElementChild.checked=check_value;
			this.firstElementChild.style.opacity = '1';
		
		  }
		  
		  return false;
		}
		
		function handleDragEnd(e) {
		  this.style.opacity = '1';
		  
		  items.forEach(function (item) {
			item.classList.remove('over');
		  });
		}
		
		
		var items = document.querySelectorAll('.sep_box .sep_box_move');
		items.forEach(function(item) {
		  item.addEventListener('dragstart', handleDragStart, false);
		  item.addEventListener('dragenter', handleDragEnter, false);
		  item.addEventListener('dragover', handleDragOver, false);
		  item.addEventListener('dragleave', handleDragLeave, false);
		  item.addEventListener('drop', handleDrop, false);
		  item.addEventListener('dragend', handleDragEnd, false);
		  
		});
		
		
		
	
}