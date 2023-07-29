var lang = document.getElementById('lang').value;
$("#langLabel").val(lang);
let guidKey = "guid"
sessionStorage.setItem(guidKey, 'not found');


openOverlay() 
function openOverlay() {
  document.querySelector('.overlay').style.display = 'block';
}

// Function to close the overlay
function closeOverlay() {
  document.querySelector('.overlay').style.display = 'none';
  langChange();
}


var langChange = function(){
  $(".list-group-item").remove();
  $("#chat-input").val('');
  sessionStorage.setItem(guidKey, 'not found');
  lang = document.getElementById('lang').value;
  $("#langLabel").val(lang); 
  console.log(lang);
}

var appendResponseHtml = function(response){
  let html_response = '';
  html_response += `<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/225px-Microsoft_Azure.svg.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
    <div class="d-flex gap-2 w-100 justify-content-between">
      <div>
        <p class="mb-0 opacity-75">${response}</p>
      </div>
    </div>
    </a>`;
    $("#list-group").append(html_response);
}

$("#gpt-button").click(function(){
    
    var lang = document.getElementById('lang').value;
    //console.log(lang.value)

    var question = $("#chat-input").val();
    let html_question = ''
    html_question += `<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
      <img src="./static/images/favicon.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <p class="mb-0 opacity-75">${question}</p>
        </div>
      </div>
    </a>`;
    $("#list-group").append(html_question);
    $("#chat-input").val('');
    var elem = document.getElementById('list-group');
    elem.scrollTop = elem.scrollHeight;
    $.ajax({
        type:"POST",
        url:"/",
        data:{
              'input_text': question,
              'lang': lang
             },
        success: function(data){
            //response = data;
            console.log(data);
            appendResponseHtml(data);
            elem.scrollTop = elem.scrollHeight;
        }
    });
  });

  $("#textHistory").click(function(){
    //console.log(guid);
    //const chatbox = document.getElementById('list-group');
    //const directChildren = chatbox.children.length;
    //console.log(directChildren);
    
    var lang = document.getElementById('lang').value;
    var question = $("#chat-input").val();
    //console.log(lang);
    let html_question = ''
    html_question += `<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
      <img src="./static/images/favicon.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <p class="mb-0 opacity-75">${question}</p>
        </div>
      </div>
    </a>`;
    $("#list-group").append(html_question);
    $("#chat-input").val('');
    var elem = document.getElementById('list-group');
    elem.scrollTop = elem.scrollHeight;
    let guid = sessionStorage.getItem(guidKey);
    
    $.ajax({
      type:"POST",
      url:"/callBotWithText_withHistory",
      data:{
        'input_text': question,
        'lang':lang,
        "guid":guid
      }
    }).done(function(data) {
      appendResponseHtml(data.last_message);
      elem.scrollTop = elem.scrollHeight;
      sessionStorage.setItem(guidKey, data.guid);
    }).fail(function(err) {
        console.log(err)
    }).always(function(data) {
        
    });

  });