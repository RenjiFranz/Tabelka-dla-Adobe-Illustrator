$._ext_ILST={
    run : function(tab_path,artwork) {
        
    	/**********   JSX code  **********/
        var sep_info_out=[];
        
        var xmp_info = xmp(app.activeDocument);
        var sep_infoRGB = xmp_info[1];
        $.writeln ("START 1");
        for (i = 1; i < xmp_info[0].length; i++) {
            sep_info_out[i - 1] = xmp_info[0][i].name;
            }
            $.writeln (tab_path,artwork);  
        addTab(tab_path,artwork);
        
        /************************************************************************/
        
        
        return [sep_info_out,sep_infoRGB];
    },
    run2 : function() {
        
    	/**********   JSX code  **********/
        var sep_info_out=[];
        $.writeln ("START 1:RUN2");
        var xmp_info = xmp(app.activeDocument);
        var sep_infoRGB = xmp_info[1];
        $.writeln ("START 1");
        for (i = 1; i < xmp_info[0].length; i++) {
            sep_info_out[i - 1] = xmp_info[0][i].name;
            }
            
        
        /************************************************************************/
        
        
        return [sep_info_out,sep_infoRGB];
    },
    go : function(colorName, sepName, techColorName, techSepname){
        $.writeln ("START2");
        $.writeln ("1  "+colorName);
        $.writeln ("2  "+sepName);
        $.writeln ("3  "+techColorName);
        $.writeln ("4  "+techSepname);
        fill_Tab ();
        colorsSeparation (colorName, sepName, techColorName, techSepname);
        
        
        
    },
};

//DODANIE TBELKI
function addTab(path, artwork) {
    $.writeln("ARTWORK   " + artwork);
    //Artwork+Path
    var docA = app.activeDocument;
    //var filePath = decodeURI(doc.path);
    docA.selected = false;
    //otwarcie pliku z tabelka
    var layersName = [];
    for (i = 0; i < docA.layers.length; i++) {
        if (docA.layers[i].name == "Legend") {

            break;
        }
        else {
            var tabLayer = docA.layers.add();
            tabLayer.name = "Legend";
            break;
        }
    }

    //var tabPath = "Macintosh HD/Users/tomasz.hadala/Creative Cloud Files/TABELKA CRS 2021/Ai_PDF/tabCRS21_r02.ai";
    

            var tabPath = path;
            var str = docA.name;
            var patt = /cedo/i;
            var patt2 = /C:/i;
            $.writeln("path   " + path);
            if (str.search(patt2) != -1) {

                if (str.search(patt) != -1) {
                    app.open(File("C:/Program Files/Common Files/Adobe/CEP/extensions/com.example.CRS2021r02/lib/tabCRS21_r02_CEDO.ai"));
                } else { app.open(File("C:/Program Files/Common Files/Adobe/CEP/extensions/com.example.CRS2021r02/lib/tabCRS21_r02.ai")); }

            } else {
                if (str.search(patt) != -1) {
                    app.open(File(tabPath.match(/(.*)index.html/)[1] + "lib/tabCRS21_r02_CEDO.ai"));
                } else { app.open(File(tabPath.match(/(.*)index.html/)[1] + "lib/tabCRS21_r02.ai")); }
            }
            //skopiowanie tabelki na artwork

            var tabdoc = app.activeDocument.layers.getByName("Legend").groupItems[0];
            tabdoc.selected = true;
            var dup = tabdoc.duplicate(docA.layers.getByName("Legend"), null);
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

            // poloznie tabelki na Arbord            
            var tabelka = docA.layers.getByName("Legend").groupItems[0];
            var aRect = docA.artboards[0].artboardRect;
            var docVisibleBounds;

            if (artwork == 1) {
                tabelka.position = Array(10 + aRect[2], aRect[1] - 10);
                docVisibleBounds = docA.visibleBounds;
                var left = aRect[0];
                var top = aRect[1];
                var right = aRect[2] + tabelka.width + 30;
                var bottom = docVisibleBounds[3] - 14;
                var ab = docA.artboards.getActiveArtboardIndex();
                docA.artboards[ab].artboardRect = [left, top, right, bottom];

            } else {
                tabelka.position = Array(aRect[2] - tabelka.width - 10, aRect[1] - 10);
            }
         
    
}


