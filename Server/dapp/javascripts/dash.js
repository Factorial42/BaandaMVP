console.log("@user:email:" + getUrlParameter("email"));
$.get("/contractsByEmail/" + getUrlParameter("email"),
    function(data) {
        console.log("@contractCount:" + data.length);
        $("#header").html("You have *" + data.length + "* smart contracts for email *" + getUrlParameter("email") + "*").css({
            'color': 'green',
            'font-size': '110%'
        });
        for (var i = 0; i < data.length; i++) {
            populateTable(data[i]);
        }
    });


function populateTable(v) {
    //console.log("@populateTable:" + JSON.stringify(v));
    var beginTag = "<tr id='doc_" + v.id + "'><td>";
    var contractIDHREF = "<a target='_blank' href='http://localhost:8080/?cId=" + v.contract_address + "'>" + v.contract_address + "</a>";
    var endTag = "</td></tr>";
    var midTag = "</td><td>";
    var html = beginTag + contractIDHREF + midTag + v.contract_name + midTag + v.created_date.substring(0, 10) + endTag;
    $('#mytable tbody').append(html);
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
window.addContract = function(docname) {
    console.log("Contract creation start of type@ " + $('#contractType :selected').text());
    try {
        $("#msg").html(" Smart Contract of type *" + $('#contractType :selected').text() + "* is being recorded on the blockchain. Please wait...").css({
            'color': 'green',
            'font-size': '110%'
        });
        $("#addContract").removeClass("btn btn-primary");
        $("#addContract").addClass("btn btn-primary disabled");

        //create smart contractType
        $.post("/createContract", {
            type: $('#contractType :selected').text(),
            email: getUrlParameter("email")
        }, function(data) {

            if (typeof data == 'undefined') {
                console.log("@contractCreated:undefined::" + data);
                $("#msg").html(" Smart Contract could not be created at this time. Please try again later!").css({
                    'color': 'red',
                    'font-size': '110%'
                });
            } else if (data.contract_address) {
                console.log("@contractCreated:" + data.contract_address);
                populateTable(data);

                //hightlight last row
                $("#msg").html(" Smart Contract created successfully with address *" + data.contract_address + "*!").css({
                    'color': 'green',
                    'font-size': '110%'
                });

                //highlight last row and enable button to create contract and highlight last row
                $("#addContract").removeClass("btn btn-primary disabled");
                $("#addContract").addClass("btn btn-primary");
                $("#mytable tr:last").css({
                    backgroundColor: 'yellow'
                });
            } else {
                console.log("@contractCreated:fail::" + JSON.stringify(data));
                $("#msg").html(" Smart Contract could not be created at this time. Please try again later or contact admin(not reddy)! Error@" + JSON.stringify(data)).css({
                    'color': 'red',
                    'font-size': '110%'
                });
            }
        });

    } catch (err) {
        console.log(err);
        $("#addContract").removeClass("btn btn-primary disabled");
        $("#addContract").addClass("btn btn-primary");
    }
}
