let quizData = null;
let currentQuestion = 0;
let score = 0;

// 从 JSON 文件加载测试数据
window.onload = function() {
    fetch('./quiz-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            quizData = data.questions;
            console.log(quizData);  // 调试信息，检查数据是否成功加载
            loadQuestion();
        })
        .catch(error => {
            console.error('Error fetching quiz data:', error);
            alert('无法加载测试数据，请检查文件路径或服务器设置');
        });
};

// 动态生成测试题

function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        showResults();
        return;
    }

    const questionData = quizData[currentQuestion];
    const questionText = document.getElementById('question');
    const optionsContainer = document.getElementById('options');

    // 清空旧的选项
    optionsContainer.innerHTML = '';

    // 设置问题
    questionText.textContent = `${currentQuestion + 1}. ${questionData.question}`;

    // 创建选项
    questionData.options.forEach((option, index) => {
        const optionElement = document.createElement('input');
        optionElement.type = (questionData.type === 'multiple') ? 'checkbox' : 'radio';
        optionElement.name = 'option';
        optionElement.value = index;
        optionElement.id = `option${index}`;
        
        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option;

        const optionContainer = document.createElement('div');
        optionContainer.appendChild(optionElement);
        optionContainer.appendChild(label);

        optionsContainer.appendChild(optionContainer);
    });
}

function checkAnswer() {
    const questionData = quizData[currentQuestion];
    const selectedOptions = document.querySelectorAll('input[name="option"]:checked');
    
    let selectedAnswers = [];
    selectedOptions.forEach(option => {
        selectedAnswers.push(parseInt(option.value));
    });

    let isCorrect = false;
    if (questionData.type === 'multiple') {
        isCorrect = JSON.stringify(selectedAnswers.sort()) === JSON.stringify(questionData.answer.sort());
    } else {
        isCorrect = selectedAnswers.length === 1 && selectedAnswers[0] === questionData.answer;
    }

    if (isCorrect) {
        score++;
    }

    currentQuestion++;
    loadQuestion();
}

function showResults() {
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = `<h2>测试完成！你的分数是 ${score}/${quizData.length}</h2>`;
}

document.getElementById('submit').addEventListener('click', checkAnswer);

// 加载测试数据
loadQuizData();
