const answerCards = document.querySelector('#answerCards');

for (let index = 0; index < quesSheet_objs_arr.length; index++) {
	answerCards.insertAdjacentHTML('beforeend', generateCardHTML(index));
}

function generateCardHTML(index) {

	const card = `
            <div id="${index}" class="border-top my-5 wow fadeInUp" data-wow-delay="300ms">
                <div class=" container d-flex flex-column justify-content-center align-items-center ">
                    <div class="mx-0 d-flex justify-content-center align-items-center responder-question-number">
                        <p id="activeStatus" type="button" class="border d-flex justify-content-center align-items-center">
                        ${index + 1}
                        </p>
                    </div>
                    <div class="row g-3 py-5">
                        <div class="col-12">
                            <input type="text" id="qString" class="form-control" readonly value="${quesSheet_objs_arr[index].question}" />
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <input type="text" id="option_a" class="opn btn ${opnHighlight(index,'option_a')} w-100" readonly value="${quesSheet_objs_arr[index].option_a}" />
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <input type="text" id="option_b" class="opn btn ${opnHighlight(index,'option_b')} w-100" readonly value="${quesSheet_objs_arr[index].option_b}" />
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <input type="text" id="option_c" class="opn btn ${opnHighlight(index,'option_c')} w-100" readonly value="${quesSheet_objs_arr[index].option_c}" />
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <input type="text" id="option_d" class="opn btn ${opnHighlight(index,'option_d')} w-100" readonly value="${quesSheet_objs_arr[index].option_d}" />
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

function opnHighlight(index = 0,option = "option_a"){
    const correctAns = quesSheet_objs_arr[index].correctAns;
    const clientAns = answer[index];
    console.log(correctAns + "  " +  clientAns + " " + option);
   
    if(clientAns == option)
        return 'btn-primary';

    if(correctAns == option)
        return 'btn-border';
        
    return 'btn-light';
}
