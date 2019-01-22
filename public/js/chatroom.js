$(function() {
  let socket = io();
  socket.emit('add user', username);

  $('form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('.m').val());
    $('.m').val('');
    return false;
  });

  socket.on('chat message', function(msg) {
    $('.messages').append($('<li>').text(msg));
    let div = $('.messagebox');
    div.scrollTop(div.prop('scrollHeight'));
  });

  socket.on('user list', function(arr) {
    $('.users').empty();
    for (let i = 0; i < arr.length; i++) {
      $('.users').append($('<li>').text(arr[i]));
    }
  });

  $('.icon').click(function() {
    $('.chatroom').toggleClass('column');
    $('.messagebox').toggleClass('border');
    $('.userlist').toggle();
  });
});
