// window.setInterval(function() {
  
// }, 5000);



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
        data:{'input_text': question},
        success: function(data){
            //response = data;
            console.log(data);
            appendResponseHtml(data);
            elem.scrollTop = elem.scrollHeight;
        }
        
    });
  });