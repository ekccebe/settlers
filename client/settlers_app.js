// use addMenuItem from main script
addToolsMenuItem("Angel Tool", AngelToolMenuHandler);

function SendBuildingListToAPI()
{
  var buildings = [];
  swmmo.application.mGameInterface.mCurrentPlayerZone.mStreetDataMap.mBuildingContainer.forEach(function (item) {
    try {
      if (item == null) {
          return;
      }

      if (item.isGarrison()) { return; }

      var name = item.GetBuildingName_string();
      if (
          name.toUpperCase().indexOf('EW_') != -1 ||
          name.toUpperCase().indexOf('DECORATION_MOUNTAIN_PEAK') != -1 ||
          name.toUpperCase().indexOf('BANDITS') != -1
      ) { return; }
      
      var isDestroyableMountain = item.IsDestroyableMountain();
      if (isDestroyableMountain) { return; }

      var locName = loca.GetText('BUI', name);
      if (locName.indexOf('[undefined text]') >= 0) {
          locName = name;
      }

      buildings.push({
            'grid': item.GetGrid(),
            'name': name,
            'locName': locName,
            'level': item.GetUIUpgradeLevel(),
            'isWorking': item.IsProductionActive(),
            'isUpgradeInProgress': item.IsUpgradeInProgress(),
            'buff': item.productionBuff != null ? loca.GetText("RES", item.productionBuff.GetBuffDefinition().GetName_string()) : "",
        });

    } catch (e) {
      //debug(e)
    }
  })

  var datetime = new Date().toISOString()
  var output = {
      'player': swmmo.application.mGameInterface.mHomePlayer.GetPlayerName_string(),
      'level': swmmo.application.mGameInterface.mHomePlayer.GetPlayerLevel(),
      'datetime': datetime,
      'buildings': buildings
  }

  try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3456/api/save-building-list", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(output));
  } catch (e) {
    //debug(e);
  }

}

function SendResourceListToAPI()
{
  var resources = [];

  // this works for any zone but can't see other player resources anyway
  var resourcesFromZone = swmmo.application.mGameInterface.mCurrentPlayerZone.getResourcesFromCurrentZone()

  // alternative way
  //var playerId = game.gi.mHomePlayer;
  //var resourcesForPlayer = swmmo.application.mGameInterface.mCurrentPlayerZone.GetResources(playerId)
  
  resourcesFromZone.GetPlayerResources_vector("").forEach(function (item) {
    try {
      if (item == null) { return; }
      if (!item.active) { return; }

      var groupMap = {
        'CL1': 'Basic',
        'CL2': 'Intermediate',
        'CL3': 'Advanced',
        'CL4': 'Expert',
        'CL5': 'Elite'
      };

      var name = item.name_string == "HardCurrency" ? "Gems" : item.name_string

      resources.push({
            'name': item.name_string,
            'amount': item.amount,
            'group': groupMap[item.group_string] || item.group_string,
            'maxLimit': item.maxLimit
        });

    } catch (e) {
      //debug(e)
    }
  })

  var datetime = new Date().toISOString()
  var output = {
      'player': swmmo.application.mGameInterface.mHomePlayer.GetPlayerName_string(),
      'level': swmmo.application.mGameInterface.mHomePlayer.GetPlayerLevel(),
      'datetime': datetime,
      'resources': resources
  }

  try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3456/api/save-resource-list", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(output));
  } catch (e) {
    //debug(e);
  }

}


function SendUserListToAPI()
{
  var guild = swmmo.application.mGameInterface.GetCurrentPlayerGuild();
  var guild_users = []
  var datetime = new Date().toISOString()

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

  } catch (e) {
    //debug(e);
  }
}

$(document).ready(function () {

    var timer = setInterval(function () {

        if (
            window.swmmo &&
            swmmo.application &&
            swmmo.application.mGameInterface &&
            swmmo.application.mGameInterface.GetCurrentPlayerGuild
        ) {
            clearInterval(timer);
            SendUserListToAPI();
        }

    }, 25000);

});


function AngelToolMenuHandler(event)
{
	// close all modals
	$( "div[role='dialog']:not(#angelToolModal):visible").modal("hide");

	createModalWindow('angelToolModal', 'Angel Tool Window');
	$('#angelToolModalData').html(AngelToolModal());

	// bind buttons
	$('#btn-user-list').click(function() {
    SendUserListToAPI();
    $(this).prop('disabled', true); 
    $(this).after('<span style="color: #28a745; margin-left: 8px; font-weight: bold;">&#10003;</span>');
  });

  $('#btn-building-list').click(function() {
    SendBuildingListToAPI();
    $(this).prop('disabled', true); 
    $(this).after('<span style="color: #28a745; margin-left: 8px; font-weight: bold;">&#10003;</span>');
  });

  $('#btn-resource-list').click(function() {
    SendResourceListToAPI();
    $(this).prop('disabled', true); 
    $(this).after('<span style="color: #28a745; margin-left: 8px; font-weight: bold;">&#10003;</span>');
  });

	// show modal
	$('#angelToolModal:not(:visible)').modal({backdrop: "static"});
}


function AngelToolModal()
{
  return '<div class="container-fluid">' +
       '<H3>Angel Tool</H3><hr/>' +
       '<div <div style="margin-bottom: 12px; clear: both;">' +
       '  <button type="button" class="btn" id="btn-user-list"><span>Send</span></button>' +
       '  <span> Guild Players Activity Data </span>' +
       '</div><div style="margin-bottom: 12px; clear: both;">' +
       '  <button type="button" class="btn" id="btn-building-list"><span>Send</span></button>' +
       '  <span> Island Building List </span>' +
       '</div><div>' +
       '  <button type="button" class="btn" id="btn-resource-list"><span>Send</span></button>' +
       '  <span> Player resources </span>' +
       '</div>' +
       '</div>';
}






