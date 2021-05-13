
function timeAgo(timestamp) {
  let now = Date.now();
  let time =  Date.parse(timestamp);
  let seconds =  now - time;

	var numdays = Math.floor(seconds / 86400); 
	var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	if (numdays == 0) {
		return  numhours + " hours ago";
	}
	if (numhours == 0) {
		return  numminutes + " minutes ago";
	}
	else {
		return numdays + " days " + numhours + " hours ago";
	}

}

export {timeAgo}