function format(){
    
         var layerFormat = false;
		var form = new RegExp(/format/i);

		for (i = 0; i < app.activeDocument.layers.length; i++) {
			if (form.test(app.activeDocument.layers[i].name) == true) {
                layerFormat=true;
                if (app.activeDocument.layers[i].pathItems.length == 0) {
					layerFormat = false;
                }
			}
          }
      return layerFormat;
}
//UZUPELNIANIE  I ODSWIEZANIE
function fill_Tab(){
    var doc = app.activeDocument;
    var filePath = decodeURI(app.activeDocument.path);
    var fileName = doc.name;
    fileName = fileName.split(' ');
    var temp_data = /(G[0-9]{4} .*) /g;
    //UZUPEŁNIENIE
    var custumer_gmg=doc.name.match(temp_data);
    temp_data = / .* /g;
    temp_data=custumer_gmg[0].match(temp_data);
    
    //ORDER
    doc.layers.getByName("Legend").groupItems[0].groupItems[1].textFrames[0].contents=fileName[0];
    $.writeln (fileName[0]);
    //CUSTOMER
    doc.layers.getByName("Legend").groupItems[0].groupItems[1].textFrames[1].contents=custumer();
     $.writeln (custumer());
    //PRINT CODE
    doc.layers.getByName("Legend").groupItems[0].groupItems[1].textFrames[2].contents=fileName[1].split('-')[0];
    //PRINT PROCES
    doc.layers.getByName("Legend").groupItems[0].groupItems[1].textFrames[3].contents=printing_method();
    //PRINTER
    doc.layers.getByName("Legend").groupItems[0].groupItems[1].textFrames[4].contents=temp_data[0]+" "+custumer_gmg[0].split(' ')[0];
    //GMG PROFILE
    if(custumer()=="CEDO"){doc.layers.getByName("Legend").groupItems[0].groupItems[1].textFrames[5].contents="...";}
    //GMG PROFILE
    doc.layers.getByName("Legend").groupItems[0].groupItems[3].groupItems[1].textFrames[0].contents=fileName[fileName.length-1].match(/[^v]*[^(.ai|.pdf)]/g)[1];
    //GMG PROFILE
    doc.layers.getByName("Legend").groupItems[0].groupItems[3].groupItems[1].textFrames[1].contents=data();
    }
 
