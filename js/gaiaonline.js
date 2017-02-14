var gaiaboard = {
	settings:localStorage,
	timers:{},
	notificationsCount: {
		pmNotifications: 0,
		announcementNotifications: 0,
		requestNotifications: 0,
		noticeNotifications: 0
	},
	refreshInterval:function(callback, timeOutVar, var1)
	{
		var internalCallback = function()
		{
	        gaiaboard.timers[timeOutVar] = setTimeout(internalCallback, localStorage[timeOutVar]);
	        gaiaboard[callback](var1);
	    }

	    gaiaboard[callback](var1);
	    gaiaboard.timers[timeOutVar] = setTimeout(internalCallback, localStorage[timeOutVar]);
	},
	resetHTML:function()
	{
		var notices = $('#notices table tbody'),
			requests = $('#requests table tbody'),
			friendStuff = $('#friendstuff table tbody'),
			announcements = $('#announcements table tbody'),
			inBoxPrivateMessages = $('#inbox table tbody'),
			outBoxPrivateMessages = $('#outbox table tbody'),
			sentBoxPrivateMessages = $('#sentbox table tbody'),
			savedBoxPrivateMessages = $('#savedbox table tbody'),
			userTopic = $('#topics table tbody'),
			subscribedThreads = $('#subscribed table tbody'),
			userDataAvatarName = $('#userdata .page-header h3'),
			userDataAvatarImage = $('#userdata .avatar img'),
			userDataGGold = $('#userdata .currency .gGold'),
			userDataGCash = $('#userdata .currency .gCash'),
			userDataPrivateMessages = $('#notifications #home a.pms span'),
			userDataPequests = $('#notifications #home a.requests span'),
			userDataAnnouncements = $('#notifications #home a.announcements span'),
			userDataNotices = $('#notifications #home a.notices span');
		
		userDataAvatarName.text('Guest');
		userDataAvatarImage.attr({'src':'images/avatar.gif'});
		userDataGGold.text('0');
		userDataGCash.text('0');
		userDataPrivateMessages.text('0');
		userDataPequests.text('0');
		userDataAnnouncements.text('0');
		userDataNotices.text('0');
		
		notices.html($.tmpl('emptyNoticeTmpl',null));
		requests.html($.tmpl('emptyRequestsTmpl',null));
		friendStuff.html($.tmpl('emptyFriendStuffTmpl',null));
		announcements.html($.tmpl('emptyAnnouncementsTmpl',null));
		inBoxPrivateMessages.html($.tmpl('emptyPrivateMessageTmpl',null));
		outBoxPrivateMessages.html($.tmpl('emptyPrivateMessageTmpl',null));
		sentBoxPrivateMessages.html($.tmpl('emptyPrivateMessageTmpl',null));
		savedBoxPrivateMessages.html($.tmpl('emptyPrivateMessageTmpl',null));
		userTopic.html($.tmpl('emptyThreadsTmpl',null));
		subscribedThreads.html($.tmpl('emptyThreadsTmpl',null));
	},
	checknum:function(num)
	{
		num = parseInt(num);
		if(isNaN(num))
		{
			return parseInt(0);
		}
		else {
			return parseInt(num);
		}
	},
	addCommas:function(nStr)
	{
		nStr += '';
	  	x = nStr.split('.');
	  	x1 = x[0];
	  	x2 = x.length > 1 ? '.' + x[1] : '';
	  	var rgx = /(\d+)(\d{3})/;
	  	while (rgx.test(x1)) {
	    	x1 = x1.replace(rgx, '$1' + ',' + '$2');
	  	}
	  	return x1 + x2;
	},
	capitaliseFirstLetter:function(string)
	{
	    return string.charAt(0).toUpperCase() + string.slice(1);
	},
	pageRequest:function(url)
	{
		var data = $.ajax({
			url: url,
			crossDomain:true,
		    async:false,
		    dataType:'text'
		}).responseText;
		
		return data;
	},
	sendNotification:function(title, text, delay)
	{
		title = typeof title !== 'undefined' ? title : 'Test notification';
		text = typeof text !== 'undefined' ? text : 'This is a test!';
		delay = typeof delay !== 'undefined' ? delay : 5000;
			
		// Create a simple text notification:
		var notification = webkitNotifications.createNotification(
			'images/icon48.png',  			// icon url - can be relative
			'Gaia Board: ' + title,  		// notification title
			text 							// notification body text
		);
	
		// Then show the notification.
		notification.show();
		
		notification.ondisplay = function() {
			setTimeout(function(){
	            notification.cancel();
	        }, delay);
	    };
	},
	parseMobileURL:function(str)
	{
		search = new Array(
		      /http\:\/\/(www\.|)gaiaonline\.com\/mobileapp\/forums\/show\/(.*?)/gi,
		      /http\:\/\/(www\.|)gaiaonline\.com\/mobileapp\/marketplace\/item\/\?itemid=(.*?)/gi,
		      /http\:\/\/(www\.|)gaiaonline\.com\/mobileapp\/profiles\/\?userid\=(.*?)/gi);
		
		replace = new Array(
		      "http://www.gaiaonline.com/forum/$2",
		      "http://www.gaiaonline.com/marketplace/itemdetail/$2",
		      "http://www.gaiaonline.com/profiles/$2");
		
		var test;
		
		for (i = 0; i < search.length; i++) {
		    var stop = false;
		    while(stop==false)
		    {
		    	str = str.replace(search[i], replace[i]);
		    	test = str.match(search[i]);
		    	if(test==null) {
		    		stop = true;
		    	}
		    }
		}
			
		return str;
	},
	loadTemplates:function(){
		//Notices
		$.template( "noticeTmpl", gaiaboard.template.notices );
		$.template( "emptyNoticeTmpl", gaiaboard.template.empty.notices );
		
		//Requests
		$.template( "requestsTmpl", gaiaboard.template.requests );
		$.template( "emptyRequestsTmpl", gaiaboard.template.empty.requests );
		
		//Announcements
		$.template( "announcementsTmpl", gaiaboard.template.announcements );
		$.template( "emptyAnnouncementsTmpl", gaiaboard.template.empty.announcements );
		
		//Friend's Stuff
		$.template( "friendStuffTmpl", gaiaboard.template.friendStuff );
		$.template( "emptyFriendStuffTmpl", gaiaboard.template.empty.friendStuff );
		
		//Private Message
		$.template( "privateMessageTmpl", gaiaboard.template.privateMessage );
		$.template( "emptyPrivateMessageTmpl", gaiaboard.template.empty.privateMessage );
		
		//Threads
		$.template( "threadsTmpl", gaiaboard.template.threads );
		$.template( "emptyThreadsTmpl", gaiaboard.template.empty.threads );
	},
	template:{
		notices:"<tr><td>${Notice}</td></tr>",
		requests:"<tr><td>${Request}</td></tr>",
		announcements:"<tr><td><a href='http://gaiaonline.com/forum/t.${PostId}'>${Title}</a></td><td>${Creator}</td><td>${Posted}</td></tr>",
		friendStuff:"<tr><td>${FriendStuff}</td></tr>",
		privateMessage:"<tr><td><img src='${Status}' /></td><td><a href='http://www.gaiaonline.com/profiles/${Username}'>${Username}</a></td><td><a href='http://www.gaiaonline.com/profile/privmsg.php?folder=inbox&mode=read&id=${PmId}'>${Subject}</a></td><td>${Created}</td></tr>",
		threads:"<tr><td class=\"title ${Status}\">${Title}</td><td>${Replies}</td><td>${Created}</td></tr>",
		empty:{
			notices:"<tr><td class=\"text-center\">No new notices.</td></tr>",
			requests:"<tr><td class=\"text-center\">No new requests.</td></tr>",
			announcements:"<tr><td class=\"text-center\" colspan=\"3\">No new announcements</td></tr>",
			friendStuff:"<tr><td class=\"text-center\">No friend stuff.</td></tr>",
			privateMessage:"<tr><td class=\"text-center\" colspan=\"4\">No private message found in this mailbox.</td></tr>",
			threads:"<tr><td class=\"text-center\" colspan=\"3\">No threads found.</td></tr>",
		}
	},
	getUserData:function()
	{
		try {
			var userData = JSON.parse(gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/userdata/1.6'));
		}
		catch (e) {
			gaiaboard.resetHTML();
			return false;
		}

		try {
			var pmData = JSON.parse(gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/privatemessages/count/1.6'));
		}
		catch (e) {
			gaiaboard.resetHTML();
			return false;
		}
		
		try {
			if (userData['status'] == 1)
			{
				var avatarName = $('#userdata .page-header h3'),
					avatarImage = $('#userdata .avatar img'),
					gGold = $('#userdata .currency .gGold'),
					gCash = $('#userdata .currency .gCash'),
					privateMessages = $('#notifications #home a.pms span'),
					requests = $('#notifications #home a.requests span'),
					announcements = $('#notifications #home a.announcements span'),
					notices = $('#notifications #home a.notices span');
					
				avatarName.text(userData.user_name);
				avatarImage.attr({'src':userData.user_avatar});
				gGold.text(gaiaboard.addCommas(userData.gold));
				gCash.text(gaiaboard.addCommas(userData.gpass));
				privateMessages.text(pmData.user_notify_pm_count);
				requests.text(userData.user_mygaia_requests_count);
				announcements.text(userData.user_notify_announcement_count);
				notices.text(userData.user_mygaia_notice_count);

				if ((localStorage['requestNotifications'].toLowerCase() == 'true'))
				{
					if(gaiaboard.checknum(userData.user_mygaia_requests_count)!=gaiaboard.notificationsCount.requestNotifications && gaiaboard.checknum(userData.user_mygaia_requests_count)!=0) {
						gaiaboard.sendNotification('New Request(s)', 'You have a new request(s) to check.');
					}
				}

				if ((localStorage['pmNotifications'].toLowerCase() == 'true'))
				{
					if(gaiaboard.checknum(pmData.user_notify_pm_count)!=gaiaboard.notificationsCount.pmNotifications && gaiaboard.checknum(pmData.user_notify_pm_count)!=0) {
						gaiaboard.sendNotification('New Private Message(s)', 'There is a new Private Message(s).');
					}
				}

				if ((localStorage['announcementNotifications'].toLowerCase() == 'true'))
				{
					if(gaiaboard.checknum(userData.user_notify_announcement_count)!=gaiaboard.notificationsCount.announcementNotifications && gaiaboard.checknum(userData.user_notify_announcement_count)!=0) {
						gaiaboard.sendNotification('New Announcement(s)', 'There is a new announcement(s).');
					}
				}

				if ((localStorage['noticeNotifications'].toLowerCase() == 'true'))
				{
					if(gaiaboard.checknum(userData.user_mygaia_notice_count)!=gaiaboard.notificationsCount.noticeNotifications && gaiaboard.checknum(userData.user_mygaia_notice_count)!=0) {
						gaiaboard.sendNotification('New Notice(s)','You have a new notice(s).');
					}
				}

				gaiaboard.notificationsCount.pmNotifications = gaiaboard.checknum(pmData.user_notify_pm_count);
				gaiaboard.notificationsCount.announcementNotifications = gaiaboard.checknum(userData.user_notify_announcement_count);
				gaiaboard.notificationsCount.requestNotifications = gaiaboard.checknum(userData.user_mygaia_requests_count);
				gaiaboard.notificationsCount.noticeNotifications = gaiaboard.checknum(userData.user_mygaia_notice_count);
			}
		}
		catch (e) {
			gaiaboard.resetHTML();
			return false;
		}
	},
	getNotices:function()
	{
		var userNotices = gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/notices/notices/1.3');

		if(userNotices!=null && userNotices.length>0) {
			var links = $(userNotices).find('ul'), notices = $('#notices table tbody'), newNotices = [];
			
			links.find('a').each(function(index, value){
				var link = $(value);
				if($.trim(link.text())!="Load All") {
					$(value).attr('href', gaiaboard.parseMobileURL(link.attr('href'))); 
				}
			});
			
			links = links.find('p');

			var limit = (links.length > gaiaboard.settings['noticesLimit']) ? gaiaboard.settings['noticesLimit'] : links.length;
			
			for(x=0;x<limit;x++){
				var w = {};
				if($.trim($(links[x]).text())!="Load All") {
					$('.icon', links[x]).removeClass('icon').addClass('noticeicon');
					w.Notice = $(links[x]).html();
					newNotices.push(w);
				}
			}
			
			notices.html($.tmpl('noticeTmpl',newNotices));
			return true;
		}
		
		notices.html($.tmpl('emptyNoticeTmpl',null));
		return true;
	},
	getRequests:function()
	{
		var userRequests = gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/notices/requests/1.3');
		
		var links = $(userRequests).find('ul'), requests = $('#requests table tbody'), newRequests = [];
		
		if(userRequests!=null && userRequests.length>0) {
			
			if(links.length>0) {
				links.find('a').each(function(index, value){
					var link = $(value);
					
					$(value).attr('href', gaiaboard.parseMobileURL(link.attr('href')));
				});
				
				links = links.find('p');
				links.find('img').remove();
				
				var limit = (links.length > gaiaboard.settings['requestsLimit']) ? gaiaboard.settings['requestsLimit'] : links.length;

				for(x=0;x<limit;x++){
					var w = {};
					
					if($(links[x]).find('a.mg_sprite').length==0) {
						w.Request = $(links[x]).html();
						newRequests.push(w);
					}
				}
				
				requests.html($.tmpl('requestsTmpl',newRequests));
				return true;
			}
		}
		
		requests.html($.tmpl('emptyRequestsTmpl',null));
		return true;
	},
	getAnnoucements:function()
	{
		try {
			var gaiaAnnoucements = gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/announcements/list/1.6?limit='+gaiaboard.settings['announcementsLimit']);
		}
		catch (e) {
			gaiaboard.resetHTML();
			return false;
		}
		
		try {
			gaiaAnnoucements = JSON.parse(gaiaAnnoucements);
			
			var announcements = $('#announcements table tbody'), newAnnouncements = [];
			
			if (gaiaAnnoucements['status'] == 1)
			{
				
				if(gaiaAnnoucements['count']>=1)
				{
					for(x=0;x<gaiaAnnoucements.announcements.length;x++)
					{
						var w = {}
						w.PostId = gaiaAnnoucements.announcements[x].announcement_postid;
						w.Title = gaiaAnnoucements.announcements[x].announcement_title;
						w.Creator = gaiaAnnoucements.announcements[x].announcement_creator;
						w.Posted = gaiaAnnoucements.announcements[x].announcement_posted;
						
						newAnnouncements.push(w);
					}
					
					announcements.html('');
					$.tmpl('announcementsTmpl',newAnnouncements).appendTo(announcements);
					return true;	
				}
			}
		}
		catch (e) {
			console.log(e);
			gaiaboard.resetHTML();
			return false;
		}
		
		announcements.html('');
		$.tmpl('emptyAnnouncementsTmpl',null).appendTo(announcements);
		return false;
	},
	getFriendStuff:function()
	{
		var userFriendStuff = gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/notices/stuff/1.3');
				
		var links = $(userFriendStuff).find('ul'), friendStuff = $('#friendstuff table tbody'), newFriendStuff = [];
		
		if(userFriendStuff!=null && userFriendStuff.length>0) {
			
			if(links.length>0) {
				links.find('a').each(function(index, value){
					var link = $(value);
					
					$(value).attr('href', gaiaboard.parseMobileURL(link.attr('href')));
				});
				
				links = links.find('div.message');
				links.find('img').remove();

				var limit = (links.length > gaiaboard.settings['friendsStuffLimit']) ? gaiaboard.settings['friendsStuffLimit'] : links.length;
				
				for(x=0;x<limit;x++){
					var w = {};
					
					w.FriendStuff = $(links[x]).html();
					newFriendStuff.push(w);
				}
				
				friendStuff.html($.tmpl('friendStuffTmpl',newFriendStuff));
				return true;
			}
		}
		
		friendStuff.html($.tmpl('emptyFriendStuffTmpl',null));
		return true;
	},
	getPrivateMessages:function(folder)
	{
		folder = typeof folder !== 'undefined' ? folder : 'inbox';
		try {
			var userPrivateMessages = gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/privatemessages/list/1.6?folder='+folder+'&limit='+gaiaboard.settings['pm'+gaiaboard.capitaliseFirstLetter(folder)+'Limit']);
		}
		catch (e) {
			gaiaboard.resetHTML();
			return false;
		}
		
		try {
			userPrivateMessages = JSON.parse(userPrivateMessages);
			
			var privateMessages = $('#'+folder+' table tbody'), newPrivateMessages = [];
			
			if (userPrivateMessages['status'] == 1)
			{
				if(userPrivateMessages.pmlist.length>=1)
				{
					for(x=0;x<userPrivateMessages.pmlist.length;x++)
					{
						var w = {}
						w.PmId = userPrivateMessages.pmlist[x].id;
						w.Username = userPrivateMessages.pmlist[x].from;
						w.Created = userPrivateMessages.pmlist[x].created;
						
						switch (userPrivateMessages.pmlist[x].status) {
							case "1":
								w.Status = "images/privatemessages/ic_forumpost.gif";
								w.Subject = "<strong>"+userPrivateMessages.pmlist[x].subject+"</strong>";
								break;
							case "2":
								w.Status = "images/privatemessages/ic_forumpost_read.gif";
								w.Subject = userPrivateMessages.pmlist[x].subject;
								break;
							case "3":
								w.Status = "images/privatemessages/ic_pm_replied.gif";
								w.Subject = userPrivateMessages.pmlist[x].subject;
								break;
							default:
								w.Status = "images/privatemessages/ic_forumpost_read.gif";
								w.Subject = userPrivateMessages.pmlist[x].subject;
								break;
						}
						
						newPrivateMessages.push(w);
					}
					
					privateMessages.html('');
					$.tmpl('privateMessageTmpl',newPrivateMessages).appendTo(privateMessages);
					return true;
				}
			}
		}
		catch (e) {
			console.log(e);
			gaiaboard.resetHTML();
			return false;
		}
		
		privateMessages.html('');
		$.tmpl('emptyPrivateMessageTmpl',null).appendTo(privateMessages);
		return false;
	},
	getUserTopics:function()
	{
		var userTopics = gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/forums/view/history?tab=topics');
				
		var posts = $('tr.topic', userTopics), userTopic = $('#topics table tbody'), newUserTopics = [];
		
		if(userTopics!=null && userTopics.length>0) {
			
			if(posts.length>0) {
				posts.find('a').each(function(index, value){
					var link = $(value);
					
					$(value).attr('href', gaiaboard.parseMobileURL(link.attr('href')));
				});
				
				posts.find('img').remove();
				posts.find('p').remove();
				posts.find('.created').remove();
				
				var limit = (posts.length > gaiaboard.settings['myTopicsLimit']) ? gaiaboard.settings['myTopicsLimit'] : posts.length;

				for(var x = 0; x < limit; x++)
					newUserTopics.push(posts[x]);

				userTopic.html(newUserTopics);
				return true;
			}
		}
		
		userTopic.html($.tmpl('emptyThreadsTmpl',null));
		return true;
	},
	getUserSubscribed:function()
	{
		// Max is 50 thread
		var userSubscribed = gaiaboard.pageRequest('http://www.gaiaonline.com/mobileapp/forums/view/subscribed');
				
		var posts = $('tbody tr', userSubscribed), subscribedThreads = $('#subscribed table tbody'), newSubscribedThreads = [];
		
		if(userSubscribed!=null && userSubscribed.length>0) {
			
			if(posts.length>0) {
				posts.find('a').each(function(index, value){
					var link = $(value);
					
					$(value).attr('href', gaiaboard.parseMobileURL(link.attr('href')));
				});
				
				posts.find('.creator').remove();
				
				var limit = (posts.length > gaiaboard.settings['subscribedThreadsLimit']) ? gaiaboard.settings['subscribedThreadsLimit'] : posts.length;

				for(var x = 0; x < limit; x++)
					newSubscribedThreads.push(posts[x]);

				subscribedThreads.html(newSubscribedThreads);
				return true;
			}
		}
		
		subscribedThreads.html($.tmpl('emptyThreadsTmpl',null));
		return true;
	}
};








