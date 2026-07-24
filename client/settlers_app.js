// use addMenuItem from main script
addToolsMenuItem("Settlers App", ExampleMenuHandler);

function SendUserListThroughAPI()
{
  var guild = swmmo.application.mGameInterface.GetCurrentPlayerGuild();
  var guild_users = []
  const datetime = new Date().toISOString()

  for(key in guild.members)
  {
    var online = guild.members[key].onlineLast24
    guild_users.push({ 
      "id": guild.members[key].username, 
      "online24h": online, 
      "datetime": datetime 
    });
  }

  try {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3456/api/save-guild-user-list", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(guild_users));

  } catch (error) {
    //debug("Xhr error");
  }
}

$(document).ready(function () {

    const timer = setInterval(function () {

        if (
            window.swmmo &&
            swmmo.application &&
            swmmo.application.mGameInterface &&
            swmmo.application.mGameInterface.GetCurrentPlayerGuild
        ) {
            clearInterval(timer);
            SendUserListThroughAPI();
        }

    }, 5000);

});


function ExampleMenuHandler(event)
{
	// close all modals
	$( "div[role='dialog']:not(#exampleModal):visible").modal("hide");
	// create modal
	createModalWindow('exampleModal', 'Example modal window');
	// fill modal data 
	$('#exampleModalData').html(ExampleMakeModal());
	// bind buttons
	$('#exampleModalData .showlevelbtn').click(ex_get_level);
	// show modal
	$('#exampleModal:not(:visible)').modal({backdrop: "static"});
}


function ExampleMakeModal()
{
  SendUserListThroughAPI();
  return '<div class="container-fluid"><H3>User list saved</H3></div>';
}



