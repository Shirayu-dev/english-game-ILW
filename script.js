let DB=[];
let current=undefined;
let currentQuestion;
let msgReader = new SpeechSynthesisUtterance();
msgReader.lang='en-US';

const randomValueOfArray=(array)=>{
    return array.length===0?undefined:array.length===1?array[0]:array[Math.floor(Math.random() * array.length)]
}

const readText=(text)=>{
    msgReader.text = text;
    window.speechSynthesis.speak(msgReader);
}

const checkCorrespondance=(first,second,isAVocabularyWord)=>{

    if(second.length===1) return first.toLowerCase()===second.toLowerCase();

    let numberOfWord,firstValue,secondValue;
    if(isAVocabularyWord){
        firstValue=first.toLowerCase().replace(/[^a-zA-Z ]/g, "")
        if(firstValue.startsWith("to ")) firstValue=firstValue.replace(/to /,"")
        else if(firstValue.startsWith("a ")) firstValue=firstValue.replace(/a /,"");

        secondValue=second.toLowerCase().replace(/[^a-zA-Z ]/g, "");
        if(secondValue.startsWith("to ")) secondValue=secondValue.replace(/to /,"")
        else if(secondValue.startsWith("a ")) secondValue=secondValue.replace(/a /,"");
        
        return firstValue===secondValue;
    }

    numberOfWord=second.toLowerCase().replace(/[^a-zA-Z ]/g, "").split(/ +/g).length;
    firstValue=first.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/ +/g,"");
    secondValue=second.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/ +/g,"");

    const firstMap=new Map();
    const secondMap=new Map();

    let correspondance=0;

    for(const letter of firstValue){
        if(letter!==" ")firstMap.has(letter)?firstMap.set(letter,firstMap.get(letter)+1):firstMap.set(letter,1);
    };

    for(const letter of secondValue){
        if(letter!==" ")secondMap.has(letter)?secondMap.set(letter,secondMap.get(letter)+1):secondMap.set(letter,1);
    };

    const arrayFirstMap=[...firstMap];
    const arraySecondMap=[...secondMap];

    arrayFirstMap.forEach(e=>{
    if(secondMap.has(e[0])){
        correspondance+=Math.min(e[1],secondMap.get(e[0]));
    }
    });
    let difference=Math.abs(correspondance-secondValue.length);
    return difference<numberOfWord;
}

//Vocabulary
//Orthograph
//Expression
//Grammar
//Bonus

const map=new Map([["v","Vocabulary"],["o","Orthograph"],["e","Expression"],["g","Grammar"],["b","Bonus"]]);

const vocabularyQuestions=[["(n) Something that has greatest importance; a first concern","A priority"],["(n) A work group; a commission; a board","A committee"],["(n) A car having a closed body and a closed boot separated from the part in which the driver and passengers sit","A sedan"],["(v) Examine and make corrections or alterations to written or printed matter","To revise"],["(noun) The subject of a speech, essay, thesis, or discourse","A topic"],["(adv) In a bad manner","Badly"],["(n) A pedal, pressed to change the gear","A clutch"],["(n) A part of the car that is visible to the driver and contains the controls and instrument panel","A dashboard"],["(v) To construct, to assemble, to make","To build"],["(n) A device for controlling the rate of working of machinery or for controlling fluid flow","A regulator"],["(a noun) Someone who has guests; master of ceremonies","A host"],["(n) A higher education diploma","A degree"],["(adjective) Introverted; bashful; timid","Shy"],["(v) To take into custody, to capture, to apprehend","To arrest"]];
const orthographQuestions=["Honorificabilitudinitatibus","Pharaoh","Weird","Intelligence","Pronunciation","Misspell","Handkerchief","Logorrhea","Chiaroscurist","Nauseous","Liquefy","Paraphernalia","Onomatopoeia","Acquiesce","Gubernatorial","Mischievous"];
//What is the expression that means:
const expressionQuestions=[["When it's raining a lot","It’s raining cats and dogs"],["Wish someone luck","Break a leg!"],["Be hesitant","To be sitting on the fence"],["Avoiding a question","To beat around the bush"],["Something very unexpected","Out of the blue"],["Like the sound of a bell","That rings a bell"],["That's all for today","Let’s call it a day"],["Get a grip on yourself","Get your act together"],["Too easy","A piece of cake"],["Like father like son","The apple doesn’t fall far from the tree"],["What's done is done","Don't cry over spilt milk"],["Cost a fortune","To cost an arm and a leg"],["Express the idea that an action or event will never happen","When pigs can fly"]];
//Choose the correct answer:
const grammarQuestions=[["The car is ..... it's neither ..... nor .....\n\nA.at John / mine / yours\nB.John's / mine / yours\nC.John / mine / yours\nD.John's / myself / yourself","B"],["I know Mr smith, ..... young mechanic next door, very well.\n\nA. an\nB. who is\nC. Ø\nD. the","D"],[" ..... are you waiting ..... , Peter?\n\nA. how / for\nB. which / at\nC. who / for","C"],["You should not have behaved like that, ..... ?\n\nA. haven't you\nB. should you\nC. shouldn't you\nD. would you","B"],["Peter .....\n\nA. gave a book Paul.\nB. gave to Paul a book.\nC. Paul gave a book.\nD. gave Paul a book.","D"],["Don't go out without ..... me.\n\nA. to tell\nB. telling\nC. told\nD. tell","B"],["I wanted to phone my friend, but I couldn't get .....\n\nA. in\nB. on\nC. over\nD.through","D"],["Joanna killed ..... because they no longer saw .....\n\nA. him / themselves\nB. herself / each other\nC. herself / themselves\nD. her / them","B"],["She is not here today, she ..... be ill.\n\nA. must\nB. can't\nC. has to\nD. should","A"],["Cartoons make me .....\n\nA. laughing\nB. laugh\nC. to laugh\nD. laughed","B"],["I saw him ..... from the bridge.\n\nA. fall\nB. to fall\nC. fallen\nD.fell","A"],["I am told he is not in ..... but I know he is at .....\n\nA. office / the work\nB. office / work\nC. the office / work\nD. the office / the work","C"],["She went to the pub after .....\n\nA. to work\nB. working\nC. worked\nD. have worked","B"],["They ..... playing all afternoon when I arrived.\n\nA. had been\nB. were\nC. have been\nD. had","A"],["..... he is French, he lives in Japan.\n\nA. in spite of\nB. despite\nC. for\nD. although","D"],["It is much ..... than I expected.\n\nA. best\nB. good\nC. better\nD. the better","C"],["There won't ..... any tickets left.\n\nA. have\nB. be\nC. has\nD been","B"],["..... is a bad habit !\n\nA. Smoke\nB. Smoking\nC. The smoke\nD. The smoking","B"],["I can't stand ..... the housework.\n\nA. me to do\nB. do\nC. doing\nD. that I do","C"],["My friend has never been to America and .....\n\nA. neither have I\nB. I neither have\nC. so have I\nD. nor do I","A"]];
const bonusQuestions=[];

