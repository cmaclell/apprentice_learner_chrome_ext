// function lockChatBox() {
//     $('#chatmessageDiv').hide();
// }
// 
// function unlockChatBox() {
//     $('#chatmessageDiv').show();
// }
// 
// // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// //     console.log(sender.tab ?
// //         "from a content script:" + sender.tab.url :
// //         "from the extension");
// //     if (request.greeting == "hello")
// //         sendResponse({
// //             farewell: "goodbye"
// //         });
// // });
// 
// $(function() {
//     lockChatBox();
// 
//     chrome.storage.sync.get(['agent_id', 'current_task'], function(result) {
//         if (result.current_task != null) {
//             $('#currentTask').html(result.current_task);
//         } else {
//             $('#currentTask').html('No task currently set');
//         }
// 
//         if (result.agent_id != null) {
//             unlockChatBox();
//         } else {
//             $('#currentTask').html("No task because no agent currently set.");
//         }
// 
//     });
// 
//     $('#chatMessageButton').on('click', function() {
//         let task = $('#chatBox').val();
//         if (task != "") {
//             chrome.storage.sync.set({
//                 current_task: task
//             }, function() {
//                 $('#currentTask').html(task);
//                 $('#chatBox').val('');
//             })
//         }
//     });
// 
// });


/*
  var socket = io.connect("ws://" + window.location.host);

  //var trainer;
  var id;
  var buttonIdCounter = 0;
  var lastButtonList = null;

  socket.on('connect', function() {
      var currentUrlString = window.location.href;
      var indexOfStartOfWorkerId = currentUrlString.indexOf("workerId");
      var indexOfAmpersandAtEndOfWorkerId = currentUrlString.indexOf("&", indexOfStartOfWorkerId);
      var workerIdString = currentUrlString.substring(indexOfStartOfWorkerId + 9, indexOfAmpersandAtEndOfWorkerId);
      var indexOfStartOfAssignmentId = currentUrlString.indexOf("assignmentId");
      var indexOfAmpersandAtEndOfAssignmentId = currentUrlString.indexOf("&", indexOfStartOfAssignmentId);
      var assignmentIdString = currentUrlString.substring(indexOfStartOfAssignmentId + 13, indexOfAmpersandAtEndOfAssignmentId);
      var finalIdString = workerIdString + ":" + assignmentIdString

      socket.emit('join', {
          'id': finalIdString,
          'source': 'stage'
      });

      id = finalIdString;

  });

  socket.on('getTrainingButtons', function(buttonList) {


      if (lastButtonList !== null &&
          buttonListsEqual(lastButtonList, buttonList)) {
          return;
      }

      $('#holdButtons').html("");
      for (var i = 0; i < buttonList.length; i++) {

          var data = buttonList[i];

          var button = $("<button>" + data.buttonText + "</button>");
          if (data.descriptionText !== undefined) {
              $(button).attr('title', data.descriptionText);
          }
          $(button).addClass('receivedButton');
          $(button).attr('button-id', data.identifier);

          $('#holdButtons').append(button);
          $(button).tooltip();
          $(button).effect('highlight', {}, 1500);
      }

      $('.receivedButton').on('click', function(ev) {
          socket.emit('onTrainingButtonPress', {
              'identifier': '' + $(ev.currentTarget).attr('button-id'),
              'id': '' + id
          });
      });

      lastButtonList = buttonList;
  });

  socket.on('sendTrainingMessage', function(message) {
      var m = $('<p></p>').text(message);
      $('#serverMessages').append(m);
      $("#serverMessages").scrollTop($("#serverMessages")[0].scrollHeight);
      $(m).effect("highlight", {}, 1500);
  });

  socket.on('instructions', function(message) {
      console.log("instructions: " + message);
  });

  socket.on('clearTrainingMessages', function(message) {
      $('#serverMessages').html("");
  });

  //OBSOLETE FUNCTION: clearTrainingButtons
  socket.on('clearTrainingButtons', function(message) {
      $('#holdButtons').html('');
  });

  socket.on('lockButtons', lockButtons);
  socket.on('unlockButtons', unlockButtons);
  socket.on('lockChatBox', lockChatBox);
  socket.on('unlockChatBox', unlockChatBox);

  function lockButtons() {
      $('.receivedButton').attr('disabled', 'disabled');
  }

  function unlockButtons() {
      $('.receivedButton').removeAttr('disabled');
  }

  function sendChatMessage() {
      socket.emit("getChatMessage", {
          'message': document.getElementById('chatBox').value,
          'id': id
      });
      document.getElementById('chatBox').value = "";
  }

  function requestButtons() {
      socket.emit("requestTestTrainingButtons");
  }

  function clearServerOutput() {
      socket.emit("clearAll");
  }

  function requestLock() {
      socket.emit("requestLock");
  }

  function requestUnlock() {
      socket.emit("requestUnlock");
  }

  function requestLockChatBox() {
      socket.emit("requestLockChatBox");
  }

  function requestUnlockChatBox() {
      socket.emit("requestUnlockChatBox");
  }

  function requestResetUnity() {
      socket.emit("requestResetUnity");
  }

  function requestUnityAction() {
      socket.emit("requestActionBroadcast");
  }

  function buttonListsEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) {
          return false;
      }
      for (var i = arr1.length; i--;) {
          if (arr1[i].identifier !== arr2[i].identifier ||
              arr1[i].buttonText !== arr2[i].buttonText ||
              arr1[i].descriptionText !== arr2[i].descriptionText) {
              return false;
          }
      }

      return true;
  }

  $(function() {
      $('#chatMessageButton').on('click', sendChatMessage);
      $('#chatBox').keypress(function(e) {
          if (e.which == 13) {
              sendChatMessage();
          }


      });
      lockChatBox();

      // Load the unity game in an Iframe, so it can be removed easily.
      var idx = window.location.href.indexOf('?');
      var src = '/unity.html' + window.location.href.substring(idx,
          window.location.href.length);
      console.log("loading SRC in iframe");
      console.log(src);
      var iframe = $("<iframe scrolling=\"no\" seamless=\"seamless\"></iframe>")
          .attr({
              "id": 'unityFrame',
              "src": src
          });
      $('#gameContainer').append(iframe);
  });

*/
