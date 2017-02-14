$(document).ready(function() {
	gaiaboard.loadTemplates();

	function init() {
		if(localStorage['firstInstall'] == undefined) {
			localStorage['subscribedThreadsLimit'] = 5;
			localStorage['myTopicsLimit'] = 5;
			localStorage['noticesLimit'] = 5;
			localStorage['requestsLimit'] = 5;
			localStorage['announcementsLimit'] = 5;
			localStorage['friendsStuffLimit'] = 5;
			localStorage['pmInboxLimit'] = 5;
			localStorage['pmOutboxLimit'] = 5;
			localStorage['pmSentboxLimit'] = 5;
			localStorage['pmSaveboxLimit'] = 5;
			localStorage['userdataRate'] = 15000;
			localStorage['notificationsRate'] = 15000;
			localStorage['subscribedThreadsRate'] = 15000;
			localStorage['myTopicsRate'] = 15000;
			localStorage['pmRate'] = 15000;
			localStorage['pmNotifications'] = true;
			localStorage['announcementNotifications'] = true;
			localStorage['requestNotifications'] = true;
			localStorage['noticeNotifications'] = true;
			localStorage['firstInstall'] = false;
		}

		gaiaboard.refreshInterval('getUserData', 'userdataRate');
		gaiaboard.refreshInterval('getPrivateMessages', 'pmRate');
		gaiaboard.refreshInterval('getUserTopics', 'myTopicsRate');
		gaiaboard.refreshInterval('getUserSubscribed', 'subscribedThreadsRate');
	}

	$('#notifications-tabs a').live('click', function() {
		clearTimeout(gaiaboard.timers['notificationsRate']);

		switch ($(this).attr('href').slice(1)) {
			case 'notices':
				gaiaboard.refreshInterval('getNotices', 'notificationsRate');
				break;
			case 'requests':
				gaiaboard.refreshInterval('getRequests', 'notificationsRate');
				break;
			case 'announcements':
				gaiaboard.refreshInterval('getAnnoucements', 'notificationsRate');
				break;
			case 'friendstuff':
				gaiaboard.refreshInterval('getFriendStuff', 'notificationsRate');
				break;
			default:
				break;
		}
	});

	$('#privatemessages-tabs a').live('click', function() {
		var box = $(this).attr('href').slice(1);
		clearTimeout(gaiaboard.timers['pmRate']);
		gaiaboard.refreshInterval('getPrivateMessages', 'pmRate', box);
	});

	init();
});