var agent_id = null;
var state = null;
var current_task = null;
var last_action = null;
var lastButtonList = null;
var url = 'http://localhost:8000';


/*
 * The Training Dialog Functionality
 */

function lockChatBox() {
    $('#chatmessageDiv').hide();
}

function unlockChatBox() {
    $('#chatmessageDiv').show();
}

function update_agent() {
    console.log("updating agent");
    chrome.storage.sync.get(['agent_id', 'current_task'], function(result) {
        current_task = result.current_task;
        agent_id = result.agent_id;
        query_apprentice();
    });
}

function set_task() {
    console.log('clicked');
    let task = $('#chatBox').val();
    if (task != "") {
        chrome.storage.sync.set({
            current_task: task
        }, function() {
            $('#currentTask').html(task);
            $('#chatBox').val('');
            update_agent();
            add_message_to_log("Task set to: " + task);
        })
    }
}

function add_message_to_log_helper(message, callback) {
    var m = $('<p></p>').text(message);
    $('#serverMessages').append(m);
    $("#serverMessages").scrollTop($("#serverMessages")[0].scrollHeight);
    $(m).effect("highlight", {}, 1500);
    typeof callback === 'function' && callback();
}

function add_message_to_log(message, callback) {
    if (!is_dialog_open()) {
        toggle_dialog(function() {
            add_message_to_log_helper(message, callback);
        });
    } else {
        add_message_to_log_helper(message, callback);
    }
}

function update_buttons(buttonList) {

    $('#holdButtons').html("");
    for (var i = 0; i < buttonList.length; i++) {
        let data = buttonList[i];
        let button = $("<button>" + data.buttonText + "</button>");
        if (data.descriptionText !== undefined) {
            $(button).attr('title', data.descriptionText);
        }
        $(button).addClass('receivedButton');
        $(button).attr('button-id', data.identifier);
        $(button).attr('name', data.identifier);
        $(button).on('click', data.callback);

        $('#holdButtons').append(button);
        $(button).tooltip();
        $(button).effect('highlight', {}, 1500);
    }


    // $('.receivedButton').on('click', function(ev) {
    //     socket.emit('onTrainingButtonPress', {
    //         'identifier': '' + $(ev.currentTarget).attr('button-id'),
    //         'id': '' + id
    //     });
    // });

    lastButtonList = buttonList;
    console.log('done');
}

function init_dialog() {

    lockChatBox();

    chrome.storage.sync.get(['agent_id', 'current_task'], function(result) {
        if (result.current_task != null) {
            $('#currentTask').html(result.current_task);
        } else {
            $('#currentTask').html('No task currently set');
        }

        if (result.agent_id != null) {
            unlockChatBox();
        } else {
            $('#currentTask').html("No task because no agent currently set.");
        }

    });

    $('#chatMessageButton').on('click', set_task);
    $('#chatBox').keypress(function(e) {
        if (e.which == 13) {
            set_task();
        }
    });

}

function is_dialog_open() {
    return ($('#apprenticeControl').length != 0)
}

function toggle_dialog(callback) {
    let url = chrome.extension.getURL('training_interface.html');
    console.log(url);
    console.log('open popup');
    if ($('#apprenticeControl').length == 0) {
        $('head').append($('<link rel="stylesheet" id="jquery-ui-css" type="text/css" />').attr('href', chrome.extension.getURL('lib/jquery-ui.min.css')));
        $('head').append($('<link rel="stylesheet" id="jquery-ui-theme-css" type="text/css" />').attr('href', chrome.extension.getURL('lib/jquery-ui.theme.min.css')));
        $('head').append($('<link rel="stylesheet" id="apprenticeCss" type="text/css" />').attr('href', chrome.extension.getURL('training_interface.css')));

        $('body').wrapInner('<div id="originalBody"></div>');
        $('body').append('<div id="apprenticeControl"></div>');

        $.get(url, function(data) {
            // $(data).appendTo('#apprenticeControl');
            // Or if you're using jQuery 1.8+:
            $($.parseHTML(data)).appendTo('#apprenticeControl');
            init_dialog();
            typeof callback === 'function' && callback();
        });

    } else {
        $('#jquery-ui-css').remove();
        $('#jquery-ui-theme-css').remove();
        $('#apprenticeCss').remove();
        $('#apprenticeControl').remove();
        $('body').find('#originalBody').replaceWith($('#originalBody').contents());
    }
    // $('#apprenticeControl').load(chrome.extension.getURL('training_interface.html'));

}

/*
 * The Agent Learning Functionality
 */

function turn_on_listeners() {
    $('input').not('#chatBox').on('change', send_demo);
    $('select').on('change', send_demo);
    $('textarea').on('change', send_demo);
    $('button').on('click', send_demo);
}

function turn_off_listeners() {
    $('input').off('change', send_demo);
    $('select').off('change', send_demo);
    $('textarea').off('change', send_demo);
    $('button').off('click', send_demo);
}

function get_state(){
    let state_array = $('form').serializeArray();
    state_array.push({current_task: current_task});

    let state_json = {}
    $.each(state_array, function(idx, element){
        // add question marks for apprentice.
        state_json["?ele-" + idx] = element;
    });

    return state_json;

}


function query_apprentice() {
    if (agent_id == null || current_task == null) {
        return;
    }

    console.log('querying agent');

    state = get_state();

    var data = {
        'state': state
    }
    console.log(data);

    $.ajax({
        type: 'POST',
        url: url + '/request/' + agent_id + '/',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(resp) {
            if (jQuery.isEmptyObject(resp)) {
                query_user_demo();
            } else {
                console.log('action to take!');
                console.log(resp);
                query_user_feedback(resp);
            }
        }
    });
}

