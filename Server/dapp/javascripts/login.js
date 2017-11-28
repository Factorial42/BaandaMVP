var userEmail;
$(document).ready(function() {
    // On Click SignIn Button Checks For Valid E-mail And All Field Should Be Filled
    $("#login").click(function() {
        var email = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
        if ($("#loginemail").val() == '' || $("#loginpassword").val() == '') {
            alert("Please fill all fields...!!!!!!");
        } else if (!($("#loginemail").val()).match(email)) {
            alert("Please enter valid Email...!!!!!!");
        } else {
            var email = $("#loginemail").val();
            var password = $("#loginpassword").val();
            console.log("@user:" + email + "/" + password);
            $.post("/loginUser", {
                    email: email,
                    password: password
                },
                function(data) {
                    //console.log (JSON.stringify(data));
                    if (data == 'Invalid Email.......') {
                        $('input[type="text"]').css({
                            "border": "2px solid red",
                            "box-shadow": "0 0 3px red"
                        });
                        $('input[type="password"]').css({
                            "border": "2px solid #00F5FF",
                            "box-shadow": "0 0 5px #00F5FF"
                        });
                    } else if (data == 'Email or Password is wrong...!!!!') {
                        $('input[type="text"],input[type="password"]').css({
                            "border": "2px solid red",
                            "box-shadow": "0 0 3px red"
                        });
                    } else if (data == null) {
                        $('input[type="text"],input[type="password"]').css({
                            "border": "2px solid red",
                            "box-shadow": "0 0 3px red"
                        });
                    } else if (data.email) {
                        console.log("@User:login success" + JSON.stringify(data));
                        userEmail = data.email;
                        $(location).attr('href', '/dash.html?email=' + data.email);
                        /*$("#first").slideUp("slow", function() {
                        		$("#third").slideDown("slow");
                        });*/
                    } else {
                        //alert(JSON.stringify(data));
                    }
                });
            $("#form")[0].reset();
        }
    });
    $("#register").click(function() {
        var email = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
        if ($("#name").val() == '' || $("#registeremail").val() == '' || $("#registerpassword").val() == '' || $("#contact").val() == '') {
            alert("Please fill all fields...!!!!!!");
        } else if (!($("#registeremail").val()).match(email)) {
            alert("Please enter valid Email...!!!!!!");
        } else {
            var name = $("#name").val();
            var email = $("#registeremail").val();
            var password = $("#registerpassword").val();
            var mobile = $("#contact").val();
            console.log("@user:" + name + "/" + email + "/" + password + "/" + contact);
            $.post("/validateUser", {
                    email: email
                },
                function(data) {
                    if (data == null) {
                        $.post("/registerUser", {
                                name: name,
                                email: email,
                                password: password,
                                mobile: mobile
                            },
                            function(data) {
                                if (data == 'Invalid Email.......') {
                                    $('input[type="text"]').css({
                                        "border": "2px solid red",
                                        "box-shadow": "0 0 3px red"
                                    });
                                    $('input[type="password"]').css({
                                        "border": "2px solid #00F5FF",
                                        "box-shadow": "0 0 5px #00F5FF"
                                    });
                                    alert(data);
                                } else if (data == 'Email or Password is wrong...!!!!') {
                                    $('input[type="text"],input[type="password"]').css({
                                        "border": "2px solid red",
                                        "box-shadow": "0 0 3px red"
                                    });
                                    alert(data);
                                } else if (data == 'Successfully Logged in...') {
                                    $("form")[0].reset();
                                    $('input[type="text"],input[type="password"]').css({
                                        "border": "2px solid #00F5FF",
                                        "box-shadow": "0 0 5px #00F5FF"
                                    });
                                    alert(data);
                                } else {
                                    console.log("@User" + JSON.stringify(data));
                                }
                            });
                    } else
                    if (data !== null && data.email) {
                        console.log("@email already registered!");
                        alert("User email is already registered. Try again with a different email address!");
                    }
                });

            $("#form")[0].reset();
            $("#second").slideUp("slow", function() {
                $("#first").slideDown("slow");
            });
        }
    });

    // On Click SignUp It Will Hide Login Form and Display Registration Form
    $("#signup").click(function() {
        $("#first").slideUp("slow", function() {
            $("#second").slideDown("slow");
        });
    });
    // On Click SignIn It Will Hide Registration Form and Display Login Form
    $("#signin").click(function() {
        $("#second").slideUp("slow", function() {
            $("#first").slideDown("slow");
        });
    });
});
