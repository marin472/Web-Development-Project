function load() {
	const $name = document.getElementById('name');
	if(playername && $name) $name.value = playername;	
}

function playAsGuest() {
	const name = document.getElementById('name').value;
	if(!name) return alert('Please enter a name!');
	
	playername = name;
	localStorage.setItem('playername', playername);
	location.href = '/~/Space_Race/space_race'
}

function play() {
	location.href = '/~/Space_Race/space_race'
}

async function createAccount() {
	const username = document.getElementById('name').value;
	const password = document.getElementById('password').value;
	if(!username) return alert('Please enter a name!');
	if(!password) return alert('Please enter a password!');
	
	const path = '/~/Space_Race/signup';
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' }
	const body = JSON.stringify({ username, password });
	const redirect = 'error';
	
	try {
		await fetch(path, { method, headers, body, redirect });
		playername = username;
		localStorage.setItem('playername', playername);
		location.href = '/~/Space_Race/space_race'
	} catch(ex) {
		alert('Name already taken, please choose another one.')
	}
}

async function login() {
	const username = document.getElementById('name').value;
	const password = document.getElementById('password').value;
	if(!username) return alert('Please enter a name!');
	if(!password) return alert('Please enter a password!');
	
	const path = '/~/Space_Race/login';
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' }
	const body = JSON.stringify({ username, password });
	const redirect = 'error';
	
	try {
		await fetch(path, { method, headers, body, redirect });
		playername = username;
		localStorage.setItem('playername', playername);
		location.href = '/~/Space_Race/space_race'
	} catch(ex) {
		alert('Cannot log in, check your name and password')
	}
}

async function logout() {
	
	const path = '/~/Space_Race/logout';
	const method = 'POST';
	
	await fetch(path, { method })
	location.reload();

}

async function sendScore(score) {
	if(!isLoggedIn) return;
	const path = '/~/Space_Race/open/leaders';
	const method = 'POST';
	const headers = { 'Content-Type': 'application/json' }
	const name = playername;
	const body = JSON.stringify({ name, score });
	
	await fetch(path, { method, headers, body });
}

async function getLeaders() {

	const path = '/~/Space_Race/open/leaders?all=true';
	const method = 'GET'
	const resp = await fetch(path, { method });
	const leaders = await resp.json();
	 
	const $leaders = document.getElementById('leaders');
	if(!leaders.length) {
		$leaders.innerHTML = 'No Leaders';
		return;
	}
	
	
	$leaders.innerHTML = JSON.stringify(JSON.parse(leaders))/*leaders
		.filter(leader => parseInt(leader.data.score) >= 0) 
		.sort((a, b) => parseInt(b.data.score) > parseInt(a.data.score) ? 1 : -1)
		.filter((leader, i) => i < 10)
		.map((leader, i) => `
			<div>${i + 1}. ${leader.data.name} ${leader.data.score}</div>
		`)
		.join('\n')*/
	
}