//KOLORY SEPARACJE
function colorsSeparation(colorName, sepName, techColorName, techSepname){
   
    var colorName=colorName.split(',');
    var sepName=sepName.split(',');  

    var techColorName = techColorName.split(',');
    var techSepname = techSepname.split(',');
   $.writeln ("START3");
    $.writeln ("1  "+colorName);
    $.writeln ("2  "+sepName);
    $.writeln ("3  "+techColorName);
    $.writeln ("4  "+techSepname);
    var doc = app.activeDocument;
    var sepInfo=xmp(app.activeDocument);
//Grupowanie separacji na kolory artworkowe i techniczne
    var sepColorName=[];
    var sepTechName=[];
  //  var sCN=0;
   // var sTN=0;
    
    for (i =0; i<sepName.length; i++) {
        for (x = 1; x <sepInfo[0].length; x++) {     
            $.writeln ("sepName[i] "+sepName[i]);
            if(sepName[i]==sepInfo[0][x].name){
                
                sepColorName[i]=sepInfo[0][x];
                sepColorName[i].name=colorName[i];
            }      
            
        }
    }
    for (i =0; i<techSepname.length; i++) {
        $.writeln ("techSepname[i] "+sepName[i]);
        for (x = 1; x <sepInfo[0].length; x++) { 
            if(techSepname[i]==sepInfo[0][x].name){          
            sepTechName[i]=sepInfo[0][x];
            sepTechName[i].name=techColorName[i];
            }
        }
    }
              
//$.writeln ("Separacje   "+sepColorName.name);
//$.writeln ("techniczne "+sepTechName.name);


//Dopasowanie wielkosci tabelki
//Sprawdzenie ilosci separacji aby powiekszyc tabelke moduł to 2 sepracje karzda kolejna liczba nieparzysta powyzej 2  dodaje kolejny moduł
var modSEP_1 =  doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[0];
var modSEP_2 =  doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[1];
var modInLegend = Math.ceil(doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems.length/2);
var copyModSEP_1;
var copyModSEP_2;
var licznik=1;
var ileMod=Math.ceil(sepColorName.length/2);
$.writeln("ILE MODOW   " + ileMod+"  "+modInLegend);
    if (ileMod > modInLegend) {
        //$.writeln("ILE MODOW   " + ileMod);
        if (ileMod >= 2) {
            for (m = modInLegend; m < ileMod; m++) {
                copyModSEP_1 = modSEP_1.duplicate(doc.layers.getByName("Legend").groupItems[0].groupItems[0], null);
                copyModSEP_2 = modSEP_2.duplicate(doc.layers.getByName("Legend").groupItems[0].groupItems[0], null);
                copyModSEP_1.zOrder(ZOrderMethod.SENDTOBACK);
                copyModSEP_2.zOrder(ZOrderMethod.SENDTOBACK);

                copyModSEP_1.name = "s" + (2 + licznik);
                licznik++;
                copyModSEP_2.name = "s" + (2 + licznik);
                licznik++;

                copyModSEP_1.position = Array(copyModSEP_1.position[0], copyModSEP_1.position[1] - ((m) * 30));
                copyModSEP_2.position = Array(copyModSEP_2.position[0], copyModSEP_2.position[1] - ((m) * 30));
            }
            /*for (i = 0;i<doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems.length;i++){
                doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[i].zOrder(ZOrderMethod.BRINGTOFRONT);
            }*/

            //PRZESUNIECIE DOLNEJNEJ CZESCI W?G ILOSCI SEPARCJI

            doc.layers.getByName("Legend").groupItems[0].groupItems[3].position = Array(doc.layers.getByName("Legend").groupItems[0].groupItems[3].position[0], copyModSEP_1.position[1] - 36);
            //doc.layers.getByName("Legend").groupItems[0].groupItems[4].position = Array(doc.layers.getByName("Legend").groupItems[0].groupItems[4].position[0], copyModSEP_1.position[1] - 30);
        }
    }
    else if (ileMod < modInLegend){
        var sepModToDelate = app.activeDocument.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems;
        var sepModToDelateLength=sepModToDelate.length;

        $.writeln("ILE septodelate   " + sepModToDelate.length);

        for(i = sepModToDelateLength;i >sepModToDelateLength-((modInLegend-ileMod)*2);i--){

            sepModToDelate[i-1].remove();
        }
        
        doc.layers.getByName("Legend").groupItems[0].groupItems[3].position = Array(doc.layers.getByName("Legend").groupItems[0].groupItems[3].position[0], sepModToDelate[sepModToDelate.length-1].position[1] - 36);
        //doc.layers.getByName("Legend").groupItems[0].groupItems[4].position = Array(doc.layers.getByName("Legend").groupItems[0].groupItems[4].position[0], sepModToDelate[sepModToDelate.length-1].position[1] - 30);
    }

// KLINY SEPARACJA
//$.writeln (sCN+" ILOSC KOLOROW, ile modow "+ileMod+", "+sCN +", "+doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems.length+", "+sepColorName.length);
//$.writeln(sepColorName);
//$.writeln(sepColorName.name);

var kliny =new Array (app.activeDocument.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems.length);
var noColor = new NoColor();
$.writeln (kliny.length+" kliny nr");
    for(lp=0;lp<kliny.length;lp++){
        kliny[lp]=new Array (8);
        kliny[lp][0]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].textFrames[0];
        kliny[lp][1]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].textFrames[0].textRange;
        kliny[lp][2]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].textFrames[1].textRange;
        kliny[lp][3]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].pathItems[0];
        kliny[lp][4]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].pathItems[1];
        kliny[lp][5]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].pathItems[2];
        kliny[lp][6]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].pathItems[3];
        kliny[lp][7]=doc.layers.getByName("Legend").groupItems[0].groupItems[0].groupItems[lp].pathItems[4];
        }

    for (z = 0; z < sepColorName.length; z++) {
        $.writeln(z + "  ZZZZZZ  " + sepColorName[z].name + "    ");
        kliny[z][0].contents = sepColorName[z].name;

        for (y = 1; y < 7; y++) {
            kliny[z][y].fillColor = sepColorName[z];
        }
       

    }
    if ((sepColorName.length % 2) != 0) {
        for (y = 1; y < 7; y++) {
            kliny[sepColorName.length][y].fillColor = noColor;
        }
    }
  //KOORY TECHNICZNE  
    var techn = new Array(4);
    for (var lp = 0; lp < 4; lp++) {
        techn[lp] = new Array(5);
        techn[lp][0] = doc.layers.getByName("Legend").groupItems[0].groupItems[3].groupItems[0].groupItems[lp].textFrames[0];
        techn[lp][1] = doc.layers.getByName("Legend").groupItems[0].groupItems[3].groupItems[0].groupItems[lp].textFrames[0].textRange;
        techn[lp][2] = doc.layers.getByName("Legend").groupItems[0].groupItems[3].groupItems[0].groupItems[lp].textFrames[1].textRange;
        techn[lp][3] = doc.layers.getByName("Legend").groupItems[0].groupItems[3].groupItems[0].groupItems[lp].pathItems[0];
        techn[lp][4] = doc.layers.getByName("Legend").groupItems[0].groupItems[3].groupItems[0].groupItems[lp].pathItems[1];
    }

    for (z = 0; z < sepTechName.length; z++) {

        techn[z][0].contents = sepTechName[z].name;

        for (y = 1; y < 4; y++) {
            techn[z][y].fillColor = sepTechName[z];
        }
    }
    $.writeln("  techniczne ilosc  " + sepTechName.length);
    if(sepTechName.length < 4){
    for (z = sepTechName.length; z < 4; z++) {
        techn[z][0].contents = " ";
        $.writeln(z + "  techniczne no cokor  " + z + "    ");
        for (y = 1; y < 4; y++) {
            $.writeln(z + "  y  " + y + "    ");
            techn[z][y].fillColor = noColor;
            $.writeln("dfdfdf ");
        }
    }
    }

}
 
