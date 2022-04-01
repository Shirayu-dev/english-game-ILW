let DB=[];
let current=undefined;
let currentQuestion;
let msgReader = new SpeechSynthesisUtterance();
msgReader.lang='en-UK';
let showAnswer=false;

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
    return difference<=numberOfWord/2;
}

const map=new Map([["v","Vocabulary"],["o","Orthograph"],["e","Expression"],["g","Grammar"],["b","Bonus"]]);

const vocabularyQuestions=[["(n) Something that has greatest importance; a first concern","A priority"],["(n) A work group; a commission; a board","A committee"],["(n) A car having a closed body and a closed boot separated from the part in which the driver and passengers sit","A sedan"],["(v) Examine and make corrections or alterations to written or printed matter","To revise"],["(noun) The subject of a speech, essay, thesis, or discourse","A topic"],["(adv) In a bad manner","Badly"],["(n) A pedal, pressed to change the gear","A clutch"],["(n) A part of the car that is visible to the driver and contains the controls and instrument panel","A dashboard"],["(v) To construct, to assemble, to make","To build"],["(n) A device for controlling the rate of working of machinery or for controlling fluid flow","A regulator"],["(a noun) Someone who has guests; master of ceremonies","A host"],["(n) A higher education diploma","A degree"],["(adjective) Introverted; bashful; timid","Shy"],["(v) To take into custody, to capture, to apprehend","To arrest"]];

const orthographQuestions=["Honorificabilitudinitatibus","Pharaoh","Weird","Intelligence","Pronunciation","Misspell","Handkerchief","Logorrhea","Chiaroscurist","Nauseous","Liquefy","Paraphernalia","Onomatopoeia","Acquiesce","Gubernatorial","Mischievous"];

//What is the expression that means:
const expressionQuestions=[["When it's raining a lot\n\nIt's raining ... ... ...",["It’s raining cats and dogs","cats and dogs"]],["Wish someone luck\n\n Break a ...!",["Break a leg!","leg"]],["Be hesitant\n\nTo be sitting on the ...",["To be sitting on the fence","fence"]],["Avoiding a question\n\nTo ... around the ...",["To beat around the bush","beat bush"]],["Something very unexpected\n\nOut of the ...",["Out of the blue","blue"]],["Like the sound of a bell\n\nThat rings a ...",["That rings a bell","bell"]],["That's all for today\n\nLet's ... it a ...",["Let’s call it a day","call day"]],["Get a grip on yourself\n\nGet your ... together",["Get your act together","act"]],["Too easy\n\nA ... of ...",["A piece of cake","piece cake"]],["Like father like son\n\nThe ... doesn't fall far from the ...",["The apple doesn’t fall far from the tree","apple tree"]],["What's done is done\n\nDon't ... over spilt ...",["Don't cry over spilt milk","cry milk"]],["Cost a fortune\n\nTo cost an ... and a ...",["To cost an arm and a leg","arm leg"]],["Express the idea that an action or event will never happen\n\nWhen ... can ...",["When pigs can fly","pigs fly"]]];

//Choose the correct answer:
const grammarQuestions=[["The car is ..... it's neither ..... nor .....\n\nA.at John / mine / yours\nB.John's / mine / yours\nC.John / mine / yours\nD.John's / myself / yourself","B"],["I know Mr smith, ..... young mechanic next door, very well.\n\nA. an\nB. who is\nC. Ø\nD. the","D"],[" ..... are you waiting ..... , Peter?\n\nA. how / for\nB. which / at\nC. who / for","C"],["You should not have behaved like that, ..... ?\n\nA. haven't you\nB. should you\nC. shouldn't you\nD. would you","B"],["Peter .....\n\nA. gave a book Paul.\nB. gave to Paul a book.\nC. Paul gave a book.\nD. gave Paul a book.","D"],["Don't go out without ..... me.\n\nA. to tell\nB. telling\nC. told\nD. tell","B"],["I wanted to phone my friend, but I couldn't get .....\n\nA. in\nB. on\nC. over\nD.through","D"],["Joanna killed ..... because they no longer saw .....\n\nA. him / themselves\nB. herself / each other\nC. herself / themselves\nD. her / them","B"],["She is not here today, she ..... be ill.\n\nA. must\nB. can't\nC. has to\nD. should","A"],["Cartoons make me .....\n\nA. laughing\nB. laugh\nC. to laugh\nD. laughed","B"],["I saw him ..... from the bridge.\n\nA. fall\nB. to fall\nC. fallen\nD.fell","A"],["I am told he is not in ..... but I know he is at .....\n\nA. office / the work\nB. office / work\nC. the office / work\nD. the office / the work","C"],["She went to the pub after .....\n\nA. to work\nB. working\nC. worked\nD. have worked","B"],["They ..... playing all afternoon when I arrived.\n\nA. had been\nB. were\nC. have been\nD. had","A"],["..... he is French, he lives in Japan.\n\nA. in spite of\nB. despite\nC. for\nD. although","D"],["It is much ..... than I expected.\n\nA. best\nB. good\nC. better\nD. the better","C"],["There won't ..... any tickets left.\n\nA. have\nB. be\nC. has\nD been","B"],["..... is a bad habit !\n\nA. Smoke\nB. Smoking\nC. The smoke\nD. The smoking","B"],["I can't stand ..... the housework.\n\nA. me to do\nB. do\nC. doing\nD. that I do","C"],["My friend has never been to America and .....\n\nA. neither have I\nB. I neither have\nC. so have I\nD. nor do I","A"]];

