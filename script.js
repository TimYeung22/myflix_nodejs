$(document).ready(function() {
	openNav();
	let u_id = 1000001;
	$.get( "/re/"+u_id, function(data) {
		var src = document.getElementById("TheSidenav");
		var recomm = document.createElement("div");
		recomm.setAttribute('Id','recom');
		text = "your recommendation are: <br>"
		for(let i = 0; i < data.length; i ++ ) {
			text = text + '<br>' + data[i];
		}
		recomm.innerHTML=text;
		src.appendChild(recomm);
	});
	$.get( "/catalogues", function(data) {
			var catcatalogue = data;
		for(let i = 0; i < catcatalogue.length; i ++ ) {
			let currentElement = catcatalogue[i];
			var src = document.getElementById("selectmenu");
			var buttonss = document.createElement("div");
			var br = document.createElement("br");
			buttonss.setAttribute('Id',catcatalogue[i]);
			buttonss.setAttribute('name','catalogue');
			text = currentElement;
			buttonss.setAttribute('name',currentElement);
			buttonss.innerHTML='<b><font size="5">Catagory: '+text+'</font><br>';
			src.appendChild(buttonss);
		}
	});
	$.get( "/uuid", function(data) {
			var videocatalogue = data;
		for(let i = 0; i < videocatalogue.length; i ++ ) {
			let currentElement = videocatalogue[i];
			$.get( "/uuid/"+currentElement, function(data2) {
			var src = document.getElementById(data2);
			var buttonss = document.createElement("a");
			buttonss.setAttribute('id','thumbs');
			image = "/thumb/"+currentElement;
			buttonss.setAttribute('name',currentElement);
			buttonss.innerHTML="<img src=\'"+image+"\'><br>";
			$.get( "/vidname/"+currentElement, function(data3) {
				buttonss.innerHTML += data3+'<br>';
			src.appendChild(buttonss);
			})})
		}
	});
	$(document).on('click', '#thumbs', function(e){
		var lightBoxVideo = document.getElementById("videoPlayer");
		window.scrollTo(0, 0);
		document.getElementById('light').style.display = 'block';
		document.getElementById('fade').style.display = 'block';
		let videoname = 'vid/'+this.name;
		e.preventDefault();
		$.ajax({
	  type:"POST",
	  url:"/video",
	  contentType: "application/json",
	  data: JSON.stringify({videoname}),
  });
	lightBoxVideo.src='/videos/'+this.name;
    var content = lightBoxVideo.innerHTML;
    lightBoxVideo.innerHTML= content; 
   });
});

function lightbox_close() {
  var lightBoxVideo = document.getElementById("videoPlayer");
  document.getElementById('light').style.display = 'none';
  document.getElementById('fade').style.display = 'none';
  lightBoxVideo.pause();
  lightBoxVideo.src='';
}


function openNav() {
  document.getElementById("TheSidenav").style.width = "20%";
  document.getElementById("main").style.marginLeft = "20%";
  document.getElementById("expand").style.display = 'none';
}

function closeNav() {
  document.getElementById("TheSidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("expand").style.display = 'block';
}

