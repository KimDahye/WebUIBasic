touchstart_pageX = 0;
touchstart_pageY = 0;
bestIndex = 1; // bestSeller섹션 화면에 표시되는 두개의 책 중 오른쪽 책의 index를 저장한다.
nonNovelIndex = 1; //비소설 섹션 화면에 표시되는 두 개의 책 중 오른쪽 책의 index를 저장한다.
aGenre = {};

(function() {
	var url = "http://10.73.42.188:8000/bestBook_m.json";
	//var url = "http://nigayo.com/googleBook1";
	var request = new XMLHttpRequest();
	request.open("GET" , url , true);
	request.send(null);
	request.onreadystatechange = function() {
		if(request.readyState === 4 && request.status === 200) 
		{
	   	    result = request.responseText;
	    	result = JSON.parse(result);
	        aGenre["best"] = result;
	        console.log("best loadead");
		}
	}
})();
//이것과 이 위에 함수는 거의 동일한 데, url과 key값만 다르다... 중복 제거 할 수 없을까?
(function() {
	var url = "http://10.73.42.188:8000/nonNovel_m.json";
	//var url = "http://nigayo.com/googleBook1";
	var request = new XMLHttpRequest();
	request.open("GET" , url , true);
	request.send(null);
	request.onreadystatechange = function() {
		if(request.readyState === 4 && request.status === 200) 
		{
	   	    result = request.responseText;
	    	result = JSON.parse(result);
	        aGenre["nonNovel"] = result;
	        console.log("nonNovel loadead");
		}
	}
})(); 

(function(){
	var sections = document.getElementsByClassName('section');

	sections[0].addEventListener('touchstart', saveStartingPosition, false);
	sections[0].addEventListener('touchmove', preventDefaultWhenTransverseScroll, false);
	sections[0].addEventListener('touchend', changeContents, false);

	sections[1].addEventListener('touchstart', saveStartingPosition, false);
	sections[1].addEventListener('touchmove', preventDefaultWhenTransverseScroll, false);
	sections[1].addEventListener('touchend', changeContents, false);
})();

function saveStartingPosition(e){
	touchstart_pageX = e.changedTouches[0].pageX;
	touchstart_pageY = e.changedTouches[0].pageY;
}

function preventDefaultWhenTransverseScroll(e){
	var touchmove_pageX = e.changedTouches[0].pageX;
	var touchmove_pageY = e.changedTouches[0].pageY;
	var diff_X = touchmove_pageX - touchstart_pageX;
	var diff_Y = touchmove_pageY - touchstart_pageY;
	if(diff_X !== 0){
		var slope = diff_Y/diff_X;
		//슬로프의 범위가 -45도~ 45도 범위이면, 가로 스크롤! 이 때만 preventDefault!
		if((-1.0 < slope) && (slope < 1.0)){
			e.preventDefault();
		}
	}
}

function changeContents(e){
	var touchend_pageX = e.changedTouches[0].pageX;
	var touchend_pageY = e.changedTouches[0].pageY;
	var diff_X = touchend_pageX - touchstart_pageX;
	var diff_Y = touchend_pageY - touchstart_pageY;
	var right = 1;
	var left = -1;
	if(diff_X !== 0){
		var slope = diff_Y/diff_X;
		if((-1.0 < slope) && (slope < 1.0)){
			if(diff_X < 0){
				Move(e, right);
			}
			else{
				Move(e, left);
			}	
		}
	}
}

function Move(e, direction){
	var sections = document.getElementsByClassName('section');
	var nowSection = e.currentTarget.id;

	if(nowSection === "best"){
		bestIndex = changeInnerHTML(sections[0], aGenre[nowSection], bestIndex, direction);
	}
	else if(nowSection === "nonNovel"){
		nonNovelIndex = changeInnerHTML(sections[1], aGenre[nowSection], nonNovelIndex, direction);
	}
}

//direction이 1이면 오른쪽, -1이면 왼쪽이다.
function changeInnerHTML(section, bookList, index, direction){
	var listTemplate = '<li class="book_card"><a class="card-click-target" href="<%=linkURL%>" aria-hidden="true" tabindex="-1"></a><div class="cover_container"><img src="<%=imgURL%>"></div><div class="details"><a class="booktitle" href="<%=linkURL%>"><%=title%></a><span class="paragraph_end"></span><a class="author" href="<%=authorURL%>"><%=author%></a><a class="price" href="<%=priceURL%>"><%=price%></a></div></li>';
	var bookCardsTemplate = '<ul><%=lists%></ul>';
	var count = 0;
	var lists = "";
	//오른쪽으로 더이상 이동할 수 없는 경우.
	if((direction === 1) && (index > bookList.length - 2)){
		return index;
	}
	//왼쪽으로 더이상 이동할 수 없는 경우.
	if((direction === -1) && (index < 2)){
		return index;
	}

	//배열 인덱스를 증가하면서 템플릿에 넣기 때문에, 왼쪽으로 이동할 때는 다음과 같이 인덱스 변환이 필요하다. 
	if(direction === -1){
		if(index%2 === 1){
			index = index - 4;	
		}
		else{
			index = index -3;
		}
	}

	while(count < 2){
		//오른쪽으로 이동할 때 리스트의 개수가 홀 수개였다면, 하나만 리스트에 넣고도 루프가 중단되어야 한다.
		if((direction === 1) && (index === bookList.length-1)){
			break;
		}
		index++;
		lists += listTemplate.replace("<%=title%>", bookList[index]["name"]).replace("<%=linkURL%>", bookList[index]["src"]).replace("<%=imgURL%>", bookList[index]["imgSrc"]).replace("<%=author%>", bookList[index]["author"]);
		count++;
	}
	section.getElementsByClassName('book_cards')[0].innerHTML = bookCardsTemplate.replace('<%=lists%>', lists);
	return index;
}