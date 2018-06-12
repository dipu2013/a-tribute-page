$(document).ready(function () {
  "use strict";

  // Scrollbar
  // ----------------------
  var generateSlimScroll = function (e) {
    if (!$(e).attr("data-init")) {
      var a = $(e).attr("data-height"),
        t = {
          height: (a = a || $(e).height())
        };
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
        ? ($(e).css("height", a), $(e).css("overflow-x", "scroll"))
        : $(e).slimScroll(t),
        $(e).attr("data-init", !0),
        $(".slimScrollBar").hide();
    }
  };

  $("[data-scrollbar=true]").each(function () {
    generateSlimScroll($(this));
  });

  // Toggle sidebar
  // ----------------------
  if ($(window).width() <= 750) {
    $(document).on("click", ".sidebar-toggle", function (e) {
      e.preventDefault();
      var a = "page-sidebar-minified",
        mo = "page-sidebar-minified-out",
        t = "#page-container";
      $(t).hasClass(a)
        ? $(t)
          .removeClass(a)
          .addClass(mo)
        : ($(t)
          .addClass(a)
          .removeClass(mo),
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) &&
          ($('#sidebar [data-scrollbar="true"]').css("margin-top", "0"),
            $('#sidebar [data-scrollbar="true"]').css("overflow-x", "scroll"))),
        $(window).trigger("resize");
    });
  }

  // Backdrop
  //-----------------
  if ($(window).width() <= 750) {
    var shadowClass = $(".mobile-sticky-body-overlay");
    $(".sidebar-toggle").on("click", function (e) {
      e.preventDefault();
      if (!shadowClass.hasClass("active")) {
        shadowClass.addClass("active");
        $("body").css("overflow", "hidden");
      } else {
        shadowClass.removeClass("active");
        $("body").css("overflow", "auto");
      }
    });

    $(".mobile-sticky-body-overlay").on("click", function (e) {
      $(this).removeClass("active");
      $("#page-container").removeClass("page-sidebar-minified");
      $("body").css("overflow", "auto");
    });
  }

  // Sidebar Menu Dropdown
  // ----------------------
  (function () {
    var e = $(".sidebar").attr("data-disable-slide-animation") ? 0 : 250;
    $(".sidebar .nav > .has-sub > a").click(function () {
      var firstMenu = $(this).next(".sub-menu"),
        t = $(".sidebar .nav > li.has-sub > .sub-menu").not(firstMenu);
      $(t)
        .closest("li")
        .addClass("closing"),
        $(t).slideUp(e, function () {
          $(t)
            .closest("li")
            .addClass("closed")
            .removeClass("expand closing");
        }),
        $(firstMenu).is(":visible")
          ? $(firstMenu)
            .closest("li")
            .addClass("closing")
            .removeClass("expand")
          : $(firstMenu)
            .closest("li")
            .addClass("expanding")
            .removeClass("closed"),
        $(firstMenu).slideToggle(e, function () {
          var parentLi = $(this).closest("li");
          $(firstMenu).is(":visible")
            ? ($(parentLi).addClass("expand"),
              $(parentLi).removeClass("closed"))
            : ($(parentLi).addClass("closed"),
              $(parentLi).removeClass("expand")),
            $(parentLi).removeClass("expanding closing");
        });
    }),
      $(".sidebar .nav > .has-sub .sub-menu li.has-sub > a").click(function () {
        var secondMenu = $(this).next(".sub-menu");
        $(secondMenu).is(":visible")
          ? $(secondMenu)
            .closest("li")
            .addClass("closing")
            .removeClass("expand")
          : $(secondMenu)
            .closest("li")
            .addClass("expanding")
            .removeClass("closed"),
          $(secondMenu).slideToggle(e, function () {
            var parentLi = $(this).closest("li");
            $(secondMenu).is(":visible")
              ? ($(parentLi).addClass("expand"),
                $(parentLi).removeClass("closed"))
              : ($(parentLi).addClass("closed"),
                $(parentLi).removeClass("expand")),
              $(parentLi).removeClass("expanding closing");
          });
      });
  })();

  // Tooltips and popover
  // ----------------------
  $('[data-toggle="tooltip"]').tooltip({
    container: "body",
    template:
      '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
  });
  $('[data-toggle="popover"]').popover();

  // Todo list
  // ----------------------
  if (document.querySelector("#todo")) {
    var list = document.querySelector("#todo-list"),
      todoInput = document.querySelector("#todo-input"),
      todoInputForm = todoInput.querySelector("form"),
      item = todoInputForm.querySelector("input");

    document.querySelector("#add-task").addEventListener("click", function (e) {
      e.preventDefault();
      todoInput.classList.toggle("d-block");
      item.focus();
    });

    todoInputForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (item.value.length <= 0) {
        return;
      }
      list.innerHTML =
        `<div class="single-todo d-flex flex-row justify-content-between">
        <i class="fa"></i>
        <span class="">${item.value}</span>
        <span class="badge badge-primary">Today</span>
      </div>` + list.innerHTML;
      item.value = "";
      //Close input field
      todoInput.classList.toggle("d-block");
      todoCheckAll();
    });

    function todoCheckAll() {
      var fas = document.querySelectorAll(".single-todo .fa");
      for (let fa of fas) {
        fa.addEventListener("click", function (e) {
          e.stopPropagation();
          console.log(e);
          e.target.parentElement.classList.toggle("finished");
        });
      }
    }
    todoCheckAll();
  }

  // jVectormap Dashboard
  // ----------------------
  var mapData = {
    US: 1298,
    FR: 540,
    DE: 350,
    BW: 450,
    NA: 250,
    ZW: 300,
    AU: 760,
    GB: 120,
    ZA: 450
  };

  if (document.getElementById("world")) {
    $("#world").vectorMap({
      map: "world_mill",
      backgroundColor: "transparent",
      zoomOnScroll: false,
      regionStyle: {
        initial: {
          fill: "#e4e4e4",
          "fill-opacity": 0.9,
          stroke: "none",
          "stroke-width": 0,
          "stroke-opacity": 0
        }
      },
      markerStyle: {
        initial: {
          stroke: "transparent"
        },
        hover: {
          stroke: "rgba(112, 112, 112, 0.30)"
        }
      },

      markers: [
        {
          latLng: [54.673629, -62.347026],
          name: "USA",
          style: {
            fill: "limegreen"
          }
        },
        {
          latLng: [62.466943, 11.797592],
          name: "Europe",
          style: {
            fill: "orange"
          }
        },
        {
          latLng: [23.956725, -8.768815],
          name: "Africa",
          style: {
            fill: "red"
          }
        },
        {
          latLng: [-21.943369, 123.102198],
          name: "Australia",
          style: {
            fill: "royalblue"
          }
        }
      ]
    });
  }

  // jVectormap Analytics
  // ----------------------
  var mapData2 = {
    IN: 19000,
    US: 13000,
    TR: 9500,
    DO: 7500,
    PL: 4600,
    UK: 4000
  };

  //Vector map widgets
  if (document.getElementById("analytic-world")) {
    $("#analytic-world").vectorMap({
      map: "world_mill",
      backgroundColor: "transparent",
      zoomOnScroll: false,
      regionStyle: {
        initial: {
          fill: "#e4e4e4",
          "fill-opacity": 0.9,
          stroke: "none",
          "stroke-width": 0,
          "stroke-opacity": 0
        }
      },

      series: {
        regions: [
          {
            values: mapData2,
            scale: ["#6a9ef9", "#b6d0ff"],
            normalizeFunction: "polynomial"
          }
        ]
      }
    });
  }

  //JVectormap widgrts

  if (document.getElementById("demoworld")) {
    $("#demoworld").vectorMap({
      map: "world_mill",
      backgroundColor: "transparent",
      regionStyle: {
        initial: {
          fill: "#9c9c9c"
        }
      }
    });
  }

  // initialize the calendar
  // ----------------------
  var todayDate = moment().startOf("day");
  var YM = todayDate.format("YYYY-MM");
  var YESTERDAY = todayDate
    .clone()
    .subtract(1, "day")
    .format("YYYY-MM-DD");
  var TODAY = todayDate.format("YYYY-MM-DD");
  var TOMORROW = todayDate
    .clone()
    .add(1, "day")
    .format("YYYY-MM-DD");

  $("#calendar").fullCalendar({
    header: {
      left: "prev,next today",
      center: "title",
      right: "month,agendaWeek,agendaDay"
    },
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    navLinks: true,
    eventSources: [
      {
        events: [
          {
            title: "All Day Event",
            start: YM + "-01",
            end: YM + "-02"
          }
        ],
        color: "#4c84ff", // an option!
        textColor: "#ffffff" // an option!
      },
      {
        events: [
          {
            title: "Long Event",
            start: YM + "-07",
            end: YM + "-10"
          }
        ],
        color: "#f5f6fa", // an option!
        textColor: "#1b223c" // an option!
      },
      {
        events: [
          {
            title: "Confference",
            start: YM + "-14T16:00:00"
          }
        ],
        color: "#29cc97", // an option!
        textColor: "#ffffff" // an option!
      },
      {
        events: [
          {
            title: "Meeting",
            start: TODAY + "T10:30:00",
            end: TODAY + "T12:30:00"
          },
          {
            title: "Lunch",
            start: TODAY + "T12:00:00"
          },
          {
            title: "Meeting",
            start: TODAY + "T14:30:00"
          },
          {
            title: "Happy Hour",
            start: TODAY + "T17:30:00"
          },
          {
            title: "Dinner",
            start: TODAY + "T20:00:00"
          }
        ],
        color: "#f5f6fa", // an option!
        textColor: "#1b223c" // an option!
      },
      {
        events: [
          {
            title: "Click for Google",
            url: "http://google.com/",
            start: YM + "-28"
          }
        ],
        color: "#fe5461", // an option!
        textColor: "#ffffff" // an option!
      }
    ]
  });

  // Quill Text Editor
  // ----------------------
  var quillHook = document.getElementById("editor");
  if (quillHook !== null) {
    var quill = new Quill(quillHook, {
      modules: {
        formula: false,
        syntax: false,
        toolbar: "#toolbar"
      },
      placeholder: "Enter Text ...",
      theme: "snow"
    });
  }

  //Code Editor
  //------------------
  if (document.getElementById("code-editor")) {
    var htmlCode = `
    <html style="color: green">
      <!-- this is a comment -->
      <head>
        <title>HTML Example</title>
      </head>
      <body>
        The indentation tries to be <em>somewhat &quot;do what
        I mean&quot;</em>... but might not match your style.
      </body>
    </html>
  `;

    var myCodeMirror = CodeMirror(document.getElementById("code-editor"), {
      value: htmlCode,
      mode: "xml",
      extraKeys: { "Ctrl-Space": "autocomplete" },
      lineNumbers: true,
      indentWithTabs: true,
      lineWrapping: true
    });
  }
});