const bonusQuestions=[["Which year was the Great Fire of London in?","1666"],["What is the name of the treaty that united England and Scotland?","Treaty of the Union"],["Who won the Battle of Hastings?","The Normans"],["Who founded the Church of England?","Henry VIII, so he could end his marriage with Catherine of Aragon."],["What was the first major Roman City in Britain?","Colchester"],["Which houses fought in the war of Roses (1 point per house)?","House of York and house of Lancaster"],["What is the name of the government (still used today) established by the Vikings in AD 979 on the Isle of Man?","Tynwald"],["When was the Battle of Hastings?","14 October 1066"],["When was the Battle of Waterloo?","18 June 1815"],["When did the UK declare war on Germany?","3rd of September 1939"],["When did Australia gain independence from Britain?","1901"],["Where was the Titanic built?","Belfast"],["Which union ended the Wars of the Roses and started the Tudor Dynasty?","King Henry VII and Elizabeth of York"],["When was the London Underground built?","1863"],["Where did Princess Diana and Prince Charles go on their first official royal tour?","Australia and New Zealand"],["When did women get the right to vote in the UK?","1918"],["Who was caught with the gunpowder in 1605 (Gunpowder plot)?","Guy Fawkes"],["Elizabeth I was the last monarch of the Tudor Dynasty.","True"],["David Cameron served longer as Prime Minister than Tony Blair.","False"],["Winston Churchill was against the D-Day landings.","True"],["Stonehenge was built in several stages.","True"],["The gunpowder plot was meant to blow up Buckingham Palace.","False, the house of lords."],["William the Conqueror established French as the official language of England.","True"],["Queen Victoria had 9 children.","True."],["Winchester used to be the capital of England.","True"],["Edinburgh has always been the capital of Scotland.","False."],["Queen Victoria’s first language was English.","False, it was German."],["Who was the first Tudor monarch?","Henry VII of England"],["Who was the first protestant monarch?","Edward VI of England"],["Who was the first-ever Queen of England to rule in her own right?","Mary I of England (Bloody Mary)"],["What did Elizabeth I never do in her life?","She never married."],["Who was Mary, Queen of Scots’ first husband?","Francis II of France"],["Who was the first monarch of the United Kingdom?","Queen Anne"],["Which house did Queen Victoria belong to?","House of Hanover"],["Which monarch took the British throne after Edward VIII’s abdication?","George VI"],["In which country was William III of England born?","The Netherlands"],["Who is the longest serving British monarch in history?","Elizabeth II"],["When did Churchill become Prime Minister for the first time?","1940"],["What was the nickname given to Margaret Thatcher?","The Iron Lady"],["How many female Prime Ministers did the UK have (+ bonus points for the names)?","Two. Margaret Thatcher and Theresa May"],["Which Prime Minister resigned after the Brexit Referendum?","David Cameron"],["Which year did Boris Johnson become Prime Minister?","2019"],["Who is the longest serving UK Prime Minister?","Sir Robert Walpole"],["Who was the first prime minister born after World War II?","Tony Blair"],["Which 10-week war happened while Margaret Thatcher was Prime Minister?"," The Falklands War"],["Which party was Gordon Brown the leader of?","Labour Party"],["Who was the Prime Minister before Margaret Thatcher?","James Callaghan"],["In which century did the Industrial Revolution begin?","18th century"],["Which UK city has a golden cotton ball at the top of its town hall, as a tribute to its industrial background?","Manchester"],["Between which two cities was the first passenger railway?","Manchester and Liverpool"],["Who invented the first steam engine?","Thomas Newcomen"],["What was the first canal in Britain to be built without following an existing watercourse?","Bridgewater Canal"],["In 1803, cotton became the UK’s biggest export. What was it before that?","Wool"],["What was Belfast’s nickname in the 19th century?","Linenopolis"],["In which British city was the World’s first wet dock built?","Liverpool"],["Which war led to the independence of the United States from Britain?","The American Revolutionary War"],["Which German cipher device was cracked by Alan Turing?","Enigma"],["What was the name of the German bombing campaign against the United Kingdom in 1940 and 1941?","The Blitz"],["Which operation was codenamed Operation Dynamo?","The evacuation of Dunkirk"],["Which country declared war on Germany on the same day that the UK?","France"],["When was Victory in Europe Day?","8th of May 1945"],["Which year was the Battle of Britain?","1940"],["Who was the UK Prime Minister when WWII started?","Neville Chamberlain"],["In which year did rationing start in the UK?","1940"],["On which side was the UK during WWII?","The Allies"],["Which UK city was the most bombed during WWII outside of London?","Liverpool"],["When was Elizabeth II coronated (1 point for the year, 2 points for the full date)?","2nd of June 1953"],["Who carried the bombings in Manchester in 1996?","IRA"],["Which year was the Brexit Referendum in?","2016"],["Which UK Prime Minister sent troops to Iraq in 2003?","Tony Blair"],["Which year was the Scottish Independence referendum held?","2014"],["What is the name of the agreement signed in 1998 which ended the Troubles?","Belfast Agreement / Good Friday Agreement"],["Who was the first female first minister of Scotland?","Nicola Sturgeon"],["When did the United Kingdom leave the European Union?","31st January 2020 but the transition period ended on the 31st of December 2020"],["In which year did the UK cease all combat operations in Afghanistan and withdrew the last of its combat troops?","2014"],["When did Prince Charles and Princess Diana get married (1 point for the year, 2 points for the full date)?","29th July 1981"]];

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
const repeatButton=document.getElementById("repeatButton");

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
        repeatButton.style.display="none";
        checkAnswer.value="Check the answer!";
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
    answerZone.disabled=current==="b";
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
            repeatButton.style.display="block";
            readText(questionData.question);
            break;
        case "Expression":
            question=`Complete this expression that means: \n\n${questionData.question}`;
            break;
        case "Grammar":
            question=`Choose the correct answer: \n\n${questionData.question}`;
            break;
        case "Bonus":
            question=`${questionData.question.endsWith(".")?"Answer true or false:\n":""}${questionData.question}`;
            checkAnswer.value="Show the answer!"
            checkAnswer.disabled=false;
            break;
    }

    questionZone.innerText=`${question}${showAnswer?`\nAnswer: ${questionData.answer}`:""}`;
    if(questionData.type==="Grammar") {
        questionZone.innerHTML=`${questionZone.innerHTML.replace("<br><br>A.","<br><br><span class='left-align text-left'>A.")}</span>`
    }
})

const typingSomething=(text)=>{
    checkAnswer.disabled=!text.length>0
}

const checkingAnswer=(fromAnswerZone)=>{
    if(fromAnswerZone&&event.key!=="Enter") return;
    if((checkCorrespondance(answerZone.value,currentQuestion.type==="Expression"?currentQuestion.answer[1]:currentQuestion.answer,currentQuestion.type==="Vocabulary"||currentQuestion.type==="Orthograph")&&currentQuestion.type!=="Bonus")){
        responseZone.innerText="Correct!"
        responseZone.className="green";
    }
    else if(currentQuestion.type!=="Bonus"){
        responseZone.innerText="Wrong!"
        responseZone.className="red";
    }
    else {
        responseZone.innerText="just below ↓"
        responseZone.className="";
    }
    correctAnswer.innerText=`“${currentQuestion.type==="Expression"?currentQuestion.answer[0]:currentQuestion.answer}”`;
    checkAnswer.disabled=true;
    answerZone.disabled=true;
    repeatButton.style.display="none";
    elementList.forEach(e=>{
        e.className=e.className.replace("selected","");
    });
    current=undefined;
    createQuestion.disabled=true
}

const replay=()=>{
    if(repeatButton.style.display==="block") readText(currentQuestion.question);
}