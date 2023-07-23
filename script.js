$("#gpt-button").click(function(){
        
    var question = $("#chat-input").val();
    let html_question = ''
    html_question += `<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
      <img src="images/favicon.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <p class="mb-0 opacity-75">${question}</p>
        </div>
      </div>
    </a>`;
    $("#list-group").append(html_question);
    $("#chat-input").val('');
    
    $.ajax({
        type:"POST",
        url:"/",
        data:{'input_text': question},
        success: function(data){
            //response = data;
            console.log(data);
            appendResponseHtml(data);
        }
        
    });

    var appendResponseHtml = function(response){
      let html_response = '';
      html_response += `<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
        <img src="https://digital-practice.ams3.cdn.digitaloceanspaces.com/static%2Fapp%2Fimg%2Fopenai-logo.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <p class="mb-0 opacity-75">${response}</p>
          </div>
        </div>
        </a>`;
        $("#list-group").append(html_response);
    }

  });