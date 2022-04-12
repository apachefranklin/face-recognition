function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function showPreview(objFileInput, html_element) {
    if (objFileInput.files[0]) {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            $(html_element).html('<img src="' + e.target.result + '" width="100%" height="100%" class="upload-preview zoom-in" />');
        }
        fileReader.readAsDataURL(objFileInput.files[0]);
    }
}

function display_result(result, form_id = "", pso = "mid-center") {
    $(".jq-toast-wrap *").hide();
    var icon_d = "success";
    if (result["status"] == false) {
        icon_d = "error";
    }
    $.toast({
        text: result["msg"],
        icon: icon_d,
        hideAfter: 4000,
        position: pso,
        afterHidden: function () {
            if (result['status'] == true) {
                $(form_id).trigger("reset")
                if (result["redirect"] != undefined) {
                    window.location.replace(result['redirect']);
                }
            }
        }
    });

    if (result["redirect"] != undefined) {
        window.location.replace(result['redirect']);
    }
}
//fonction de soumission des formaulaires via ajax
$(function (e) {
    $("#demo-form").on("submit", function (ert) {
        ert.preventDefault();
        $("#pageloader").fadeIn();
        var form_data = new FormData(this);
        var form_title = $(this).attr("form_title");
        var form_method = $(this).attr("method");
        var form_id = $(this).attr("id")
        $.ajax({
            url: $(this).attr("action"),
            method: form_method,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            success: function (result) {
                $("#pageloader").fadeOut();
                let modeltemp = $("#template-result").html();
                $("#new-result .content").html("");
                let content = "";
                let students = result["students"];
                for (let i = 0; i < result["students"].length; i++) {
                    content += "<tr style='color: black; text-align:center !important;'>" +
                        "<td style='color: black; text-align:center !important;'>" + students[i].registrationNumber + "</td>" +
                        "<td style='color: black; text-align:center !important;'>" + students[i].name + " " + students[i].lastname + "</td>" +
                        "<td style='color: black; text-align:center !important;'><center><img src='/static/images/students/" + students[i].real_img + "' style='width: 50 px; height: 50px;' /></center></td>"
                    "</tr>";
                }

                content = "<table style='width: 100%'>" +
                    "<tr style='color: black; text-align:center !important;'>" +
                    "<th>Registration</th><th>Full name</th><th>Face</th></tr>" + content
                    + "</table>";
                $("#new-result .content").html(content);
            },
            error: function (result) {
                //$("#pageloader").fadeOut();
                $.toast({
                    heading: form_title,
                    text: "Une erreur innatendue s'est produite",
                    icon: "error"
                });
            }
        });
    });


    $("#zip-form-upload").on("submit", function (ert) {
        ert.preventDefault();
        $("#pageloader").fadeIn();
        $("#link-download-zip").fadeOut();
        var form_data = new FormData(this);
        var form_title = $(this).attr("form_title");
        var form_method = $(this).attr("method");
        var form_id = $(this).attr("id")
        $.ajax({
            url: $(this).attr("action"),
            method: form_method,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            success: function (result) {
                $("#pageloader").fadeOut();
                display_result(result)
                $("#link-download-zip").fadeIn();
                $("#link-download-zip").attr("href", result["url"]);
                $("#link-download-zip").trigger("click");
            },
            error: function (result) {
                $("#pageloader").fadeOut();
                $.toast({
                    heading: form_title,
                    text: "Une erreur innatendue s'est produite",
                    icon: "error"
                });
            }
        });

    });

    //validateur de formulaire universelle
    $(".ajax-form").on("submit", function (e) {
        e.preventDefault();
        $("#pageloader").fadeIn();
        var form_data = new FormData(this);
        var form_title = $(this).attr("form_title");
        var form_method = $(this).attr("method");
        var form_id = $(this).attr("id")
        $.ajax({
            url: $(this).attr("action"),
            method: form_method,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            success: function (result) {
                $("#pageloader").fadeOut();
                display_result(result)
            },
            error: function (result) {
                $("#pageloader").fadeOut();
                $.toast({
                    heading: form_title,
                    text: "Une erreur innatendue s'est produite",
                    icon: "error"
                });
            }
        });
    });
    //fin du submitteur universel
});
//end fonction de soummision des formaulaires via ajax

