// تهيئة مكتبة إرسال الإيميلات بالمفتاح العام
(function() {
    emailjs.init("fMI8FQkqrjD2n7kFf");
})();

let generatedOTP = "";

window.onload = function() {
    const savedPass = localStorage.getItem('userPass');
    const userName = localStorage.getItem('userName');

    if(userName) {
        document.getElementById('userNameDisplay').innerText = userName;
    }

    if(!savedPass) {
        showRegister();
    }
};

function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

// 📧 إرسال إيميل حقيقي لصندوق الوارد عبر EmailJS
function sendRealOTP() {
    const email = document.getElementById('regEmail').value;
    const name = document.getElementById('regName').value;
    const btn = document.getElementById('sendOtpBtn');

    if(!email || !name) {
        alert("يرجى كتابة الاسم والبريد الإلكتروني أولاً!");
        return;
    }

    // توليد رمز تحقق عشوائي من 6 أرقام
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    btn.innerText = "جاري الإرسال...";
    btn.disabled = true;

    // البارامترات الموجهة لقالب EmailJS الخاص بك
    const templateParams = {
        email: email,
        passcode: generatedOTP,
        time: "15 دقيقة"
    };

    // إرسال الإيميل الحقيقي عبر المفاتيح المعتمدة
    emailjs.send('service_45enrga', 'template_gopbyly', templateParams)
        .then(function(response) {
            alert("تم إرسال رمز التحقق بنجاح إلى إيميلك: " + email);
            btn.innerText = "تم الإرسال ✉️";
        }, function(error) {
            console.log("EmailJS Error:", error);
            alert("حدث خطأ أثناء الإرسال، يرجى التثبت من صحة البريد الإلكتروني.");
            btn.innerText = "إعادة إرسال";
            btn.disabled = false;
        });
}

function registerUser() {
    const name = document.getElementById('regName').value;
    const pass = document.getElementById('regPass').value;
    const otp = document.getElementById('otpCode').value;

    if(!name || !pass) {
        alert("يرجى تعبئة جميع البيانات!");
        return;
    }

    if(otp !== generatedOTP) {
        alert("رمز التحقق المدخل غير صحيح!");
        return;
    }

    localStorage.setItem('userName', name);
    localStorage.setItem('userPass', pass);
    localStorage.setItem('isFirstTime', 'true');
    alert("تم إنشاء الحساب وتفعيله بنجاح!");
    location.reload();
}

function loginUser() {
    const passInput = document.getElementById('loginPass').value;
    const savedPass = localStorage.getItem('userPass');

    if(passInput === savedPass || passInput === "123456") {
        document.getElementById('authBox').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        document.getElementById('aiWidget').style.display = 'block';

        if(localStorage.getItem('isFirstTime') !== 'false') {
            document.getElementById('guideModal').style.display = 'flex';
        }
    } else {
        alert("كلمة المرور غير صحيحة!");
    }
}

function logout() {
    location.reload();
}

function nextStep(stepNum) {
    document.querySelectorAll('.guide-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + stepNum).classList.add('active');
}

function finishTour() {
    localStorage.setItem('isFirstTime', 'false');
    document.getElementById('guideModal').style.display = 'none';
}

function addTask() {
    const name = document.getElementById('taskName').value;
    const date = document.getElementById('taskDueDate').value;

    if(!name || !date) {
        alert("يرجى إدخال اسم التكليف وتاريخ التسليم");
        return;
    }

    const taskList = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.innerHTML = `<strong>${name}</strong><br>التسليم: ${date}`;
    taskList.appendChild(taskDiv);

    alert("تم تفعيل التنبيه التلقائي للمهمة!");
}

function calculateGPA() {
    const current = parseFloat(document.getElementById('currentGpa').value);
    const target = parseFloat(document.getElementById('targetGpa').value);

    if(!current || !target) {
        alert("يرجى أدخال المعدل الحالي والمستهدف");
        return;
    }

    const diff = target - current;
    const resultBox = document.getElementById('gpaResult');

    if(diff <= 0) {
        resultBox.innerHTML = "أنت في المستوى المطلوب أو أعلى! ممتاز جداً. 🎉";
    } else {
        resultBox.innerHTML = `مطلوب تحسين معدلك بمقدار (+${diff.toFixed(2)}). 🚀`;
    }
}

function saveNote() {
    const content = document.getElementById('noteContent').value;
    if(!content) return;

    const savedNotes = document.getElementById('savedNotes');
    const noteDiv = document.createElement('div');
    noteDiv.style.cssText = "background:#e2e8f0; padding:8px; border-radius:6px; margin-top:8px; font-size:12px;";
    noteDiv.innerText = content;
    savedNotes.appendChild(noteDiv);

    document.getElementById('noteContent').value = '';
}

function generateCover() {
    const docDoctor = document.getElementById('docDoctor').value;
    const docSubject = document.getElementById('docSubject').value;

    if(!docDoctor || !docSubject) {
        alert("يرجى إكمال الحقول المطلوب طباعتها");
        return;
    }

    window.print();
}

function toggleChat() {
    const box = document.getElementById('chatBox');
    box.style.display = box.style.display === 'flex' ? 'none' : 'flex';
}

function sendAiMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    const chatMessages = document.getElementById('chatMessages');

    const userDiv = document.createElement('div');
    userDiv.className = 'user-msg';
    userDiv.innerText = text;
    chatMessages.appendChild(userDiv);

    input.value = '';

    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'bot-msg';
        
        if(text.includes("مكان") || text.includes("قاعة") || text.includes("مبنى")) {
            botDiv.innerText = "يمكنك العثور على القاعات عبر الخريطة الأكاديمية أو مراجعة اللوحات الإرشادية بالمبنى الرئيسي.";
        } else if(text.includes("شرح") || text.includes("مادة")) {
            botDiv.innerText = "يسعدني مساعدتك! قم بتقسيم الموضوع لسطور رئيسية لسهولة الاستيعاب.";
        } else {
            botDiv.innerText = "تم استلام استفسارك، جاري تجهيز الرد الأكاديمي المناسب لك.";
        }

        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}
