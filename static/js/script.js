var lang = document.getElementById('lang').value;   // Setup language in a var
$("#langLabel").val(lang);                          // show the selected language on the page
//let guidKey = "guid"                                //create a var for session key
//sessionStorage.setItem(guidKey, 'not found');       //set the session key value

// Function to open overlay
openOverlay() 
function openOverlay() {
  document.querySelector('.overlay').style.display = 'block';
}

// Function to close the overlay
function closeOverlay() {
  document.querySelector('.overlay').style.display = 'none';
  langChange();
}

//Function to run on language change
var langChange = function(){
  $(".list-group-item").remove();               //delete exisiting chat
  $("#chat-input").val('');                     //set input as empty
  //sessionStorage.setItem(guidKey, 'not found'); //reset the guid to not found (means the previous chat is not in context)
  lang = document.getElementById('lang').value; //Setup language in a var
  $("#langLabel").val(lang);                    //show the selected language on the page
  
  $.ajax({
    type:"POST",
    url:"/deleteHistory",
    data:{}
  }).done(function(data) {
    alert(data)
  }).fail(function(err) {
    alert(err)
  });
  
}


var input = document.getElementById("chat-input");
input.addEventListener("keypress",function(event) {
  if (event.key === "Enter") {
     event.preventDefault();
     $("#askbot").click();
  }
});

//function to add chat objects dynamically
var appendResponseHtml = function(response){
  let html_response = '';
  html_response += `<div class="list-group-item list-group-item-action d-flex gap-3 py-3">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/225px-Microsoft_Azure.svg.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
    <div class="d-flex gap-2 w-100">
      <div>
        <p class="mb-0 opacity-75" style="text-align:left">${response}</p>
      </div>
    </div>
    </div>`;
    $("#list-group").append(html_response);
}

var appendQuestionHtml = function(question){
  let html_question = ''
  html_question += `<div class="list-group-item list-group-item-action d-flex gap-3 py-3">
    <img src="./static/images/favicon.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
    <div class="d-flex gap-2 w-100 justify-content-between">
      <div>
        <p class="mb-0 opacity-75" style="text-align:left">${question}</p>
      </div>
    </div>
  </div>`;
  $("#list-group").append(html_question);
}

  ///// This function gets the reponse from backend - ////////////////////
  ////// The response is based on the context of chat ////////////////////
  $("#askbot").click(function(){
    
    var lang = document.getElementById('lang').value;
    var question = $("#chat-input").val();
    appendQuestionHtml(question);
    $("#chat-input").val('');
    var elem = document.getElementById('list-group');
    elem.scrollTop = elem.scrollHeight;
    let guid = "NA" //sessionStorage.getItem(guidKey); 

    $.ajax({
      type:"POST",
      url:"/",
      data:{
        'input_text': question,
        'lang':lang,
        "guid":guid
      }
    }).done(function(data) {
      appendResponseHtml(data.last_message);
      elem.scrollTop = elem.scrollHeight;
      //sessionStorage.setItem(guidKey, data.guid);
    }).fail(function(err) {
        console.log(err)
    }).always(function(data) {
        
    });

  });