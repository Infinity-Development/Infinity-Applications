function imgError(place) {
  place.src = '/static/images/Apps.png';
}

var $info = $('.tooltip');
$info.each(function () {
  var dataInfo = $(this).data('tooltip');
  $(this).append('<span class="inner" >' + dataInfo + '</span>');
});

$('body').toggleClass('loaded');
$(document).ready(function () {
  setTimeout(function () {
    $('body').addClass('loaded');
    $('h1').css('color', '#222222');
  }, 250);
});

function limitChars(textid, limit, infodiv, less) {
  var text = $('#' + textid).val();
  var textlength = text.length;
  if (textlength > limit) {
    $('#' + infodiv).html(
      '- You cannot write more then ' + limit + ' characters!',
    );
    $('#' + textid).val(text.substr(0, limit));
    return false;
  }
  if (textlength < less) {
    $('#' + infodiv).html(
      '- You cannot write less then ' + less + ' characters!',
    );
    $('#' + textid).val(text.substr(0, limit));
    return false;
  } else {
    $('#' + infodiv).html(
      '- You have ' + (limit - textlength) + ' characters left.',
    );
    return true;
  }
}
// Bind the function to ready event of document.
$(function () {
  $('#comment').keyup(function () {
    limitChars('comment', 140, 'charlimitinfo');
  });
});