function send_positive_feedback() {
    if (last_action === null) {
        console.log('error. cannot give feedback on no action.');
    }

    update_buttons([]);

    let data = last_action;
    data.state = state;
    data.reward = 1

    if (data.action == "task_done"){
        finish_task(); 
    }
    else if (data.action == 'set_radio') {
        set_radio(data.selection, data.inputs.value);
    } else if (data.action == 'update_text') {
        $("[name='" + data.selection + "']").val(data.inputs.value);
    } else if (data.action == 'select') {
        $("select[name='" + data.selection + "'] option[value='" +
            data.inputs.value + "']").prop('selected', true);
    } else if (data.action == 'click') {
        $("[name='" + data.selection + "']").click();
    }

    send_training_data(data);

}

function send_negative_feedback() {
    if (last_action === null) {
        console.log('error. cannot give feedback on no action.');
    }

    update_buttons([]);
    let data = last_action;
    data.state = state;
    data.reward = -1

    send_training_data(data);

}

function send_training_data(data) {
    $.ajax({
        type: 'POST',
        url: url + '/train/' + agent_id + '/',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(resp) {
            console.log('training received.');
            query_apprentice();
        }
    });

}

function query_user_feedback(data) {
    if (data.action == "task_done"){
        action_string = "The agent thinks it is done with the task, do you approve?"
    }
    else {
        action_string = "Should the agent apply the \"" + data.action + "\" function to the object with name \"" + data.selection + "\" with argument \'" + JSON.stringify(data.inputs) + "\'?";
    }

    last_action = data;

    add_message_to_log(action_string, function() {
        // Show the buttons.
        update_buttons([{
            identifier: "action:yes",
            callback: send_positive_feedback,
            buttonText: "Approve Action",
            descriptionText: "This approves of the agent's action and lets it proceed."
        }, {
            identifier: "action:no",
            callback: send_negative_feedback,
            buttonText: "Disapprove Action",
            descriptionText: "This disapproves the agent's action and makes it try again."
        }]);

        if (data.action == 'set_radio') {
            $("input:radio[name='" + data.selection + "']").parent().effect("highlight", {}, 3000);
            $("input:radio[name='" + data.selection + "']").get(0).scrollIntoView();
        } else if (data.action == 'update_text') {
            $("[name='" + data.selection + "']").effect('highlight', {}, 3000);
            $("[name='" + data.selection + "']").get(0).scrollIntoView();
        } else if (data.action == 'select') {
            $("select[name='" + data.selection + "']").effect('highlight', {}, 3000);
            $("select[name='" + data.selection + "']").get(0).scrollIntoView();
        } else if (data.action == 'click') {
            $("[name='" + data.selection + "']").effect('highlight', {}, 3000);
            $("[name='" + data.selection + "']").get(0).scrollIntoView();
        }
        // $("[name='" + data.selection + "']").effect('highlight', {}, 5000);

    });

}

function finish_task(){
    update_buttons([]);

    if (current_task != "") {
        chrome.storage.sync.set({
            current_task: null
        }, function() {
            $('#currentTask').html("");
            update_agent();
            add_message_to_log("Task Completed.");
        })
    }

}


function query_user_demo() {
    console.log('querying user');

    state = get_state();

    add_message_to_log("Agent doesn't know what to do, please demonstrate next step.", function() {
        update_buttons([{
                identifier: "finish:request",
                callback: finish_task,
                buttonText: "Task is Done",
                descriptionText: "This marks the task as done and clears the current task. Press this when the agent has completed the task you asked it to do."
            }
        ]);
    });

    turn_on_listeners();

}

function set_radio(name, val) {
    var radios = $('input:radio[name=' + name + ']');
    if (radios.is(':checked') === false) {
        radios.filter('[value=' + val + ']').prop('checked', true);
    }
}

function send_demo(ev) {
    console.log('sending demo');
    add_message_to_log("Thank you for the example, updating agent's knowledge.");

    if ($(ev.target).attr('button-id') == "finish:request"){
        var data = {
            action: 'task_done',
            selection: "finish:request",
            inputs: {}
        }
    }
    else if ($(ev.target).is('input:radio')) {
        var data = {
            action: 'set_radio',
            selection: $(ev.target).prop('name'),
            inputs: {value: $(ev.target).val()}
        }
    } else if ($(ev.target).is('input') || $(ev.target).is('textarea')) {
        var data = {
            action: 'update_text',
            selection: $(ev.target).prop('name'),
            inputs: {value: $(ev.target).val()}
        }
    } else if ($(ev.target).is('select')) {
        var data = {
            action: 'select',
            selection: $(ev.target).prop('name'),
            inputs: {value: $(ev.target).val()}
        }
    } else if ($(ev.target).is('button')) {
        var data = {
            action: 'click',
            selection: $(ev.target).prop('name'),
            inputs: {}
        }
    }

    data.state = state;
    data.reward = 1;

    console.log("sending", data);

    $.ajax({
        type: 'POST',
        url: url + '/train/' + agent_id + '/',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(resp) {
            console.log('training received.');
            turn_off_listeners();
            query_apprentice();
        }
    });
}


$(function() {

    // $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'your stylesheet url') );
    // $('body').wrapInner("<div id='original_body'></div>");
    // $('body').append('<div id="sidePanel" class="hasOutline">');

    console.log("beep");

    /*
    chrome.runtime.sendMessage({
        greeting: "hello"
    }, function(response) {

        console.log(response.farewell);
    });
    */

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('huh');
        // create the float.
        if (request.action == "toggle_dialog_box") {
            toggle_dialog();
        }

        if (request.action == "update_agent") {
            update_agent();
        }

    });

    update_agent();
    console.log(domJSON.toJSON($('body')[0], {attributes: { values: ['id', 'name', 'value'] } }));

});