const categories=[["Vocabulary",vocabularyQuestions],["Orthograph",orthographQuestions],["Expression",expressionQuestions],["Grammar",grammarQuestions],["Bonus",bonusQuestions]];

categories.forEach(c=>{
    c[1].forEach(e=>{
        DB.push({question:c[0]==="Orthograph"?e:e[0],answer:c[0]==="Orthograph"?e:e[1],type:c[0]});
    });
});

const vElement=document.getElementById("v");
const oElement=document.getElementById("o");
const eElement=document.getElementById("e");
const gElement=document.getElementById("g");
const bElement=document.getElementById("b");

const elementList=[vElement,oElement,eElement,gElement,bElement];
const createQuestion=document.getElementById("createQuestion");
const answerZone=document.getElementById("answerZone");

const checkAnswer=document.getElementById("checkAnswer");
const correctAnswer=document.getElementById("correctAnswer");

const questionZone=document.getElementById("questionZone");
const responseZone=document.getElementById("responseZone");

elementList.forEach(e=>{
    e.addEventListener("click", (event)=>{
        answerZone.value="";
        answerZone.disabled=true;
        questionZone.innerText="";
        responseZone.innerText="";
        correctAnswer.innerText="";
        if(current===event.target.id){
            elementList.forEach(e=>{
                e.className=e.className.replace("selected","");
            });
            current=undefined;
            createQuestion.disabled=true
        }
        else {
            elementList.forEach(e=>{
                e.className=e.className.replace("selected","");
            });
            event.target.className+=" selected";
            current=`${event.target.id}`;
            createQuestion.disabled=false
        }
    });
});

createQuestion.addEventListener("click",(event)=>{
    answerZone.innerText="";
    answerZone.disabled=false;
    responseZone.innerText="";
    correctAnswer.innerText="";
    let questionData=randomValueOfArray(DB.filter(e=>e.type===map.get(current)));
    currentQuestion=questionData;
    let question;

    switch(questionData.type){
        case "Vocabulary":
            question=`What is the word that corresponds to this definition:\n\n${questionData.question}`;
            break;
        case "Orthograph":
            question=`Listen to the word and write it in the box`;
            readText("Honorificabilitudinitatibus");
            break;
        case "Expression":
            question=`What is the expression that means: \n\n“${questionData.question}”`;
            break;
        case "Grammar":
            question=`Choose the correct answer: \n\n${questionData.question}`;
            break;
        case "Bonus":
            question=questionData.question;
            break;
    }

    questionZone.innerText=question+questionData.answer;
    if(questionData.type==="Grammar") {
        questionZone.innerHTML=`${questionZone.innerHTML.replace("<br><br>A.","<br><br><span class='left-align text-left'>A.")}</span>`
    }
})

const typingSomething=(text)=>{
    checkAnswer.disabled=!text.length>0
}

const checkingAnswer=(fromAnswerZone)=>{
    if(fromAnswerZone&&event.key!=="Enter") return;
    if(checkCorrespondance(answerZone.value,currentQuestion.answer,currentQuestion.type==="Vocabulary")){
        responseZone.innerText="Correct!"
    }
    else {
        responseZone.innerText="Wrong!"
    }
    correctAnswer.innerText=`“${currentQuestion.answer}”`;
    checkAnswer.disabled=true;
    answerZone.disabled=true;
    elementList.forEach(e=>{
        e.className=e.className.replace("selected","");
    });
    current=undefined;
    createQuestion.disabled=true
}