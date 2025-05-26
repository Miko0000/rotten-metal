const rlimit = {};
const check = module.exports = function(ip){
	return rlimit[ip];
}

check.raise = function(ip){
	return rlimit[ip] = (rlimit[ip] || 0) + 1;
}

setInterval(function(){
	for(const [ ip, count ] of Object.entries(rlimit)){
		if(rlimit[ip] <= 0)
			delete rlimit[ip];

		rlimit[ip] = Math.max(count - 1, 0);
	}
}, 1000)