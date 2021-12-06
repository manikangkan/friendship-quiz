const clientLoginBtn = document.querySelector('#clientLogin');

clientLoginBtn.addEventListener('click', function () {
	let usercode = document.querySelector('#usercode').value;
	if (usercode == null || usercode == '') {
		modalTrigger('Warning 🥁', "Quiz code can't be empty", 'Type Again 👍');
		return;
	}

	if (validURL(usercode)) {
		// usercode = usercode.split("/")[usercode.split("/").length - 3];
		console.log('this is a url ' + usercode);
	}
	if (hasLowerCase(usercode)) {
		validate(usercode).then((data) => {
			if (data.userExists) window.location.href = data.redirect;
			else {
				modalTrigger('No such user exists!', 'Did you type Correctly?', 'Try Again 👍');
			}
		});
	} else {
		modalTrigger('Warning 🥁', 'You entered an invalid code', 'Try Again 👍');
	}
});

function hasLowerCase(str) {
	return /^[a-zA-Z]+$/.test(str);
}

async function validate(usercode) {
	const response = await fetch(`/${usercode.toLowerCase()}/validate`, {
		method: 'GET',
		redirect: 'follow',
	});
	return response.json();
}

function validURL(str) {
	var res = str.match(
		/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
	);
	return res !== null;
}



function liveValidate(code){
    if(code != null && code !=''){
        validate(code).then(data => {
            if (data.userExists){
                $("#clientLogin").removeClass('btn-disabled');
                $("#clientLogin").text("Let's play 👍") ;
            }
            else {
                $("#clientLogin").addClass('btn-disabled');
                $("#clientLogin").text("play") ;
            }
        })
    }
    
}