$(function (e) {
    //on va forcer le telechargement des fichiers pgm
    $("#download-pgm-result").click(function () {
        var dname = $(this).attr("data-download")
        $.get($(this).attr("data-url"), { download_name: dname }, function (e) {

        });
    });

    $("#image-viewver").hide();
    $("#image-viewver").click(function () {
        $(this).fadeOut(1000)
    });
    $(document).on("click", "img:not(.viewver)", function () {
        $("#image-viewver .content").html("<img src='" + $(this).attr("src") + "' class='viewver' />");
        $("#image-viewver").fadeIn(1000)
    });

    //exemple de requete ajax
    $("#form_upload_image").submit(function (r) {
        form_data = new FormData(this)
        $.ajax({
            url: $(this).attr("action"),
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result);
                $("#result-box").html("<img src='/static/imageprocess/images/result/" + result["saved_name"] + "' width='100%' height='100%' />");
                $("#download-pgm-result").attr("data-download", result["pgm_name"])
            },
            error: function (result) {
                console.log("error");
            }
        });
        return false;
    });


    $("#form_equalize").submit(function () {

        form_data = new FormData(this)
        $.ajax({
            url: $(this).attr("action"),
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result);
                $("#result-box").html("<img src='/static/imageprocess/images/result/" + result["saved_name"] + "' width='100%' height='100%' />");
                $("#hist-preview").html("<img src='/static/imageprocess/images/hist/" + result["preview_hist"] + "' width='100%' height='100%' />");
                $("#hist-result-box").html("<img src='/static/imageprocess/images/histresult/" + result["new_hist"] + "' width='100%' height='100%' />");
            },
            error: function (result) {
                console.log("error");
            }
        });
        return false;
    });


    $("#form_make_operation").submit(function () {
        form_data = new FormData(this)
        $.ajax({
            url: $(this).attr("action"),
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            method: "POST",
            success: function (result) {
                $("#result-box").html("<img src='/static/imageprocess/images/result/" + result["saved_name"] + "' width='100%' height='100%' />");
            },
            error: function (result) {
                console.log("error");
            }
        });
        return false;
    });

    $("#form_make_convolution").submit(function () {
        form_data = new FormData(this)
        $.ajax({
            url: $(this).attr("action"),
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            method: "POST",
            success: function (result) {
                $("#result-box").html("<img src='/static/imageprocess/images/" + result["saved_name"] + "' width='100%' height='100%' />");
            },
            error: function (result) {
                console.log("error");
            }
        });
        return false;
    });

    $(".sober-horizontal").click(function () {
        $("#kernel").val("-1 -2 -1\n0 0 0\n1 2 1")
    });
    $(".sober-vertical").click(function () {
        $("#kernel").val("-1 0 1\n-2 0 2\n-1 0 1")
    });
    $(".filtre-moyenneur").click(function () {
        $("#kernel").val("0.1111 0.1111 0.1111\n0.1111 0.1111 0.1111\n0.1111 0.1111 0.1111")
    });

    $(".filtre-laplacien").click(function () {
        $("#kernel").val("0 1 0\n1 -4 1\n0 1 0")
    });

    $(".filtre-prewit-x").click(function () {
        $("#kernel").val("-1 0 1\n-1 0 1\n-1 0 1")
    });

    $(".filtre-prewit-y").click(function () {
        $("#kernel").val("-1 -1 -1\n0 0 0\n1 1 1")
    });
    $(".filtre-constrate").click(function () {
        $("#kernel").val("0 -1 0\n-1 5 -1\n0 -1 1")
    });
    $(".filtre-repoussage").click(function () {
        $("#kernel").val("-2 1 0\n-1 1 1\n0 1 2")
    });

    $(".filtre-flou").click(function () {
        $("#kernel").val("1 1 1\n1 1 1\n1 1 1")
    });

    $(".filtre-gaussien").click(function () {
        $("#kernel").val("0.0625 0.125 0.0625\n0.125 0.25 0.125\n0.0625 0.125 0.0625")
    });



});