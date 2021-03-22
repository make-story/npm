$(document).ready(function () {
  goTop();
});

// var lastScrollTop = 0,

//     delta = 15;

//   $(window).scroll(function(event) {
//     var st = $(this).scrollTop();

//     if (Math.abs(lastScrollTop - st) <= delta) return;

//     if ((st > lastScrollTop) && (lastScrollTop > 0)) {
//       $(".header").addClass("move");
//     } else {
//       $(".header").removeClass("move");
//     }
//     lastScrollTop = st;
//   });

// 헤더 고정
// function gnb() {
//   $(".header").each(function () {
//     var gnbWrap = $(this);
//     $( window ).scroll( function() {
//       if ( $( this ).scrollTop() > 56 ) {
//         gnbWrap.addClass("fixed");
//       } else {
//         gnbWrap.removeClass("fixed");
//       }
//     });
//   });
// }

// go top
function goTop() {
  $(".goTop").each(function () {
    var goTop = $(this);
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        goTop.addClass("show");
      } else {
        goTop.removeClass("show");
      }
    });
  });
}
