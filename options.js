var url = 'http://localhost:8000';

function update_current() {
    chrome.storage.sync.get(['project_id', 'agent_type', 'agent_id', 'current_task'], function(result) {
        $('#project_id').val(result.project_id);
        $('#agent_type').val(result.agent_type);

        if (result.agent_id != null) {
            $('#agent_id').html(result.agent_id);

            if (result.current_task != null) {
                $('#current_task').html(result.current_task);
            } else {
                $('#current_task').html("No Task Set.");
            }

            $.ajax({
                type: "GET",
                url: url + '/report/' + result.agent_id + '/',
                dataType: "json",
                success: function(resp) {
                    $('#agent_name').html(resp.name);
                    $('#num_request').html(resp.num_request);
                    $('#num_train').html(resp.num_train);
                    $('#num_check').html(resp.num_check);
                    $('#created').html(resp.created);
                    $('#updated').html(resp.updated);
                }
            });


        } else {
            $('#agent_id').html("No Agent Set.");
        }
    });
}

$(function() {

    update_current();

    $('#new_agent').on('click', function() {
        let agent_type = $('#agent_type').val();
        let project_id = $('#project_id').val();

        if (agent_type != null && project_id != null) {
            $.ajax({
                type: "POST",
                url: url + '/create/',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    'agent_type': agent_type,
                    'project_id': project_id
                }),
                success: function(resp) {
                    console.log(resp);
                    chrome.storage.sync.set({
                        agent_id: resp.agent_id,
                        current_task: null,
                    }, function() {
                        console.log('new agent set.');
                        update_current();
                    })

                }
            });
        }
    });

});

// let page = document.getElementById('buttonDiv');
// const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
// 
// function constructOptions(kButtonColors) {
//     for (let item of kButtonColors) {
//         let button = document.createElement('button');
//         button.style.backgroundColor = item;
//         button.addEventListener('click', function() {
//             chrome.storage.sync.set({
//                 color: item
//             }, function() {
//                 console.log('color is ' + item);
//             })
//         });
//         page.appendChild(button);
//     }
// }
// constructOptions(kButtonColors);