//PRINT PROCES

function printing_method() {
    var fileRef=app.activeDocument.name;
			if (fileRef.search(" O ") != -1)
				return "Litho";
			else if (fileRef.search(" F ") != -1)
				return "Flexo";
			else if (fileRef.search(" R ") != -1)
				return "Gravure";
			else if (fileRef.search(" H ") != -1)
				return "HD Flexo 151lpi";
			else if (fileRef.search(" LP ") != -1)
				return "LetterPress";
			else if (fileRef.search(" SKC ") != -1)
				return "SilkScreen";
			else if (fileRef.search(" N ") != -1)
				return "Narrow Web Flexo";
			else if (fileRef.search(" WW ") != -1)
				return "Wide Web Flexo";
			else if (fileRef.search(" D ") != -1)
				return "Digital";
			else if (fileRef.search(" SO ") != -1)
				return "Suchy Offset";

			else
				return "unknown";
		}
//CUSTOMER -wyciagnienicie nazwy kienta ze scieszki

function custumer(){
    var filePath = decodeURI(app.activeDocument.path);    
    var temp = filePath.split('/');
	
    return temp[temp.length-2];
    }

//DATA
function data(){
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
        if(dd<10) {dd='0'+dd} 
        if(mm<10) {mm='0'+mm} 
                            
    return dd+'/'+mm+'/'+yyyy;                        
}