//Markdown Editor
//-------------------

$("#markdown-editor").markdown({
  onShow: function (e) {
    var markdown = document.querySelector(".md-editor");
    var header = markdown.querySelector(".md-header");

    var buttonGroups = header.querySelectorAll(".btn-group");
    for (var group of buttonGroups) {
      group.className = "btn-group ml-2";
    }

    var buttonAll = header.querySelectorAll(
      '.btn-group .btn:not([title="Preview"])'
    );

    for (var button of buttonAll) {
      button.className = "btn btn-sm btn-outline-secondary";
    }

    var buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdBold"] span'
    );
    buttonSpan.className = "fa fa-bold";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdItalic"] span'
    );
    buttonSpan.className = "fa fa-italic";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdHeading"] span'
    );
    buttonSpan.className = "fa fa-header";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdUrl"] span'
    );
    buttonSpan.className = "fa fa-link";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdImage"] span'
    );
    buttonSpan.className = "fa fa-image";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdList"] span'
    );
    buttonSpan.className = "fa fa-list";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdListO"] span'
    );
    buttonSpan.className = "fa fa-list-ol";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdCode"] span'
    );
    buttonSpan.className = "fa fa-code";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdQuote"] span'
    );
    buttonSpan.className = "fa fa-quote-right";

    buttonSpan = header.querySelector(
      '[data-handler="bootstrap-markdown-cmdPreview"] span'
    );
    buttonSpan.className = "fa fa-search";

    var buttonFullscreen = markdown.querySelector(
      ".md-controls .md-control.md-control-fullscreen span"
    );
    buttonFullscreen.className = "fa fa-expand";

    buttonFullscreen = markdown.querySelector(
      ".md-fullscreen-controls .exit-fullscreen span"
    );
    buttonFullscreen.className = "fa fa-compress";
  },
  onPreview: function (e) {
    //Required marked.js plugin
    return marked(e.getContent());
  }
});

