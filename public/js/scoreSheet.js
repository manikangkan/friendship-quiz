const answerCards = document.querySelector('#answerCards');
const cardProps = {
    color : {
        success: '#699169',
        failure: '#a74f4f'
    },
    headerImage:{
        success: "/assets/CardTopSuccess.svg",
        failure: "/assets/CardTopFailure.svg"
    } 
}

for (let index = 0; index < quesSheet_objs_arr.length; index++) {
	var color = 'failure';
	if (get_myChosenOption(index) == get_correctAns(index)) {
		color = 'success';
	} 

	const html = `
  <li class="list-group-item ${color}" id="${index}">
      <h4>Q${index} ${get_questionString(index)}</h4>
      <h4>Your choice: ${get_myChosenOption(index)}</h4>
      <h4>Correct Ans: ${get_correctAns(index)} </h4>
  </li>
  `;
	answerCards.insertAdjacentHTML('beforeend', generateCardHTML(index,color));
}

function generateCardHTML(index,color) {
    console.log("color",cardProps.headerImage[color]);
    

	const card = `
        <div class="col" id="${index}>
            <div class="card wow fadeInUp" data-wow-delay="400ms">
                <img src="${cardProps.headerImage[color]}" class="card-img-top" alt="...">
                <div class="card-body" style="background-color:${cardProps.color[color]}">
                    <h3 class="card-title fw-bold">Q${index}: ${get_questionString(index)}</h3>
                    <div class="card-text vh-40">
                        <h4 class="">Your choice: ${get_myChosenOption(index)}</h4>
                        <h4 class="">Correct Ans: ${get_correctAns(index)} </h4>
                    </div>
                </div>
            </div>
        </div>
    `;

    return card;
}

function get_questionString(Qindex) {
	return quesSheet_objs_arr[Qindex].question;
}

function get_correctAns(Qindex) {
	const quesObj = new Map(Object.entries(quesSheet_objs_arr[Qindex]));
	const correctAns = quesObj.get('correctAns');
	return quesObj.get(quesObj.get('correctAns'));
}

function get_myChosenOption(Qindex) {
	const tempMap = new Map(Object.entries(quesSheet_objs_arr[Qindex]));
	return tempMap.get(answer[Qindex]);
}