//INFORMACA O KOLOROACH Z PLIKU ARTWORKOWEGO - ODCZYT XMP
function xmp(doc) {

    if (ExternalObject.AdobeXMPScript == undefined)
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");

    var file = new File(doc.fullName);
    var xmpf = new XMPFile(file.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmp = xmpf.getXMP();
    var ns = XMPMeta.getNamespacePrefix("http://ns.adobe.com/xap/1.0/t/pg/");
    var ary = xmp.countArrayItems("http://ns.adobe.com/xap/1.0/t/pg/", "PlateNames");
    var sep = [];
var sepName = [];
var eanList = [];

sep[0] = "kontrolny";
sep[0].name = "Kontrolny";

for (i = 1; i < ary + 1; i++) {
   sep[i] = xmp.getArrayItem("http://ns.adobe.com/xap/1.0/t/pg/",
      "PlateNames", i);
   if (sep[i] == "Cyan") {
      sep[i] = new CMYKColor();
      sep[i].cyan = 100;
      sep[i].name = "Cyan";
      sepName[i] = sep[i].name;
      $.writeln(sep[i].typename);
   } else if (sep[i] == "Magenta") {
      sep[i] = new CMYKColor();
      sep[i].magenta = 100;
      sep[i].name = "Magenta";
      sepName[i] = sep[i].name;
   } else if (sep[i] == "Yellow") {
      sep[i] = new CMYKColor();
      sep[i].yellow = 100;
      sep[i].name = "Yellow";
      sepName[i] = sep[i].name;
   } else if (sep[i] == "Black") {
      sep[i] = new CMYKColor();
      sep[i].black = 100;
      sep[i].name = "Black";
      sepName[i] = sep[i].name;
   } else {
      // sep[i] = new SpotColor();
      sep[i] = app.activeDocument.swatches.getByName(sep[i]).color;
      sep[i].name = xmp.getArrayItem("http://ns.adobe.com/xap/1.0/t/pg/", "PlateNames", i);
      sepName[i] = sep[i].name;
      $.writeln(sepName[i]);
            // $.writeln(sep[i].typename);
        }

    }
    // powbieranie wartosci RGB dla wszystkich separacju uzytych w pracy - pobierane z info od ESKO
    var inks = xmp.countArrayItems("http://ns.esko-graphics.com/grinfo/1.0/", "inks");

    var colorRGB = [];
    var allRGB;
    
    for (s = 1; s < sepName.length; s++) {

        for (i = 1; i <= inks; i++) {
           //$.writeln(sepName[s].toString().search("Wedel "));
           //if (sepName[s].toString().search("Wedel ") == -1){
            if (sepName[s].toString().match(/PANTONE (.*) C/)||sepName[s].toString().match(/PANTONE (.*) U/)!= null) {
                if (sepName[s].toString().match(/PANTONE (.*) C/)!= null) {
                   sepName[s] = sepName[s].toString().match(/PANTONE (.*) C/)[1]; }
                else {
                   sepName[s] = sepName[s].toString().match(/PANTONE (.*) U/)[1];}
             }
     
           if (sepName[s].toString().toLowerCase() == xmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks/*[" + i + "]/egInk:name").toString().toLowerCase()) {
         colorRGB[i] = " RGB " + Math.round((xmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks/*[" + i + "]/egInk:r")) * 255) + "," + Math.round((xmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks/*[" + i + "]/egInk:g")) * 255) + "," + Math.round((xmp.getProperty("http://ns.esko-graphics.com/grinfo/1.0/", "inks/*[" + i + "]/egInk:b")) * 255);
         $.writeln(i+"  "+colorRGB[i]);
                allRGB = allRGB + colorRGB[i];
            }

        }
    }
    return [sep, allRGB];
}
// INFORMACJE O KODZIE KRESKOWYM
/*	$.writeln(XMPMeta.getNamespacePrefix("http://ns.esko-graphics.com/barcodelist/1.0/"));
	if (XMPMeta.getNamespacePrefix("http://ns.esko-graphics.com/barcodelist/1.0/") != false) {
		var xxxxx = xmp.countArrayItems(
				"http://ns.esko-graphics.com/barcodelist/1.0/", "barcodes");
		for (i = 1; i < xxxxx + 1; i++) {
			var type = xmp.getProperty(
					"http://ns.esko-graphics.com/barcodelist/1.0/",
					"barcodes/*[" + i + "]/egBarc:Type");
			$.writeln(type);

			var cc = /EAN 13|EAN 8|ITF/i;
			var patt = new RegExp(cc);
			if (patt.test(type) == true) {
				var xmp_code = xmp.getProperty(
						"http://ns.esko-graphics.com/barcodelist/1.0/",
						"barcodes/*[" + i + "]/egBarc:Code");
				var xmp_bwr = xmp.getProperty(
						"http://ns.esko-graphics.com/barcodelist/1.0/",
						"barcodes/*[" + i + "]/egBarc:BarWidthReduction");
				var xmp_mag = xmp.getProperty(
						"http://ns.esko-graphics.com/barcodelist/1.0/",
						"barcodes/*[" + i + "]/egBarc:Magnification");
				var xmp_type = xmp.getProperty(
						"http://ns.esko-graphics.com/barcodelist/1.0/",
						"barcodes/*[" + i + "]/egBarc:Type");
			}
		}
	}*/
	

