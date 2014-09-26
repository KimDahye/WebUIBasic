(function() {
	var aGenre;
	var url = "http://nigayo.com/googleBook1";
	var request = new XMLHttpRequest();
	request.open("GET" , url , true);
	request.send(null);
	request.onreadystatechange = function() {
	// 응답이 도착했고, 정상적인 응답이라면, 응답데이터를 파싱하기 시작한다. 
		if(request.readyState === 4 && request.status === 200) 
		{
	   	    result = request.responseText;
	    	result = JSON.parse(result);
	        aBookList = result;
	        aGenre = {
				family: aBookList,
				health: aBookList,
				economy: aBookList,
				science: aBookList,
				comic: aBookList,
				literature: aBookList,
				kid: aBookList,
				travel: aBookList,
				history: aBookList,
				art: aBookList,
				language: aBookList,
				cook: aBookList,
				biography: aBookList,
				socialogy: aBookList
			};
			console.log("loaded");
			var genre_submenu_wrapper = document.querySelector(".submenu-item-wrapper");
			var more_buttons = document.querySelectorAll(".more_button");
			genre_submenu_wrapper.addEventListener('click', function(e){changeInnerHTML(e, aGenre);}, false);
			more_buttons[0].addEventListener('click', function(e){appendBookCards(e, aGenre);}, false);
			more_buttons[1].addEventListener('click', function(e){appendBookCards(e, aGenre);}, false);
		}
	}
})();

(function(){
	var genre_button = document.querySelector("#genre_container");
	var body = document.body;
	genre_button.addEventListener('click', displaySubmenu, false);
	body.addEventListener('click', undisplaySubmenu, false);
})();

//장르의 서브메뉴를 보여주는 함수
function displaySubmenu(e){
	var genre_submenu = document.querySelector("#action-bar-dropdown-container");
	if(genre_submenu.style.display == "none"){
		genre_submenu.style.display = "block";
	}
	else{
		genre_submenu.style.display = "none";
	}
	e.stopPropagation();
}

//장르의 서브메뉴를 안보이게 하는 함수
function undisplaySubmenu(){
	var genre_submenu = document.querySelector("#action-bar-dropdown-container");
	genre_submenu.style.display="none";
}

//장르의 서브메뉴중 하나를 선택했을 때 책 리스트 내용을 바꿔주는 함수 
function changeInnerHTML(e, aGenre){
	var wrapper = document.querySelector("#wrapper");
	var cardListTemplate = '<li class="book-card-list"><a class="bookcover" href="#"><div class="cover_container"><img src="<%=imgUrl%>"><div class="books_hover"></div></div></a><div class="details"><a class="booktitle" href="#"><%=title%></a><span class="paragraph_end"></span><a class="author" href="https://play.google.com/store/books/author?id=%EC%9E%A5%ED%95%B4%EC%A0%95"><%=author%></a><a class="price" href=""><%=price%></a></div></li>';
	var wrapperTemplate = '<div class="section"><h1 class="section_header"><a class="section_title" href="#">새로 나온 도서</a><a class="more_button" href="https://play.google.com/store/books/collection/promotion_1001065_toppaid_bookkr">더보기</a></h1><div class="book_cards"><ul><%=cardLists%></ul></div></div>';
	var nowTitle = e.target.title;
	undisplaySubmenu();
	wrapper.innerHTML = makeInnerHTML(aGenre[nowTitle], cardListTemplate, wrapperTemplate);
	e.stopPropagation();
}

//ChangeInnerHTML에서 쓰이는 함수. 북리스트를 받아서 innerHTML에 넣을 내용을 만든다.
function makeInnerHTML(bookList, cardListTemplate, wrapperTemplate) {
	var res = wrapperTemplate.replace("<%=cardLists%>", makeBookCardList(bookList, cardListTemplate));
	return res;
}

// innerHTML로 만들 부분 중에 일단 cardList부분만 만드는 함수.
function makeBookCardList(bookList, cardListTemplate){
	var cardLists = "";
	var temp;
	bookList.forEach(function(item){
		temp = cardListTemplate.replace("<%=title%>", item["Name"]).replace("<%=endPageLink%>", item["PageLink"]).replace("<%=imgUrl%>", item["ImageLink"]).replace("<%=author%>", item["Writer"]).replace("<%=price%>", item["Price"]);
		cardLists += temp;
	});
	return cardLists;
}

//더보기를 눌렀을 때 카드리스트를 만들어서 원래 리스트에 덧붙이는 함수.
function appendBookCards(e, aGenre){
	var cardListTemplate = '<li class="book-card-list"><a class="bookcover" href="#"><div class="cover_container"><img src="<%=imgUrl%>"><div class="books_hover"></div></div></a><div class="details"><a class="booktitle" href="#"><%=title%></a><span class="paragraph_end"></span><a class="author" href="https://play.google.com/store/books/author?id=%EC%9E%A5%ED%95%B4%EC%A0%95"><%=author%></a><a class="price" href=""><%=price%></a></div></li>';
	var bookCards = e.target.parentNode.nextElementSibling.querySelector("ul");
	bookCards.innerHTML += makeBookCardList(aGenre["family"], cardListTemplate);
	e.stopPropagation;
}