//Select multi in form advanced
$(".js-example-basic-multiple").select2();

//Countdown
$(".simple_timer").syotimer({
  year: 2018,
  month: 9,
  day: 9,
  hour: 20,
  minute: 30
});

//Ladda Button// Loading Button
//-----------------------------
// Bind normal buttons
Ladda.bind(".ladda-button", {
  timeout: 5000
});

// Bind progress buttons and simulate loading progress
Ladda.bind(".progress-demo button", {
  callback: function (instance) {
    var progress = 0;
    var interval = setInterval(function () {
      progress = Math.min(progress + Math.random() * 0.1, 1);
      instance.setProgress(progress);

      if (progress === 1) {
        instance.stop();
        clearInterval(interval);
      }
    }, 200);
  }
});

if ($(window).width() > 750) {
  var flag = false;
  var flagOffCanvas = false;
  var page_container = $("#page-container");

  $("#offcanvas-sidebar-toggle").on("click", function () {

    if (
      page_container.hasClass("fixed-offcanvas-sidebar") ||
      page_container.hasClass("static-offcanvas")
    ) {
      $(this)
        .addClass("offcanvas-sidebar-toggle")
        .removeClass("sidebar-toggle");
      if (flagOffCanvas === false) {
        page_container.addClass("sidebar-collapse");
        flagOffCanvas = true;
        flag = false;
      } else {
        page_container.removeClass("sidebar-collapse");
        page_container.addClass("sidebar-collapse-out");
        setTimeout(function () {
          page_container.removeClass("sidebar-collapse-out");
        }, 1000);
        flagOffCanvas = false;
      }
    }

    if (
      page_container.hasClass("sidebar-fixed") ||
      page_container.hasClass("static")
    ) {
      $(this)
        .addClass("sidebar-toggle")
        .removeClass("offcanvas-sidebar-toggle");
      if (flag === false) {
        page_container
          .removeClass("sidebar-collapse page-sidebar-minified-out")
          .addClass("page-sidebar-minified");
        flag = true;
        flagOffCanvas = false;
      } else {
        page_container.removeClass("page-sidebar-minified");
        page_container.addClass("page-sidebar-minified-out");
        flag = false;
      }
    }
  });
}
