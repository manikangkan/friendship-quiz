const sprite = ['adventurer', 'avataaars', 'big-ears', 'big-smile', 'micah', 'miniavs', 'personas', 'open-peeps'];

function liveAvatarGen(name) {
	const offCanvasName = document.querySelector('#offCanvasName');
	if (name.length < 2) offCanvasName.innerText = 'Adventurer';
	else {
		offCanvasName.innerText = name.split(' ')
        .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(' ');
	}
	const element = document.querySelectorAll('.avatar-img');
	let spriteCode = -1;
	if (name == null || name == '') element.src = 'assets/avatars/male1.svg';
	else {
		spriteCode = Math.floor(Math.random() * 8);
		avatarGen(element[0], sprite[spriteCode], name);
		avatarGen(element[1], sprite[spriteCode], name);
	}
	const avatarCode = document.querySelector('#userAvatarCode');
	avatarCode.value = sprite[spriteCode];
}

function allRandom(){
    const elements = document.querySelectorAll(".avatar-img");
    elements.forEach(elem => {
        let devName = elem.parentElement.nextElementSibling.innerText;
        if(devName.match(/^[A-Za-z. ]+$/))
            avatarGen(elem, sprite[Math.floor(Math.random() * 8)], devName);
    });
}